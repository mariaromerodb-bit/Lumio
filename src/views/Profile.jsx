import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile({ currentUser, userMediaState = {}, onToggleAddList }) {
  const navigate = useNavigate();
  const mediaItems = Object.values(userMediaState);

  const [movieFilter, setMovieFilter] = useState('all'); 
  const [tvFilter, setTvFilter] = useState('all');       

  const getUserDisplayName = () => {
    if (!currentUser) return 'Usuario';
    return currentUser.name || currentUser.username || currentUser.email?.split('@')[0] || 'Usuario';
  };

  const displayName = getUserDisplayName();

  const movies = mediaItems.filter(item => item.type === 'movie' || item.media_type === 'movie');
  const watchedMovies = movies.filter(m => m.watched);
  const pendingMovies = movies.filter(m => !m.watched);

  const filteredMovies = movies.filter(movie => {
    if (movieFilter === 'watched') return movie.watched;
    if (movieFilter === 'pending') return !movie.watched;
    return true;
  });

  const tvShows = mediaItems.filter(item => item.type === 'tv' || item.media_type === 'tv');

  const completedTV = tvShows.filter(show => {
    if (show.watched) return true;
    const eps = show.watchedEpisodes || [];
    return show.total_episodes > 0 && eps.length >= show.total_episodes;
  });

  const watchingTV = tvShows.filter(show => {
    const eps = show.watchedEpisodes || [];
    const total = show.total_episodes || 0;
    return eps.length > 0 && (total === 0 || eps.length < total);
  });

  const pendingTV = tvShows.filter(show => {
    const eps = show.watchedEpisodes || [];
    return !show.watched && eps.length === 0;
  });

  const filteredTV = tvShows.filter(show => {
    const eps = show.watchedEpisodes || [];
    const total = show.total_episodes || 0;
    const isDone = show.watched || (total > 0 && eps.length >= total);

    if (tvFilter === 'completed') return isDone;
    if (tvFilter === 'watching') return eps.length > 0 && !isDone;
    if (tvFilter === 'pending') return !isDone && eps.length === 0;
    return true;
  });

  const renderCard = (item, isMovie = true) => {
    const title = item.title || item.name;
    const poster = item.poster_path
      ? (item.poster_path.startsWith('http') ? item.poster_path : `https://image.tmdb.org/t/p/w300${item.poster_path}`)
      : null;

    const epsCount = item.watchedEpisodes ? item.watchedEpisodes.length : 0;
    const totalEps = item.total_episodes || 0;
    const isDone = item.watched || (totalEps > 0 && epsCount >= totalEps);

    return (
      <div
        key={`${item.type || (isMovie ? 'movie' : 'tv')}-${item.id}`}
        style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#2b2d42',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          aspectRatio: '2/3',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}
      >
        {poster ? (
          <img
            src={poster}
            alt={title}
            onClick={() => navigate(`/detalle/${item.type || (isMovie ? 'movie' : 'tv')}/${item.id}`)}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
          />
        ) : (
          <div 
            onClick={() => navigate(`/detalle/${item.type || (isMovie ? 'movie' : 'tv')}/${item.id}`)}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#343a40', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd', padding: '10px', textAlign: 'center', fontSize: '13px', cursor: 'pointer' }}
          >
            {title}
          </div>
        )}

        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)'
        }} />

        <button
          title="Quitar de mi biblioteca"
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleAddList) onToggleAddList(item);
          }}
          style={{
            position: 'absolute', top: '8px', left: '8px', zIndex: 3,
            background: 'rgba(220, 38, 38, 0.85)', color: '#fff', border: 'none',
            width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold'
          }}
        >
          ✕
        </button>

        <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 2 }}>
          {isMovie ? (
            <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '20px', background: item.watched ? '#2e7d32' : 'rgba(0, 0, 0, 0.75)', color: '#fff' }}>
              {item.watched ? '🎉 Vista' : '⏳ Pendiente'}
            </span>
          ) : (
            <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '20px', background: isDone ? '#1565c0' : epsCount > 0 ? '#7b1fa2' : 'rgba(0, 0, 0, 0.75)', color: '#fff' }}>
              {isDone ? '🏆 Completada' : epsCount > 0 ? `🔥 Cap. ${epsCount}` : '📌 Guardada'}
            </span>
          )}
        </div>

        <div 
          onClick={() => navigate(`/detalle/${item.type || (isMovie ? 'movie' : 'tv')}/${item.id}`)}
          style={{ position: 'relative', zIndex: 2, padding: '10px', color: '#fff', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </div>
          {!isMovie && (
            <div style={{ fontSize: '11px', color: '#e0e0e0', marginTop: '2px' }}>
              {epsCount} {totalEps > 0 ? `/ ${totalEps}` : ''} eps
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', color: '#2b2d42' }}>
      <header style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ width: '55px', height: '55px', borderRadius: '50%', background: '#1b4332', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 'bold' }}>
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>{displayName}</h1>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '13px' }}>Resumen de tu biblioteca</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '35px' }}>
        <div style={{ background: '#e8f5e9', padding: '16px', borderRadius: '12px', borderLeft: '5px solid #2e7d32' }}>
          <span style={{ fontSize: '12px', color: '#2e7d32', fontWeight: 'bold' }}>🎬 Películas Vistas</span>
          <p style={{ fontSize: '26px', fontWeight: 'bold', margin: '4px 0 0 0', color: '#1b5e20' }}>🎉 {watchedMovies.length}</p>
        </div>
        <div style={{ background: '#fff3e0', padding: '16px', borderRadius: '12px', borderLeft: '5px solid #ef6c00' }}>
          <span style={{ fontSize: '12px', color: '#ef6c00', fontWeight: 'bold' }}>🍿 Películas Pendientes</span>
          <p style={{ fontSize: '26px', fontWeight: 'bold', margin: '4px 0 0 0', color: '#e65100' }}>⏳ {pendingMovies.length}</p>
        </div>
        <div style={{ background: '#e3f2fd', padding: '16px', borderRadius: '12px', borderLeft: '5px solid #1565c0' }}>
          <span style={{ fontSize: '12px', color: '#1565c0', fontWeight: 'bold' }}>🏆 Series Completadas</span>
          <p style={{ fontSize: '26px', fontWeight: 'bold', margin: '4px 0 0 0', color: '#0d47a1' }}>✅ {completedTV.length}</p>
        </div>
        <div style={{ background: '#f3e5f5', padding: '16px', borderRadius: '12px', borderLeft: '5px solid #7b1fa2' }}>
          <span style={{ fontSize: '12px', color: '#7b1fa2', fontWeight: 'bold' }}>🔥 Series En Proceso</span>
          <p style={{ fontSize: '26px', fontWeight: 'bold', margin: '4px 0 0 0', color: '#4a148c' }}>📺 {watchingTV.length}</p>
        </div>
      </div>

      <section style={{ marginBottom: '40px', background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>🎬 Mis Películas ({filteredMovies.length})</h2>
          <div style={{ display: 'flex', gap: '8px', background: '#f1f3f5', padding: '4px', borderRadius: '10px' }}>
            <button onClick={() => setMovieFilter('all')} style={{ border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', background: movieFilter === 'all' ? '#1b4332' : 'transparent', color: movieFilter === 'all' ? '#fff' : '#495057' }}>Todas ({movies.length})</button>
            <button onClick={() => setMovieFilter('watched')} style={{ border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', background: movieFilter === 'watched' ? '#2e7d32' : 'transparent', color: movieFilter === 'watched' ? '#fff' : '#495057' }}>Vistas ({watchedMovies.length})</button>
            <button onClick={() => setMovieFilter('pending')} style={{ border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', background: movieFilter === 'pending' ? '#ef6c00' : 'transparent', color: movieFilter === 'pending' ? '#fff' : '#495057' }}>Pendientes ({pendingMovies.length})</button>
          </div>
        </div>
        {filteredMovies.length === 0 ? (
          <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', padding: '30px 0' }}>No hay películas en esta categoría.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px' }}>
            {filteredMovies.map(movie => renderCard(movie, true))}
          </div>
        )}
      </section>

      <section style={{ marginBottom: '40px', background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>📺 Mis Series ({filteredTV.length})</h2>
          <div style={{ display: 'flex', gap: '6px', background: '#f1f3f5', padding: '4px', borderRadius: '10px' }}>
            <button onClick={() => setTvFilter('all')} style={{ border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', background: tvFilter === 'all' ? '#1b4332' : 'transparent', color: tvFilter === 'all' ? '#fff' : '#495057' }}>Todas ({tvShows.length})</button>
            <button onClick={() => setTvFilter('watching')} style={{ border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', background: tvFilter === 'watching' ? '#7b1fa2' : 'transparent', color: tvFilter === 'watching' ? '#fff' : '#495057' }}>Viendo ({watchingTV.length})</button>
            <button onClick={() => setTvFilter('completed')} style={{ border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', background: tvFilter === 'completed' ? '#1565c0' : 'transparent', color: tvFilter === 'completed' ? '#fff' : '#495057' }}>Completadas ({completedTV.length})</button>
            <button onClick={() => setTvFilter('pending')} style={{ border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', background: tvFilter === 'pending' ? '#6c757d' : 'transparent', color: tvFilter === 'pending' ? '#fff' : '#495057' }}>Pendientes ({pendingTV.length})</button>
          </div>
        </div>
        {filteredTV.length === 0 ? (
          <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', padding: '30px 0' }}>No hay series en esta categoría.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px' }}>
            {filteredTV.map(show => renderCard(show, false))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;