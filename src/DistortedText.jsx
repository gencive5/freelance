import { useEffect, useRef, useState, useCallback } from "react";

const DistortedText = ({ 
  text = "observation",
  fontFamily = "sm00ch",
  baseSize = 120,
  color = "#f7f0f0ff",
  padding = 40,
  speed = 0.1,     
  volatility = 0.3,     
  seed = 0.3, 
  className = "",
  desktopSizeMultiplier = 2,
  mouseMovementMultiplier = 1.3,
  mouseDecayRate = 0.92
}) => {
  const containerRef = useRef(null);
  const blotterInstance = useRef(null);
  const scopeRef = useRef(null);
  const materialRef = useRef(null);
  const animationFrameId = useRef(null);
  const resizeTimeout = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [blotterReady, setBlotterReady] = useState(false);
  const timeRef = useRef(0);

  // Device detection
  const isDesktopRef = useRef(windowWidth > 1024);
  
  // Mouse movement tracking (desktop only)
  const mouseMovementRef = useRef(0);
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  const mouseActiveRef = useRef(false);

  // Hover multiplier (mobile only)
  const hoverMultiplierRef = useRef(1);

  // Simplified font loading for sm00ch only
  useEffect(() => {
    let mounted = true;

    const loadFont = async () => {
      try {
        console.log(`Loading font: ${fontFamily}`);
        
        await document.fonts.ready;
        
        const isLoaded = document.fonts.check(`1em "${fontFamily}"`);
        console.log(`Font ${fontFamily} loaded:`, isLoaded);
        
        if (mounted) {
          setFontLoaded(true);
        }
      } catch (error) {
        console.warn(`Font loading failed:`, error);
        if (mounted) {
          setFontLoaded(true);
        }
      }
    };

    loadFont();

    return () => {
      mounted = false;
    };
  }, [fontFamily]);

  // Responsive size calculation
  const getResponsiveSize = useCallback(() => {
    return isDesktopRef.current ? baseSize * desktopSizeMultiplier : baseSize;
  }, [baseSize, desktopSizeMultiplier]);

  // Mouse movement handler (desktop only)
  const handleMouseMove = useCallback((e) => {
    if (!isDesktopRef.current) return;

    if (!lastMousePositionRef.current.x && !lastMousePositionRef.current.y) {
      lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const deltaX = Math.abs(e.clientX - lastMousePositionRef.current.x);
    const deltaY = Math.abs(e.clientY - lastMousePositionRef.current.y);
    const movement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    mouseMovementRef.current = Math.min(mouseMovementRef.current + movement * 0.1, 10);
    mouseActiveRef.current = true;

    lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  // Animation with device-specific behavior
  const render = useCallback(() => {
    if (!materialRef.current) return;

    timeRef.current += 0.01;

    if (isDesktopRef.current) {
      // DESKTOP: Mouse movement controlled animation
      if (mouseActiveRef.current) {
        mouseMovementRef.current *= mouseDecayRate;
        
        // Pause animation when movement is minimal
        if (mouseMovementRef.current < 0.05) {
          mouseActiveRef.current = false;
          mouseMovementRef.current = 0;
          // Don't update timeRef when paused to freeze animation
          timeRef.current -= 0.01;
        }
      }

      const baseVolatility = Math.sin(timeRef.current * 0.5) * 0.2 + volatility;
      const mouseEffect = mouseMovementRef.current * mouseMovementMultiplier;
      
      materialRef.current.uniforms.uVolatility.value = baseVolatility + mouseEffect;
      materialRef.current.uniforms.uSpeed.value = speed + (mouseEffect * 0.1);
    } else {
      // MOBILE: Original hover-based animation
      const baseMovement = Math.sin(timeRef.current * 0.5) * 0.2 + volatility;
      materialRef.current.uniforms.uVolatility.value = baseMovement * hoverMultiplierRef.current;
      materialRef.current.uniforms.uSpeed.value = speed;
    }

    animationFrameId.current = requestAnimationFrame(render);
  }, [speed, volatility, mouseMovementMultiplier, mouseDecayRate]);

  // Mobile hover handlers
  const handleMobileHoverStart = useCallback(() => {
    if (isDesktopRef.current) return;
    if (materialRef.current) {
      materialRef.current.uniforms.uSpeed.value = 1.3;
    }
    hoverMultiplierRef.current = 3;
  }, []);

  const handleMobileHoverEnd = useCallback(() => {
    if (isDesktopRef.current) return;
    if (materialRef.current) {
      materialRef.current.uniforms.uSpeed.value = speed;
    }
    hoverMultiplierRef.current = 1;
  }, [speed]);

  const initializeBlotter = useCallback(() => {
    if (!window.Blotter || !containerRef.current) {
      console.log('Blotter not available or container missing');
      return false;
    }

    try {
      const prevCanvas = containerRef.current.querySelector("canvas");
      const responsiveSize = getResponsiveSize();

      console.log(`Creating Blotter text with font: ${fontFamily}, isDesktop: ${isDesktopRef.current}`);

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
        texts: textObj,
        antialiasing: true,
        webgl2: true,
        resolutionScale: isDesktopRef.current ? 1.3 : 1,
      });

      scopeRef.current = blotterInstance.current.forText(textObj);

      const tempDiv = document.createElement("div");
      scopeRef.current.appendTo(tempDiv);
      const newCanvas = tempDiv.querySelector("canvas");

      if (newCanvas) {
        newCanvas.style.imageRendering = "optimizeQuality";
        newCanvas.style.willChange = "transform";
        newCanvas.style.opacity = "0";
        newCanvas.style.transition = "opacity 0.3s ease-out";
      }

      if (prevCanvas && newCanvas) {
        containerRef.current.appendChild(newCanvas);
        requestAnimationFrame(() => {
          newCanvas.style.opacity = "1";
          prevCanvas.style.opacity = "0";
          setTimeout(() => {
            if (prevCanvas.parentNode === containerRef.current) {
              containerRef.current.removeChild(prevCanvas);
            }
          }, 300);
        });
      } else {
        scopeRef.current.appendTo(containerRef.current);
        const initialCanvas = containerRef.current.querySelector("canvas");
        if (initialCanvas) {
          initialCanvas.style.opacity = "0";
          initialCanvas.style.transition = "opacity 0.3s ease-out";
          requestAnimationFrame(() => {
            initialCanvas.style.opacity = "1";
          });
        }
      }

      // Add event listeners based on device type
      const el = containerRef.current;
      
      if (isDesktopRef.current) {
        // DESKTOP: Mouse movement on entire document
        document.addEventListener("mousemove", handleMouseMove);
      } else {
        // MOBILE: Hover/touch on element itself
        el.addEventListener("mouseenter", handleMobileHoverStart);
        el.addEventListener("mouseleave", handleMobileHoverEnd);
        el.addEventListener("touchstart", handleMobileHoverStart);
        el.addEventListener("touchend", handleMobileHoverEnd);
      }

      if (!animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(render);
      }

      setBlotterReady(true);
      
      return () => {
        if (isDesktopRef.current) {
          document.removeEventListener("mousemove", handleMouseMove);
        } else {
          el.removeEventListener("mouseenter", handleMobileHoverStart);
          el.removeEventListener("mouseleave", handleMobileHoverEnd);
          el.removeEventListener("touchstart", handleMobileHoverStart);
          el.removeEventListener("touchend", handleMobileHoverEnd);
        }
      };
    } catch (error) {
      console.error('Blotter initialization failed:', error);
      return false;
    }
  }, [text, fontFamily, color, padding, speed, volatility, seed, render, getResponsiveSize, handleMouseMove, handleMobileHoverStart, handleMobileHoverEnd]);

  const handleResize = useCallback(() => {
    const newWidth = window.innerWidth;
    const wasDesktop = isDesktopRef.current;
    isDesktopRef.current = newWidth > 1024;
    setWindowWidth(newWidth);

    // Reinitialize if device type changed
    if (wasDesktop !== isDesktopRef.current) {
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(() => {
        initializeBlotter();
      }, 150);
    }
  }, [initializeBlotter]);

  // Initialize Blotter when font is loaded
  useEffect(() => {
    if (fontLoaded) {
      console.log('Font loaded, initializing Blotter');
      const cleanup = initializeBlotter();
      return cleanup;
    }
  }, [fontLoaded, initializeBlotter]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    
    const initTimeout = setTimeout(() => {
      if (fontLoaded) {
        initializeBlotter();
      }
    }, 200);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(initTimeout);
      clearTimeout(resizeTimeout.current);
      cancelAnimationFrame(animationFrameId.current);

      // Clean up all event listeners
      document.removeEventListener("mousemove", handleMouseMove);
      
      if (containerRef.current) {
        const el = containerRef.current;
        el.removeEventListener("mouseenter", handleMobileHoverStart);
        el.removeEventListener("mouseleave", handleMobileHoverEnd);
        el.removeEventListener("touchstart", handleMobileHoverStart);
        el.removeEventListener("touchend", handleMobileHoverEnd);
        
        const canvas = containerRef.current.querySelector("canvas");
        if (canvas) {
          containerRef.current.removeChild(canvas);
        }
      }
    };
  }, [initializeBlotter, handleResize, fontLoaded, handleMouseMove, handleMobileHoverStart, handleMobileHoverEnd]);

  const shouldShowContent = blotterReady;

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
        minHeight: shouldShowContent ? 'auto' : '1px',
        opacity: shouldShowContent ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
        cursor: isDesktopRef.current ? 'default' : 'pointer'
      }}
      data-font-loaded={fontLoaded}
      data-blotter-ready={blotterReady}
      data-device-type={isDesktopRef.current ? 'desktop' : 'mobile'}
    />
  );
};

export default DistortedText;