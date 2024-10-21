import React, { useEffect, useState } from 'react';
import './Transition.css';
import DropdownMenu from './DropDownMenu';

interface TransitionProps {
  className?: string;
  onTransitionComplete: () => void;
}

const Transition: React.FC<TransitionProps> = ({ className, onTransitionComplete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [animateDropdown, setAnimateDropdown] = useState(false);
  const videoElement = document.createElement('video');
  videoElement.src = './portfolio/projects/temple.mp4';
  videoElement.loop = true;
  videoElement.muted = true; 
  const projects = [
    { title: 'Détection automatique de pigments par Segmentation Sémantique ', image: videoElement ,sector:'Deep Learning', description:''},
   
  ];
  useEffect(() => {
    if (className?.includes('show')) {
      // Affiche le Dropdown après un délai pour laisser le composant se rendre
      const timer = setTimeout(() => {
        setShowDropdown(true); // Montrer le DropdownMenu
      }, 100); // Attendre un peu avant d'afficher le Dropdown

      const animateTimer = setTimeout(() => {
        setAnimateDropdown(true); // Appliquer l'animation de translation
        onTransitionComplete();
      }, 250); // Synchroniser l'animation avec un délai court

      return () => {
        clearTimeout(timer);
        clearTimeout(animateTimer);
      };
    } else {
      setShowDropdown(false);
      setAnimateDropdown(false);
    }
  }, [className, onTransitionComplete]);

  return (
    <div className={`transition ${className}`}>
      <div className="transition-background" />
      {showDropdown && <DropdownMenu projects={projects} className={animateDropdown ? 'show' : ''} />}
    </div>
  );
};

export default Transition;
