import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PlaneGeometry } from 'three'; // Import PlaneGeometry
import './DropDownMenu.css';

// Extend Three.js objects
extend({ PlaneGeometry });

interface DropdownMenuProps {
  className?: string;
  projects: { title: string; image: string | HTMLVideoElement }[];
}

const Plane: React.FC<{ texture: THREE.Texture }> = ({ texture }) => {
  return (
    <mesh>
      <planeGeometry attach="geometry" args={[15, 8]} />
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  );
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({ className, projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const textureRef = useRef<THREE.Texture | null>(null);
  const [targetDistance, setTargetDistance] = useState(5); // Cible pour la distance de la caméra
  const [cameraDistance, setCameraDistance] = useState(5); // Distance actuelle de la caméra
  const isMouseDown = useRef(false); // Pour suivre l'état du clic de souris

  useEffect(() => {
    const project = projects[currentIndex];
    const loader = new THREE.TextureLoader();

    if (typeof project.image === 'string') {
      loader.load(project.image, (loadedTexture) => {
        textureRef.current = loadedTexture;
      });
    } else {
      const videoTexture = new THREE.VideoTexture(project.image);
      textureRef.current = videoTexture;
    }
  }, [currentIndex, projects]);

  useEffect(() => {
    // Facteur de réduction de la sensibilité
    const scrollSensitivity = 20; // Augmente la valeur pour diminuer la sensibilité

    const handleScroll = (event: WheelEvent) => {
      const delta = event.deltaY / scrollSensitivity; // Réduction du deltaY

      if (delta > 0) {
        setCurrentIndex((prevIndex) =>
          prevIndex === projects.length - 1 ? 0 : prevIndex + 1
        );
      } else if (delta < 0) {
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? projects.length - 1 : prevIndex - 1
        );
      }
    };

    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, [projects.length]);

  // Gestion des événements de clic de souris pour ajuster la distance de la caméra
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0) { // Clic gauche
        isMouseDown.current = true;
        setTargetDistance(15); // La caméra s'éloigne lorsqu'on clique
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 0) { // Relâchement du clic gauche
        isMouseDown.current = false;
        setTargetDistance(5); // La caméra revient à sa position d'origine
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Composant de contrôle de la caméra avec animation
  const CameraController: React.FC = () => {
    const { camera } = useThree();

    useFrame(() => {
      // Interpolation progressive entre la distance actuelle et la distance cible
      setCameraDistance((prevDistance) => 
        THREE.MathUtils.lerp(prevDistance, targetDistance, 0.1) // '0.1' contrôle la vitesse de transition
      );
      camera.position.z = cameraDistance; // Mise à jour de la position de la caméra
    });

    return null;
  };

  return (
    <div className={`dropdown-menu ${className}`}>
      <Canvas>
        <CameraController />
        {textureRef.current && <Plane texture={textureRef.current} />}
      </Canvas>
    </div>
  );
};

export default DropdownMenu;
