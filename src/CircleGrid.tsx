import React, { useEffect, useState, useRef } from 'react';
import type { CSSProperties } from 'react';
import './CircleGrid.css';

interface CircleGridProps {
  circleDiameter?: number; // Fixed pixel size
  gapSize?: number;       // Fixed pixel gap
  rows?: number;
  circleStyle?: CSSProperties;
  customCircles?: { [key: string]: CSSProperties };
}

const CircleGrid: React.FC<CircleGridProps> = ({
  circleDiameter = 40,
  gapSize = 20,
  rows = 5,
  circleStyle = {},
  customCircles = {},
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(0);

  useEffect(() => {
    const calculateCols = () => {
      if (!gridRef.current) return;
      const viewportWidth = gridRef.current.clientWidth;
      const colCount = Math.floor(viewportWidth / (circleDiameter + gapSize));
      setCols(Math.max(1, colCount)); // Ensure at least 1 column
    };

    calculateCols();
    window.addEventListener('resize', calculateCols);
    return () => window.removeEventListener('resize', calculateCols);
  }, [circleDiameter, gapSize]);

  return (
    <div 
      ref={gridRef}
      className="circle-grid"
      style={{
        '--diameter': `${circleDiameter}px`,
        '--gap': `${gapSize}px`,
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
              width: `${circleDiameter}px`,
              height: `${circleDiameter}px`,
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