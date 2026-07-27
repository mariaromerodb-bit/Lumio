import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMediaDetails } from '../services/tmdb';
import PersonDetailModal from '../components/PersonDetailModal';

function MediaDetail({ userMediaState = {}, onUpdateUserMedia, onToggleAddList, onToggleEpisode }) {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedPersonId, setSelectedPersonId] = useState(null);

  const mediaKey = `${type}-${id}`;
  const currentUserItem = userMediaState[mediaKey] || {};
  const isAdded = !!currentUserItem.added;
  const isMovieWatched = !!currentUserItem.watched;
  const watchedEpisodes = currentUserItem.watchedEpisodes || [];

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMediaDetails(type, id);
        setDetails(data);
      } catch (err) {
        console.error('Error al obtener detalles:', err);
        setError('No se pudo cargar la información de este contenido.');
      } finally {
        setLoading(false);
      }
    };

    if (type && id) {
      fetchDetails();
    }
  }, [type, id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4a5568' }}>
        <h2>Cargando detalles...</h2>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#e53e3e' }}>
        <h2>{error || 'No se encontró el contenido.'}</h2>
        <button
          onClick={() => navigate(-1)}
          style={{ marginTop: '16px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#bcecdb', color: '#1b4332', fontWeight: 'bold', cursor: 'pointer' }}
        >
          ← Volver atrás
        </button>
      </div>
    );
  }

  const title = details.title || details.name;
  const releaseDate = details.release_date || details.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const totalEpisodes = details.number_of_episodes || 0;

  const directors = details.credits?.crew?.filter(c => c.job === 'Director') || [];
  const creators = details.created_by || [];
  const cast = details.credits?.cast || [];

  const handleToggleMovieWatched = () => {
    onUpdateUserMedia(mediaKey, {
      ...currentUserItem,
      added: true,
      title: title,
      poster_path: details.poster_path,
      type: 'movie',
      watched: !isMovieWatched
    });
  };

  const handleEpisodeClick = (epId, seasonNumber, epNumber, seasonsList) => {
    let previousEpIds = [];

    if (seasonsList) {
      seasonsList.forEach(season => {
        if (season.season_number > 0) {
          const count = season.episodes ? season.episodes.length : season.episode_count || 0;
          
          if (season.season_number < seasonNumber) {
            for (let i = 1; i <= count; i++) {
              previousEpIds.push(`s${season.season_number}e${i}`);
            }
          } else if (season.season_number === seasonNumber) {
            for (let i = 1; i < epNumber; i++) {
              previousEpIds.push(`s${season.season_number}e${i}`);
            }
          }
        }
      });
    }

    onToggleEpisode(
      mediaKey,
      epId,
      totalEpisodes,
      {
        added: true,
        title: title,
        poster_path: details.poster_path,
        type: 'tv'
      },
      previousEpIds
    );
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '10px', color: '#2d3748', fontFamily: "'Quicksand', sans-serif" }}>
      
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ffffff',
          border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '12px',
          cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginBottom: '20px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
        }}
      >
        ← Volver
      </button>

      {/* DETALLES PRINCIPALES */}
      <div style={{
        background: '#ffffff', borderRadius: '24px', padding: '28px',
        display: 'flex', gap: '28px', flexWrap: 'wrap',
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)', marginBottom: '30px'
      }}>
        <div style={{ width: '220px', flexShrink: 0, margin: '0 auto' }}>
          <img
            src={details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : 'https://via.placeholder.com/220x330?text=Sin+Imagen'}
            alt={title}
            style={{ width: '100%', borderRadius: '16px', boxShadow: '0 6px 16px rgba(0,0,0,0.1)', display: 'block' }}
          />
        </div>

        <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '30px', fontWeight: '800', margin: 0, color: '#1a202c' }}>
                {title} {year && <span style={{ fontSize: '22px', color: '#a0aec0', fontWeight: '500' }}>({year})</span>}
              </h1>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {details.genres?.map(g => (
                <span key={g.id} style={{ background: '#edf2f7', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', color: '#4a5568' }}>
                  {g.name}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', fontSize: '15px', fontWeight: '700', color: '#d69e2e' }}>
              <span>⭐</span>
              <span>{details.vote_average ? details.vote_average.toFixed(1) : 'N/A'} / 10</span>
            </div>

            <p style={{ color: '#4a5568', lineHeight: '1.6', fontSize: '15px', margin: '0 0 20px 0' }}>
              {details.overview || 'Sin descripción disponible.'}
            </p>

            {(directors.length > 0 || creators.length > 0) && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1b4332' }}>🎬 Dirección / Creación:</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {directors.map(dir => (
                    <span
                      key={dir.id}
                      onClick={() => setSelectedPersonId(dir.id)}
                      style={{
                        background: '#e8f5e9', color: '#2e7d32', padding: '6px 12px',
                        borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer'
                      }}
                    >
                      👤 {dir.name}
                    </span>
                  ))}
                  {creators.map(cr => (
                    <span
                      key={cr.id}
                      onClick={() => setSelectedPersonId(cr.id)}
                      style={{
                        background: '#e8f5e9', color: '#2e7d32', padding: '6px 12px',
                        borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer'
                      }}
                    >
                      👤 {cr.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid #edf2f7' }}>
            <button
              onClick={() => onToggleAddList(details)}
              style={{
                padding: '12px 20px', borderRadius: '14px', border: 'none',
                background: isAdded ? '#fed7d7' : '#bcecdb',
                color: isAdded ? '#9b2c2c' : '#1b4332',
                fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <span>{isAdded ? '✕' : '+'}</span>
              <span>{isAdded ? 'Quitar de mi lista' : 'Añadir a mi lista'}</span>
            </button>

            {type === 'movie' && (
              <button
                onClick={handleToggleMovieWatched}
                style={{
                  padding: '12px 20px', borderRadius: '14px', border: 'none',
                  background: isMovieWatched ? '#c6f6d5' : '#edf2f7',
                  color: isMovieWatched ? '#22543d' : '#4a5568',
                  fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <span>{isMovieWatched ? '✓' : '👁️'}</span>
                <span>{isMovieWatched ? 'Película Vista' : 'Marcar como Vista'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN DE REPARTO */}
      {cast.length > 0 && (
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '28px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '700', color: '#1a202c' }}>
            👥 Reparto Principal
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '15px' }}>
            {cast.slice(0, 12).map(actor => (
              <div
                key={actor.id}
                onClick={() => setSelectedPersonId(actor.id)}
                style={{ cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img
                  src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/185x278?text=Sin+Foto'}
                  alt={actor.name}
                  style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', marginBottom: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
                />
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#2b2d42', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {actor.name}
                </div>
                <div style={{ fontSize: '10px', color: '#6c757d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {actor.character}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN DE SERIES */}
      {type === 'tv' && details.seasons && (
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '28px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1a202c' }}>
              📺 Episodios por Temporada
            </h3>
            <span style={{ fontSize: '13px', background: '#e2e8f0', padding: '6px 14px', borderRadius: '20px', fontWeight: '600', color: '#4a5568' }}>
              Progreso: {watchedEpisodes.length} / {totalEpisodes} episodios
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
            {details.seasons
              .filter(s => s.season_number > 0)
              .map(s => (
                <button
                  key={s.id || s.season_number}
                  onClick={() => setSelectedSeason(s.season_number)}
                  style={{
                    padding: '8px 16px', borderRadius: '12px', border: 'none',
                    background: selectedSeason === s.season_number ? '#1a202c' : '#f7fafc',
                    color: selectedSeason === s.season_number ? '#ffffff' : '#4a5568',
                    fontWeight: '700', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap'
                  }}
                >
                  Temporada {s.season_number}
                </button>
              ))}
          </div>

          {(() => {
            const currentSeasonData = details.seasons.find(s => s.season_number === selectedSeason);
            const epCount = currentSeasonData ? (currentSeasonData.episodes?.length || currentSeasonData.episode_count || 0) : 0;

            if (epCount === 0) {
              return <p style={{ color: '#a0aec0', fontStyle: 'italic' }}>No hay lista de episodios disponible para esta temporada.</p>;
            }

            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                {Array.from({ length: epCount }, (_, i) => {
                  const epNum = i + 1;
                  const epId = `s${selectedSeason}e${epNum}`;
                  const isEpWatched = watchedEpisodes.includes(epId);

                  return (
                    <button
                      key={epId}
                      onClick={() => handleEpisodeClick(epId, selectedSeason, epNum, details.seasons)}
                      style={{
                        padding: '12px', borderRadius: '14px', border: '1px solid',
                        borderColor: isEpWatched ? '#bcecdb' : '#e2e8f0',
                        background: isEpWatched ? '#bcecdb' : '#f7fafc',
                        color: isEpWatched ? '#1b4332' : '#4a5568',
                        fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>Capítulo {epNum}</span>
                      <span style={{ fontSize: '11px', opacity: 0.8 }}>
                        {isEpWatched ? '✓ Visto' : '+ Marcar'}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {selectedPersonId && (
        <PersonDetailModal
          personId={selectedPersonId}
          onClose={() => setSelectedPersonId(null)}
        />
      )}
    </div>
  );
}

export default MediaDetail;