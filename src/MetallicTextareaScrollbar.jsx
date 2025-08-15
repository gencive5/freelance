import { useEffect, useRef } from 'react';
import './MetallicTextareaScrollbar.css';

const MetallicTextareaScrollbar = ({ textareaRef, style }) => {
  const thumbRef = useRef(null);
  const trackRef = useRef(null);
  
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startScrollTopRef = useRef(0);

  useEffect(() => {
    const textarea = textareaRef.current;
    const thumb = thumbRef.current;
    const track = trackRef.current;

    if (!textarea || !thumb || !track) return;

    function applyMetallicStyle() {
      const fakeThumb = document.createElement('div');
      fakeThumb.className = 'metallicss';
      fakeThumb.style.setProperty('--convexity', style?.['--convexity'] || '1.5');
      fakeThumb.style.setProperty('--metal', style?.['--metal'] || 'silver');
      fakeThumb.style.position = 'absolute';
      fakeThumb.style.opacity = '0';
      document.body.appendChild(fakeThumb);

      setTimeout(() => {
        const styles = window.getComputedStyle(fakeThumb);
        thumb.style.background = styles.background;
        thumb.style.boxShadow = styles.boxShadow;
        thumb.style.border = styles.border;
        document.body.removeChild(fakeThumb);
      }, 100);
    }

    const updateThumbPosition = () => {
      const { scrollTop, scrollHeight, clientHeight } = textarea;
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

    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      startYRef.current = e.clientY;
      startScrollTopRef.current = textarea.scrollTop;
      thumb.style.cursor = 'grabbing';
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      
      const deltaY = e.clientY - startYRef.current;
      const scrollRatio = textarea.scrollHeight / textarea.clientHeight;
      textarea.scrollTop = startScrollTopRef.current + deltaY * scrollRatio;
      e.preventDefault();
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      thumb.style.cursor = 'grab';
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    // Initialize
    applyMetallicStyle();
    updateThumbPosition();

    // Event listeners
    textarea.addEventListener('scroll', updateThumbPosition);
    window.addEventListener('resize', updateThumbPosition);
    thumb.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      textarea.removeEventListener('scroll', updateThumbPosition);
      window.removeEventListener('resize', updateThumbPosition);
      thumb.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [textareaRef, style]);

  return (
    <div className="textarea-scroll-track" ref={trackRef}>
      <div
        className="textarea-scroll-thumb metallicss"
        ref={thumbRef}
        style={{
          '--convexity': style?.['--convexity'] || '1.5',
          '--metal': style?.['--metal'] || 'silver',
        }}
      />
    </div>
  );
};

export default MetallicTextareaScrollbar;