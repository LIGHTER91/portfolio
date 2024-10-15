import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF,MeshTransmissionMaterial,Text } from '@react-three/drei';
import { Mesh } from 'three';
import * as THREE from 'three'; // Import THREE
import { GLTF } from 'three-stdlib';
import { useControls } from 'leva';
interface TorusGLTF extends GLTF {
  nodes: {
    Torus002: {
      geometry: THREE.BufferGeometry;
    };
  };
}

const Model = () => {
  const torusRef = useRef<Mesh>(null); // Specify the ref type

  // Load the torus model from the correct path
  const { nodes } = useGLTF("portfolio/medias/torrus.glb") as unknown as TorusGLTF; // Use the defined type

  // Animate the torus rotation
  useFrame(() => {
    if (torusRef.current) { // Check if torusRef.current is defined
      torusRef.current.rotation.x += 0.01;
      torusRef.current.rotation.y += 0.01;
    }
    
  }
  
);
const materialProps = useControls({

    thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },

    roughness: { value: 0, min: 0, max: 1, step: 0.1 },

    transmission: {value: 1, min: 0, max: 1, step: 0.1},

    ior: { value: 1.2, min: 0, max: 3, step: 0.1 },

    chromaticAberration: { value: 0.02, min: 0, max: 1},

    backside: { value: true},

})
  return (
    <group>
        <Text font={'portfolio/fonts/ppneuemontreal-bold.otf'} position={[0, 0, -1]} fontSize={2} color="white" anchorX="center" anchorY="middle">LUCIEN LACHAUD</Text>
<mesh ref={torusRef} geometry={nodes.Torus002.geometry}> {/* No need to assert as any now */}
      <meshStandardMaterial color="skyblue" metalness={0.6} roughness={0.1} />
      <MeshTransmissionMaterial {...materialProps}/>
    </mesh>
    </group>
    
    
  );
};

export default Model;
