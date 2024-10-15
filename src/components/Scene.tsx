import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Model from './Model';
import './Scene.css'; // Import the CSS file for styles
import AnimatedBackground from './AnimatedBackground';
const Scene = () => {
  return (
    <Canvas className="canvas" style={{ background: '#000' }}>
      <AnimatedBackground />
      <ambientLight intensity={0.1} />
      <directionalLight intensity={1.5} position={[2, 3, 4]} />
      <Environment preset="city" />
      

      <Model />
      
    </Canvas>
  );
};

export default Scene;
