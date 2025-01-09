import { useState, useEffect } from 'react';
import '../styles/global.css';

function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div>
      <button 
        onClick={() => setDarkMode(!darkMode)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: darkMode ? '#f0f0f0' : '#333333',
          color: darkMode ? '#333333' : '#f0f0f0',
          cursor: 'pointer'
        }}
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;