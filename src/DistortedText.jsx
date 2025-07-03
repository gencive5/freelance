import { useEffect, useRef } from "react";

const DistortedText = ({ 
  text = "observation",
  fontFamily = "'EB Garamond', serif",
  size = 100,
  color = "#202020",
  padding = 40,
  speed = 1,
  volatility = 0,
  seed = 0.1,
  className = ""
}) => {
  const containerRef = useRef(null);
  const blotterInstance = useRef(null);
  const scopeRef = useRef(null);
  const materialRef = useRef(null);
  const lastMousePosition = useRef({x: window.innerWidth/2, y: window.innerHeight/2});
  const currentVolatility = useRef(0);
  const animationFrameId = useRef(null);
  const mousePosRef = useRef({x: window.innerWidth/2, y: window.innerHeight/2});

  // Helper functions
  const lineEq = (y2, y1, x2, x1, currentVal) => {
    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;
    return m * currentVal + b;
  };

  const lerp = (a, b, n) => (1 - n) * a + n * b;

  const render = () => {
    if (!materialRef.current) return;
    
    const mouseDistance = Math.hypot(
      lastMousePosition.current.x - mousePosRef.current.x,
      lastMousePosition.current.y - mousePosRef.current.y
    );
    
    currentVolatility.current = lerp(
      currentVolatility.current, 
      Math.min(lineEq(0.9, 0, 100, 0, mouseDistance), 0.9), 
      0.05
    );
    
    materialRef.current.uniforms.uVolatility.value = currentVolatility.current;
    lastMousePosition.current = { ...mousePosRef.current };
    
    animationFrameId.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    if (!window.Blotter || !containerRef.current) return;

    const { Text, LiquidDistortMaterial } = window.Blotter;

    // Clear previous content safely
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    const textObj = new Text(text, {
      family: fontFamily,
      size: size,
      fill: color,
      paddingLeft: padding,
      paddingRight: padding,
      paddingTop: padding,
      paddingBottom: padding,
    });

    const material = new LiquidDistortMaterial();
    material.uniforms.uSpeed.value = speed;
    material.uniforms.uVolatility.value = volatility;
    material.uniforms.uSeed.value = seed;
    materialRef.current = material;

    blotterInstance.current = new window.Blotter(material, { texts: textObj });
    scopeRef.current = blotterInstance.current.forText(textObj);
    scopeRef.current.appendTo(containerRef.current);

    const handleMouseMove = (ev) => {
      mousePosRef.current = {
        x: ev.clientX,
        y: ev.clientY
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId.current);
      
      // Safe cleanup
      if (scopeRef.current && scopeRef.current.element) {
        try {
          scopeRef.current.element.remove();
        } catch (e) {
          console.warn("Cleanup error:", e);
        }
      }
      blotterInstance.current = null;
      scopeRef.current = null;
      materialRef.current = null;
    };
  }, [text, fontFamily, size, color, padding, speed, seed]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: 'inline-block',
        margin: '0 auto',
        width: '100%',
        textAlign: 'center'
      }}
    />
  );
};

export default DistortedText;