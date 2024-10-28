import React, { useEffect, useState } from 'react';
import './Transition.css';
import DropdownMenu from './DropDownMenu';
import DropdownMenuMobile from './DropDownMenuMobile';
interface TransitionProps {
  className?: string;
  onTransitionComplete: () => void;
  projects: Array<{ title: string, image: HTMLVideoElement|string, sector: string, readMoreLink: string }>;
}

const Transition: React.FC<TransitionProps> = ({ className, onTransitionComplete ,projects}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [animateDropdown, setAnimateDropdown] = useState(false);
  const isMobileOrTablet = /Mobi|Tablet|Android|iPad|iPhone/.test(navigator.userAgent);

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
      {!isMobileOrTablet&&showDropdown && <DropdownMenu projects={projects} className={animateDropdown ? 'show' : ''} />}
      {isMobileOrTablet&&showDropdown && <DropdownMenuMobile projects={projects} className={animateDropdown ? 'show' : ''} />}
    </div>
  );
};

export default Transition;
