import Scene from './Scene/Scene';
import './Home.css';
import { useState, useEffect } from 'react';

const Home: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the device is mobile based on touch capabilities
    setIsMobile(navigator.maxTouchPoints > 0);
  }, []);

  return (
    <>
      <Scene />
      <div className="drag-down-indicator">
        <span className="vertical-text">
          {isMobile ? 'Hold Finger ---' : 'Hold & Drag Down -->'}
        </span>
      </div>
    </>
  );
};

export default Home;
