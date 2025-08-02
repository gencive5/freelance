import { useEffect } from 'react';
import 'metallicss';
import './App.css';

const MetallicCursor = () => {
  useEffect(() => {
    // Create cursor element
    const cursor = document.createElement('div');
    cursor.className = 'metallicss metallic-cursor';
    
    // Set metallic properties
    cursor.style.setProperty('--convexity', '1.5');
    cursor.style.setProperty('--metal', 'silver');
    cursor.style.setProperty('--light-x', '0.5');
    cursor.style.setProperty('--light-y', '0.5');
    cursor.style.setProperty('--light-intensity', '0.8');
    
    document.body.appendChild(cursor);

    // Track mouse movement
    const moveCursor = (e) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    // Hide default cursor and show metallic one
    document.body.style.cursor = 'none';
    window.addEventListener('mousemove', moveCursor);

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', moveCursor);
      if (cursor.parentNode) {
        document.body.removeChild(cursor);
      }
    };
  }, []);

  return null;
};

export default MetallicCursor;