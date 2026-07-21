import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';

function App() {
  
  const [moviesCount, setMoviesCount] = useState(0);


  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); 
  const [latestMovie, setLatestMovie] = useState(null); 

  
  const simularBuscarPelicula = async (debeFallar) => {
    setErrorMessage(null);
    setIsLoading(true);

    try { 
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (debeFallar) {
        throw new Error("No se pudo conectar con el servidor de películas. Revisa tu conexión a internet.");
      }

      const nuevaPelicula = {
        id: Date.now(),
        titulo: "Shōgun (2024)",
        genero: "Drama / Histórico"
      };

      setLatestMovie(nuevaPelicula);
      setMoviesCount(prevCount => prevCount + 1);

    } catch (error) {
      
      setErrorMessage(error.message);
    } finally { 
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
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

        {/* Sección de Perfil y Estadísticas */}
        <section className="profile-summary">
          <h2 className="section-title">PERFIL</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">0</span>
              <span className="stat-label">series vistas</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">0</span>
              <span className="stat-label">episodios vistos</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{moviesCount}</span>
              <span className="stat-label">películas vistas</span>
            </div>
          </div>
        </section>

        {/* 🛠️ PANEL TEMPORAL DE PRUEBAS PARA EL JUNIOR */}
        <section style={{ background: 'rgba(255,255,255,0.5)', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
          <h3>Control de Errores (Zona de Pruebas)</h3>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
            Usa estos botones para ver cómo reacciona React cuando las cosas van bien o cuando falla la red.
          </p>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => simularBuscarPelicula(false)} 
              disabled={isLoading}
              style={{ padding: '10px 15px', background: '#bcecdb', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Simular Éxito (Añadir película)
            </button>
            
            <button 
              onClick={() => simularBuscarPelicula(true)} 
              disabled={isLoading}
              style={{ padding: '10px 15px', background: '#f7d6d6', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#a36161' }}
            >
              Simular Error de Red
            </button>
          </div>

          {/* 🔄 INTERFAZ CONDICIONAL: Mostramos mensajes dinámicos según el estado */}
          {isLoading && (
            <p style={{ marginTop: '15px', color: '#666', fontWeight: 'bold' }}>
              ⏳ Conectando con la API... Por favor, espera.
            </p>
          )}

          {errorMessage && (
            <div style={{ marginTop: '15px', padding: '10px', background: '#ffdddd', borderLeft: '5px solid #ff5c5c', borderRadius: '4px', color: '#a71d1d' }}>
              ⚠️ <strong>Error detectado:</strong> {errorMessage}
            </div>
          )}

          {latestMovie && !isLoading && !errorMessage && (
            <p style={{ marginTop: '15px', color: '#2e7d32' }}>
              ✅ ¡Película añadida con éxito!: <strong>{latestMovie.titulo}</strong> ({latestMovie.genero})
            </p>
          )}
        </section>

        {/* Carruseles (Esperando la API real) */}
        <section className="media-section">
          <h2 className="section-subtitle">Tus Películas</h2>
          <div className="media-carousel" style={{ minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', marginTop: '10px' }}>
            {latestMovie && !errorMessage ? (
              <div style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                🎬 {latestMovie.titulo}
              </div>
            ) : (
              <span style={{ color: '#999' }}>No hay películas marcadas como vistas todavía</span>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;