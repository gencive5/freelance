import React, { useEffect, useState, useRef } from 'react';
import type { CSSProperties } from 'react';
import './CircleGrid.css';

interface CircleGridProps {
  baseSize?: number;     // Base size in pixels
  mobileMultiplier?: number; // Size multiplier for mobile
  gapRatio?: number;     // Gap as ratio of circle size
  rows?: number;
  circleStyle?: CSSProperties;
  customCircles?: { [key: string]: CSSProperties };
}

const CircleGrid: React.FC<CircleGridProps> = ({
  baseSize = 30,        // Smaller base size
  mobileMultiplier = 0.8, // 20% smaller on mobile
  gapRatio = 0.5,       // Gap is half of circle size
  rows = 5,
  circleStyle = {},
  customCircles = {},
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => window.innerWidth < 768;
    setIsMobile(checkMobile());
    
    const calculateCols = () => {
      if (!gridRef.current) return;
      const effectiveSize = isMobile ? baseSize * mobileMultiplier : baseSize;
      const effectiveGap = effectiveSize * gapRatio;
      const viewportWidth = gridRef.current.clientWidth;
      const colCount = Math.floor(viewportWidth / (effectiveSize + effectiveGap));
      setCols(Math.max(1, colCount));
    };

    const handleResize = () => {
      setIsMobile(checkMobile());
      calculateCols();
    };

    calculateCols();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [baseSize, mobileMultiplier, gapRatio, isMobile]);

  const effectiveSize = isMobile ? baseSize * mobileMultiplier : baseSize;
  const effectiveGap = effectiveSize * gapRatio;

  return (
    <div 
      ref={gridRef}
      className="circle-grid"
      style={{
        '--diameter': `${effectiveSize}px`,
        '--gap': `${effectiveGap}px`,
        '--rows': rows,
        '--cols': cols,
      } as CSSProperties}
    >
      {Array.from({ length: rows * cols }).map((_, index) => {
        const id = `c${index + 1}`;
        return (
          <div
            key={id}
            id={id}
            className="circle"
            style={{
              width: `${effectiveSize}px`,
              height: `${effectiveSize}px`,
              ...circleStyle,
              ...(customCircles[id] || {})
            }}
          />
        );
      })}
    </div>
  );
};

export default CircleGrid;