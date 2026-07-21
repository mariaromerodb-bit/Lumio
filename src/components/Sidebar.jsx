import React from 'react';

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Nombre de tu aplicación */}
      <div className="brand-logo">
        <h1>LUMIO</h1>
      </div>

      {/* Perfil del usuario */}
      <div className="user-profile">
        <div className="profile-avatar">JB</div>
        <span className="user-name">Juan B.</span>
      </div>

      {/* Menú de navegación principal con botones */}
      <nav className="main-nav">
        <ul>
          <li>
            <button type="button" className="nav-btn">
              <span className="icon">🔍</span> Explorar
            </button>
          </li>
          <li>
            <button type="button" className="nav-btn active">
              <span className="icon">👤</span> Perfil
            </button>
          </li>
          <li>
            <button type="button" className="nav-btn">
              <span className="icon">📺</span> Series
            </button>
          </li>
          <li>
            <button type="button" className="nav-btn">
              <span className="icon">🎬</span> Películas
            </button>
          </li>
        </ul>
      </nav>

      {/* Sección inferior del menú */}
      <footer className="sidebar-footer">
        <ul>
          <li>
            <button type="button" className="nav-btn">
              <span className="icon">⚙️</span> Ajustes
            </button>
          </li>
          <li>
            <button type="button" className="nav-btn">
              <span className="icon">❓</span> Ayuda
            </button>
          </li>
        </ul>
        <button type="button" className="btn-toggle-menu">
          Cerrar Menú <span>◀</span>
        </button>
      </footer>
    </aside>
  );
}
 
export default Sidebar;