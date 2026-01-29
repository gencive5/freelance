import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

const Distortion = ({
  text = "observation",
  fontFamily = "sm00ch",
  color = "#f7f0f0",
  fontSize = 120,
  speed = 0.6,
  volatility = 0.25,
  className = "",
  desktopSizeMultiplier = 2,
  mouseMovementMultiplier = 0.06,
  mouseDecayRate = 0.92,
  hoverMultiplier = 2.0
}) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const materialRef = useRef(null);
  const textureRef = useRef(null);
  const frameRef = useRef(null);
  
  // Interactive states
  const [fontLoaded, setFontLoaded] = useState(false);
  const [threeReady, setThreeReady] = useState(false);
  const isDesktopRef = useRef(window.innerWidth > 768);
  
  // Animation and interaction refs
  const timeRef = useRef(0);
  const mouseMovementRef = useRef(0);
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  const mouseActiveRef = useRef(false);
  const hoverActiveRef = useRef(false);

  // ----------------------------------------------------------
  // FONT LOADING
  // ----------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const waitForFonts = async () => {
      try {
        // Check if font is already loaded first
        const fontString = `1em "${fontFamily}"`;
        if (document.fonts.check(fontString)) {
          if (mounted) setFontLoaded(true);
          return;
        }
        
        // Try to load it
        await document.fonts.load(fontString);
        if (mounted) setFontLoaded(true);
      } catch (err) {
        console.warn("Font check failed, continuing anyway", err);
        if (mounted) setFontLoaded(true);
      }
    };

    waitForFonts();
    return () => {
      mounted = false;
    };
  }, [fontFamily]);

  // ----------------------------------------------------------
  // FORCE FONT RENDER PASS
  // ----------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current || !fontLoaded) return;

    const getResponsiveSize = () => {
      return isDesktopRef.current ? fontSize * desktopSizeMultiplier : fontSize;
    };

    const temp = document.createElement("div");
    temp.style.cssText = `
      position:absolute;
      opacity:0;
      pointer-events:none;
      font-family: '${fontFamily}', sans-serif;
      font-size:${getResponsiveSize()}px;
      white-space:nowrap;
    `;
    temp.textContent = text;

    containerRef.current.appendChild(temp);
    setTimeout(() => temp.remove(), 100);

    return () => temp.remove();
  }, [text, fontLoaded, fontFamily, fontSize, desktopSizeMultiplier]);

  // ----------------------------------------------------------
  // MOUSE MOVEMENT
  // ----------------------------------------------------------
  const handleMouseMove = useCallback((e) => {
    if (!isDesktopRef.current || !materialRef.current) return;

    if (!lastMousePositionRef.current.x && !lastMousePositionRef.current.y) {
      lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const dx = Math.abs(e.clientX - lastMousePositionRef.current.x);
    const dy = Math.abs(e.clientY - lastMousePositionRef.current.y);
    const movement = Math.sqrt(dx * dx + dy * dy);

    mouseMovementRef.current = Math.min(mouseMovementRef.current + movement * 0.1, 10);
    mouseActiveRef.current = true;

    lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  // ----------------------------------------------------------
  // TOUCH/HOVER
  // ----------------------------------------------------------
  const handleMobileHoverStart = useCallback(() => {
    if (isDesktopRef.current || !materialRef.current) return;
    hoverActiveRef.current = true;
  }, []);

  const handleMobileHoverEnd = useCallback(() => {
    if (isDesktopRef.current || !materialRef.current) return;
    hoverActiveRef.current = false;
  }, []);

  // ----------------------------------------------------------
  // ANIMATION LOOP - SIMPLIFIED VERSION
  // ----------------------------------------------------------
  const animate = useCallback(() => {
    if (!materialRef.current || !sceneRef.current || !cameraRef.current) {
      frameRef.current = requestAnimationFrame(animate);
      return;
    }

    timeRef.current += 0.016; // Approximately 60fps

    // Update shader uniforms based on interaction
    if (isDesktopRef.current) {
      // Mouse movement decay
      if (mouseActiveRef.current) {
        mouseMovementRef.current *= mouseDecayRate;
        if (mouseMovementRef.current < 0.05) {
          mouseMovementRef.current = 0;
          mouseActiveRef.current = false;
        }
      }

      const baseVol = Math.sin(timeRef.current * 0.5) * 0.2 + volatility;
      const mouseBoost = mouseMovementRef.current * mouseMovementMultiplier;

      materialRef.current.uniforms.uVolatility.value = baseVol + mouseBoost;
      materialRef.current.uniforms.uSpeed.value = speed + mouseBoost * 0.1;
      
      // For desktop, just use regular multiplier
      materialRef.current.uniforms.uHoverMultiplier.value = 1.0;
      materialRef.current.uniforms.uMouseBoost.value = mouseBoost;

    } else {
      // Mobile hover effects
      const baseVolatility = Math.sin(timeRef.current * 0.5) * 0.2 + volatility;
      const currentMultiplier = hoverActiveRef.current ? hoverMultiplier : 1;
      
      materialRef.current.uniforms.uVolatility.value = baseVolatility;
      materialRef.current.uniforms.uSpeed.value = speed * (hoverActiveRef.current ? 1.3 : 1);
      materialRef.current.uniforms.uHoverMultiplier.value = currentMultiplier;
      materialRef.current.uniforms.uMouseBoost.value = 0;
    }

    // Update time uniform
    materialRef.current.uniforms.uTime.value = timeRef.current;

    // Render the scene
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }

    frameRef.current = requestAnimationFrame(animate);
  }, [speed, volatility, mouseMovementMultiplier, mouseDecayRate, hoverMultiplier]);

  // ----------------------------------------------------------
  // THREE.JS INITIALIZATION
  // ----------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current || !fontLoaded) return;

    let mounted = true;
    let geometry, material, texture, renderer;

    const initThree = () => {
      try {
        // Calculate responsive size
        const getResponsiveSize = () => {
          return isDesktopRef.current ? fontSize * desktopSizeMultiplier : fontSize;
        };
        const responsiveSize = getResponsiveSize();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const finalFontSize = responsiveSize * dpr;

        // Create text canvas
        const textCanvas = document.createElement("canvas");
        const ctx = textCanvas.getContext("2d");

        ctx.font = `${finalFontSize}px "${fontFamily}", sans-serif`;
        const metrics = ctx.measureText(text);

        textCanvas.width = Math.ceil(metrics.width + finalFontSize * 0.6);
        textCanvas.height = Math.ceil(finalFontSize * 1.4);

        ctx.font = `${finalFontSize}px "${fontFamily}", sans-serif`;
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

        // Three.js setup
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
        
        // Clear container and append
        containerRef.current.innerHTML = '';
        const canvasElement = renderer.domElement;
        canvasElement.style.width = '100%';
        canvasElement.style.height = '100%';
        canvasElement.style.display = 'block';
        containerRef.current.appendChild(canvasElement);

        material = new THREE.ShaderMaterial({
          transparent: true,
          uniforms: {
            uTime: { value: 0 },
            uSpeed: { value: speed },
            uVolatility: { value: volatility },
            uHoverMultiplier: { value: 1.0 },
            uMouseBoost: { value: 0.0 },
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
            uniform float uHoverMultiplier;
            uniform float uMouseBoost;

            void main() {
              vec2 uv = vUv;
              
              // Base distortion
              float waveX = sin(uv.y * 10.0 + uTime * uSpeed) * uVolatility;
              float waveY = sin(uv.x * 8.0 + uTime * uSpeed * 1.2) * uVolatility;
              
              // Interactive effects
              waveX *= uHoverMultiplier;
              waveY *= uHoverMultiplier;
              
              // Mouse movement boost
              float mouseEffect = sin(uv.x * 15.0 + uTime * uSpeed * 2.0) * uMouseBoost * 0.3;
              waveX += mouseEffect;
              waveY += mouseEffect;
              
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

        // Add event listeners for interactivity
        if (isDesktopRef.current) {
          document.addEventListener("mousemove", handleMouseMove);
        } else {
          containerRef.current.addEventListener("mouseenter", handleMobileHoverStart);
          containerRef.current.addEventListener("mouseleave", handleMobileHoverEnd);
          containerRef.current.addEventListener("touchstart", handleMobileHoverStart);
          containerRef.current.addEventListener("touchend", handleMobileHoverEnd);
          containerRef.current.addEventListener("touchcancel", handleMobileHoverEnd);
        }

        // Start animation
        timeRef.current = 0;
        frameRef.current = requestAnimationFrame(animate);
        
        setThreeReady(true);
        
        console.log('Three.js initialized successfully');
        
      } catch (error) {
        console.error('Three.js initialization error:', error);
      }
    };

    initThree();

    // ----------------------------------------------------------
    // RESIZE HANDLER
    // ----------------------------------------------------------
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const wasDesktop = isDesktopRef.current;
      isDesktopRef.current = newWidth > 768;

      // Update renderer size
      if (rendererRef.current && containerRef.current) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        rendererRef.current.setPixelRatio(dpr);
        rendererRef.current.setSize(
          containerRef.current.clientWidth, 
          containerRef.current.clientHeight
        );
      }

      // If device type changed, reinitialize
      if (wasDesktop !== isDesktopRef.current && mounted) {
        // Cleanup and reinitialize
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        
        // Remove old event listeners
        document.removeEventListener("mousemove", handleMouseMove);
        if (containerRef.current) {
          containerRef.current.removeEventListener("mouseenter", handleMobileHoverStart);
          containerRef.current.removeEventListener("mouseleave", handleMobileHoverEnd);
          containerRef.current.removeEventListener("touchstart", handleMobileHoverStart);
          containerRef.current.removeEventListener("touchend", handleMobileHoverEnd);
        }

        // Reinitialize
        setTimeout(() => {
          if (mounted) initThree();
        }, 100);
      }
    };

    window.addEventListener("resize", handleResize);

    // ----------------------------------------------------------
    // CLEANUP
    // ----------------------------------------------------------
    return () => {
      mounted = false;
      setThreeReady(false);
      
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      
      // Remove event listeners
      document.removeEventListener("mousemove", handleMouseMove);
      if (containerRef.current) {
        containerRef.current.removeEventListener("mouseenter", handleMobileHoverStart);
        containerRef.current.removeEventListener("mouseleave", handleMobileHoverEnd);
        containerRef.current.removeEventListener("touchstart", handleMobileHoverStart);
        containerRef.current.removeEventListener("touchend", handleMobileHoverEnd);
        containerRef.current.removeEventListener("touchcancel", handleMobileHoverEnd);
      }
      window.removeEventListener("resize", handleResize);

      // Dispose Three.js resources
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
  }, [fontLoaded, text, fontFamily, fontSize, color, speed, volatility, 
      desktopSizeMultiplier, handleMouseMove, handleMobileHoverStart, 
      handleMobileHoverEnd, animate]);

  // ----------------------------------------------------------
  // DEBUG: Check if component is working
  // ----------------------------------------------------------
  useEffect(() => {
    console.log('Distortion component state:', {
      fontLoaded,
      threeReady,
      containerExists: !!containerRef.current,
      isDesktop: isDesktopRef.current
    });
  }, [fontLoaded, threeReady]);

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  return (
    <div
      ref={containerRef}
      className={`distorted-text-container ${className}`}
      style={{
        display: "block",
        position: "relative",
        lineHeight: 0,
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        opacity: threeReady ? 1 : 0,
        transition: "opacity 0.3s ease-out",
        cursor: isDesktopRef.current ? "default" : "pointer",
        width: "100%",
        height: "100%",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "manipulation",
        backgroundColor: 'transparent'
      }}
      data-font-loaded={fontLoaded}
      data-three-ready={threeReady}
      data-device-type={isDesktopRef.current ? "desktop" : "mobile"}
    />
  );
};

export default Distortion;