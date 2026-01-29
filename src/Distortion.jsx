import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const Distortion = ({
  text = "observation",
  fontFamily = "sm00ch",
  color = "#f7f0f0",
  fontSize = 120,
  speed = 0.6,
  volatility = 0.25,
  className = ""
}) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const materialRef = useRef(null);
  const textureRef = useRef(null);
  const frameRef = useRef(null);
  const startTimeRef = useRef(performance.now());
  
  // State for graceful loading like your old component
  const [fontLoaded, setFontLoaded] = useState(false);
  const [threeReady, setThreeReady] = useState(false);
  const isDesktopRef = useRef(window.innerWidth > 768);

  useEffect(() => {
    // Device detection
    isDesktopRef.current = window.innerWidth > 768;
  }, []);

  useEffect(() => {
    // Load font first (like your old component)
    const loadFont = async () => {
      const fontString = `1em "${fontFamily}"`;
      
      // Check if already loaded (common on mobile)
      if (document.fonts.check(fontString)) {
        setFontLoaded(true);
        return;
      }
      
      // Try to load it
      try {
        await document.fonts.load(fontString);
        setFontLoaded(true);
      } catch (err) {
        console.warn('Font load failed, continuing anyway:', err);
        setFontLoaded(true); // Still continue
      }
    };
    
    loadFont();
  }, [fontFamily]);

  useEffect(() => {
    if (!containerRef.current || !fontLoaded) return;

    let mounted = true;
    let geometry, material, texture, renderer;

    const initThree = () => {
      try {
        // ----------------------
        // Canvas text (font should be loaded now)
        // ----------------------
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const textCanvas = document.createElement("canvas");
        const ctx = textCanvas.getContext("2d");

        ctx.font = `${fontSize * dpr}px "${fontFamily}", sans-serif`;
        const metrics = ctx.measureText(text);

        textCanvas.width = Math.ceil(metrics.width + fontSize * dpr * 0.6);
        textCanvas.height = Math.ceil(fontSize * dpr * 1.4);

        ctx.font = `${fontSize * dpr}px "${fontFamily}", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = color;
        ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
        ctx.fillText(text, textCanvas.width / 2, textCanvas.height / 2);

        texture = new THREE.CanvasTexture(textCanvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
        textureRef.current = texture;

        // ----------------------
        // Three.js setup
        // ----------------------
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
        camera.position.z = 1;
        cameraRef.current = camera;

        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "high-performance"
        });

        renderer.setPixelRatio(dpr);
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        rendererRef.current = renderer;
        
        // Clear and append
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(renderer.domElement);

        material = new THREE.ShaderMaterial({
          transparent: true,
          uniforms: {
            uTime: { value: 0 },
            uSpeed: { value: speed },
            uVolatility: { value: volatility },
            uTexture: { value: texture }
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            varying vec2 vUv;
            uniform sampler2D uTexture;
            uniform float uTime;
            uniform float uSpeed;
            uniform float uVolatility;
            void main() {
              vec2 uv = vUv;
              float waveX = sin(uv.y * 10.0 + uTime * uSpeed) * uVolatility;
              float waveY = sin(uv.x * 10.0 + uTime * uSpeed * 1.2) * uVolatility;
              uv.x += waveX;
              uv.y += waveY;
              vec4 color = texture2D(uTexture, uv);
              if (color.a < 0.01) discard;
              gl_FragColor = color;
            }
          `
        });

        materialRef.current = material;

        geometry = new THREE.PlaneGeometry(2, 2, 64, 64);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Animation loop
        const animate = () => {
          if (!mounted) return;
          material.uniforms.uTime.value = (performance.now() - startTimeRef.current) * 0.001;
          renderer.render(scene, camera);
          frameRef.current = requestAnimationFrame(animate);
        };

        animate();
        
        // Mark as ready (like your old component's blotterReady)
        setThreeReady(true);
        
      } catch (error) {
        console.error('Three.js initialization error:', error);
      }
    };

    initThree();

    // Cleanup
    return () => {
      mounted = false;
      setThreeReady(false);
      
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (texture) texture.dispose();
      if (renderer) {
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
    };
  }, [fontLoaded, text, fontFamily, fontSize, color, speed, volatility]);

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
        opacity: threeReady ? 1 : 0,
        transition: "opacity 0.3s ease-out",
        cursor: isDesktopRef.current ? "default" : "pointer",
        width: "100%",
        height: "100%"
      }}
      data-font-loaded={fontLoaded}
      data-three-ready={threeReady}
      data-device-type={isDesktopRef.current ? "desktop" : "mobile"}
    />
  );
};

export default Distortion;