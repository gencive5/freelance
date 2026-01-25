import { useEffect, useRef, useState, useCallback } from "react";

/* -------------------------------
   SVG FALLBACK COMPONENT
-------------------------------- */
const FallbackDistortedText = ({ text, color }) => {
  const [active, setActive] = useState(false);

  return (
    <svg
      width="100%"
      height="1.2em"
      viewBox="0 0 600 150"
      style={{ overflow: "visible", cursor: "pointer" }}
      onTouchStart={() => setActive(true)}
      onTouchEnd={() => setActive(false)}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
    >
      <defs>
        <filter id="wave">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={active ? 0.015 : 0.002}
            numOctaves="2"
            seed="2"
          >
            <animate
              attributeName="baseFrequency"
              dur="1.2s"
              values="0.002;0.015;0.002"
              repeatCount={active ? "indefinite" : "1"}
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="18" />
        </filter>
      </defs>

      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill={color}
        fontFamily="sm00ch, sans-serif"
        fontSize="120"
        filter="url(#wave)"
      >
        {text}
      </text>
    </svg>
  );
};

/* -------------------------------
   MAIN COMPONENT
-------------------------------- */
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
  mouseDecayRate = 0.92
}) => {

  const containerRef = useRef(null);
  const blotterInstance = useRef(null);
  const scopeRef = useRef(null);
  const materialRef = useRef(null);
  const animationFrameId = useRef(null);
  const resizeTimeout = useRef(null);
  const fontRetryCountRef = useRef(0);
  const blotterInitRef = useRef(false);
  const blotterTimeoutRef = useRef(null);

  const [fontLoaded, setFontLoaded] = useState(false);
  const [blotterReady, setBlotterReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const timeRef = useRef(0);
  const isDesktopRef = useRef(window.innerWidth > 1024);

  const mouseMovementRef = useRef(0);
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  const mouseActiveRef = useRef(false);
  const hoverMultiplierRef = useRef(1);

  /* -------------------------------
     WEBGL CHECK
  -------------------------------- */
  const hasUsableWebGL = () => {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl")
      );
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!hasUsableWebGL()) {
      console.warn("WebGL unavailable → fallback");
      setUseFallback(true);
    }
  }, []);

  /* -------------------------------
     FONT LOADING
  -------------------------------- */
  useEffect(() => {
    let mounted = true;

    const waitForFonts = async () => {
      try {
        await document.fonts.load("400 16px sm00ch");
        await document.fonts.ready;
        if (mounted) setFontLoaded(true);
      } catch {
        if (mounted) setFontLoaded(true);
      }
    };

    waitForFonts();
    return () => { mounted = false; };
  }, []);

  /* -------------------------------
     SIZE
  -------------------------------- */
  const getResponsiveSize = useCallback(() => {
    return isDesktopRef.current ? baseSize * desktopSizeMultiplier : baseSize;
  }, [baseSize, desktopSizeMultiplier]);

  /* -------------------------------
     MOUSE
  -------------------------------- */
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

  /* -------------------------------
     ANIMATION LOOP
  -------------------------------- */
  const render = useCallback(() => {
    if (!materialRef.current) return;

    timeRef.current += 0.01;

    if (isDesktopRef.current) {
      if (mouseActiveRef.current) {
        mouseMovementRef.current *= mouseDecayRate;

        if (mouseMovementRef.current < 0.05) {
          mouseMovementRef.current = 0;
          mouseActiveRef.current = false;
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

  /* -------------------------------
     BLOTTER INIT
  -------------------------------- */
  const initializeBlotter = useCallback(() => {
    if (useFallback) return;

    if (!document.fonts.check("16px sm00ch")) {
      if (fontRetryCountRef.current < 10) {
        fontRetryCountRef.current += 1;
        setTimeout(initializeBlotter, 120);
      }
      return;
    }

    if (blotterInitRef.current) return;
    if (!window.Blotter || !containerRef.current || !fontLoaded) return;

    blotterInitRef.current = true;

    try {
      /* watchdog */
      clearTimeout(blotterTimeoutRef.current);
      blotterTimeoutRef.current = setTimeout(() => {
        console.warn("Blotter timeout → fallback");
        setUseFallback(true);
      }, 1200);

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

      if (!newCanvas) {
        throw new Error("Canvas not created");
      }

      containerRef.current.appendChild(newCanvas);

      clearTimeout(blotterTimeoutRef.current);

      if (isDesktopRef.current) {
        document.addEventListener("mousemove", handleMouseMove);
      }

      animationFrameId.current = requestAnimationFrame(render);
      setBlotterReady(true);

    } catch (err) {
      console.error("Blotter failed:", err);
      clearTimeout(blotterTimeoutRef.current);
      setUseFallback(true);
    }
  }, [
    text, fontFamily, color, padding, speed, volatility, seed,
    getResponsiveSize, fontLoaded, handleMouseMove, render, useFallback
  ]);

  useEffect(() => {
    if (fontLoaded) initializeBlotter();
  }, [fontLoaded, initializeBlotter]);

  /* -------------------------------
     RESIZE
  -------------------------------- */
  useEffect(() => {
    const handleResize = () => {
      const wasDesktop = isDesktopRef.current;
      isDesktopRef.current = window.innerWidth > 1024;

      if (wasDesktop !== isDesktopRef.current) {
        clearTimeout(resizeTimeout.current);
        resizeTimeout.current = setTimeout(() => {
          blotterInitRef.current = false;
          initializeBlotter();
        }, 150);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initializeBlotter]);

  /* -------------------------------
     OUTPUT
  -------------------------------- */
  if (useFallback) {
    return <FallbackDistortedText text={text} color={color} />;
  }

  return (
    <div
      ref={containerRef}
      className={`distorted-text-container ${className}`}
      style={{
        display: "inline-block",
        position: "relative",
        lineHeight: 0,
        opacity: blotterReady ? 1 : 0,
        transition: "opacity 0.3s ease-out"
      }}
    />
  );
};

export default DistortedText;
