import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPopularMovies, getPopularTVShows, searchMulti } from '../services/tmdb';

function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setIsLoading(true);
      try {
        const [moviesData, tvData] = await Promise.all([
          getPopularMovies(),
          getPopularTVShows()
        ]);
        setMovies(moviesData);
        setTvShows(tvData);
      } catch (err) {
        console.error("Error al cargar novedades:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchMulti(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error("Error en la búsqueda:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div style={{ width: '100%', maxWidth: '1050px', margin: '0 auto', padding: '20px 30px', boxSizing: 'border-box' }}>
      {/* Buscador */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Buscar películas o series..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: '12px 20px',
            borderRadius: '25px',
            border: '1px solid #ccc',
            outline: 'none',
            fontSize: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '12px 25px',
            borderRadius: '25px',
            border: 'none',
            background: '#bcecdb',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {isSearching ? '⏳ Buscando...' : '🔍 Buscar'}
        </button>
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            style={{
              padding: '12px 18px',
              borderRadius: '25px',
              border: 'none',
              background: '#eee',
              cursor: 'pointer'
            }}
          >
            ✖ Limpiar
          </button>
        )}
      </form>

      {/* Resultados de búsqueda */}
      {searchResults.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1a202c', marginBottom: '15px' }}>🔍 Resultados de Búsqueda</h2>
          <CarouselRow items={searchResults} />
        </section>
      )}

      {/* Novedades */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>⏳ Cargando novedades...</div>
      ) : (
        <>
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1a202c', marginBottom: '15px' }}>🎬 Novedades en Películas</h2>
            <CarouselRow items={movies.map(m => ({ ...m, media_type: 'movie' }))} />
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1a202c', marginBottom: '15px' }}>📺 Novedades en Series</h2>
            <CarouselRow items={tvShows.map(t => ({ ...t, media_type: 'tv' }))} />
          </section>
        </>
      )}
    </div>
  );
}

function CarouselRow({ items }) {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div style={{ position: 'relative', margin: '15px 0', padding: '0 10px' }}>
      <button
        onClick={() => scroll('left')}
        aria-label="Anterior"
        style={{
          position: 'absolute', left: '0px', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
          background: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ddd', borderRadius: '50%',
          width: '38px', height: '38px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        ❮
      </button>

      <div
        ref={rowRef}
        style={{
          display: 'flex', gap: '15px', overflowX: 'auto', scrollBehavior: 'smooth',
          padding: '10px 30px', scrollbarWidth: 'none', msOverflowStyle: 'none'
        }}
      >
        {items.map((item) => (
          <div key={`${item.media_type}-${item.id}`} style={{ flex: '0 0 150px' }}>
            <MediaCard item={item} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        aria-label="Siguiente"
        style={{
          position: 'absolute', right: '0px', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
          background: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ddd', borderRadius: '50%',
          width: '38px', height: '38px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        ❯
      </button>
    </div>
  );
}

function MediaCard({ item }) {
  const navigate = useNavigate();
  const title = item.title || item.name;
  const isMovie = item.media_type === 'movie';
  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');

  const goToDetail = () => {
    navigate(`/detalle/${mediaType}/${item.id}`);
  };

  return (
    <div
      onClick={goToDetail}
      style={{
        background: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', height: '100%', cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.06)';
      }}
    >
      {item.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
          alt={title}
          style={{ width: '100%', height: '210px', objectFit: 'cover' }}
        />
      ) : (
        <div style={{ height: '210px', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
          Sin Imagen
        </div>
      )}

      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#777', fontWeight: 'bold' }}>
            {isMovie ? '🎬 Película' : '📺 Serie'}
          </span>
          <h4 style={{ fontSize: '12px', margin: '2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={title}>
            {title}
          </h4>
          <p style={{ fontSize: '11px', color: '#666', margin: '0' }}>
            ⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            goToDetail();
          }}
          style={{
            width: '100%', padding: '6px', background: '#bcecdb', border: 'none',
            borderRadius: '6px', fontSize: '10px', cursor: 'pointer', fontWeight: 'bold', marginTop: '8px'
          }}
        >
          👁️ Ver Detalles
        </button>
      </div>
    </div>
  );
}

export default Explore;