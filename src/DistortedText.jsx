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
  const timeRef = useRef(0);

  // NEW: Hover multiplier
  const hoverMultiplierRef = useRef(1);

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
    if (!window.Blotter || !containerRef.current) return;

    const prevCanvas = containerRef.current.querySelector("canvas");
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
      material.uniforms.uSpeed.value = 1.3;
      hoverMultiplierRef.current = 3;
    };
    const handleHoverEnd = () => {
      material.uniforms.uSpeed.value = speed;
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
  }, [text, fontFamily, color, padding, speed, volatility, seed, windowWidth, render, getResponsiveSize]);

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
    clearTimeout(resizeTimeout.current);
    resizeTimeout.current = setTimeout(() => {
      initializeBlotter();
    }, 100);
  }, [initializeBlotter]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    const initTimeout = setTimeout(initializeBlotter, 50);

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
    />
  );
};

export default DistortedText;