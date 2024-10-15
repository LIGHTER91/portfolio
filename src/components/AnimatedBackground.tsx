import { useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Extend Three.js objects to be used declaratively
extend({ PlaneGeometry: THREE.PlaneGeometry });

const AnimatedBackground = () => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const elapsedTime = clock.getElapsedTime();
      // Cast material to ShaderMaterial to access uniforms
      (ref.current.material as THREE.ShaderMaterial).uniforms.uTime.value = elapsedTime;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -9]}>
      {/* Use PlaneGeometry instead of PlaneBufferGeometry */}
      <planeGeometry args={[2, 30, 32, 32]} />
      <shaderMaterial
        uniforms={{
          uTime: { value: 0.0 },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    // Animate the wave based on time and UV coordinates
    float wave = sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5; // Offset to make it visible
    vec3 color = vec3(vUv.x, wave, 1.0 - vUv.x); // Vary colors based on wave and uv.x
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default AnimatedBackground;
