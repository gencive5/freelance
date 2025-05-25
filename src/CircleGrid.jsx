import React, { useEffect, useState, useRef } from 'react';
import './CircleGrid.css';

const CircleGrid = ({
  minCircleSize = 20,
  maxCircleSize = 40,
  gapRatio = 0.5,
  rows = 5,
  circleStyle = {},
  customCircles = {},
}) => {
  const gridRef = useRef(null);
  const [circleSize, setCircleSize] = useState(maxCircleSize);
  const [cols, setCols] = useState(0);

  useEffect(() => {
    const calculateLayout = () => {
      if (!gridRef.current) return;
      
      const containerWidth = gridRef.current.clientWidth;
      const containerHeight = gridRef.current.clientHeight;
      
      // Calculate maximum possible circle size that fits both width and height
      const widthBasedSize = (containerWidth / Math.floor(containerWidth / (maxCircleSize * (1 + gapRatio)))) * (1 + gapRatio);
      const heightBasedSize = containerHeight / (rows * (1 + gapRatio * 0.5));
      
      const newCircleSize = Math.max(
        minCircleSize,
        Math.min(maxCircleSize, widthBasedSize, heightBasedSize)
      );
      
      setCircleSize(newCircleSize);
      setCols(Math.floor(containerWidth / (newCircleSize * (1 + gapRatio))));
    };

    calculateLayout();
    const resizeObserver = new ResizeObserver(calculateLayout);
    if (gridRef.current) resizeObserver.observe(gridRef.current);

    return () => resizeObserver.disconnect();
  }, [minCircleSize, maxCircleSize, gapRatio, rows]);

  const gapSize = circleSize * gapRatio;

  return (
    <div 
      ref={gridRef}
      className="circle-grid-container"
      style={{
        '--circle-size': `${circleSize}px`,
        '--gap-size': `${gapSize}px`,
        '--rows': rows,
        '--cols': cols,
      }}
    >
      <div className="circle-grid">
        {Array.from({ length: rows * cols }).map((_, index) => {
          const id = `c${index + 1}`;
          return (
            <div
              key={id}
              id={id}
              className="circle"
              style={{
                width: `${circleSize}px`,
                height: `${circleSize}px`,
                ...circleStyle,
                ...(customCircles[id] || {})
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CircleGrid;