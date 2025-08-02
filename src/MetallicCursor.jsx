import { useEffect } from 'react';
import 'metallicss';
import './App.css';

const SHAPES = {
  default: 'circle',
  text: 'text-shape',
  button: 'pointer-shape',
  scrollbar: 'scroll-shape'
};

const isTouchDevice = () => {
  return ('ontouchstart' in window) || 
         (navigator.maxTouchPoints > 0) || 
         (navigator.msMaxTouchPoints > 0);
};

const MetallicCursor = () => {
  useEffect(() => {
    // Skip entirely on touch devices
    if (isTouchDevice()) return;

    const cursor = document.createElement('div');
    cursor.className = 'metallicss metallic-cursor';
    
    // Enhanced metallic properties
    cursor.style.setProperty('--convexity', '2');
    cursor.style.setProperty('--metal', 'linear-gradient(145deg, #c0c0c0, #e0e0e0)');
    cursor.style.setProperty('--light-x', '0.4');
    cursor.style.setProperty('--light-y', '0.4');
    cursor.style.setProperty('--reflectivity', '0.8');
    
    document.body.appendChild(cursor);
    document.body.classList.add('metallic-cursor-active');

    // Smooth movement with requestAnimationFrame
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let requestId = null;

    const lerp = (a, b, n) => (1 - n) * a + n * b;

    const animate = () => {
      cursorX = lerp(cursorX, mouseX, 0.2);
      cursorY = lerp(cursorY, mouseY, 0.2);
      cursor.style.transform = `translate(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%)`;
      requestId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!requestId) {
        animate();
      }
    };

    // Shape detection
    const updateCursorShape = (e) => {
      const target = e.target;
      cursor.classList.remove(...Object.values(SHAPES));
      
      if (target.matches('button, [role="button"], a, input[type="submit"], .metallic-button')) {
        cursor.classList.add(SHAPES.button);
      } 
      else if (target.matches('input, textarea, [contenteditable], a, p, span, h1, h2, h3, h4, h5, h6')) {
        cursor.classList.add(SHAPES.text);
      }
      else if (target.matches('.scrollbar-thumb, .scrollbar-track, [data-scrollbar]')) {
        cursor.classList.add(SHAPES.scrollbar);
      }
      else {
        cursor.classList.add(SHAPES.default);
      }
    };

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', updateCursorShape);

    // Cleanup
    return () => {
      cancelAnimationFrame(requestId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', updateCursorShape);
      document.body.classList.remove('metallic-cursor-active');
      if (cursor.parentNode) {
        document.body.removeChild(cursor);
      }
    };
  }, []);

  return null;
};

export default MetallicCursor;