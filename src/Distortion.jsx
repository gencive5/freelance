import { useEffect, useRef } from "react";
import * as THREE from "three";

// --------------------------------------------------
// Distortion — Canvas → Texture → Shader text
// --------------------------------------------------

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

    // ----------------------
    // Canvas text
    // ----------------------
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const textCanvas = document.createElement("canvas");
    const ctx = textCanvas.getContext("2d");

    ctx.font = `${fontSize * dpr}px ${fontFamily}`;
    const metrics = ctx.measureText(text);

    textCanvas.width = Math.ceil(metrics.width + fontSize * dpr * 0.6);
    textCanvas.height = Math.ceil(fontSize * dpr * 1.4);

    ctx.font = `${fontSize * dpr}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    ctx.fillText(text, textCanvas.width / 2, textCanvas.height / 2);

    const texture = new THREE.CanvasTexture(textCanvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    textureRef.current = texture;

    // ----------------------
    // Three.js setup
    // ----------------------
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

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    renderer.setPixelRatio(dpr);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // ----------------------
    // Shader material
    // ----------------------
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

    materialRef.current = material;

    // ----------------------
    // Plane
    // ----------------------
    const geometry = new THREE.PlaneGeometry(2, 2, 64, 64);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ----------------------
    // Animation loop
    // ----------------------
    const animate = () => {
      material.uniforms.uTime.value = (performance.now() - startTimeRef.current) * 0.001;
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // ----------------------
    // Cleanup
    // ----------------------
    return () => {
      cancelAnimationFrame(frameRef.current);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
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