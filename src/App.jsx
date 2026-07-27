import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Explore from './components/Explore';
import MediaDetail from './components/MediaDetail';
import Auth from './components/Auth';

function App() {
  const [user, setUser] = useState(null); 
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [userList, setUserList] = useState([]); 
  const [watchedEpisodes, setWatchedEpisodes] = useState({}); 

  const handleOpenLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleOpenRegister = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleCloseAuth = () => {
    setShowAuthModal(false);
  };


  const handleToggleAddList = (item) => {
    setUserList((prevList) => {
      const exists = prevList.some((i) => i.id === item.id && i.type === item.type);
      if (exists) {
        return prevList.filter((i) => !(i.id === item.id && i.type === item.type));
      }
      return [...prevList, item];
    });
  };

  const handleToggleEpisode = (showId, seasonNum, episodeNum) => {
    const key = `${showId}_S${seasonNum}_E${episodeNum}`;
    setWatchedEpisodes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <BrowserRouter>
      <div className="app-container min-h-screen bg-slate-950 text-white flex flex-col">
        {/* Header / Navegación Principal */}
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
            CineApp
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium hover:text-red-400 transition-colors">
              Explorar
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-300">Hola, {user.name || 'Usuario'}</span>
                <button
                  onClick={() => setUser(null)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenLogin}
                  className="text-sm px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={handleOpenRegister}
                  className="text-sm px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
                >
                  Registrarse
                </button>
              </div>
            )}
          </nav>
        </header>

        {/* Rutas de la Aplicación */}
        <main className="flex-1">
          <Routes>
            {/* La ruta principal va directamente a Explore */}
            <Route 
              path="/" 
              element={<Explore userList={userList} onToggleAddList={handleToggleAddList} />} 
            />
            
            {/* Detalle de película o serie */}
            <Route 
              path="/detalle/:type/:id" 
              element={
                <MediaDetail 
                  userList={userList} 
                  onToggleAddList={handleToggleAddList} 
                  watchedEpisodes={watchedEpisodes}
                  onToggleEpisode={handleToggleToggleEpisode}
                />
              } 
            />

            {/* Redirección para rutas no encontradas */}
            <Route path="*" element={<Explore userList={userList} onToggleAddList={handleToggleAddList} />} />
          </Routes>
        </main>

        {/* Modal Emergente de Autenticación */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <button
                onClick={handleCloseAuth}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold"
              >
                ✕
              </button>
              <Auth 
                initialMode={authMode} 
                onSuccess={(userData) => {
                  setUser(userData);
                  handleCloseAuth();
                }} 
              />
            </div>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;