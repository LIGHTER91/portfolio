import { Canvas } from '@react-three/fiber';
import { Environment, Html, useProgress } from '@react-three/drei';
import Model from './Model';
import Spark from './Spark';
import './Scene.css';
import Stars from './Star';
// Loading component to display while the scene is loading
const Loader = () => {
  const { progress, loaded, total } = useProgress(); // Get the current loading progress and state

  // Display loader only if loading is still in progress
  if (loaded < total) {
    return (
      <Html center>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading... {progress.toFixed(0)}%</p>
        </div>
      </Html>
    );
  }
  return null; // Return nothing once everything is loaded
};

const Scene: React.FC = () => {
  return (
    <Canvas className="canvas" style={{ background: '#000' }}>
      
      <ambientLight intensity={0.1} />
      <directionalLight intensity={1.5} position={[2, 3, 4]} />
      <Environment preset="city" />
      <Stars/>
      <Spark />
      <Model />

      {/* Loader will disappear once the scene is fully loaded */}
      <Loader />
    </Canvas>
  );
};

export default Scene;
