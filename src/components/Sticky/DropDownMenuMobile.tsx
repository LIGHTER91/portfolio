import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PlaneGeometry } from 'three';
import Spark from '../Scene/Spark';
import Stars from '../Scene/Star';
import './DropDownMenu.css';
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
    <planeGeometry attach="geometry" args={[16, 8]} />
    <meshBasicMaterial attach="material" map={texture} />
  </mesh>
);

const DropdownMenu: React.FC<DropdownMenuProps> = ({ className = '', projects }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const savedIndex = sessionStorage.getItem('currentIndex');
    return savedIndex ? Number(savedIndex) : 0;
  });
  const [visible, setVisible] = useState(true);
  const textureRef = useRef<THREE.Texture | null>(null);
  const [targetDistance, setTargetDistance] = useState(5);
  const [cameraDistance, setCameraDistance] = useState(5);
  const isMouseDown = useRef(false);
  const startY = useRef(0);
  const offsetY = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollPosition = useRef<number>(sessionStorage.getItem('scrollPosition') ? Number(sessionStorage.getItem('scrollPosition')) : 0);
  const [showSlider, setShowSlider] = useState(false);
  
  const doubleTapDelay = 300; // Time in ms to recognize double tap
  const lastTap = useRef<number>(0);
  const loadTexture = (index: number) => {
    const project = projects[index];
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
  };
  
  // Persist currentIndex to localStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('currentIndex', currentIndex.toString());
  }, [currentIndex]);

  // Texture loading logic
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

  // Scroll handling logic
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

  // Mouse handling logic
  useEffect(() => {
    let holdTimer: NodeJS.Timeout | null = null;

    const handleMouseDown = (event: MouseEvent) => {
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
      if (event.button === 0) {
        isMouseDown.current = false;
        if (holdTimer) {
          clearTimeout(holdTimer);
        }
        setTargetDistance(5);

        const slider = document.querySelector('.titles-slider') as HTMLElement;
        if (slider) {
          scrollPosition.current = slider.scrollTop;
          sessionStorage.setItem('scrollPosition', slider.scrollTop.toString());
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

  // Scroll position handling for titles slider
  useEffect(() => {
    if (showSlider) {
      const slider = document.querySelector('.titles-slider') as HTMLElement;
      if (slider) {
        slider.scrollTop = scrollPosition.current;
      }
    }
  }, [showSlider, projects.length]);

  // Camera controller logic
  const CameraController: React.FC = () => {
    const { camera } = useThree();

    useFrame(() => {
      setCameraDistance((prevDistance) => THREE.MathUtils.lerp(prevDistance, targetDistance, 0.1));
      camera.position.z = cameraDistance;
     
    });

    return null;
  };

  const memoizedSpark = useMemo(() => <Spark />, []);
  const memoizedStars = useMemo(() => <Stars />, []);
  const currentProject = projects[currentIndex];

  // Double-tap handling logic
  const handleDoubleTap = () => {
    setShowSlider((prev) => !prev);
  };

  const handleTouchStart = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTap.current;

    if (timeSinceLastTap < doubleTapDelay) {
      handleDoubleTap();
    }
    lastTap.current = now;
  };

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart);
    return () => window.removeEventListener('touchstart', handleTouchStart);
  }, []);

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
        <div className='doubletap'>Double Tap To Switch Project</div>
      {showSlider && (
        <div className={`titles-slider ${showSlider ? 'show' : ''}`}>
          {projects.map((project, index) => (
            <div
              key={index}
              className={`project-title ${hoveredIndex === index || currentIndex === index ? 'hovered' : ''}`}
              onMouseEnter={() => {
                setHoveredIndex(index);
                setCurrentIndex(index);
                loadTexture(index);
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
            <h2 className="project-details-h2">
              {currentProject.title}
            </h2>
            {currentProject.sector && <p className="p-p"><strong>Secteur:</strong> {currentProject.sector}</p>}
            {currentProject.description && <p className="description">{currentProject.description}</p>}
            {currentProject.readMoreLink && (
              <Link to={currentProject.readMoreLink} onClick={(e) => {
                e.preventDefault();
                if (currentProject.readMoreLink) {
                  window.location.href = currentProject.readMoreLink;
                  window.location.reload();
                }
              }}>
                Read more
              </Link>
            )}
          </div>
          <div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
