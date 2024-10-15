import { useRef, useState, useLayoutEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, MeshTransmissionMaterial, Text } from '@react-three/drei';
import { Mesh } from 'three';
import { useControls } from 'leva';
import * as THREE from 'three';

// Define the expected structure of the nodes
interface GLTFResult {
  nodes: {
    Texte: {
      geometry: THREE.BufferGeometry;
    };
  };
}

const Model = () => {
  const torusRef = useRef<Mesh>(null); // Specify the ref type
  const { nodes } = useGLTF('portfolio/medias/portfolio.glb') as unknown as GLTFResult; // Type assertion
  const [time, setTime] = useState(0);

  const { size } = useThree();
  const isMobile = size.width < 768;

  // Controls for material properties
  const materialProps = useControls({
    thickness: { value: 0.25, min: 0, max: 3, step: 0.05 },
    roughness: { value: 0, min: 0, max: 1, step: 0.1 },
    transmission: { value: 1.0, min: 0, max: 1, step: 0.1 },
    ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
    chromaticAberration: { value: 0.08, min: 0, max: 1 },
    backside: { value: true },
  });

  // Adjust the 3D model and text size based on screen width
  const textScale = isMobile ? 0.75 : 3.5;
  const torusScale: [number, number, number] = isMobile ? [0.4, 2.5, 0.5] : [1.2, 5, 1.5]; // Cast as tuple

  // Animate the torus rotation
  useFrame(() => {
    if (!isMobile && torusRef.current) {
      setTime((prevTime) => prevTime + 0.015); // Increment time

      // Calculate the oscillation using sine
      torusRef.current.rotation.y = Math.sin(time) * (Math.PI / 80); // ±30 degrees
      torusRef.current.rotation.z = Math.sin(time) * (Math.PI / 80); // ±30 degrees
    }
  });

  // Dynamically resize and reposition elements based on the viewport size
  useLayoutEffect(() => {
    const handleResize = () => {
      // You can add logic to adjust the text and model positions or scales here if needed
    };

    handleResize(); // Call once on mount
  }, [size]);

  return (
    <group>
      <Text
        font={'portfolio/fonts/ppneuemontreal-bold.otf'}
        position={[0, 0, -6]}
        fontSize={textScale}
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
          scale={torusScale}
          geometry={nodes.Texte.geometry} // Now TypeScript should recognize this
          position={[0, -0.22, 0.4]} // Adjust mesh position relative to new pivot
        >
          <meshStandardMaterial color="skyblue" metalness={0.6} roughness={0.1} />
          <MeshTransmissionMaterial {...materialProps} />
        </mesh>
      </group>
    </group>
  );
};

export default Model;
