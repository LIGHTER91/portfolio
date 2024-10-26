import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import Spark from './Scene/Spark';
import Stars from './Scene/Star';
import './About.css';

interface BackgroundProps {
  image: string;
  opacity: number;
  animated?: boolean;
}

const Background = ({ image, opacity, animated = false }: BackgroundProps) => {
  const texture = useTexture(image) as THREE.Texture;
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (animated && materialRef.current) {
      materialRef.current.opacity = 0.4 + 0.3 * Math.sin(clock.elapsedTime);
    }
  });

  return (
    <mesh position={[0, -10, -100]} scale={[16, 10, 0.1]}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial ref={materialRef} map={texture} transparent opacity={opacity} />
    </mesh>
  );
};

const InteractiveScene = () => {
  const { raycaster, mouse, scene, camera } = useThree();
  const franceMeshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const handleMouseClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0 && intersects[0].object === franceMeshRef.current) {
        console.log('France clicked!');
      }
    };

    window.addEventListener('click', handleMouseClick);

    return () => {
      window.removeEventListener('click', handleMouseClick);
    };
  }, [raycaster, mouse, camera, scene]);

  return (
    <group>
    
      {/* Define the France region with a unique mesh */}
      <mesh ref={franceMeshRef} position={[-0.2, 1.5, -1]} scale={0.6}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color='green' transparent opacity={0} />
      </mesh>
    </group>
  );
};

const About = () => {
 

  // State for the custom cursor position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  const memoizedSpark = useMemo(() => <Spark />, []);
  const memoizedStars = useMemo(() => <Stars />, []);
  return (
    <div className="custom-cursor-container">
      <div
        className="custom-cursor"
        style={{
          transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0)`,
        }}
      />
      <Canvas className="canvas">
        <group>
          {memoizedSpark}
          {memoizedStars}
        </group>
        <Background image="./portfolio/about/background.jpg" opacity={0.5} />
        <Background image="./portfolio/about/overlay.png" opacity={0.95} animated />
        <InteractiveScene />
      </Canvas><div className="retro-container scanline-effect">
        <header>
            <h1></h1>
            <nav >
                <ul>
                    <li><a>PROFILE</a></li>
                </ul>
            </nav>
        </header>
        <main>
            <section id="screen-1">
                <article>
                    <header>
                        <h2>Lucien Lachaud</h2>
                    </header>
                    <div className="content">
                        Né à Bordeaux
                        <h2>Formation :</h2>
                        Licence Informatique 2020-2023<br/>
                        Master Informatique spec IA 2023-2025
                    </div>
                    <figure>
                 
                    </figure>
                </article>
            </section>
        </main>
        <footer>
            <p></p>
        </footer>
    </div>
    </div>
  );
};

export default About;
