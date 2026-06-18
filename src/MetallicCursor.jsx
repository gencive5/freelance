import { useEffect, useRef } from 'react';
import 'metallicss';
import './App.css';

const SHAPES = {
  default: 'circle',
  text: 'text-shape',
  pointer: 'pointer-oval'
};

const isTouchDevice = () => {
  return ('ontouchstart' in window) || 
         (navigator.maxTouchPoints > 0) || 
         (navigator.msMaxTouchPoints > 0);
};

const MetallicCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    // Skip entirely on touch devices
    if (isTouchDevice()) return;

    // Create cursor element
    const cursor = document.createElement('div');
    cursor.className = 'metallicss metallic-cursor';
    cursorRef.current = cursor;
    
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
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      requestId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!requestId) {
        animate();
      }
    };

    // Shape detection using event delegation (MORE RELIABLE)
    const handleMouseOver = (e) => {
      const target = e.target;
      
      // Remove all shape classes
      cursor.classList.remove(...Object.values(SHAPES));
      
      // IMPORTANT: Check for INPUTS FIRST (before clickable)
      // This prevents inputs from being misidentified as clickable
      const isInput = target.matches('input, textarea, [contenteditable="true"]') || 
                     target.closest('input, textarea, [contenteditable="true"]');
      
      if (isInput) {
        cursor.classList.add(SHAPES.text);
        return; // Exit early - don't check for clickable
      }
      
      // Check for clickable elements
      const isClickable = target.matches('button, a, [role="button"], [onclick], .clickable, .metallic-button, .link') || 
                         target.closest('button, a, [role="button"], [onclick], .clickable, .metallic-button, .link');
      
      if (isClickable) {
        cursor.classList.add(SHAPES.pointer);
      } else {
        cursor.classList.add(SHAPES.default);
      }
    };

    // Use event delegation on document with capture phase
    document.addEventListener('mouseover', handleMouseOver, true);
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      cancelAnimationFrame(requestId);
      document.removeEventListener('mouseover', handleMouseOver, true);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.classList.remove('metallic-cursor-active');
      if (cursor.parentNode) {
        document.body.removeChild(cursor);
      }
    };
  }, []);

  return null;
};

export default MetallicCursor;