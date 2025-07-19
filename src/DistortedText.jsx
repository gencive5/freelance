import { useEffect, useRef, useState, useCallback } from "react";

const DistortedText = ({ 
  text = "observation",
  fontFamily = "'EB Garamond', serif",
  size = 60,
  color = "#ffffffff",
  padding = 40,
  speed = 1,
  volatility = 0.8,
  seed = 0.8,
  className = ""
}) => {
  const containerRef = useRef(null);
  const blotterInstance = useRef(null);
  const scopeRef = useRef(null);
  const materialRef = useRef(null);
  const animationFrameId = useRef(null);
  const resizeTimeout = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const timeRef = useRef(0);
  const lastYPosition = useRef(0);

  const render = useCallback(() => {
    if (!materialRef.current) return;
    
    timeRef.current += 0.01;
    
    // Constant movement
    const autoVolatility = Math.sin(timeRef.current * 0.5) * 0.2 + volatility;
    materialRef.current.uniforms.uVolatility.value = autoVolatility;
    materialRef.current.uniforms.uSpeed.value = speed;
    
    animationFrameId.current = requestAnimationFrame(render);
  }, [speed, volatility]);

  const initializeBlotter = useCallback(() => {
    if (!window.Blotter || !containerRef.current) return;

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
    material.uniforms.uSpeed.value = speed;
    material.uniforms.uVolatility.value = volatility;
    material.uniforms.uSeed.value = seed;
    materialRef.current = material;

    blotterInstance.current = new window.Blotter(material, { 
      texts: textObj
    });

    scopeRef.current = blotterInstance.current.forText(textObj);
    
    const tempDiv = document.createElement('div');
    scopeRef.current.appendTo(tempDiv);
    const newCanvas = tempDiv.querySelector('canvas');
    
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

    if (!animationFrameId.current) {
      animationFrameId.current = requestAnimationFrame(render);
    }
  }, [text, fontFamily, size, color, padding, speed, volatility, seed, windowWidth, render]);

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
    clearTimeout(resizeTimeout.current);
    resizeTimeout.current = setTimeout(() => {
      initializeBlotter();
    }, 100);
  }, [initializeBlotter]);

  // Prevent accidental scrolling
  const handleTouchMove = useCallback((e) => {
    const currentY = e.touches[0].clientY;
    if (Math.abs(currentY - lastYPosition.current) > 10) {
      e.preventDefault();
    }
    lastYPosition.current = currentY;
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    containerRef.current?.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    const initTimeout = setTimeout(initializeBlotter, 50);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('touchmove', handleTouchMove);
      clearTimeout(initTimeout);
      clearTimeout(resizeTimeout.current);
      cancelAnimationFrame(animationFrameId.current);
      
      if (containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          containerRef.current.removeChild(canvas);
        }
      }
    };
  }, [initializeBlotter, handleResize, handleTouchMove]);

  return (
    <div
      ref={containerRef}
      className={`distorted-text-container ${className}`}
      style={{
        width: '100%',
        height: 'auto',
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'none' // Prevent scroll on touch devices
      }}
    />
  );
};

export default DistortedText;