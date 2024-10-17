import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, MeshTransmissionMaterial } from '@react-three/drei';
import { Mesh } from 'three';
import * as THREE from 'three'; // Ensure THREE is imported
import { useControls } from 'leva';
import Title from './Title';

interface GLTFResult {
  nodes: {
    Texte: {
      geometry: THREE.BufferGeometry;
    };
  };
}

const Model = () => {
  const torusRef = useRef<Mesh>(null);
  const { nodes } = useGLTF('portfolio/medias/portfolio.glb') as unknown as GLTFResult;
  const [time, setTime] = useState(0);
  const [showModel, setShowModel] = useState(false);
  const [yPosition, setYPosition] = useState(-8); // Start below the visible area
  const [opacity, setOpacity] = useState(0); // Initial opacity

  const { size } = useThree();
  const isMobile = size.width < 768;

  const materialProps = useControls({
    thickness: { value: 0.25, min: 0, max: 3, step: 0.05 },
    roughness: { value: 0, min: 0, max: 1, step: 0.1 },
    transmission: { value: 1.0, min: 0, max: 1, step: 0.1 },
    ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
    chromaticAberration: { value: 0.08, min: 0, max: 1 },
    backside: { value: true },
  });

  const geometry = isMobile ? useMemo(() => nodes.Texte.geometry, [nodes.Texte.geometry]) : nodes.Texte.geometry;
  const torusMaterial = <MeshTransmissionMaterial {...materialProps} />;

  const torusScale: [number, number, number] = isMobile ? [0.4, 2.5, 0.5] : [1.2, 5, 1.5];

  useFrame(() => {
    if (!isMobile && torusRef.current) {
      setTime((prevTime) => prevTime + 0.015);
      torusRef.current.rotation.y = Math.sin(time) * (Math.PI / 80);
      torusRef.current.rotation.z = Math.sin(time) * (Math.PI / 80);
    }

    // Animate the model's rise after the title appears
    if (showModel) {
      setYPosition((prevY) => {
        if (prevY < -0.22) { // Target Y position
          return prevY + 0.15; // Adjust speed of rise
        } else {
          setOpacity(1); // Set opacity to 1 when reached
          return prevY; // Maintain position
        }
      });
    }
  });

  return (
    <group>
      <Title onComplete={() => setShowModel(true)} />

      {showModel && (
        <group position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            ref={torusRef}
            scale={torusScale}
            geometry={geometry}
            position={[0, yPosition, 0.4]} // Bind Y position
            material-opacity={opacity} // Bind opacity to mesh material
          >
            {torusMaterial}
          </mesh>
        </group>
      )}
    </group>
  );
};

export default Model;
