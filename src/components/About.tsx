import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture,Text } from '@react-three/drei';
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

const InteractiveScene = ({onFranceClick}) => {
  const { raycaster, mouse, scene, camera } = useThree();
  const franceMeshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const handleMouseClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0 && intersects[0].object === franceMeshRef.current) {
        onFranceClick()
        console.log("clickerd")
      }
    };

    window.addEventListener('click', handleMouseClick);

    return () => {
      window.removeEventListener('click', handleMouseClick);
    };
  }, [raycaster, mouse, camera, scene,onFranceClick]);

  return (
    <group>
      <mesh ref={franceMeshRef} position={[-0.2, 2, -1]} scale={0.6}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color='green' transparent opacity={0} />
      </mesh>
    </group>
  );
};

const About = () => {
  const categories = [
    {
      name: "Data Science",
      skills: [
        { name: "Python", level: 4, description: "Utilisé pour le traitement et l'analyse de données." },
        { name: "Pandas", level: 4, description: "Utilisé dans des projets académiques de machine learning,prétraitement de données et gestion de base de données." },
        { name: "TensorFlow", level: 3, description: "Utilisé pour construire des modèles de machine learning." },
        { name: "PyTorch", level: 4, description: "Utilisé pour mes travaux dirigé et mes projets acadèmiques dans le domaine du deep learning." },
      ],
      
    },
    {
      name: "Learning Reinforcement",
      skills: [
        { name: "Python", level: 4, description: "Utilisé pour le traitement et l'analyse de données." },
        { name: "Deep LR", level: 3, description: "Utilisation dans projets sur des agents Qlearning,SARSA,MonteCarlo pour entraînement sur des environnements diverses." },
        { name: "Notion", level: 4, description: "Notion mathèmatiques des différents agents,formules ,environnements." },
      ],
      
    },
    {
      name: "Backend",
      skills: [
        { name: "Java", level: 4, description: "Utilisé pour développer des applications d'entreprise." },
        { name: "Spring Boot", level: 3, description: "Utilisé pour construire des microservices." },
        { name: "Python", level: 4, description: "Utilisé pour le développement d'applications et l'analyse de données." },
      ],
    },
    {
      name: "Frontend",
      skills: [
        { name: "HTML", level: 5, description: "Utilisé pour créer la structure des pages web." },
        { name: "CSS", level: 4, description: "Utilisé pour styliser les pages et rendre les sites responsives." },
        { name: "JavaScript", level: 3, description: "Utilisé pour ajouter de l'interactivité aux pages web." },
        { name: "React", level: 4, description: "Utilisé pour construire des interfaces utilisateur dynamiques." },
        { name: "Vuejs", level: 4, description: "Utilisé pour développer des applications web avec une approche progressive." },
      ],
    },
  ];
  

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [screenExpanded, setScreenExpanded] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const currentSkill = categories[currentCategoryIndex].skills[currentLevel];
  const handleFranceClick = () => {
    setScreenExpanded(true);
    setTimeout(() => setLoadingComplete(true), 3000);
  };
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
            <div className="skill-label">{skill.name}</div>
          
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
        <InteractiveScene  onFranceClick={handleFranceClick}/>
      </Canvas>
      <div className="drag-down-indicator">
        <span className="vertical-text">Clique sur la France</span>
      </div>
       <div className={`retro-container scanline-effect ${screenExpanded ? 'expanded' : ''}`} id="big">
      {loadingComplete ? (
        <>
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
          <div className="skill-info">
            <p className='skill-level'>Niveau de connaissance: {[...Array(5)].map((_, pointIndex) => (
              
              <div
                
                key={pointIndex}
                className={`skill-point ${pointIndex < currentSkill.level ? "green" : "blue-black"}`}
              />
            ))}</p>
            <p className='skill-infop'>Utilisations:<br/>{currentSkill.description}</p>
            
          </div>
        </div>
        </>
         ) : (!loadingComplete && (
          <div className="retro-container scanline-effect" id="loading-bar-container">
            <div id="loading-bar" />
          </div>
          
        ))}
      </div>
    </div>
  );
};

export default About;
