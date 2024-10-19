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
  const projects = [
    { title: 'Project 1', image: './portfolio/projects/test.png' },
    { title: 'Project 2', image: './portfolio/projects/r.jpeg' },
    { title: 'Project 3', image: './portfolio/projects/test.png' },
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
