import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Model from './Model';
import './Scene.css'; // Import the CSS file for styles

const Scene = () => {
  return (
    <Canvas className="canvas" style={{ background: '#000' }}>
      <ambientLight intensity={0.5} />
      <directionalLight intensity={1.5} position={[2, 3, 4]} />
      <Environment preset="city" />
      <Model />
    </Canvas>
  );
};

export default Scene;
