// src/components/MetallicButton.jsx
import { useEffect } from 'react';
import 'metallicss';
import './MetallicButton.css'; // Make sure to import your CSS

const MetallicButton = ({ children, onClick, className = '', style = {}, ...props }) => {
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
      className={`metallic-button metallicss ${className}`} // Added metallic-button class
      onClick={onClick}
      style={{
        '--convexity': 3,
        '--metal': 'silver',
        borderRadius: '120px',
        width: '240px',
        height: '80px',
        background: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: 'white !important',
        textShadow: '0 -1px 0 rgba(0,0,0,0.5)',
        ...style
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default MetallicButton;