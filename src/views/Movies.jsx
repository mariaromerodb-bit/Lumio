import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPopularMovies } from '../services/tmdb';

function Movies({ userMediaState = {}, onToggleWatched }) {
  const [popularMovies, setPopularMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const movies = await getPopularMovies();
        setPopularMovies(movies);
      } catch (error) {
        console.error("Error al obtener películas:", error);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <section className="media-section" style={{ maxWidth: '1050px', margin: '0 auto' }}>
      <header className="section-header" style={{ marginBottom: '20px' }}>
        <h2 className="section-subtitle" style={{ margin: 0, fontSize: '24px' }}>Películas Populares</h2>
      </header>

      {isLoading && (
        <div style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
          ⏳ Cargando catálogo de películas desde TMDB...
        </div>
      )}

      {errorMessage && (
        <div style={{ 
          margin: '10px 0', 
          padding: '15px', 
          background: '#ffebee', 
          borderLeft: '5px solid #ef5350', 
          borderRadius: '8px', 
          color: '#c62828' 
        }}>
          ⚠️ <strong>Error al cargar las películas:</strong> {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && (
        <div className="media-carousel" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
          gap: '20px', 
          paddingTop: '15px' 
        }}>
          {popularMovies.map((movie) => {
            const mediaKey = `movie-${movie.id}`;
            const isWatched = userMediaState[mediaKey]?.watched;

            return (
              <div key={movie.id} style={{ 
                background: '#fff', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}>
                <div 
                  onClick={() => navigate(`/detalle/movie/${movie.id}`)}
                  style={{ cursor: 'pointer', position: 'relative' }}
                >
                  {movie.poster_path ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                      alt={movie.title}
                      style={{ width: '100%', height: '210px', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{ height: '210px', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      Sin Imagen
                    </div>
                  )}

                  {isWatched && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '8px', 
                      left: '8px', 
                      background: '#2e7d32', 
                      color: '#fff', 
                      fontSize: '10px', 
                      padding: '3px 8px', 
                      borderRadius: '10px', 
                      fontWeight: 'bold' 
                    }}>
                      ✓ VISTA
                    </div>
                  )}
                </div>

                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                  <div>
                    <h4 
                      title={movie.title}
                      style={{ fontSize: '13px', margin: '0 0 5px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {movie.title}
                    </h4>
                    <p style={{ fontSize: '11px', color: '#666', margin: '0 0 10px 0' }}>
                      ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                    </p>
                  </div>

                  <button 
                    onClick={() => onToggleWatched && onToggleWatched({ ...movie, media_type: 'movie' })}
                    style={{ 
                      width: '100%', 
                      padding: '6px', 
                      background: isWatched ? '#e0e0e0' : '#bcecdb', 
                      color: isWatched ? '#555' : '#1b4332',
                      border: 'none', 
                      borderRadius: '6px', 
                      fontSize: '11px', 
                      cursor: 'pointer',
                      fontWeight: 'bold' 
                    }}
                  >
                    {isWatched ? '✓ Vista' : '+ Marcar Vista'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Movies;