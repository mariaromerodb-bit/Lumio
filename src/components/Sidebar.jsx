import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Sidebar({ currentUser, onLogout }) {
  const navigate = useNavigate();

  return (
    <aside style={{ width: '240px', background: '#fff', borderRight: '1px solid #e9ecef', display: 'flex', flexDirection: 'column', padding: '20px', boxSizing: 'border-box' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 5px 0', letterSpacing: '1px' }}>LUMIO</h2>
      
      {/* Estado de sesión */}
      <div style={{ marginBottom: '30px' }}>
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8f9fa', padding: '8px 12px', borderRadius: '8px' }}>
            <span style={{ fontSize: '13px', color: '#2e7d32', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
              {currentUser.name}
            </span>
            <button 
              onClick={onLogout} 
              style={{ background: 'none', border: 'none', color: '#dc3545', fontSize: '12px', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}
            >
              Salir
            </button>
          </div>
        ) : (
          <div>
            <span style={{ fontSize: '12px', color: '#dc3545', display: 'block', marginBottom: '8px' }}>
              Sin sesión activa
            </span>
            <button 
              onClick={() => navigate('/login')}
              style={{ 
                width: '100%', 
                padding: '8px', 
                background: '#1b4332', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '6px', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                cursor: 'pointer' 
              }}
            >
              Iniciar Sesión / Registrarse
            </button>
          </div>
        )}
      </div>

      {/* Enlaces de navegación */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <NavLink 
          to="/explorar" 
          style={({ isActive }) => ({
            padding: '10px 12px',
            borderRadius: '8px',
            textDecoration: 'none',
            color: isActive ? '#1b4332' : '#495057',
            background: isActive ? '#bcecdb' : 'transparent',
            fontWeight: isActive ? 'bold' : 'normal',
            fontSize: '14px'
          })}
        >
          Explorar
        </NavLink>

        <NavLink 
          to="/peliculas" 
          style={({ isActive }) => ({
            padding: '10px 12px',
            borderRadius: '8px',
            textDecoration: 'none',
            color: isActive ? '#1b4332' : '#495057',
            background: isActive ? '#bcecdb' : 'transparent',
            fontWeight: isActive ? 'bold' : 'normal',
            fontSize: '14px'
          })}
        >
          Películas
        </NavLink>

        <NavLink 
          to="/perfil" 
          style={({ isActive }) => ({
            padding: '10px 12px',
            borderRadius: '8px',
            textDecoration: 'none',
            color: isActive ? '#1b4332' : '#495057',
            background: isActive ? '#bcecdb' : 'transparent',
            fontWeight: isActive ? 'bold' : 'normal',
            fontSize: '14px'
          })}
        >
          Perfil
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;