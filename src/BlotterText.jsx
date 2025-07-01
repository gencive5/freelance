import { useEffect, useRef } from "react";

const BlotterText = ({ text, size = 40, className }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const Blotter = window.Blotter;
    const LiquidDistortMaterial = Blotter?.LiquidDistortMaterial;

    // Exit early if Blotter or material is missing
    if (!Blotter || !LiquidDistortMaterial) {
      console.error("Blotter or LiquidDistortMaterial is not loaded.");
      return;
    }

    const textObj = new Blotter.Text(text, {
      size,
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

 if (containerRef.current) {
  containerRef.current.innerHTML = ""; // ✅ clear old canvas
  scope.appendTo(containerRef.current); // then append fresh one
}

    

    const triggerOn = () => {
      material.uniforms.uVolatility.value = 0.15;
    };
    const triggerOff = () => {
      material.uniforms.uVolatility.value = 0.0;
    };

    const el = containerRef.current;
    el.addEventListener("mouseenter", triggerOn);
    el.addEventListener("mouseleave", triggerOff);
    el.addEventListener("touchstart", triggerOn);
    el.addEventListener("touchend", triggerOff);

    return () => {
      el.removeEventListener("mouseenter", triggerOn);
      el.removeEventListener("mouseleave", triggerOff);
      el.removeEventListener("touchstart", triggerOn);
      el.removeEventListener("touchend", triggerOff);
    };
  }, [text, size]);

  return <div ref={containerRef} className={className} />;
};

export default BlotterText;
