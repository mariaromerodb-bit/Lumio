import React, { useState } from 'react';
import Auth from '../components/Auth';

function HomeLanding({ onLogin }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [initialRegisterMode, setInitialRegisterMode] = useState(false);

  const backdropPosters = [
    'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDO23A9mOx5.jpg',
    'https://image.tmdb.org/t/p/w500/pB8BM7PDSp6B6Ih7QZ4DrQ3PmJK.jpg',
    'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFv7Pv8bfUHY0.jpg',
    'https://image.tmdb.org/t/p/w500/8UlWsov1APDu1V13Kq2G19g71pQ.jpg',
    'https://image.tmdb.org/t/p/w500/628pA11933.jpg',
    'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg'
  ];

  const openAuth = (isRegister = false) => {
    setInitialRegisterMode(isRegister);
    setShowAuthModal(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#ffffff', fontFamily: "'Quicksand', sans-serif", position: 'relative', overflow: 'hidden' }}>
      
      {/* FONDO MOSAICO CON DEGRADADO */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '12px', opacity: 0.2, transform: 'scale(1.05) rotate(-2deg)',
        filter: 'blur(2px)', pointerEvents: 'none'
      }}>
        {Array.from({ length: 18 }).map((_, idx) => (
          <img
            key={idx}
            src={backdropPosters[idx % backdropPosters.length]}
            alt=""
            style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '12px' }}
          />
        ))}
      </div>

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.95) 80%)',
        pointerEvents: 'none'
      }} />

      {/* CABECERA SUPERIOR */}
      <header style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '1px', margin: 0, color: '#38bdf8' }}>LUMIO</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => openAuth(false)}
            style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: '700', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => openAuth(true)}
            style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', background: '#38bdf8', color: '#0f172a', fontWeight: '700', cursor: 'pointer' }}
          >
            Registrarse
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL HERO */}
      <main style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '6px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', marginBottom: '20px' }}>
          🍿 Tu diario personal de cine y series
        </span>

        <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: '800', lineHeight: '1.15', margin: '0 0 20px 0' }}>
          Organiza lo que ves.<br /><span style={{ color: '#38bdf8' }}>Sin complicaciones.</span>
        </h2>

        <p style={{ fontSize: '18px', color: '#94a3b8', margin: '0 0 36px 0', lineHeight: '1.6' }}>
          Lleva el control de tus películas pendientes, registra tus episodios vistos capítulo a capítulo y sincroniza tus estadísticas en tu propio perfil.
        </p>

        <button
          onClick={() => openAuth(true)}
          style={{
            padding: '18px 42px', borderRadius: '16px', border: 'none',
            background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
            color: '#ffffff', fontWeight: '800', fontSize: '18px', cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(56, 189, 248, 0.3)', transition: 'transform 0.2s ease'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          🚀 Crear mi perfil ahora
        </button>
      </main>

      {/* MODAL EMERGENTE DE AUTENTICACIÓN */}
      {showAuthModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
            <button
              onClick={() => setShowAuthModal(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: '#334155', color: '#fff', border: 'none',
                borderRadius: '50%', width: '32px', height: '32px',
                fontWeight: 'bold', cursor: 'pointer', zIndex: 10
              }}
            >
              ✕
            </button>
            <Auth onLogin={onLogin} initialRegister={initialRegisterMode} />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeLanding;