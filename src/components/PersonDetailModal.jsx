import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PersonDetailModal({ personId, onClose }) {
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = 'fa89b00b6c654823eff697985a42bfb5';
  const BASE_URL = 'https://api.themoviedb.org/3';

  useEffect(() => {
    if (!personId) return;

    async function fetchPersonData() {
      setLoading(true);
      try {
        const resPerson = await fetch(`${BASE_URL}/person/${personId}?api_key=${API_KEY}&language=es-ES`);
        const dataPerson = await resPerson.json();
        setPerson(dataPerson);

        const resCredits = await fetch(`${BASE_URL}/person/${personId}/combined_credits?api_key=${API_KEY}&language=es-ES`);
        const dataCredits = await resCredits.json();
        
        const sortedMedia = (dataCredits.cast || [])
          .concat(dataCredits.crew || [])
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        
        const uniqueMedia = Array.from(new Set(sortedMedia.map(a => a.id)))
          .map(id => sortedMedia.find(a => a.id === id));

        setCredits(uniqueMedia);
      } catch (err) {
        console.error("Error al cargar la persona:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPersonData();
  }, [personId]);

  if (!personId) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.75)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', maxWidth: '800px', width: '100%',
        maxHeight: '85vh', overflowY: 'auto', padding: '25px', position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '15px', right: '15px', border: 'none',
            background: '#e9ecef', borderRadius: '50%', width: '35px', height: '35px',
            cursor: 'pointer', fontSize: '18px', fontWeight: 'bold'
          }}
        >
          ✕
        </button>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Cargando perfil...</p>
        ) : person ? (
          <div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
              <img
                src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : 'https://via.placeholder.com/185x278?text=Sin+Foto'}
                alt={person.name}
                style={{ width: '120px', height: '180px', objectFit: 'cover', borderRadius: '12px' }}
              />
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>{person.name}</h2>
                <p style={{ fontSize: '13px', color: '#6c757d', margin: '0 0 10px 0' }}>
                  {person.known_for_department} {person.place_of_birth ? `• ${person.place_of_birth}` : ''}
                </p>
                <p style={{
                  fontSize: '13px', lineHeight: '1.5', color: '#495057',
                  display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                  {person.biography || 'Sin biografía disponible.'}
                </p>
              </div>
            </div>

            <h3 style={{ fontSize: '18px', borderBottom: '2px solid #e9ecef', paddingBottom: '8px', marginBottom: '15px' }}>
              🎬 Filmografía Destacada ({credits.length})
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
              {credits.slice(0, 12).map(item => {
                const title = item.title || item.name;
                const poster = item.poster_path ? `https://image.tmdb.org/t/p/w185${item.poster_path}` : null;
                const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');

                return (
                  <div
                    key={`${type}-${item.id}`}
                    onClick={() => {
                      onClose();
                      navigate(`/detalle/${type}/${item.id}`);
                    }}
                    style={{ cursor: 'pointer', textAlign: 'center' }}
                  >
                    <div style={{ borderRadius: '8px', overflow: 'hidden', aspectRatio: '2/3', background: '#e9ecef', marginBottom: '6px' }}>
                      {poster ? (
                        <img src={poster} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ padding: '10px', fontSize: '10px' }}>{title}</div>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p>No se encontró información de la persona.</p>
        )}
      </div>
    </div>
  );
}

export default PersonDetailModal;