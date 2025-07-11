import { useEffect, useRef, useState, useCallback } from "react";

const DistortedText = ({ 
  text = "observation",
  fontFamily = "'EB Garamond', serif",
  size = 60, // Default size in pixels
  color = "#202020",
  padding = 40,
  speed = 1,
  volatility = 0,
  seed = 0.1,
  className = ""
}) => {
  const containerRef = useRef(null);
  const blotterInstance = useRef(null);
  const scopeRef = useRef(null);
  const materialRef = useRef(null);
  const textObjRef = useRef(null);
  const lastMousePosition = useRef({x: window.innerWidth/2, y: window.innerHeight/2});
  const currentVolatility = useRef(0);
  const animationFrameId = useRef(null);
  const mousePosRef = useRef({x: window.innerWidth/2, y: window.innerHeight/2});
  const resizeTimeout = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
    
    currentVolatility.current = lerp(
      currentVolatility.current, 
      Math.min(lineEq(0.9, 0, 100, 0, mouseDistance), 0.9), 
      0.05
    );
    
    // Ensure uniform values are properly set
    if (materialRef.current.uniforms) {
      materialRef.current.uniforms.uVolatility.value = Math.min(Math.max(currentVolatility.current, 0), 1);
    }
    
    lastMousePosition.current = { ...mousePosRef.current };
    animationFrameId.current = requestAnimationFrame(render);
  }, []);

  const initializeBlotter = useCallback(() => {
    if (!window.Blotter || !containerRef.current) return;

    // Clean up previous instance
    if (scopeRef.current?.element) {
      scopeRef.current.element.remove();
    }

    // Calculate responsive size based on window width
    const responsiveSize = windowWidth > 768 ? size : size * 0.7;

    // Create new text object
    textObjRef.current = new window.Blotter.Text(text, {
      family: fontFamily,
      size: responsiveSize,
      fill: color,
      paddingLeft: padding,
      paddingRight: padding,
      paddingTop: padding,
      paddingBottom: padding,
    });

    // Create material with validated uniform values
    const material = new window.Blotter.LiquidDistortMaterial();
    material.uniforms.uSpeed.value = Number(speed) || 0;
    material.uniforms.uVolatility.value = Math.min(Math.max(Number(volatility), 0), 1);
    material.uniforms.uSeed.value = Number(seed) || 0.1;
    materialRef.current = material;

    // Initialize Blotter
    blotterInstance.current = new window.Blotter(material, { 
      texts: textObjRef.current
    });

    // Create scope and append to container
    scopeRef.current = blotterInstance.current.forText(textObjRef.current);
    scopeRef.current.appendTo(containerRef.current);

    // Start render loop
    animationFrameId.current = requestAnimationFrame(render);
  }, [text, fontFamily, size, color, padding, speed, volatility, seed, windowWidth, render]);

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
    
    // Debounce resize events
    clearTimeout(resizeTimeout.current);
    resizeTimeout.current = setTimeout(() => {
      if (textObjRef.current && blotterInstance.current) {
        // Only update at breakpoints to save performance
        const newSize = window.innerWidth > 768 ? size : size * 0.7;
        textObjRef.current.properties.size = newSize;
        textObjRef.current.needsUpdate = true;
        
        // Update canvas dimensions
        if (scopeRef.current?.element) {
          const canvas = scopeRef.current.element.querySelector('canvas');
          if (canvas) {
            const containerWidth = containerRef.current.offsetWidth;
            const containerHeight = containerRef.current.offsetHeight;
            canvas.width = containerWidth;
            canvas.height = containerHeight;
            canvas.style.width = `${containerWidth}px`;
            canvas.style.height = `${containerHeight}px`;
          }
        }
      }
    }, 200);
  }, [size]);

  useEffect(() => {
    const handleMouseMove = (ev) => {
      mousePosRef.current = {
        x: ev.clientX,
        y: ev.clientY
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Initialize after a small delay to ensure container is rendered
    const initTimeout = setTimeout(initializeBlotter, 100);

    return () => {
      clearTimeout(initTimeout);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout.current);
      cancelAnimationFrame(animationFrameId.current);
      
      if (scopeRef.current?.element) {
        scopeRef.current.element.remove();
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
        position: 'relative'
      }}
    />
  );
};

export default DistortedText;