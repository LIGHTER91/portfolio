// NodeEdgeGraph.tsx

import * as THREE from 'three';
import React, { useRef, useEffect } from 'react';
import { Vector3 } from 'three';
import { Line } from '@react-three/drei';


interface Node {
  position: Vector3;
  id: string;
  label: string;
}

interface Edge {
  from: Node;
  to: Node;
}

// Function to generate a random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Function to generate a random graph with clusters
const generateClusteredGraph = (numNodes: number, maxEdges: number, clusterSize: number): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const clusterLabels = ['Cluster A', 'Cluster B', 'Cluster C', 'Cluster D'];
  
  for (let i = 0; i < numNodes; i++) {
    const x = Math.random() * 20 - 10; 
    const y = Math.random() * 20 - 10; 
    const label = clusterLabels[Math.floor(i / clusterSize) % clusterLabels.length];
    nodes.push({ position: new Vector3(x, y, 0), id: `Node ${i + 1}`, label });
  }

  const edgeCount = Math.floor(Math.random() * maxEdges) + numNodes; 
  for (let i = 0; i < edgeCount; i++) {
    const fromIndex = Math.floor(Math.random() * numNodes);
    const toIndex = Math.floor(Math.random() * numNodes);
    
    if (fromIndex !== toIndex) {
      edges.push({ from: nodes[fromIndex], to: nodes[toIndex] });
    }
  }

  return { nodes, edges };
};

interface NodeEdgeGraphProps {
  numNodes: number;
  maxEdges: number;
  clusterSize: number;
  position: [number, number, number]; // Added position prop
}

const NodeEdgeGraph: React.FC<NodeEdgeGraphProps> = ({ numNodes, maxEdges, clusterSize, position }) => {
  const graphRef = useRef<THREE.Group>(null);
  
  const { nodes, edges } = generateClusteredGraph(numNodes, maxEdges, clusterSize);

  useEffect(() => {
    const animate = () => {
      if (graphRef.current) {
        graphRef.current.rotation.y =-3.14/30; // Rotate the graph
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <group ref={graphRef} position={position}> {/* Apply the position prop here */}
      {edges.map((edge, index) => (
        <Line
          key={index}
          points={[edge.from.position, edge.to.position]}
          color="green"
          lineWidth={2}
        />
      ))}
      {nodes.map((node, index) => (
        <mesh key={index} position={node.position}>
          <sphereGeometry args={[0.5, 40, 40]} />
          <meshStandardMaterial color={getRandomColor()} />
        </mesh>
      ))}
    </group>
  );
};

export default NodeEdgeGraph;
