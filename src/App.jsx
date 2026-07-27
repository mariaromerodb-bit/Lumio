import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Explore from './views/Explore';
import MediaDetail from './views/MediaDetail';
import Profile from './views/Profile';
import Movies from './views/Movies';
import Login from './views/Login';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('lumio_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [userMediaState, setUserMediaState] = useState(() => {
    const saved = localStorage.getItem('lumio_user_media');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('lumio_user_media', JSON.stringify(userMediaState));
  }, [userMediaState]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lumio_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('lumio_current_user');
    }
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleLogin = (userData) => {
    setCurrentUser(userData);
  };

  const handleUpdateUserMedia = (mediaKey, newData) => {
    setUserMediaState(prev => ({
      ...prev,
      [mediaKey]: newData
    }));
  };

  const handleToggleAddList = (mediaItem) => {
    const mediaType = mediaItem.media_type || (mediaItem.title ? 'movie' : 'tv');
    const mediaKey = `${mediaType}-${mediaItem.id}`;

    setUserMediaState(prev => {
      const currentItem = prev[mediaKey] || {};
      const isCurrentlyAdded = !!currentItem.added;

      if (isCurrentlyAdded) {
        const copy = { ...prev };
        delete copy[mediaKey];
        return copy;
      } else {
        return {
          ...prev,
          [mediaKey]: {
            ...currentItem,
            added: true,
            title: mediaItem.title || mediaItem.name,
            poster_path: mediaItem.poster_path,
            type: mediaType,
            total_episodes: mediaItem.number_of_episodes || mediaItem.total_episodes || 0
          }
        };
      }
    });
  };

  const handleToggleEpisode = (mediaKey, epId, totalEpisodes, baseItemInfo, previousEpIds = []) => {
    setUserMediaState(prev => {
      const currentItem = prev[mediaKey] || {
        ...baseItemInfo,
        added: true,
        watchedEpisodes: []
      };

      const currentWatched = currentItem.watchedEpisodes || [];
      const isEpAlreadyWatched = currentWatched.includes(epId);
      let newWatchedEpisodes;

      if (isEpAlreadyWatched) {
        newWatchedEpisodes = currentWatched.filter(id => id !== epId);
      } else {
        const combined = [...currentWatched, epId, ...previousEpIds];
        newWatchedEpisodes = Array.from(new Set(combined));
      }

      return {
        ...prev,
        [mediaKey]: {
          ...currentItem,
          ...baseItemInfo,
          added: true,
          total_episodes: totalEpisodes || currentItem.total_episodes,
          watchedEpisodes: newWatchedEpisodes,
          watched: newWatchedEpisodes.length >= totalEpisodes && totalEpisodes > 0
        }
      };
    });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      <Sidebar currentUser={currentUser} onLogout={handleLogout} />
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/explorar" replace />} />
          
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          <Route 
            path="/explorar" 
            element={<Explore userMediaState={userMediaState} onToggleAddList={handleToggleAddList} />} 
          />
          
          <Route 
            path="/detalle/:type/:id" 
            element={
              <MediaDetail 
                userMediaState={userMediaState} 
                onUpdateUserMedia={handleUpdateUserMedia} 
                onToggleAddList={handleToggleAddList} 
                onToggleEpisode={handleToggleEpisode} 
              />
            } 
          />
          
          <Route 
            path="/perfil" 
            element={currentUser ? <Profile currentUser={currentUser} userMediaState={userMediaState} onToggleAddList={handleToggleAddList} /> : <Navigate to="/login" replace />} 
          />
          
          <Route 
            path="/peliculas" 
            element={<Movies userMediaState={userMediaState} onToggleAddList={handleToggleAddList} />} 
          />

          <Route path="*" element={<Navigate to="/explorar" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;