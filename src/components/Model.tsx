import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, MeshTransmissionMaterial, Text } from '@react-three/drei';
import { Mesh } from 'three';
import { useControls } from 'leva';
import * as THREE from 'three';
// Define the expected structure of the nodes
interface GLTFResult {
  nodes: {
    Texte: {
      geometry: THREE.BufferGeometry; // Change to the appropriate geometry type
    };
  };
}

const Model = () => {
  const torusRef = useRef<Mesh>(null); // Specify the ref type

  // Load the torus model from the correct path
  const { nodes } = useGLTF("portfolio/medias/portfolio.glb") as unknown as GLTFResult; // Type assertion

  const [time, setTime] = useState(0);
  // Animate the torus rotation
  useFrame(() => {
    if (torusRef.current) {
      setTime(prevTime => prevTime + 0.01); // Increment time

      // Calculate the oscillation using sine
      torusRef.current.rotation.y = Math.sin(time) * (Math.PI / 65); // ±30 degrees
      torusRef.current.rotation.z = Math.sin(time) * (Math.PI / 65); // ±30 degrees
    }
  });

  const materialProps = useControls({
    thickness: { value: 0.25, min: 0, max: 3, step: 0.05 },
    roughness: { value: 0, min: 0, max: 1, step: 0.1 },
    transmission: { value: 1.0, min: 0, max: 1, step: 0.1 },
    ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
    chromaticAberration: { value: 0.08, min: 0, max: 1 },
    backside: { value: true },
  });

  return (
    <group>
      <Text
        font={'portfolio/fonts/ppneuemontreal-bold.otf'}
        position={[0, 0, -6]}
        fontSize={3.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        LUCIEN LACHAUD
      </Text>

      {/* Outer group to change pivot point */}
      <group position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh
          ref={torusRef}
          scale={[1.6, 5, 1.9]}
          geometry={nodes.Texte.geometry} // Now TypeScript should recognize this
          position={[0, -0.22, -0.4]} // Adjust mesh position relative to new pivot
        >
          <meshStandardMaterial color="skyblue" metalness={0.6} roughness={0.1} />
          <MeshTransmissionMaterial {...materialProps} />
        </mesh>
      </group>
    </group>
  );
};

export default Model;
