import React, { useEffect, useState } from 'react';
import './CustomCursor.css';

interface CustomCursorProps {
  x: number;
  y: number;
  isTitleHovered: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ x, y, isTitleHovered }) => {
  const [cursorSize, setCursorSize] = useState(25);
  const [cursorColor, setCursorColor] = useState('black');

  useEffect(() => {
    const sizeTarget = isTitleHovered ? 80 : 25;
    const interval = setInterval(() => {
      setCursorSize((prevSize) => {
        if (prevSize < sizeTarget) {
          return Math.min(prevSize + 1, sizeTarget);
        } else if (prevSize > sizeTarget) {
          return Math.max(prevSize - 1, sizeTarget);
        }
        return prevSize;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [isTitleHovered]);

  // Change cursor color based on hover state
  useEffect(() => {
    setCursorColor(isTitleHovered ? 'orange' : 'black');
  }, [isTitleHovered]);

  return (
    <div 
      className="custom-cursor" 
      style={{ 
        left: x, 
        top: y, 
        width: `${cursorSize}px`, 
        height: `${cursorSize}px`, 
        backgroundColor: cursorColor,
        borderRadius: '50%'
      }}>
      <div className={`cursor-text ${isTitleHovered ? 'fade-out' : 'fade-in'}`}>HOLD & SLIDE</div>
    </div>
  );
};

export default CustomCursor;
