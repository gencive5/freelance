import { useEffect, useRef, useState, useCallback } from "react";

const DistortedText = ({ 
  text = "observation",
  fontFamily = "'EB Garamond', serif",
  size = 60,
  color = "#202020",
  padding = 40,
  speed = 1.5, // Increased default speed
  volatility = 0.3, // Adjusted default volatility
  seed = 0.1,
  className = ""
}) => {
  const containerRef = useRef(null);
  const blotterInstance = useRef(null);
  const scopeRef = useRef(null);
  const materialRef = useRef(null);
  const lastMousePosition = useRef({x: window.innerWidth/2, y: window.innerHeight/2});
  const currentVolatility = useRef(0);
  const animationFrameId = useRef(null);
  const mousePosRef = useRef({x: window.innerWidth/2, y: window.innerHeight/2});
  const resizeTimeout = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isResizing, setIsResizing] = useState(false);

  // Helper functions
  const lineEq = (y2, y1, x2, x1, currentVal) => {
    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;
    return m * currentVal + b;
  };

  const lerp = (a, b, n) => (1 - n) * a + n * b;

  const render = useCallback(() => {
    if (!materialRef.current) return;
    
    const mouseDistance = Math.hypot(
      lastMousePosition.current.x - mousePosRef.current.x,
      lastMousePosition.current.y - mousePosRef.current.y
    );
    
    // Smoother volatility calculation with performance optimization
    currentVolatility.current = lerp(
      currentVolatility.current, 
      Math.min(mouseDistance * 0.015, 0.9), // Simplified calculation
      0.08 // Slightly faster interpolation
    );
    
    materialRef.current.uniforms.uVolatility.value = Math.min(
      Math.max(currentVolatility.current, 0), 
      1
    );
    lastMousePosition.current = { ...mousePosRef.current };
    
    animationFrameId.current = requestAnimationFrame(render);
  }, []);

  const initializeBlotter = useCallback(() => {
    if (!window.Blotter || !containerRef.current) return;

    // Store reference to previous canvas
    const prevCanvas = containerRef.current.querySelector('canvas');
    
    const responsiveSize = windowWidth > 768 ? size : size * 0.7;

    const textObj = new window.Blotter.Text(text, {
      family: fontFamily,
      size: responsiveSize,
      fill: color,
      paddingLeft: padding,
      paddingRight: padding,
      paddingTop: padding,
      paddingBottom: padding,
    });

    const material = new window.Blotter.LiquidDistortMaterial();
    material.uniforms.uSpeed.value = speed * 1.5; // Increased speed multiplier
    material.uniforms.uVolatility.value = volatility;
    material.uniforms.uSeed.value = seed;
    materialRef.current = material;

    blotterInstance.current = new window.Blotter(material, { 
      texts: textObj
    });

    scopeRef.current = blotterInstance.current.forText(textObj);
    
    // Create new canvas in memory first
    const tempDiv = document.createElement('div');
    scopeRef.current.appendTo(tempDiv);
    const newCanvas = tempDiv.querySelector('canvas');
    
    // Smooth transition between canvases
    if (prevCanvas && newCanvas) {
      newCanvas.style.opacity = '0';
      newCanvas.style.transition = 'opacity 0.15s ease-out';
      containerRef.current.appendChild(newCanvas);
      
      requestAnimationFrame(() => {
        newCanvas.style.opacity = '1';
        prevCanvas.style.opacity = '0';
        
        setTimeout(() => {
          if (prevCanvas.parentNode === containerRef.current) {
            containerRef.current.removeChild(prevCanvas);
          }
        }, 150);
      });
    } else {
      scopeRef.current.appendTo(containerRef.current);
    }

    // Start optimized render loop
    if (!animationFrameId.current) {
      animationFrameId.current = requestAnimationFrame(render);
    }
  }, [text, fontFamily, size, color, padding, speed, volatility, seed, windowWidth, render]);

  const handleResize = useCallback(() => {
    setIsResizing(true);
    setWindowWidth(window.innerWidth);
    
    // More responsive debounce with quick initial response
    clearTimeout(resizeTimeout.current);
    resizeTimeout.current = setTimeout(() => {
      initializeBlotter();
      setIsResizing(false);
    }, 100); // Reduced debounce time
  }, [initializeBlotter]);

  useEffect(() => {
    const handleMouseMove = (ev) => {
      mousePosRef.current = {
        x: ev.clientX,
        y: ev.clientY
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Initialize with slight delay to ensure container is ready
    const initTimeout = setTimeout(initializeBlotter, 50);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      clearTimeout(initTimeout);
      clearTimeout(resizeTimeout.current);
      cancelAnimationFrame(animationFrameId.current);
      
      // Clean up canvas element
      if (containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          containerRef.current.removeChild(canvas);
        }
      }
    };
  }, [initializeBlotter, handleResize]);

  return (
    <div
      ref={containerRef}
      className={`distorted-text-container ${className}`}
      style={{
        width: '100%',
        height: 'auto',
        position: 'relative',
        overflow: 'hidden' // Prevent scroll jumps during resize
      }}
    />
  );
};

export default DistortedText;