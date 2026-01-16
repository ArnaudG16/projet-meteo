import { useEffect, useState } from 'react';
const citiesConfig = [
    { name: "Brive-la-Gaillarde", slug: "brive" },
    { name: "Rueil-Malmaison", slug: "rueil" },
    { name: "Couzeix", slug: "couzeix" },
    { name: "Angoulême", slug: "angouleme" },
    { name: "Royan", slug: "royan" },
    { name: "Toulouse", slug: "toulouse" }
  ];
function FavoriteCities({ apiKey, onCityClick, timePeriod }) {
  const [citiesData, setCitiesData] = useState([]);

  useEffect(() => {
    const fetchAllCities = async () => {
      try {
        const promises = citiesConfig.map(city => 
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${apiKey}&units=metric&lang=fr`)
          .then(res => res.json())
          .then(data => ({ 
            ...data, 
            imageSlug: city.slug 
          }))
        );

        const results = await Promise.all(promises);
        const validResults = results.filter(data => data.cod === 200);
        setCitiesData(validResults);
      } catch (error) {
        console.error("Erreur chargement villes favorites", error);
      }
    };

    if (apiKey) {
      fetchAllCities();
    }
  }, [apiKey]);

  return (
    <div className="favorites-grid">
      {citiesData.map((city) => (
        <div 
          key={city.id} 
          className="favorite-card"
          onClick={() => onCityClick(city.name)} 
          style={{ 
            backgroundImage: `url(/images/${city.imageSlug}_${timePeriod}.jpg)` 
          }}
        >
          <div className="overlay">
            <span className="fav-name">{city.name}</span>
            <div className="fav-info">
              <span className="fav-temp">{Math.round(city.main.temp)}°</span>
              {city.weather && (
                <img 
                  src={`https://openweathermap.org/img/wn/${city.weather[0].icon}.png`} 
                  alt="icon" 
                  className="fav-icon"
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FavoriteCities;