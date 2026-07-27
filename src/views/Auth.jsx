import React, { useState } from 'react';

function Auth({ onLogin, initialRegister = false }) {
  const [isRegister, setIsRegister] = useState(initialRegister);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) {
      onLogin({ username: username || email.split('@')[0], email });
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      padding: '30px',
      borderRadius: '20px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      textAlign: 'center',
      fontFamily: "'Quicksand', sans-serif"
    }}>
      <h2 style={{ margin: '0 0 10px 0', color: '#1a202c' }}>
        {isRegister ? 'Crear Cuenta en LUMIO' : 'Iniciar Sesión'}
      </h2>
      <p style={{ color: '#718096', fontSize: '14px', marginBottom: '20px' }}>
        {isRegister ? 'Guarda tus películas y series favoritas' : 'Accede a tu panel personal'}
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {isRegister && (
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e0', fontSize: '14px' }}
          />
        )}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e0', fontSize: '14px' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e0', fontSize: '14px' }}
        />
        <button
          type="submit"
          style={{
            padding: '14px',
            borderRadius: '12px',
            border: 'none',
            background: '#bcecdb',
            color: '#1b4332',
            fontWeight: 'bold',
            fontSize: '15px',
            cursor: 'pointer',
            marginTop: '8px'
          }}
        >
          {isRegister ? 'Registrarse' : 'Entrar'}
        </button>
      </form>

      <p style={{ marginTop: '20px', fontSize: '13px', color: '#718096' }}>
        {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'} {' '}
        <span
          onClick={() => setIsRegister(!isRegister)}
          style={{ color: '#2b6cb0', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isRegister ? 'Inicia sesión' : 'Regístrate aquí'}
        </span>
      </p>
    </div>
  );
}

export default Auth;