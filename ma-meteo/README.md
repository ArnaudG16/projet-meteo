# 🌤️ Météo Dashboard

Une application météo complète et interactive réalisée avec React (Vite).
Le projet intègre la géolocalisation, une carte interactive et des fonds d'écran dynamiques.

## 🚀 Fonctionnalités
* **Météo en temps réel** : Données précises via OpenWeatherMap.
* **Prévisions 5 jours** : Affichage simplifié des températures à venir.
* **Géolocalisation** : Bouton pour obtenir la météo de votre position actuelle.
* **Cycle Jour/Nuit** : Les images des villes favorites changent selon l'heure (Matin, Jour, Soir, Nuit).
* **Carte Interactive** : Basculez entre la photo de la ville et sa vue satellite (Leaflet).
* **Photos Dynamiques** : Si la ville n'est pas en favori, une image est générée via Unsplash.

## 🛠️ Technologies
* React.js (Vite)
* Leaflet & React-Leaflet (Cartographie)
* OpenWeatherMap API
* Unsplash API
* CSS3 (Glassmorphism & Responsive)

## 📦 Installation

1.  Cloner le repo
2.  
3.  Installer les dépendances :
    ```bash
    npm install
    ```
4.  Configurer les clés API :
    Créez un fichier `.env` à la racine et ajoutez :
    ```env
    VITE_WEATHER_API_KEY=votre_cle_openweathermap
    VITE_UNSPLASH_ACCESS_KEY=votre_cle_unsplash
    ```
5.  Lancer le projet :
    ```bash
    npm run dev
    ```

---
*Projet réalisé par Arnaud Grassian*
