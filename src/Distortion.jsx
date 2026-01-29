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
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const materialRef = useRef(null);
  const textureRef = useRef(null);
  const frameRef = useRef(null);
  const startTimeRef = useRef(performance.now());

  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;
    let geometry, material, texture, renderer;

    const initDistortion = async () => {
      try {
        // SMART FONT LOADING STRATEGY
        // ---------------------------
        const fontString = `1em "${fontFamily}"`;
        const isFontLoaded = document.fonts.check(fontString);
        
        // Mobile: Font is usually preloaded, so isFontLoaded = true
        // Desktop: Font might not be loaded yet, so isFontLoaded = false
        
        if (!isFontLoaded) {
          // Try to load font, but don't wait too long (especially for mobile)
          const fontLoadPromise = document.fonts.load(fontString);
          const timeoutPromise = new Promise(resolve => setTimeout(resolve, 50));
          
          // Race condition: font load vs short timeout
          await Promise.race([fontLoadPromise, timeoutPromise]);
          
          // Small additional wait for font application
          await new Promise(resolve => requestAnimationFrame(resolve));
        }

        if (!mounted || !containerRef.current) return;

        // ----------------------
        // Canvas text creation
        // ----------------------
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const textCanvas = document.createElement("canvas");
        const ctx = textCanvas.getContext("2d");

        // Font should be loaded by now (or fallback will be used)
        ctx.font = `${fontSize * dpr}px "${fontFamily}", sans-serif`;
        const metrics = ctx.measureText(text);

        textCanvas.width = Math.ceil(metrics.width + fontSize * dpr * 0.6);
        textCanvas.height = Math.ceil(fontSize * dpr * 1.4);

        // Redraw with same font settings
        ctx.font = `${fontSize * dpr}px "${fontFamily}", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = color;
        ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
        ctx.fillText(text, textCanvas.width / 2, textCanvas.height / 2);

        // Optional: Check if font rendered correctly (for debugging)
        if (process.env.NODE_ENV === 'development') {
          console.log(`Font "${fontFamily}" loaded:`, document.fonts.check(`1em "${fontFamily}"`));
          console.log('Canvas dimensions:', textCanvas.width, 'x', textCanvas.height);
        }

        // ----------------------
        // Three.js setup
        // ----------------------
        texture = new THREE.CanvasTexture(textCanvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
        textureRef.current = texture;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.OrthographicCamera(
          -1,
          1,
          1,
          -1,
          0,
          10
        );
        camera.position.z = 1;
        cameraRef.current = camera;

        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true
        });

        renderer.setPixelRatio(dpr);
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        rendererRef.current = renderer;
        
        // Clear container and append new canvas
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

        // ----------------------
        // Animation loop
        // ----------------------
        const animate = () => {
          if (!mounted) return;
          material.uniforms.uTime.value = (performance.now() - startTimeRef.current) * 0.001;
          renderer.render(scene, camera);
          frameRef.current = requestAnimationFrame(animate);
        };

        animate();

      } catch (error) {
        console.error('Error in Distortion component:', error);
      }
    };

    initDistortion();

    // ----------------------
    // Cleanup
    // ----------------------
    return () => {
      mounted = false;
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      // Dispose Three.js resources
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (texture) texture.dispose();
      if (renderer) {
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
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