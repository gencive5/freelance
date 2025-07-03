import { useEffect, useRef, useState } from "react";

const BlotterText = ({ text, className = "" }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    const Blotter = window.Blotter;
    const LiquidDistortMaterial = Blotter?.LiquidDistortMaterial;
    if (!Blotter || !LiquidDistortMaterial) {
      console.error("Blotter or LiquidDistortMaterial not loaded.");
      return;
    }

    const renderText = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const chars = Math.max(text.length, 25);
      
      const sizeMultiplier = isMobile ? 2 : 1.8;
      const estimatedSize = (containerWidth / chars) * sizeMultiplier;

      containerRef.current.innerHTML = "";

      const padding = isMobile ? 20 : 60;
      
      const textObj = new Blotter.Text(text, {
        size: estimatedSize,
        fill: "#ffffff",
        paddingLeft: padding,
        paddingRight: padding,
        family: "UnormativeFraktur", // This is where we set the font
        weight: 400 // Normal weight
      });

      const material = new LiquidDistortMaterial();
      material.uniforms.uSpeed.value = 0.8;
      material.uniforms.uVolatility.value = 2.5;
      material.uniforms.uSeed.value = 1.3;

      const blotter = new Blotter(material, { texts: textObj });
      const scope = blotter.forText(textObj);
      scope.appendTo(containerRef.current);
      canvasRef.current = containerRef.current.querySelector("canvas");

      const triggerOn = () => (material.uniforms.uVolatility.value = 0.3);
      const triggerOff = () => (material.uniforms.uVolatility.value = 0.8);
      const el = containerRef.current;
      el.addEventListener("mouseenter", triggerOn);
      el.addEventListener("mouseleave", triggerOff);
      el.addEventListener("touchstart", triggerOn);
      el.addEventListener("touchend", triggerOff);

      const resize = () => {
        if (!canvasRef.current || !containerRef.current) return;
        const canvasWidth = canvasRef.current.width;
        const containerWidth = containerRef.current.offsetWidth;
        if (canvasWidth === 0) return;
        
        const targetScale = isMobile ? 
          Math.min(containerWidth / canvasWidth, 1.2) : 
          containerWidth / canvasWidth;
        setScale(targetScale);
      };

      const observer = new ResizeObserver(resize);
      observer.observe(containerRef.current);
      resize();

      return () => {
        el.removeEventListener("mouseenter", triggerOn);
        el.removeEventListener("mouseleave", triggerOff);
        el.removeEventListener("touchstart", triggerOn);
        el.removeEventListener("touchend", triggerOff);
        observer.disconnect();
        window.removeEventListener('resize', checkIfMobile);
      };
    };

    renderText();
  }, [text, isMobile]);

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