import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Model from './Model';// Import the Graph component
import Spark from './Spark'; 
import './Scene.css';

const Scene: React.FC = () => {
  return (
    <Canvas className="canvas" style={{ background: '#000' }}>
      
      <ambientLight intensity={0.1} />
      <directionalLight intensity={1.5} position={[2, 3, 4]} />
      <Environment preset="city" />
      <Spark/>
       
      <Model />
      
    </Canvas>
  );
};

export default Scene;
