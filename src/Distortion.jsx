import { useEffect, useRef } from "react";
import * as THREE from "three";

const Distortion = ({
  text = "observation",
  fontFamily = "sm00ch",
  color = "#f7f0f0",
  fontSize = 120,
  speed = 0.6,
  volatility = 0.25
}) => {
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  
  // Refs for cleanup
  const cleanupRefs = useRef({
    geometry: null,
    material: null,
    texture: null,
    renderer: null
  });

  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    const init = async () => {
      try {
        // 1. Wait for font to load (if needed)
        const fontString = `1em "${fontFamily}"`;
        
        if (!document.fonts.check(fontString)) {
          // Use CSS font loading API - much cleaner
          await document.fonts.load(fontString);
        }
        
        // Optional: Wait for all fonts to be ready
        await document.fonts.ready;
        
        if (!mounted) return;

        // 2. Create canvas with loaded font
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const textCanvas = document.createElement("canvas");
        const ctx = textCanvas.getContext("2d");

        // Font should now be loaded
        ctx.font = `${fontSize * dpr}px "${fontFamily}", sans-serif`;
        const metrics = ctx.measureText(text);

        textCanvas.width = Math.ceil(metrics.width + fontSize * dpr * 0.6);
        textCanvas.height = Math.ceil(fontSize * dpr * 1.4);

        // Redraw with same settings
        ctx.font = `${fontSize * dpr}px "${fontFamily}", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = color;
        ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
        ctx.fillText(text, textCanvas.width / 2, textCanvas.height / 2);

        // Debug log to verify
        console.log(`Font "${fontFamily}" loaded, canvas width: ${metrics.width}`);

        const texture = new THREE.CanvasTexture(textCanvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
        cleanupRefs.current.texture = texture;

        // 3. Three.js setup
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
        camera.position.z = 1;

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true
        });

        renderer.setPixelRatio(dpr);
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        cleanupRefs.current.renderer = renderer;
        
        // Clear and append
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(renderer.domElement);

        const material = new THREE.ShaderMaterial({
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

        cleanupRefs.current.material = material;

        const geometry = new THREE.PlaneGeometry(2, 2, 64, 64);
        cleanupRefs.current.geometry = geometry;
        
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const startTime = performance.now();
        
        const animate = () => {
          if (!mounted) return;
          
          material.uniforms.uTime.value = (performance.now() - startTime) * 0.001;
          renderer.render(scene, camera);
          frameRef.current = requestAnimationFrame(animate);
        };

        animate();
        
      } catch (error) {
        console.error('Error initializing distortion:', error);
      }
    };

    init();

    // Cleanup
    return () => {
      mounted = false;
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      // Dispose Three.js resources
      const { geometry, material, texture, renderer } = cleanupRefs.current;
      
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (texture) texture.dispose();
      if (renderer) {
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
      
      // Reset refs
      cleanupRefs.current = {
        geometry: null,
        material: null,
        texture: null,
        renderer: null
      };
    };
  }, [text, fontFamily, fontSize, color, speed, volatility]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative"
      }}
    />
  );
};

export default Distortion;