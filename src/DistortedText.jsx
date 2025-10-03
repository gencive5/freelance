import { useEffect, useRef, useState, useCallback } from "react";

const DistortedText = ({ 
  text = "observation",
  fontFamily = "'Microsoft', serif",
  baseSize = 60,
  color = "#ffffffff",
  padding = 40,
  speed = 0.5,
  volatility = 0.8,
  seed = 0.8,
  className = "",
  desktopSizeMultiplier = 2
}) => {
  const containerRef = useRef(null);
  const blotterInstance = useRef(null);
  const scopeRef = useRef(null);
  const materialRef = useRef(null);
  const animationFrameId = useRef(null);
  const resizeTimeout = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const timeRef = useRef(0);
  const hoverMultiplierRef = useRef(1);
  const isInitialized = useRef(false);

  // Simplified animation without visibility checks
  const render = useCallback(() => {
    if (!materialRef.current) return;

    timeRef.current += 0.01;

    const baseMovement = Math.sin(timeRef.current * 0.5) * 0.2 + volatility;
    materialRef.current.uniforms.uVolatility.value = baseMovement * hoverMultiplierRef.current;
    materialRef.current.uniforms.uSpeed.value = speed;

    animationFrameId.current = requestAnimationFrame(render);
  }, [speed, volatility]);

  const getResponsiveSize = useCallback(() => {
    const isDesktop = windowWidth > 1024;
    return isDesktop ? baseSize * desktopSizeMultiplier : baseSize;
  }, [windowWidth, baseSize, desktopSizeMultiplier]);

  const initializeBlotter = useCallback(() => {
    if (!window.Blotter || !containerRef.current || isInitialized.current) return;

    const responsiveSize = getResponsiveSize();

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

    hoverMultiplierRef.current = 1;

    blotterInstance.current = new window.Blotter(material, {
      texts: textObj,
      antialiasing: true,
      webgl2: true,
      resolutionScale: windowWidth > 1024 ? 1.3 : 1,
    });

    scopeRef.current = blotterInstance.current.forText(textObj);
    scopeRef.current.appendTo(containerRef.current);

    const canvas = containerRef.current.querySelector("canvas");
    if (canvas) {
      canvas.style.imageRendering = "optimizeQuality";
      canvas.style.transform = "translateZ(0)";
    }

    // Optimized event listeners
    const el = containerRef.current;
    const handleHoverStart = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uSpeed.value = 1.5;
        hoverMultiplierRef.current = 6;
      }
    };
    const handleHoverEnd = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uSpeed.value = speed;
        hoverMultiplierRef.current = 1;
      }
    };

    el.addEventListener("mouseenter", handleHoverStart, { passive: true });
    el.addEventListener("mouseleave", handleHoverEnd, { passive: true });
    el.addEventListener("touchstart", handleHoverStart, { passive: true });
    el.addEventListener("touchend", handleHoverEnd, { passive: true });

    if (!animationFrameId.current) {
      animationFrameId.current = requestAnimationFrame(render);
    }

    isInitialized.current = true;

    return () => {
      el.removeEventListener("mouseenter", handleHoverStart);
      el.removeEventListener("mouseleave", handleHoverEnd);
      el.removeEventListener("touchstart", handleHoverStart);
      el.removeEventListener("touchend", handleHoverEnd);
    };
  }, [text, fontFamily, color, padding, speed, volatility, seed, windowWidth, render, getResponsiveSize]);

  // Debounced resize handler - only reinitialize on significant resize
  const handleResize = useCallback(() => {
    const newWidth = window.innerWidth;
    
    // Only reinitialize if crossing breakpoint thresholds
    const oldBreakpoint = windowWidth > 1024 ? 'desktop' : windowWidth > 768 ? 'tablet' : 'mobile';
    const newBreakpoint = newWidth > 1024 ? 'desktop' : newWidth > 768 ? 'tablet' : 'mobile';
    
    if (oldBreakpoint !== newBreakpoint) {
      setWindowWidth(newWidth);
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(() => {
        // Clean up and reinitialize
        if (blotterInstance.current && scopeRef.current) {
          blotterInstance.current.removeText(scopeRef.current);
        }
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
        isInitialized.current = false;
        
        // Clear container
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
        
        initializeBlotter();
      }, 250);
    } else {
      setWindowWidth(newWidth);
    }
  }, [windowWidth, initializeBlotter]);

  useEffect(() => {
    window.addEventListener("resize", handleResize, { passive: true });
    
    // Initialize with a small delay to avoid blocking main thread
    const initTimeout = setTimeout(initializeBlotter, 50);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(initTimeout);
      clearTimeout(resizeTimeout.current);
      cancelAnimationFrame(animationFrameId.current);

      // Proper cleanup
      if (blotterInstance.current && scopeRef.current) {
        blotterInstance.current.removeText(scopeRef.current);
      }
    };
  }, [initializeBlotter, handleResize]);

  return (
    <div
      ref={containerRef}
      className={`distorted-text-container ${className}`}
      style={{
        display: "inline-block",
        position: "relative",
        lineHeight: 0,
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
      aria-label={text}
    />
  );
};

export default DistortedText;