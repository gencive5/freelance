import { useEffect, useRef, useState, useCallback } from "react";

const DistortedText = ({ 
  text = "observation",
  fontFamily = "sm00ch",
  baseSize = 60,
  color = "#f7f0f0ff",
  padding = 40,
  speed = 0.4,
  volatility = 0.7,
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
  const [fontLoaded, setFontLoaded] = useState(false);
  const [blotterReady, setBlotterReady] = useState(false);
  const timeRef = useRef(0);

  // NEW: Hover multiplier
  const hoverMultiplierRef = useRef(1);

  // Font loading check with more robust detection
  useEffect(() => {
    let mounted = true;
    let fallbackTimeout;

    const loadFont = async () => {
      try {
        console.log(`Attempting to load font: ${fontFamily}`);
        
        // Method 1: Try to load the font directly
        const font = new FontFace(fontFamily, `local("${fontFamily}"), url("./fonts/${fontFamily}.woff2") format("woff2"), url("./fonts/${fontFamily}.woff") format("woff")`);
        
        try {
          await font.load();
          document.fonts.add(font);
          console.log(`Font ${fontFamily} loaded via FontFace API`);
        } catch (fontFaceError) {
          console.log(`FontFace API failed, using document.fonts.load:`, fontFaceError);
        }

        // Method 2: Use document.fonts.load as fallback
        await document.fonts.load(`1em "${fontFamily}"`);
        
        // Method 3: Wait for fonts to be ready
        await document.fonts.ready;
        
        // Final verification
        const isLoaded = document.fonts.check(`1em "${fontFamily}"`);
        console.log(`Font ${fontFamily} verification:`, isLoaded);
        
        if (mounted && isLoaded) {
          setFontLoaded(true);
        } else if (mounted) {
          console.warn(`Font ${fontFamily} verification failed`);
          // Even if verification fails, we'll proceed after timeout
        }
      } catch (error) {
        console.warn(`Font ${fontFamily} loading failed:`, error);
        if (mounted) {
          // We'll still try to proceed but log the error
        }
      }
    };

    loadFont();

    // More aggressive fallback: proceed after shorter timeout
    fallbackTimeout = setTimeout(() => {
      if (mounted) {
        console.log(`Proceeding with font ${fontFamily} after timeout`);
        setFontLoaded(true);
      }
    }, 1000); // Reduced from 2000ms to 1000ms

    return () => {
      mounted = false;
      clearTimeout(fallbackTimeout);
    };
  }, [fontFamily]);

  // Responsive size calculation
  const getResponsiveSize = useCallback(() => {
    const isDesktop = windowWidth > 1024;
    return isDesktop ? baseSize * desktopSizeMultiplier : baseSize;
  }, [windowWidth, baseSize, desktopSizeMultiplier]);

  // Animation with hover multiplier
  const render = useCallback(() => {
    if (!materialRef.current) return;

    timeRef.current += 0.01;

    const baseMovement = Math.sin(timeRef.current * 0.5) * 0.2 + volatility;
    materialRef.current.uniforms.uVolatility.value = baseMovement * hoverMultiplierRef.current;
    materialRef.current.uniforms.uSpeed.value = speed;

    animationFrameId.current = requestAnimationFrame(render);
  }, [speed, volatility]);

  const initializeBlotter = useCallback(() => {
    if (!window.Blotter || !containerRef.current) {
      console.log('Blotter not available or container missing');
      return false;
    }

    try {
      const prevCanvas = containerRef.current.querySelector("canvas");
      const responsiveSize = getResponsiveSize();

      console.log(`Creating Blotter text with font: ${fontFamily}`);

      // Create text object with the specified font
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

      // Hover control
      hoverMultiplierRef.current = 1;

      blotterInstance.current = new window.Blotter(material, {
        texts: textObj,
        antialiasing: true,
        webgl2: true,
        resolutionScale: windowWidth > 1024 ? 1.3 : 1,
      });

      scopeRef.current = blotterInstance.current.forText(textObj);

      const tempDiv = document.createElement("div");
      scopeRef.current.appendTo(tempDiv);
      const newCanvas = tempDiv.querySelector("canvas");

      if (newCanvas) {
        newCanvas.style.imageRendering = "optimizeQuality";
        newCanvas.style.willChange = "transform";
        
        // Initially hidden
        newCanvas.style.opacity = "0";
        newCanvas.style.transition = "opacity 0.3s ease-out";
      }

      if (prevCanvas && newCanvas) {
        containerRef.current.appendChild(newCanvas);

        // Fade in the new canvas
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
        
        // Fade in the initial canvas
        const initialCanvas = containerRef.current.querySelector("canvas");
        if (initialCanvas) {
          initialCanvas.style.opacity = "0";
          initialCanvas.style.transition = "opacity 0.3s ease-out";
          requestAnimationFrame(() => {
            initialCanvas.style.opacity = "1";
          });
        }
      }

      // NEW: Add hover/touch interactions
      const el = containerRef.current;
      const handleHoverStart = () => {
        if (materialRef.current) {
          materialRef.current.uniforms.uSpeed.value = 1.3;
        }
        hoverMultiplierRef.current = 3;
      };
      const handleHoverEnd = () => {
        if (materialRef.current) {
          materialRef.current.uniforms.uSpeed.value = speed;
        }
        hoverMultiplierRef.current = 1;
      };

      el.addEventListener("mouseenter", handleHoverStart);
      el.addEventListener("mouseleave", handleHoverEnd);
      el.addEventListener("touchstart", handleHoverStart);
      el.addEventListener("touchend", handleHoverEnd);

      if (!animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(render);
      }

      setBlotterReady(true);
      
      return () => {
        el.removeEventListener("mouseenter", handleHoverStart);
        el.removeEventListener("mouseleave", handleHoverEnd);
        el.removeEventListener("touchstart", handleHoverStart);
        el.removeEventListener("touchend", handleHoverEnd);
      };
    } catch (error) {
      console.error('Blotter initialization failed:', error);
      return false;
    }
  }, [text, fontFamily, color, padding, speed, volatility, seed, windowWidth, render, getResponsiveSize]);

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
    clearTimeout(resizeTimeout.current);
    resizeTimeout.current = setTimeout(() => {
      initializeBlotter();
    }, 150);
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
    
    // Initial initialization with delay to ensure DOM is ready
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

      if (containerRef.current) {
        const canvas = containerRef.current.querySelector("canvas");
        if (canvas) {
          containerRef.current.removeChild(canvas);
        }
      }
    };
  }, [initializeBlotter, handleResize, fontLoaded]);

  // Calculate if we should show anything
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
        minHeight: shouldShowContent ? 'auto' : '1px', // Prevent layout shift
        opacity: shouldShowContent ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
      }}
      data-font-loaded={fontLoaded}
      data-blotter-ready={blotterReady}
    />
  );
};

export default DistortedText;