// src/components/MetallicButton.jsx
import { useEffect } from 'react';

const MetallicButton = ({ children, onClick, className = '', style = {} }) => {
  useEffect(() => {
    // Dynamically load the MetalliCSS script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/metallicss@4.0.3/dist/metallicss.min.js';
    script.type = 'module';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <button
      className={`metallicss ${className}`}
      onClick={onClick}
      style={{
        '--convexity': 2,
        '--metal': 'neutral',
        borderRadius: '120px',
        width: '240px',
        height: '80px',
        background: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        ...style
      }}
    >
      {children}
    </button>
  );
};

export default MetallicButton;