import { useEffect, useRef, useState } from "react";

const BlotterText = ({ text, baseSize = 100, className = "" }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const Blotter = window.Blotter;
    const LiquidDistortMaterial = Blotter?.LiquidDistortMaterial;
    if (!Blotter || !LiquidDistortMaterial) {
      console.error("Blotter or LiquidDistortMaterial not loaded.");
      return;
    }

    // Clean canvas
    containerRef.current.innerHTML = "";

    const textObj = new Blotter.Text(text, {
      size: baseSize,
      fill: "#ffffff",
      paddingLeft: 60,
      paddingRight: 60,
    });

    const material = new LiquidDistortMaterial();
    material.uniforms.uSpeed.value = 0.3;
    material.uniforms.uVolatility.value = 0.0;
    material.uniforms.uSeed.value = 0.1;

    const blotter = new Blotter(material, { texts: textObj });
    const scope = blotter.forText(textObj);

    scope.appendTo(containerRef.current);
    canvasRef.current = containerRef.current.querySelector("canvas");

    // Interactivity
    const triggerOn = () => (material.uniforms.uVolatility.value = 0.15);
    const triggerOff = () => (material.uniforms.uVolatility.value = 0.0);
    const el = containerRef.current;
    el.addEventListener("mouseenter", triggerOn);
    el.addEventListener("mouseleave", triggerOff);
    el.addEventListener("touchstart", triggerOn);
    el.addEventListener("touchend", triggerOff);

    // Scale to fit width
    const resize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const canvasWidth = canvasRef.current.width;
      const containerWidth = containerRef.current.offsetWidth;
      if (canvasWidth === 0) return;
      const newScale = containerWidth / canvasWidth;
      setScale(newScale);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(containerRef.current);

    // Initial scale
    resize();

    return () => {
      el.removeEventListener("mouseenter", triggerOn);
      el.removeEventListener("mouseleave", triggerOff);
      el.removeEventListener("touchstart", triggerOn);
      el.removeEventListener("touchend", triggerOff);
      observer.disconnect();
    };
  }, [text, baseSize]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: "100%",
        overflow: "visible",
      }}
    />
  );
};

export default BlotterText;
