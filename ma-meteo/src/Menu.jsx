import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {}
      <button className={`hamburger-btn ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </button>

      {}
      <div className={`menu-overlay ${isOpen ? 'show' : ''}`}>
        <nav className="menu-nav">
          <Link to="/" onClick={toggleMenu}>🏠 Accueil</Link>
          <Link to="/about" onClick={toggleMenu}>👋 À Propos</Link>
          <a href="https://github.com/ArnaudG16" target="_blank" rel="noreferrer">💻 Mon GitHub</a>
        </nav>
      </div>
    </>
  );
}

export default Menu;