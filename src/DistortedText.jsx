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
  const timeRef = useRef(0);

  // NEW: Hover multiplier
  const hoverMultiplierRef = useRef(1);

  // Font loading check
  useEffect(() => {
    const loadFont = async () => {
      try {
        // Check if font is already loaded
        if (document.fonts.check(`1em "${fontFamily}"`)) {
          setFontLoaded(true);
          return;
        }

        // Wait for font to load
        await document.fonts.load(`1em "${fontFamily}"`);
        setFontLoaded(true);
        
        // Double check font status
        console.log(`Font ${fontFamily} loaded:`, document.fonts.check(`1em "${fontFamily}"`));
      } catch (error) {
        console.warn(`Font ${fontFamily} loading failed:`, error);
        // Continue anyway after a timeout
        setTimeout(() => setFontLoaded(true), 500);
      }
    };

    loadFont();

    // Fallback: set font as loaded after 2 seconds even if loading fails
    const fallbackTimeout = setTimeout(() => {
      setFontLoaded(true);
    }, 2000);

    return () => clearTimeout(fallbackTimeout);
  }, [fontFamily]);

  // Also listen for font loading completion
  useEffect(() => {
    const handleFontsLoaded = () => {
      setFontLoaded(true);
    };

    document.fonts.ready.then(handleFontsLoaded);

    return () => {
      // Cleanup if needed
    };
  }, []);

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
    if (!window.Blotter || !containerRef.current || !fontLoaded) {
      console.log('Blotter initialization skipped:', {
        hasBlotter: !!window.Blotter,
        hasContainer: !!containerRef.current,
        fontLoaded
      });
      return;
    }

    console.log(`Initializing Blotter with font: ${fontFamily}, loaded: ${fontLoaded}`);

    const prevCanvas = containerRef.current.querySelector("canvas");
    const responsiveSize = getResponsiveSize();

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
    }

    if (prevCanvas && newCanvas) {
      newCanvas.style.opacity = "0";
      newCanvas.style.transition = "opacity 0.15s ease-out";
      containerRef.current.appendChild(newCanvas);

      requestAnimationFrame(() => {
        newCanvas.style.opacity = "1";
        prevCanvas.style.opacity = "0";

        setTimeout(() => {
          if (prevCanvas.parentNode === containerRef.current) {
            containerRef.current.removeChild(prevCanvas);
          }
        }, 150);
      });
    } else {
      scopeRef.current.appendTo(containerRef.current);
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

    return () => {
      el.removeEventListener("mouseenter", handleHoverStart);
      el.removeEventListener("mouseleave", handleHoverEnd);
      el.removeEventListener("touchstart", handleHoverStart);
      el.removeEventListener("touchend", handleHoverEnd);
    };
  }, [text, fontFamily, color, padding, speed, volatility, seed, windowWidth, render, getResponsiveSize, fontLoaded]);

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
    clearTimeout(resizeTimeout.current);
    resizeTimeout.current = setTimeout(() => {
      initializeBlotter();
    }, 100);
  }, [initializeBlotter]);

  // Re-initialize when font loads
  useEffect(() => {
    if (fontLoaded) {
      initializeBlotter();
    }
  }, [fontLoaded, initializeBlotter]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    
    // Delay initialization to ensure fonts are ready
    const initTimeout = setTimeout(() => {
      initializeBlotter();
    }, 100);

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
      data-font-loaded={fontLoaded}
    />
  );
};

export default DistortedText;