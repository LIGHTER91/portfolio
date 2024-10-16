import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Model from './Model';

import NodeEdgeGraph from './Graph'; // Import the Graph component
import './Scene.css';

const Scene: React.FC = () => {
  return (
    <Canvas className="canvas" style={{ background: '#000' }}>
      <NodeEdgeGraph numNodes={100} maxEdges={50} clusterSize={20} position={[0,0,-10]}/>
      <ambientLight intensity={0.1} />
      <directionalLight intensity={1.5} position={[2, 3, 4]} />
      <Environment preset="city" />
      
       
      <Model />
      
    </Canvas>
  );
};

export default Scene;
