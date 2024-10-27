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
      <mesh ref={franceMeshRef} position={[-0.2, 1.5, -1]} scale={0.6}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color='green' transparent opacity={0} />
      </mesh>
    </group>
  );
};

const About = () => {
  const categories = [
    { name: "Frontend", skills: ["HTML", "CSS", "JavaScript", "React","Vuejs"] },
    { name: "Backend", skills: ["Java", "Spring boot", "Python"] },
    { name: "Data Science", skills: ["Python", "Pandas", "TensorFlow", "PyTorch"] },
  ];

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleDPadClick = (direction: string) => {
    if (direction === "up") {
      setCurrentLevel((prevLevel) => Math.max(prevLevel - 1, 0));
    } else if (direction === "down") {
      setCurrentLevel((prevLevel) => Math.min(prevLevel + 1, categories[currentCategoryIndex].skills.length - 1));
    } else if (direction === "left") {
      setCurrentCategoryIndex((prevIndex) => (prevIndex === 0 ? categories.length - 1 : prevIndex - 1));
      setCurrentLevel(0);
    } else if (direction === "right") {
      setCurrentCategoryIndex((prevIndex) => (prevIndex + 1) % categories.length);
      setCurrentLevel(0);
    }
  };

  const SkillCubes = () => {
    const skillLevel = categories[currentCategoryIndex].skills;

    return (
      <div className="skill-cube-container">
        {skillLevel.map((skill, index) => (
          <div
            key={index}
            className={`skill-cube ${index === currentLevel ? "active-skill" : ""}`}
          >
            <div className="skill-label">{skill}</div>
          </div>
        ))}
      </div>
    );
  };

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
      </Canvas>
      <div className="retro-container scanline-effect" id='big'>
        <div className="retro-container scanline-effect" id='nav_retro'>
          <header>
            <h1></h1>
            <nav>
              <ul>
                <li><a>PROFILE</a></li>
              </ul>
              <ul>
                <li><a>COMPETENCES</a></li>
              </ul>
            </nav>
            
          </header>
        </div>
        <div className="retro-container scanline-effect" id='window1'>
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
              </article>
            </section>
          </main>
          <footer>
            <p></p>
          </footer>
        </div>
        <div className="retro-container scanline-effect" id='window2'>
          <div className="dpad">
            <button className="dpad-btn" id="up" onClick={() => handleDPadClick("left")}>▲</button>
            <button className="dpad-btn" id="left" onClick={() => handleDPadClick("up")}>◄</button>
            <button className="dpad-btn" id="right" onClick={() => handleDPadClick("down")}>►</button>
            <button className="dpad-btn" id="down" onClick={() => handleDPadClick("right")}>▼</button>
          </div>
        </div>
        <div className="retro-container scanline-effect" id='screen_skills'>
          <h2>{categories[currentCategoryIndex].name}</h2>
          <SkillCubes />
        </div>
      </div>
    </div>
  );
};

export default About;
