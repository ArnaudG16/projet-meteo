import { useState, useEffect } from 'react';
import './App.css';
import FavoriteCities from './FavoriteCities';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapController({ coords }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 13, { duration: 2 });
  }, [coords, map]);
  return null;
}

function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]); 
  const [bgImage, setBgImage] = useState(null); 
  const [error, setError] = useState('');
  const [showMap, setShowMap] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);

  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  const FAVORITES_SLUGS = {
    "Brive-la-Gaillarde": "brive",
    "Rueil-Malmaison": "rueil",
    "Couzeix": "couzeix",
    "Angoulême": "angouleme",
    "Royan": "royan",
    "Toulouse": "toulouse"
  };

  const getTimePeriod = () => {
    const hour = new Date().getHours(); 
    if (hour >= 6 && hour < 11) return 'matin';
    if (hour >= 11 && hour < 18) return 'jour';
    if (hour >= 18 && hour < 22) return 'soir';
    return 'nuit';
  };
  const currentPeriod = getTimePeriod(); 

  const fetchWeather = async (cityToSearch) => {
    const searchCity = cityToSearch || city; 
    if (!searchCity) return;
    
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
      );
      if (!response.ok) throw new Error('Ville introuvable');
      const data = await response.json();
      
      await updateAppWithData(data);
      
      if (cityToSearch) setCity(cityToSearch);
      setError('');

    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
          );
          if (!response.ok) throw new Error('Erreur géolocalisation');
          const data = await response.json();

          setCity(data.name); 
          await updateAppWithData(data);
          setError('');

        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setError("Impossible de récupérer votre position");
        setIsLoading(false);
      }
    );
  };

  const updateAppWithData = async (weatherData) => {
    setWeather(weatherData);

    const { lat, lon } = weatherData.coord;
    const forecastResp = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
    );
    const forecastData = await forecastResp.json();
    const dailyForecast = forecastData.list.filter(reading => reading.dt_txt.includes("12:00:00"));
    setForecast(dailyForecast);

    const favoriteSlug = FAVORITES_SLUGS[weatherData.name];
    if (favoriteSlug) {
      setBgImage(`/images/${favoriteSlug}_${currentPeriod}.jpg`);
    } else {
      fetchUnsplashImage(weatherData.name);
    }
  };

  const fetchUnsplashImage = async (query) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&client_id=${UNSPLASH_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setBgImage(data.results[0].urls.regular);
      } else {
        setBgImage("https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000"); 
      }
    } catch (err) {
      console.error("Erreur image:", err);
    }
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'short' });
  };

  return (
    <div className="app-container">
      <h1>Météo Dashboard 🌍</h1>
      
      <FavoriteCities 
        apiKey={WEATHER_API_KEY} 
        onCityClick={fetchWeather} 
        timePeriod={currentPeriod} 
      />

      <div className="search-section">
        <div className="search-box">
          {}
          <button 
            className="geo-btn" 
            onClick={handleGeolocate} 
            title="Me géolocaliser"
            disabled={isLoading}
          >
            📍
          </button>

          <input
            type="text"
            placeholder="Rechercher une ville..."
            value={city}
onChange={(e) => {
  const sanitizedValue = e.target.value.replace(/[^a-zA-Z\s-àâäéèêëîïôöùûüç]/g, "");
  setCity(sanitizedValue);
}}            onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
          />
          <button onClick={() => fetchWeather()} disabled={isLoading}>
            {isLoading ? "..." : "Voir"}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>

      {weather && (
        <div className="weather-display">
            <div className="weather-info">
              <div>
                <h2>{weather.name}, <span className="country">{weather.sys.country}</span></h2>
                <div className="main-temp">
                    <img 
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                        alt="Météo" 
                    />
                    <span>{Math.round(weather.main.temp)}°C</span>
                </div>
                <p className="description">{weather.weather[0].description}</p>
                
                <div className="details-grid">
                    <div className="detail-item">
                        <span>💧 Humidité</span>
                        <strong>{weather.main.humidity}%</strong>
                    </div>
                    <div className="detail-item">
                        <span>💨 Vent</span>
                        <strong>{weather.wind.speed} km/h</strong>
                    </div>
                    <div className="detail-item">
                        <span>🌡️ Ressenti</span>
                        <strong>{Math.round(weather.main.feels_like)}°C</strong>
                    </div>
                </div>
              </div>

              <div className="forecast-section">
                <h3>5 prochains jours</h3>
                <div className="forecast-row">
                    {forecast.map((day) => (
                        <div key={day.dt} className="forecast-item">
                            <span className="day-name">{getDayName(day.dt_txt)}</span>
                            <img 
                                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
                                alt="icon" 
                            />
                            <span className="day-temp">{Math.round(day.main.temp)}°</span>
                        </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="visual-container">
              <button 
                className="toggle-map-btn"
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? "📸 Voir Photo" : "📍 Voir Carte"}
              </button>

              {showMap ? (
                <MapContainer 
                  center={[weather.coord.lat, weather.coord.lon]} 
                  zoom={13} 
                  scrollWheelZoom={true} 
                  className="leaflet-container"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  <Marker position={[weather.coord.lat, weather.coord.lon]}>
                    <Popup>
                      {weather.name} <br /> {weather.weather[0].description}
                    </Popup>
                  </Marker>
                  <MapController coords={[weather.coord.lat, weather.coord.lon]} />
                </MapContainer>
              ) : (
                <div 
                  className="city-image" 
                  style={{ 
                    backgroundImage: bgImage ? `url(${bgImage})` : 'linear-gradient(to right, #bdc3c7, #2c3e50)' 
                  }}
                >
                  <div className="image-overlay">
                      <span>{FAVORITES_SLUGS[weather.name] ? "Photo Locale" : "Photo via Unsplash"}</span>
                  </div>
                </div>
              )}
            </div>
        </div>
      )}
    </div>
  );
}

export default Home;