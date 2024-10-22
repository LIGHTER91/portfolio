import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PlaneGeometry } from 'three';
import Spark from '../Scene/Spark';
import Stars from '../Scene/Star';
import './DropDownMenu.css';
import CustomCursor from './CustomCursor';
import { Link } from 'react-router-dom';

extend({ PlaneGeometry });

interface DropdownMenuProps {
  className?: string;
  projects: {
    title: string;
    image: string | HTMLVideoElement;
    sector?: string;
    description?: string;
    readMoreLink?: string;
  }[];
}

const Plane: React.FC<{ texture: THREE.Texture }> = ({ texture }) => (
  <mesh>
    <planeGeometry attach="geometry" args={[15, 8]} />
    <meshBasicMaterial attach="material" map={texture} />
  </mesh>
);

const DropdownMenu: React.FC<DropdownMenuProps> = ({ className = '', projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const textureRef = useRef<THREE.Texture | null>(null);
  const [targetDistance, setTargetDistance] = useState(5);
  const [cameraDistance, setCameraDistance] = useState(5);
  const isMouseDown = useRef(false);
  const startY = useRef(0);
  const offsetY = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollPosition = useRef(0);
  const [showSlider, setShowSlider] = useState(false);


  useEffect(() => {
    const project = projects[currentIndex];
    const loader = new THREE.TextureLoader();

    if (typeof project.image === 'string') {
      loader.load(project.image, (loadedTexture) => {
        textureRef.current = loadedTexture;
      });
    } else {
      const video = project.image as HTMLVideoElement;
      const videoTexture = new THREE.VideoTexture(video);
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.play().catch((error) => console.log("Error playing video:", error));
      textureRef.current = videoTexture;
    }
  }, [currentIndex, projects]);

  useEffect(() => {
    let accumulatedDelta = 0;

    const handleScroll = (event: WheelEvent) => {
       return; // Return early if the project view is open
      accumulatedDelta += event.deltaY;

      if (accumulatedDelta > 500) {
        setVisible(false);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex === projects.length - 1 ? 0 : prevIndex + 1));
          setVisible(true);
        }, 500);
        accumulatedDelta = 0;
      } else if (accumulatedDelta < -500) {
        setVisible(false);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex === 0 ? projects.length - 1 : prevIndex - 1));
          setVisible(true);
        }, 500);
        accumulatedDelta = 0;
      }
    };

    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, [projects.length]); 

  useEffect(() => {
    let holdTimer: NodeJS.Timeout | null = null;

    const handleMouseDown = (event: MouseEvent) => {
     // Return early if the project view is open
      if (event.button === 0) {
        isMouseDown.current = true;
        startY.current = event.clientY;
        offsetY.current = 0;

        holdTimer = setTimeout(() => {
          if (isMouseDown.current) {
            setTargetDistance(15);
          }
        }, 500);
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
     // Return early if the project view is open
      if (event.button === 0) {
        isMouseDown.current = false;
        if (holdTimer) {
          clearTimeout(holdTimer);
        }
        setTargetDistance(5);

        const slider = document.querySelector('.titles-slider') as HTMLElement;
        if (slider) {
          scrollPosition.current = slider.scrollTop;
        }
      }
    };

    const mouseSensitivity = 0.07;

    const handleMouseMove = (event: MouseEvent) => {

      if (isMouseDown.current) {
        const diffY = (event.clientY - startY.current) * mouseSensitivity;
        offsetY.current -= diffY;

        const slider = document.querySelector('.titles-slider') as HTMLElement;
        if (slider) {
          const maxScrollTop = slider.scrollHeight - slider.clientHeight;
          const newScrollTop = Math.min(maxScrollTop, Math.max(0, slider.scrollTop - offsetY.current));
          slider.scrollTop = newScrollTop;
        }

        startY.current = event.clientY;
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      if (holdTimer) {
        clearTimeout(holdTimer);
      }
    };
  }, []); 

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

  useEffect(() => {
    if (showSlider) {
      const slider = document.querySelector('.titles-slider') as HTMLElement;
      if (slider) {
        slider.scrollTop = scrollPosition.current;
      }
    }
  }, [showSlider, projects.length]);

  const CameraController: React.FC = () => {
    const { camera } = useThree();

    useFrame(() => {
      setCameraDistance((prevDistance) => THREE.MathUtils.lerp(prevDistance, targetDistance, 0.1));
      camera.position.z = cameraDistance;
      setShowSlider(camera.position.z > 10);
    });

    return null;
  };

  const memoizedSpark = useMemo(() => <Spark />, []);
  const memoizedStars = useMemo(() => <Stars />, []);
  const currentProject = projects[currentIndex];

  return (
      <div className={`dropdown-menu ${className}`}>
        <Canvas>
          {showSlider && (
            <group>
              {memoizedSpark}
              {memoizedStars}
            </group>
          )}
          <CameraController />
          {textureRef.current && <Plane texture={textureRef.current} />}
        </Canvas>

        {showSlider && (
          <div className={`titles-slider ${showSlider ? 'show' : ''}`}>
            {projects.map((project, index) => (
              <div
                key={index}
                className={`project-title ${hoveredIndex === index || currentIndex === index ? 'hovered' : ''}`}
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  setCurrentIndex(index);
                }}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {project.title}
              </div>
            ))}
          </div>
        )}

        {!showSlider && (
          <div className={`project-details ${visible ? 'show' : ''}`}>
            <div className="project-details-div">
              <h2 className="project-details-h2">{currentProject.title}</h2>
              {currentProject.sector && <p className='p-p'><strong>Secteur:</strong> {currentProject.sector}</p>}
              {currentProject.description && <p className='description'>{currentProject.description}</p>}
              {currentProject.readMoreLink && (
              <Link to={currentProject.readMoreLink}>
                Read more
              </Link>
            )}
            </div>
          </div>
        )}
        <CustomCursor x={mousePosition.x} y={mousePosition.y} />
      </div>
  
  );
};

export default DropdownMenu;
