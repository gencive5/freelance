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
  mouseMovementMultiplier = 0.06,
  mouseDecayRate = 0.92,
  fallbackAnimation = "wiggle",
  fallbackIntensity = 0.5,
  enableTapAnimation = true
}) => {

  const containerRef = useRef(null);
  const fallbackRef = useRef(null);
  const blotterInstance = useRef(null);
  const scopeRef = useRef(null);
  const materialRef = useRef(null);
  const animationFrameId = useRef(null);
  const resizeTimeout = useRef(null);
  const fontRetryCountRef = useRef(0);
  const blotterInitRef = useRef(false);

  // State management
  const [fontLoaded, setFontLoaded] = useState(false);
  const [blotterReady, setBlotterReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [tapActive, setTapActive] = useState(false);

  const timeRef = useRef(0);
  const isDesktopRef = useRef(window.innerWidth > 1024);

  const mouseMovementRef = useRef(0);
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  const mouseActiveRef = useRef(false);
  const hoverMultiplierRef = useRef(1);

  // Move platform detection refs outside of effects
  const isAndroidRef = useRef(false);
  const webGLAvailableRef = useRef(true);

  // ----------------------------------------------------------
  // UTILITY FUNCTIONS (defined first to avoid hoisting issues)
  // ----------------------------------------------------------
  const getResponsiveSize = useCallback(() => {
    return isDesktopRef.current ? baseSize * desktopSizeMultiplier : baseSize;
  }, [baseSize, desktopSizeMultiplier]);

  // ----------------------------------------------------------
  // ANIMATION LOOP
  // ----------------------------------------------------------
  const render = useCallback(() => {
    if (!materialRef.current || useFallback) return;

    timeRef.current += 0.01;

    if (isDesktopRef.current) {
      if (mouseActiveRef.current) {
        mouseMovementRef.current *= mouseDecayRate;

        if (mouseMovementRef.current < 0.05) {
          mouseMovementRef.current = 0;
          mouseActiveRef.current = false;
          timeRef.current -= 0.01;
        }
      }

      const baseVol = Math.sin(timeRef.current * 0.5) * 0.2 + volatility;
      const mouseBoost = mouseMovementRef.current * mouseMovementMultiplier;

      materialRef.current.uniforms.uVolatility.value = baseVol + mouseBoost;
      materialRef.current.uniforms.uSpeed.value = speed + mouseBoost * 0.1;

    } else {
      const base = Math.sin(timeRef.current * 0.5) * 0.2 + volatility;
      materialRef.current.uniforms.uVolatility.value = base * hoverMultiplierRef.current;
      materialRef.current.uniforms.uSpeed.value = speed;
    }

    animationFrameId.current = requestAnimationFrame(render);
  }, [speed, volatility, mouseMovementMultiplier, mouseDecayRate, useFallback]);

  // ----------------------------------------------------------
  // MOUSE MOVEMENT
  // ----------------------------------------------------------
  const handleMouseMove = useCallback((e) => {
    if (!isDesktopRef.current || useFallback) return;

    if (!lastMousePositionRef.current.x && !lastMousePositionRef.current.y) {
      lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const dx = Math.abs(e.clientX - lastMousePositionRef.current.x);
    const dy = Math.abs(e.clientY - lastMousePositionRef.current.y);
    const movement = Math.sqrt(dx * dx + dy * dy);

    mouseMovementRef.current = Math.min(mouseMovementRef.current + movement * 0.1, 10);
    mouseActiveRef.current = true;

    lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
  }, [useFallback]);

  // ----------------------------------------------------------
  // TOUCH/HOVER
  // ----------------------------------------------------------
  const handleMobileHoverStart = useCallback(() => {
    if (isDesktopRef.current || useFallback) return;

    if (materialRef.current) materialRef.current.uniforms.uSpeed.value = 1.3;
    hoverMultiplierRef.current = 2;
  }, [useFallback]);

  const handleMobileHoverEnd = useCallback(() => {
    if (isDesktopRef.current || useFallback) return;

    if (materialRef.current) materialRef.current.uniforms.uSpeed.value = speed;
    hoverMultiplierRef.current = 1;
  }, [speed, useFallback]);

  // ----------------------------------------------------------
  // PLATFORM & WEBGL DETECTION
  // ----------------------------------------------------------
  const checkPlatformAndWebGL = useCallback(() => {
    // Check if Android
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const androidCheck = /android/i.test(userAgent);
    isAndroidRef.current = androidCheck;

    // Check WebGL support
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const hasWebGL = !!(gl && gl instanceof WebGLRenderingContext);
        
        if (!hasWebGL) return false;
        
        // Additional WebGL capability checks
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        const maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
        
        // If texture size is too small, WebGL might not work well
        if (maxTextureSize < 2048 || maxRenderBufferSize < 2048) {
          console.warn("WebGL texture limits too low:", {
            maxTextureSize,
            maxRenderBufferSize
          });
          return false;
        }
        
        return true;
      } catch (e) {
        return false;
      }
    };

    const webGLOk = checkWebGL();
    webGLAvailableRef.current = webGLOk;
    
    // Check Blotter availability
    const blotterOk = typeof window.Blotter !== 'undefined';
    
    // Determine if we should use fallback
    if (!webGLOk || !blotterOk) {
      setUseFallback(true);
      return;
    }
    
    // On Android, check for problematic browsers
    if (androidCheck) {
      const problematicBrowsers = [
        /SamsungBrowser/i,
        /UCBrowser/i,
        /QQBrowser/i,
        /Baidu/i,
        /Quark/i
      ];
      
      const isProblematicBrowser = problematicBrowsers.some(regex => regex.test(userAgent));
      
      if (isProblematicBrowser) {
        console.log("Problematic Android browser detected, using fallback");
        setUseFallback(true);
      }
    }
  }, []);

  // ----------------------------------------------------------
  // FONT LOADING
  // ----------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const waitForFonts = async () => {
      try {
        await document.fonts.load("400 16px sm00ch");
        await document.fonts.ready;
        if (mounted) setFontLoaded(true);
      } catch (err) {
        console.warn("Font check failed, continuing anyway", err);
        if (mounted) setFontLoaded(true);
      }
    };

    waitForFonts();
    return () => {
      mounted = false;
    };
  }, []);

  // ----------------------------------------------------------
  // FALLBACK RENDERER
  // ----------------------------------------------------------
  const renderFallback = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    
    // Clear container
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    // Create fallback text element
    const textElement = document.createElement('div');
    textElement.textContent = text;
    textElement.style.cssText = `
      display: inline-block;
      font-family: '${fontFamily}', 'Arial', sans-serif;
      font-size: ${isDesktopRef.current ? baseSize * desktopSizeMultiplier : baseSize}px;
      color: ${color};
      padding: ${padding}px;
      white-space: nowrap;
      transform: translateZ(0);
      will-change: transform;
      cursor: ${enableTapAnimation ? 'pointer' : 'default'};
      transition: transform 0.3s ease, filter 0.3s ease;
      opacity: 1;
      user-select: none;
      -webkit-user-select: none;
    `;
    
    // Add animation based on fallbackAnimation prop
    if (fallbackAnimation === 'wiggle') {
      textElement.style.animation = `wiggle ${2 + fallbackIntensity}s ease-in-out infinite`;
    } else if (fallbackAnimation === 'pulse') {
      textElement.style.animation = `pulse ${1 + fallbackIntensity}s ease-in-out infinite`;
    }
    
    container.appendChild(textElement);
    fallbackRef.current = textElement;
    
    // Add CSS animations if needed
    if (fallbackAnimation !== 'none') {
      const styleId = 'distorted-text-fallback-styles';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          @keyframes wiggle {
            0%, 100% { transform: rotate(-0.5deg) scale(1); }
            25% { transform: rotate(0.5deg) scale(1.01); }
            50% { transform: rotate(-0.3deg) scale(1); }
            75% { transform: rotate(0.3deg) scale(0.99); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: ${0.8 + fallbackIntensity * 0.2}; }
          }
          .distorted-text-tap-active {
            transform: scale(0.98) !important;
            filter: brightness(1.1) !important;
            transition: transform 0.1s ease, filter 0.1s ease !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
    
    // Add tap interaction
    if (enableTapAnimation) {
      const handleTapStart = (e) => {
        e.preventDefault();
        setTapActive(true);
        textElement.classList.add('distorted-text-tap-active');
        
        if (fallbackAnimation === 'none') {
          textElement.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px) rotate(${Math.random() * 2 - 1}deg)`;
        }
      };
      
      const handleTapEnd = () => {
        setTapActive(false);
        textElement.classList.remove('distorted-text-tap-active');
        
        if (fallbackAnimation === 'none') {
          setTimeout(() => {
            textElement.style.transform = 'translateZ(0)';
          }, 100);
        }
      };
      
      textElement.addEventListener('mousedown', handleTapStart);
      textElement.addEventListener('mouseup', handleTapEnd);
      textElement.addEventListener('mouseleave', handleTapEnd);
      textElement.addEventListener('touchstart', handleTapStart, { passive: false });
      textElement.addEventListener('touchend', handleTapEnd);
      textElement.addEventListener('touchcancel', handleTapEnd);
    }
    
    setBlotterReady(true);
  }, [text, fontFamily, baseSize, color, padding, desktopSizeMultiplier, 
      fallbackAnimation, fallbackIntensity, enableTapAnimation]);

  // ----------------------------------------------------------
  // BLOTTER INITIALIZATION
  // ----------------------------------------------------------
  const initializeBlotter = useCallback(() => {
    // First check platform and WebGL
    checkPlatformAndWebGL();
    
    // If fallback is set, use it
    if (useFallback) {
      renderFallback();
      return;
    }

    // Check font
    if (!document.fonts || !document.fonts.check) {
      console.warn("Font API not available, using fallback");
      setUseFallback(true);
      renderFallback();
      return;
    }

    if (!document.fonts.check("16px sm00ch")) {
      if (fontRetryCountRef.current < 5) {
        fontRetryCountRef.current += 1;
        setTimeout(initializeBlotter, 200);
      } else {
        setUseFallback(true);
        renderFallback();
      }
      return;
    }

    if (blotterInitRef.current) return;
    if (!window.Blotter || !containerRef.current || !fontLoaded) return;

    blotterInitRef.current = true;

    try {
      // Clear container
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }

      const size = getResponsiveSize();

      const textObj = new window.Blotter.Text(text, {
        family: fontFamily,
        size,
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
        webgl2: false,
        resolutionScale: isDesktopRef.current ? 1.0 : 0.8 // Reduced for mobile
      });

      scopeRef.current = blotterInstance.current.forText(textObj);
      
      // Append to container
      scopeRef.current.appendTo(containerRef.current);
      
      const canvas = containerRef.current.querySelector("canvas");
      if (canvas) {
        canvas.style.opacity = "0";
        canvas.style.transition = "opacity 0.5s ease-out";
        requestAnimationFrame(() => {
          canvas.style.opacity = "1";
        });
      }

      const el = containerRef.current;

      if (isDesktopRef.current) {
        document.addEventListener("mousemove", handleMouseMove);
      } else {
        el.addEventListener("mouseenter", handleMobileHoverStart);
        el.addEventListener("mouseleave", handleMobileHoverEnd);
        el.addEventListener("touchstart", handleMobileHoverStart, { passive: true });
        el.addEventListener("touchend", handleMobileHoverEnd);
      }

      animationFrameId.current = requestAnimationFrame(render);
      setBlotterReady(true);
      
    } catch (err) {
      console.error("Blotter failed:", err);
      setUseFallback(true);
      renderFallback();
    }
  }, [
    text, fontFamily, color, padding, speed, volatility, seed,
    fontLoaded, useFallback, getResponsiveSize,
    handleMouseMove, handleMobileHoverStart, handleMobileHoverEnd, render,
    checkPlatformAndWebGL, renderFallback
  ]);

  // ----------------------------------------------------------
  // INITIALIZATION EFFECT
  // ----------------------------------------------------------
  useEffect(() => {
    if (fontLoaded) {
      initializeBlotter();
    }
  }, [fontLoaded, initializeBlotter]);

  // ----------------------------------------------------------
  // RESIZE HANDLER
  // ----------------------------------------------------------
  const handleResize = useCallback(() => {
    const newWidth = window.innerWidth;
    const wasDesktop = isDesktopRef.current;
    isDesktopRef.current = newWidth > 1024;

    if (wasDesktop !== isDesktopRef.current) {
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(() => {
        // Clean up and reinitialize
        if (blotterInitRef.current && !useFallback) {
          try {
            if (animationFrameId.current) {
              cancelAnimationFrame(animationFrameId.current);
            }
            if (blotterInstance.current) {
              blotterInstance.current.destroy();
            }
            blotterInitRef.current = false;
            materialRef.current = null;
          } catch (err) {
            console.warn("Error during cleanup:", err);
          }
        }
        initializeBlotter();
      }, 250);
    }
  }, [initializeBlotter, useFallback]);

  // ----------------------------------------------------------
  // CLEANUP EFFECT
  // ----------------------------------------------------------
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout.current);
      
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      document.removeEventListener("mousemove", handleMouseMove);
      
      const el = containerRef.current;
      if (el) {
        el.removeEventListener("mouseenter", handleMobileHoverStart);
        el.removeEventListener("mouseleave", handleMobileHoverEnd);
        el.removeEventListener("touchstart", handleMobileHoverStart);
        el.removeEventListener("touchend", handleMobileHoverEnd);
      }
      
      // Clean up Blotter
      if (blotterInstance.current) {
        try {
          blotterInstance.current.destroy();
        } catch (err) {
          console.warn("Error destroying Blotter:", err);
        }
      }
    };
  }, [handleResize, handleMouseMove, handleMobileHoverStart, handleMobileHoverEnd]);

  // ----------------------------------------------------------
  // FORCE FONT RENDER PASS
  // ----------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current || !fontLoaded) return;

    const temp = document.createElement("div");
    temp.style.cssText = `
      position:absolute;
      opacity:0;
      pointer-events:none;
      font-family: 'sm00ch', sans-serif;
      font-size:${getResponsiveSize()}px;
      white-space:nowrap;
    `;
    temp.textContent = text;

    containerRef.current.appendChild(temp);
    setTimeout(() => {
      if (containerRef.current && containerRef.current.contains(temp)) {
        containerRef.current.removeChild(temp);
      }
    }, 100);

    return () => {
      if (containerRef.current && containerRef.current.contains(temp)) {
        containerRef.current.removeChild(temp);
      }
    };
  }, [text, fontLoaded, getResponsiveSize]);

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  return (
    <div
      ref={containerRef}
      className={`distorted-text-container ${className} ${useFallback ? 'distorted-text-fallback' : ''}`}
      style={{
        display: "inline-block",
        position: "relative",
        lineHeight: 0,
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        opacity: blotterReady ? 1 : 0,
        transition: "opacity 0.5s ease-out",
        cursor: isDesktopRef.current ? "default" : "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        msUserSelect: "none"
      }}
      data-font-loaded={fontLoaded}
      data-blotter-ready={blotterReady}
      data-using-fallback={useFallback}
      data-fallback-animation={fallbackAnimation}
    />
  );
};

export default DistortedText;