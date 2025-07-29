import { useEffect, useRef } from 'react';
import './MetallicScrollbar.css';

const MetallicScrollbar = ({ children, style }) => {
  const containerRef = useRef(null);
  const thumbRef = useRef(null);
  const trackRef = useRef(null);
  const contentRef = useRef(null);
  
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startScrollTopRef = useRef(0);
  const lastYRef = useRef(0);
  const velocityRef = useRef(0);
  const animationFrameRef = useRef(null);
  const lastScrollTimeRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const thumb = thumbRef.current;
    const track = trackRef.current;

    if (!container || !thumb || !track) return;

    // Load MetalliCSS once
    if (!window.metallicssLoaded) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/metallicss@4.0.3/dist/metallicss.min.js';
      script.type = 'module';
      script.onload = () => {
        window.metallicssLoaded = true;
        applyMetallicStyle();
      };
      document.body.appendChild(script);
    } else {
      applyMetallicStyle();
    }

    function applyMetallicStyle() {
      const fakeThumb = document.createElement('div');
      fakeThumb.className = 'metallicss';
      fakeThumb.style.setProperty('--convexity', style?.['--convexity'] || '1.5');
      fakeThumb.style.setProperty('--metal', style?.['--scrollbar-metal'] || 'silver');
      fakeThumb.style.position = 'absolute';
      fakeThumb.style.opacity = '0';
      document.body.appendChild(fakeThumb);

      setTimeout(() => {
        const styles = window.getComputedStyle(fakeThumb);
        if (thumb) {
          thumb.style.background = styles.background;
          thumb.style.boxShadow = styles.boxShadow;
          thumb.style.border = styles.border;
        }
        document.body.removeChild(fakeThumb);
      }, 100);
    }

    // Scroll sync
    const updateThumbPosition = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const trackHeight = track.clientHeight;
      const thumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 20);

      if (scrollHeight <= clientHeight) {
        thumb.style.display = 'none';
        return;
      }

      thumb.style.display = 'block';
      const maxScroll = scrollHeight - clientHeight;
      const thumbTop = (scrollTop / maxScroll) * (trackHeight - thumbHeight);

      thumb.style.height = `${thumbHeight}px`;
      thumb.style.top = `${thumbTop}px`;
    };

    // Momentum scrolling animation
    const animateScroll = () => {
      const now = performance.now();
      const deltaTime = now - lastScrollTimeRef.current;
      lastScrollTimeRef.current = now;

      if (Math.abs(velocityRef.current) > 0.5) {
        container.scrollTop += velocityRef.current * (deltaTime / 16);
        velocityRef.current *= 0.95; // Friction
        animationFrameRef.current = requestAnimationFrame(animateScroll);
      } else {
        velocityRef.current = 0;
      }
    };

    // Wheel/touchpad handler
    const handleWheel = (e) => {
      if (isDraggingRef.current) return;
      
      // Update velocity for momentum scrolling
      const delta = e.deltaY;
      velocityRef.current = delta * 1.5;
      
      // Apply immediate scroll
      container.scrollTop += delta;
      
      // Start or continue momentum animation
      if (!animationFrameRef.current) {
        lastScrollTimeRef.current = performance.now();
        animationFrameRef.current = requestAnimationFrame(animateScroll);
      }
      
      updateThumbPosition();
      e.preventDefault();
    };

    // Track click handler (jump to position)
    const onTrackClick = (e) => {
      if (e.target === thumb || isDraggingRef.current) return;
      
      const trackRect = track.getBoundingClientRect();
      const clickPosition = e.clientY - trackRect.top;
      const thumbHeight = thumb.offsetHeight;
      
      // Calculate new scroll position
      const scrollRatio = container.scrollHeight / container.clientHeight;
      const newScrollTop = (clickPosition / trackRect.height) * 
                         (container.scrollHeight - container.clientHeight);
      
      // Smooth scroll to position
      container.scrollTo({
        top: newScrollTop,
        behavior: 'smooth'
      });
    };

    // Drag handlers
    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      startYRef.current = e.clientY;
      startScrollTopRef.current = container.scrollTop;
      thumb.style.cursor = 'grabbing';
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      
      const deltaY = e.clientY - startYRef.current;
      const scrollRatio = container.scrollHeight / container.clientHeight;
      container.scrollTop = startScrollTopRef.current + deltaY * scrollRatio;
      e.preventDefault();
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      thumb.style.cursor = 'grab';
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    // Initialize
    updateThumbPosition();

    // Event listeners
    container.addEventListener('scroll', updateThumbPosition);
    window.addEventListener('resize', updateThumbPosition);
    container.addEventListener('wheel', handleWheel, { passive: false });
    track.addEventListener('click', onTrackClick);
    thumb.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    // Cleanup
    return () => {
      container.removeEventListener('scroll', updateThumbPosition);
      window.removeEventListener('resize', updateThumbPosition);
      container.removeEventListener('wheel', handleWheel);
      track.removeEventListener('click', onTrackClick);
      thumb.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [style]);

  return (
    <div className="metallic-scroll-wrapper">
      <div 
        className="metallic-scroll-container" 
        ref={containerRef}
      >
        <div className="scroll-content" ref={contentRef}>
          {children}
        </div>
      </div>
      <div className="scrollbar-track" ref={trackRef}>
        <div
          className="scrollbar-thumb metallicss"
          ref={thumbRef}
          style={{
            '--convexity': style?.['--convexity'] || '1.5',
            '--metal': style?.['--scrollbar-metal'] || 'silver',
          }}
        />
      </div>
    </div>
  );
};

export default MetallicScrollbar;