import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';

function App() {
  // 1. Estados de los contadores (empiezan en 0)
  const [moviesCount, setMoviesCount] = useState(0);

  // 2. 🛡️ NUEVOS ESTADOS: Manejo de Errores y Carga
  const [isLoading, setIsLoading] = useState(false); // ¿Está cargando la película?
  const [errorMessage, setErrorMessage] = useState(null); // Si hay un error, guardamos el texto aquí
  const [latestMovie, setLatestMovie] = useState(null); // Almacena la última película añadida

  // 3. ⚙️ FUNCIÓN ASÍNCRONA: Simula traer una película de internet con manejo de errores
  const simularBuscarPelicula = async (debeFallar) => {
    // Reseteamos errores anteriores y activamos la pantalla de carga
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Simulamos que la petición tarda 1.5 segundos en responder por red
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (debeFallar) {
        // Forzamos un error de red simulado si hacemos clic en el botón de fallo
        throw new Error("No se pudo conectar con el servidor de películas. Revisa tu conexión a internet.");
      }

      // Si no falla, creamos una película de éxito
      const nuevaPelicula = {
        id: Date.now(),
        titulo: "Shōgun (2024)",
        genero: "Drama / Histórico"
      };

      // Guardamos la película en el estado, sumamos 1 al contador y apagamos la carga
      setLatestMovie(nuevaPelicula);
      setMoviesCount(prevCount => prevCount + 1);

    } catch (error) {
      // 🚨 AQUÍ ATRAPAMOS EL ERROR: En lugar de congelar la pantalla, guardamos el mensaje
      setErrorMessage(error.message);
    } finally {
      // Este bloque siempre se ejecuta, falle o no, para quitar el letrero de "Cargando..."
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