import './App.css';

function About() {
  return (
    <div className="app-container" style={{ maxWidth: '800px' }}>
      <h1>À Propos 🚀</h1>
      
      <div className="weather-info" style={{ textAlign: 'left' }}>
        <p>
          Bienvenue sur mon application météo ! Ce projet a été réalisé pour mettre en pratique mes compétences en <strong>React</strong>.
        </p>
        
        <h3>🛠️ Technologies utilisées</h3>
        <ul style={{ listStyleType: 'none', padding: 0, lineHeight: '2rem' }}>
            <li>⚛️ <strong>React.js</strong> (Vite)</li>
            <li>🌍 <strong>OpenWeatherMap API</strong> (Données météo)</li>
            <li>📸 <strong>Unsplash API</strong> (Photos dynamiques)</li>
            <li>🗺️ <strong>Leaflet</strong> (Cartographie interactive)</li>
        </ul>

        {}
        <div style={{ marginTop: '40px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '30px' }}>
            <p style={{ marginBottom: '20px', fontStyle: 'italic' }}>Une question ? </p>
            
            <a 
              href="https://www.linkedin.com/in/arnaud-grassian/"
              target="_blank" 
              rel="noreferrer"
              className="linkedin-btn"
            >
              👔 Mon LinkedIn
            </a>
        </div>
      </div>
    </div>
  );
}

export default About;