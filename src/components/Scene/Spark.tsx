import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, extend } from '@react-three/fiber';
import { DodecahedronGeometry } from 'three';

// Extend the THREE namespace to include DodecahedronGeometry
extend({ DodecahedronGeometry });

const Spark = () => {
  const count = 1000; // Number of particles
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const light = useRef<THREE.PointLight>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Create random colors for each particle
  const colors = useMemo(() => {
    const tempColors = new Float32Array(count * 3); // RGB values for each particle
    for (let i = 0; i < count; i++) {
      tempColors[i * 3 + 0] = Math.random(); // Red
      tempColors[i * 3 + 1] = Math.random(); // Green
      tempColors[i * 3 + 2] = Math.random(); // Blue
    }
    return tempColors;
  }, [count]);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.005 + Math.random() * 0.01;
      const x = Math.random() * 100 - 50;
      const y = Math.random() * 100 - 50;
      const z = Math.random() * 100 - 50;

      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    particles.forEach((particle, index) => {
      let { factor, speed, x, y, z } = particle;
      const t = (particle.time += speed);

      dummy.position.set(
        x + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        y + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        z + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );

      const s = Math.cos(t);
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();

      mesh.current.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* Add a bright point light to create a glow effect */}
      <pointLight ref={light} distance={100} intensity={1000} color="dark blue" />
      <ambientLight intensity={0.2} />
      <instancedMesh ref={mesh} args={[new THREE.DodecahedronGeometry(0.2, 0), new THREE.MeshStandardMaterial({ color: 0xffffff }), count]}>
        <dodecahedronGeometry args={[0.2, 0]} />

        {/* Use a standard material for shininess and assign colors */}
        <meshStandardMaterial 
          vertexColors // Enables the use of custom colors for each particle
          emissive={'#949292'} // Adds a subtle glow
          metalness={0.5} // Adds a shiny, metallic surface
          roughness={1} // A bit more roughness for texture
        />

        {/* Attach colors to the geometry */}
        <bufferAttribute
          attach="attributes.color"
          array={colors}
          itemSize={3} // Each particle has 3 color values (R, G, B)
          count={count}
        />
      </instancedMesh>
    </>
  );
};

export default Spark;
