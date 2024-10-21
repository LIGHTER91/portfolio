import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PlaneGeometry } from 'three';
import Spark from '../Scene/Spark';
import Stars from '../Scene/Star';
import './DropDownMenu.css';

extend({ PlaneGeometry });

interface DropdownMenuProps {
  className?: string;
  projects: { title: string; image: string | HTMLVideoElement; sector?: string; description?: string; readMoreLink?: string }[];
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
  const [visible, setVisible] = useState(true);
  const textureRef = useRef<THREE.Texture | null>(null);
  const [targetDistance, setTargetDistance] = useState(5);
  const [cameraDistance, setCameraDistance] = useState(5);
  const isMouseDown = useRef(false);
  const startY = useRef(0);
  const offsetY = useRef(0); // Store the vertical offset for dragging
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // Track the hovered index
  const scrollPosition = useRef(0); // To save the scroll position on mouse up
  const [showSlider, setShowSlider] = useState(false); // Control the visibility of the slider

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
  
      // Ensure the video plays
      video.crossOrigin = 'anonymous'; // Set crossOrigin if the video is hosted externally
      video.muted = true; // Some browsers block autoplay if the video is not muted
      video.play().catch(error => {
        console.log("Error playing video:", error); // Catch errors from autoplay restrictions
      });
  
      textureRef.current = videoTexture;
    }
  }, [currentIndex, projects]);

  useEffect(() => {
    let accumulatedDelta = 0;

    const handleScroll = (event: WheelEvent) => {
      accumulatedDelta += event.deltaY;

      if (accumulatedDelta > 500) {
        setVisible(false); // Start fading out
        setTimeout(() => {
          setCurrentIndex((prevIndex) =>
            prevIndex === projects.length - 1 ? 0 : prevIndex + 1
          );
          setVisible(true); // Fade in the next project
        }, 500);
        accumulatedDelta = 0;
      } else if (accumulatedDelta < -500) {
        setVisible(false); // Start fading out
        setTimeout(() => {
          setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? projects.length - 1 : prevIndex - 1
          );
          setVisible(true); // Fade in the next project
        }, 500);
        accumulatedDelta = 0;
      }
    };

    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, [projects.length]);

  useEffect(() => {
    let holdTimer: NodeJS.Timeout | null = null; // Initialize to null for clarity
  
    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0) {
        isMouseDown.current = true;
        startY.current = event.clientY; // Store the starting position
        offsetY.current = 0; // Reset offset
  
        console.log("Mouse down detected, starting timer...");
  
        // Start a timer to check if the left button is held for more than 1 second
        holdTimer = setTimeout(() => {
          if (isMouseDown.current) {
            console.log("Held for more than 1 second, zooming out...");
            setTargetDistance(15); // Zoom out only if button is held for more than 1 second
          }
        }, 500); // 1 second delay
      }
    };
  
    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 0) {
        isMouseDown.current = false;
        if (holdTimer) {
          clearTimeout(holdTimer); // Clear the timer if mouse is released before 1 second
        }
        setTargetDistance(5);
  
        // Save scroll position when mouse is released
        const slider = document.querySelector('.titles-slider') as HTMLElement;
        if (slider) {
          scrollPosition.current = slider.scrollTop;
        }
  
        console.log("Mouse up detected, reset distance and cleared timer.");
      }
    };
  
    const mouseSensitivity = 0.07; // Adjust mouse sensitivity
  
    const handleMouseMove = (event: MouseEvent) => {
      if (isMouseDown.current) {
        const diffY = (event.clientY - startY.current) * mouseSensitivity; // Add sensitivity
        offsetY.current -= diffY; // Update the offset
  
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
        clearTimeout(holdTimer); // Clean up the timer when the component unmounts
      }
    };
  }, [showSlider]);
  
  

  useEffect(() => {
    if (showSlider) {
      const slider = document.querySelector('.titles-slider') as HTMLElement;
      if (slider) {
        slider.scrollTop = scrollPosition.current; // Restore saved scroll position
      }
    }
  }, [showSlider, projects.length]);

  const CameraController: React.FC = () => {
    const { camera } = useThree();

    useFrame(() => {
      setCameraDistance((prevDistance) =>
        THREE.MathUtils.lerp(prevDistance, targetDistance, 0.1)
      );
      camera.position.z = cameraDistance;
      setShowSlider(camera.position.z > 10); // Update showSlider based on camera position
    });

    return null;
  };

  const memoizedSpark = useMemo(() => <Spark />, []);
  const memoizedStars = useMemo(() => <Stars />, []);

  const currentProject = projects[currentIndex];

  return (
    <div className={`dropdown-menu ${className}`} style={{ position: 'relative' }}>
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
        <div
          className={`titles-slider ${showSlider ? 'show' : ''}`}
          style={{
            userSelect: 'none',
            position: 'absolute',
            top: '60%',
            left: '17%',
            transform: 'translateY(-50%)',
            height: '100%',
            width: '40%',
            overflowY: 'hidden',
            background: 'rgba(0, 0, 0, 0)',
            borderRadius: '10px',
            padding: '10px',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0)',
          }}
        >
          {projects.map((project, index) => (
            <div
              key={index}
              style={{
                margin: '250px 0',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '40px',
                color: (hoveredIndex === index || currentIndex === index) ? 'yellow' : 'white',
                background: (hoveredIndex === index || currentIndex === index) ? 'rgba(255, 255, 0, 0)' : 'transparent',
                borderRadius: '5px',
              }}
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
        <div className={`project-details ${visible ? 'show' : ''}`}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            textAlign: 'center',
            width: '60%',
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <h2>{currentProject.title}</h2>
          {currentProject.sector && <p><strong>Sector:</strong> {currentProject.sector}</p>}
          {currentProject.description && <p>{currentProject.description}</p>}
          {currentProject.readMoreLink && (
            <a href={currentProject.readMoreLink} target="_blank" rel="noopener noreferrer" style={{ color: 'yellow' }}>
              Read more
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
