// Stars.tsx
import React from 'react';
import { Points } from '@react-three/drei';

const Stars: React.FC = () => {
  const starsCount = 5000; // Nombre d'étoiles
  const positions = new Float32Array(starsCount * 3); // Créer un tableau pour les positions des étoiles

  // Remplir le tableau avec des positions aléatoires
  for (let i = 0; i < starsCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100; // Position X
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100; // Position Y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100; // Position Z
  }

  return (
    <Points positions={positions}>
      <pointsMaterial size={0.05} color="white" />
    </Points>
  );
};

export default Stars;
