import { Canvas } from '@react-three/fiber';
import { Environment, Html, useProgress,Text } from '@react-three/drei';
import Model from './Model';
import Spark from './Spark';
import Stars from './Star';
import Title from './Title'; // Import Title component
import './Scene.css';
import { useState, useMemo } from 'react';

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
  const [showModel, setShowModel] = useState(false); // State to control when to show the model

  // Memoize Spark and Stars to prevent re-rendering
  const memoizedSpark = useMemo(() => <Spark />, []);
  const memoizedStars = useMemo(() => <Stars />, []);

  return (
    <Canvas
      
      gl={{ alpha: false, antialias: true }} // Disable alpha for better performance
      style={{ display: 'block' }}
    >
      <ambientLight intensity={0.1} />
      <directionalLight intensity={1.5} position={[2, 3, 4]} />
      <Environment preset="city" />

      {/* Use memoized Spark and Stars to ensure they don't re-render */}
      {memoizedStars}
      {memoizedSpark}
      <Text fontSize={0.2} position={[0,2,0]}> {"WORK IN PROGRESS"}  </Text>
      {/* Display Title and pass function to show the Model when Title animation completes */}
      <Title onComplete={() => setShowModel(true)} />

      {/* Show Model only after Title completes */}
      {showModel && <Model />}
      
      {/* Loader will disappear once the scene is fully loaded */}
      <Loader />
    </Canvas>
  );
};

export default Scene;
