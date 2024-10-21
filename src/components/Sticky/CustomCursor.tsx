import React from 'react';
import './CustomCursor.css'; // Create a separate CSS file for styles

const CustomCursor: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <div className="custom-cursor" style={{ left: x, top: y }}>
      <div className="cursor-circle"></div>
      <div className="cursor-text">CLICK & SLIDE</div>
    </div>
  );
};

export default CustomCursor;
