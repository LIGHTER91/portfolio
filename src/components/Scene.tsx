import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Model from './Model';
import './Scene.css'; // Import the CSS file for styles
import AnimatedBackground from './AnimatedBackground';

const Scene = () => {
  const isMobile = window.innerWidth < 768;

  return (
    <Canvas className="canvas" style={{ background: '#000' }} frameloop={isMobile ? "demand" : "always"}>
      <AnimatedBackground />
      <ambientLight intensity={isMobile ? 0.05 : 0.1} />
      <directionalLight intensity={isMobile ? 1.0 : 1.5} position={[2, 3, 4]} />
      {!isMobile && <Environment preset="city" />}

      <Model />
    </Canvas>
  );
};

export default Scene;
