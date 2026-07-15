import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';

function App() {
  // Inicializamos los contadores en 0. 
  // Más adelante, cuando el usuario haga clic en "Visto", usaremos sus respectivas 
  // funciones (setSeriesCount, etc.) para sumar +1.
  const [seriesCount, setSeriesCount] = useState(0);
  const [episodesCount, setEpisodesCount] = useState(0);
  const [moviesCount, setMoviesCount] = useState(0);

  return (
    <div className="app-container">
      {/* Componente de la Barra Lateral */}
      <Sidebar />

      {/* Contenido Principal Derecho */}
      <main className="main-content">
        
        {/* Encabezado */}
        <header className="content-header">
          <div className="search-bar">
            <input type="text" placeholder="Buscar películas, series, personas..." />
            <button type="button" className="btn-search">🔍</button>
          </div>
          
          <div className="header-actions">
            <button type="button" className="btn-notifications">🔔</button>
            <div className="mini-avatar">JB</div>
            <span className="header-username">Juan B.</span>
          </div>
        </header>

        {/* Sección de Estadísticas con Datos Reales (Empiezan en 0) */}
        <section className="profile-summary">
          <h2 className="section-title">PERFIL</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{seriesCount}</span>
              <span className="stat-label">series vistas</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{episodesCount}</span>
              <span className="stat-label">episodios vistos</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{moviesCount}</span>
              <span className="stat-label">películas vistas</span>
            </div>
          </div>
        </section>

        {/* Secciones de Carruseles (Vacías para la API) */}
        <section className="media-section">
          <header className="section-header">
            <h2 className="section-subtitle">Tus Series</h2>
            <button type="button" className="view-all-link">▶</button>
          </header>
          <div className="media-carousel" id="series-container">
            {/* Aquí inyectaremos las tarjetas de las series más adelante */}
          </div>
        </section>

        <section className="media-section">
          <header className="section-header">
            <h2 className="section-subtitle">Tus Películas</h2>
            <button type="button" className="view-all-link">▶</button>
          </header>
          <div className="media-carousel" id="movies-container">
            {/* Aquí inyectaremos las tarjetas de las películas más adelante */}
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;