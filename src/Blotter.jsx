import React, { useEffect, useRef } from "react";

const BlotterText = ({ text, fontFamily = "'EB Garamond', serif", size = 27, color = "#202020" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Check if Blotter is loaded
    if (!window.Blotter) {
      console.error("Blotter.js not loaded!");
      return;
    }

    const Blotter = window.Blotter;
    
    // Configure text
    const blotterText = new Blotter.Text(text, {
      family: fontFamily,
      size: size,
      fill: color,
    });

    // Configure material (e.g., LiquidDistort, RollingDistort, etc.)
    const material = new Blotter.Material(); // Basic material

    // Initialize Blotter
    const blotter = new Blotter(material, { texts: blotterText });
    const scope = blotter.forText(blotterText);

    // Append to DOM
    if (containerRef.current) {
      scope.appendTo(containerRef.current);
    }

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""; // Clear Blotter instance
      }
    };
  }, [text, fontFamily, size, color]);

  return <div ref={containerRef} />;
};

export default BlotterText;