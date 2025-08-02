import { useEffect } from 'react';
import 'metallicss';
import './App.css';

const SHAPES = {
  default: 'circle',
  text: 'text-shape',
  button: 'pointer-shape',
  scrollbar: 'scroll-shape'
};

const MetallicCursor = () => {
  useEffect(() => {
    if ('ontouchstart' in window) return; // Skip on touch devices

    // Create cursor element
    const cursor = document.createElement('div');
    cursor.className = 'metallicss metallic-cursor';
    
    // Set initial metallic properties
    cursor.style.setProperty('--convexity', '1.8');
    cursor.style.setProperty('--metal', 'silver');
    cursor.style.setProperty('--light-x', '0.4');
    cursor.style.setProperty('--light-y', '0.4');
    
    document.body.appendChild(cursor);

    // Track mouse movement
    const moveCursor = (e) => {
      cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%)`;
    };

    // Detect hover elements
    const updateCursorShape = (e) => {
      const target = e.target;
      cursor.classList.remove(...Object.values(SHAPES));
      
      if (target.matches('button, [role="button"], a, input[type="submit"]')) {
        cursor.classList.add(SHAPES.button);
      } 
      else if (target.matches('input, textarea, [contenteditable], a')) {
        cursor.classList.add(SHAPES.text);
      }
      else if (target.matches('.scrollbar-thumb, .scrollbar-track')) {
        cursor.classList.add(SHAPES.scrollbar);
      }
      else {
        cursor.classList.add(SHAPES.default);
      }
    };

    // Hide default cursor and setup event listeners
    document.body.style.cursor = 'none';
    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', updateCursorShape);

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', updateCursorShape);
      if (cursor.parentNode) {
        document.body.removeChild(cursor);
      }
    };
  }, []);

  return null;
};

export default MetallicCursor;