 import { memo, useEffect, useRef } from 'react';
import 'metallicss';

const MetallicButton = memo(({ 
  children, 
  onClick, 
  className = '', 
  style = {},
  text = null
}) => {
  const buttonRef = useRef(null);
  const textRef = useRef(null);
  
  useEffect(() => {
    // Load MetalliCSS script only once
    if (!window.metallicssLoaded) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/metallicss@4.0.3/dist/metallicss.min.js';
      script.type = 'module';
      document.body.appendChild(script);
      window.metallicssLoaded = true;
    }
  }, []);

  useEffect(() => {
    // Update text content without re-rendering
    if (textRef.current && text !== null) {
      textRef.current.textContent = text;
    } else if (textRef.current && children) {
      textRef.current.textContent = children;
    }
  }, [text, children]);

  return (
    <button
      ref={buttonRef}
      className={`metallicss ${className}`}
      onClick={onClick}
      style={{
        '--convexity': 3,
        '--metal': 'silver',
        borderRadius: '120px',
        width: '240px',
        height: '80px',
        background: '#ffffff',
        border: 'none',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: 'white !important',
        textShadow: '0 -1px 0 rgba(0,0,0,0.5)',
        ...style
      }}
    >
      <span ref={textRef} className="metallic-button-text">
        {children}
      </span>
    </button>
  );
});

export default MetallicButton;