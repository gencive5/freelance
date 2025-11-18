import { useEffect, useRef, useState, useCallback } from "react";

const DistortedText = ({ 
  text = "observation",
  fontFamily = "'sm00ch', 'Adobe Blank', sans-serif",
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

  const blotterInitRef = useRef(false);

  // POINT 2: Removed windowWidth state - only keeping necessary states
  const [fontLoaded, setFontLoaded] = useState(false);
  const [blotterReady, setBlotterReady] = useState(false);

  const timeRef = useRef(0);

  // POINT 2: Calculate once and update ref directly on resize
  const isDesktopRef = useRef(window.innerWidth > 1024);

  const mouseMovementRef = useRef(0);
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  const mouseActiveRef = useRef(false);

  const hoverMultiplierRef = useRef(1);

  // ----------------------------------------------------------
  // FONT LOADING (unchanged)
  // ----------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const loadFont = async () => {
      try {
        const adobeBlank = new FontFace("Adobe Blank", "url(/fonts/AdobeBlank.woff2)");
        await adobeBlank.load();
        document.fonts.add(adobeBlank);

        const sm00chFont = new FontFace("sm00ch", "url(/fonts/sm00ch.woff2)");
        await sm00chFont.load();
        document.fonts.add(sm00chFont);

        await document.fonts.ready;

        if (mounted) setFontLoaded(true);
      } catch (err) {
        console.warn("Font load failed, using fallback", err);
        if (mounted) setFontLoaded(true);
      }
    };

    loadFont();
    return () => (mounted = false);
  }, []);

  // ----------------------------------------------------------
  // FORCE FONT RENDER PASS (unchanged)
  // ----------------------------------------------------------
  const getResponsiveSize = useCallback(() => {
    return isDesktopRef.current ? baseSize * desktopSizeMultiplier : baseSize;
  }, [baseSize, desktopSizeMultiplier]);

  useEffect(() => {
    if (!containerRef.current) return;

    const temp = document.createElement("div");
    temp.style.cssText = `
      position:absolute;
      opacity:0;
      pointer-events:none;
      font-family:'sm00ch','Adobe Blank',sans-serif;
      font-size:${getResponsiveSize()}px;
      white-space:nowrap;
    `;
    temp.textContent = text;

    containerRef.current.appendChild(temp);
    setTimeout(() => temp.remove(), 500);

    return () => temp.remove();
  }, [text, fontLoaded, getResponsiveSize]);

  // ----------------------------------------------------------
  // MOUSE MOVEMENT (unchanged)
  // ----------------------------------------------------------
  const handleMouseMove = useCallback((e) => {
    if (!isDesktopRef.current) return;

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
  }, []);

  // ----------------------------------------------------------
  // ANIMATION LOOP (unchanged)
  // ----------------------------------------------------------
  const render = useCallback(() => {
    if (!materialRef.current) return;

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
  }, [speed, volatility, mouseMovementMultiplier, mouseDecayRate]);

  // ----------------------------------------------------------
  // TOUCH/HOVER (unchanged)
  // ----------------------------------------------------------
  const handleMobileHoverStart = useCallback(() => {
    if (isDesktopRef.current) return;

    if (materialRef.current) materialRef.current.uniforms.uSpeed.value = 1.3;
    hoverMultiplierRef.current = 3;
  }, []);

  const handleMobileHoverEnd = useCallback(() => {
    if (isDesktopRef.current) return;

    if (materialRef.current) materialRef.current.uniforms.uSpeed.value = speed;
    hoverMultiplierRef.current = 1;
  }, [speed]);

  // ----------------------------------------------------------
  // BLOTTER INITIALIZATION (unchanged)
  // ----------------------------------------------------------
  const initializeBlotter = useCallback(() => {
    if (blotterInitRef.current) return;
    if (!window.Blotter || !containerRef.current || !fontLoaded) return;

    blotterInitRef.current = true;

    try {
      const prevCanvas = containerRef.current.querySelector("canvas");
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
        resolutionScale: isDesktopRef.current ? 1.3 : 1
      });

      scopeRef.current = blotterInstance.current.forText(textObj);

      const tempDiv = document.createElement("div");
      scopeRef.current.appendTo(tempDiv);
      const newCanvas = tempDiv.querySelector("canvas");

      if (newCanvas) {
        newCanvas.style.opacity = "0";
        newCanvas.style.transition = "opacity 0.3s ease-out";
      }

      if (prevCanvas && newCanvas) {
        containerRef.current.appendChild(newCanvas);

        requestAnimationFrame(() => {
          newCanvas.style.opacity = "1";
          prevCanvas.style.opacity = "0";
          setTimeout(() => prevCanvas.remove(), 300);
        });
      } else {
        scopeRef.current.appendTo(containerRef.current);
        const initial = containerRef.current.querySelector("canvas");
        if (initial) {
          initial.style.opacity = "0";
          initial.style.transition = "opacity 0.3s";
          requestAnimationFrame(() => (initial.style.opacity = "1"));
        }
      }

      const el = containerRef.current;

      if (isDesktopRef.current) {
        document.addEventListener("mousemove", handleMouseMove);
      } else {
        el.addEventListener("mouseenter", handleMobileHoverStart);
        el.addEventListener("mouseleave", handleMobileHoverEnd);
        el.addEventListener("touchstart", handleMobileHoverStart);
        el.addEventListener("touchend", handleMobileHoverEnd);
      }

      animationFrameId.current = requestAnimationFrame(render);

      setBlotterReady(true);
    } catch (err) {
      console.error("Blotter failed:", err);
    }
  }, [
    text, fontFamily, color, padding, speed, volatility, seed,
    getResponsiveSize, fontLoaded, handleMouseMove,
    handleMobileHoverStart, handleMobileHoverEnd, render
  ]);

  // ----------------------------------------------------------
  // INIT WHEN FONT IS READY (unchanged)
  // ----------------------------------------------------------
  useEffect(() => {
    if (fontLoaded) initializeBlotter();
  }, [fontLoaded, initializeBlotter]);

  // ----------------------------------------------------------
  // RESIZE HANDLER (updated for Point 2)
  // ----------------------------------------------------------
  const handleResize = useCallback(() => {
    const newWidth = window.innerWidth;
    const wasDesktop = isDesktopRef.current;

    // POINT 2: Update ref directly without state
    isDesktopRef.current = newWidth > 1024;

    if (wasDesktop !== isDesktopRef.current) {
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(() => {
        initializeBlotter();
      }, 150);
    }
  }, [initializeBlotter]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout.current);
      cancelAnimationFrame(animationFrameId.current);

      document.removeEventListener("mousemove", handleMouseMove);

      const el = containerRef.current;
      if (el) {
        el.removeEventListener("mouseenter", handleMobileHoverStart);
        el.removeEventListener("mouseleave", handleMobileHoverEnd);
        el.removeEventListener("touchstart", handleMobileHoverStart);
        el.removeEventListener("touchend", handleMobileHoverEnd);
      }
    };
  }, [
    handleResize, handleMouseMove,
    handleMobileHoverStart, handleMobileHoverEnd
  ]);

  // ----------------------------------------------------------
  // OUTPUT (unchanged)
  // ----------------------------------------------------------
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
        opacity: blotterReady ? 1 : 0,
        transition: "opacity 0.3s ease-out",
        cursor: isDesktopRef.current ? "default" : "pointer",
        fontFamily: "'sm00ch', 'Adobe Blank', sans-serif"
      }}
      data-font-loaded={fontLoaded}
      data-blotter-ready={blotterReady}
      data-device-type={isDesktopRef.current ? "desktop" : "mobile"}
    />
  );
};

export default DistortedText;