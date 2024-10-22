import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

import Header from './components/BurgerMenu/BurgerMenu';
import Home from './components/Home';
import Work from './components/Work';
import About from './components/About';
import Contact from './components/Contact';
import ProjectView from './components/ProjectView'; // Import ProjectView component
import DragDetector from './components/Sticky/DragDetector';
import Transition from './components/Sticky/Transition';

const App = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [hideContent, setHideContent] = useState(false);

  const videoElement = document.createElement('video');
  videoElement.src = './portfolio/projects/temple.mp4';
  videoElement.loop = true;
  videoElement.muted = true;

  const projects = [
    { title: 'Détection automatique de pigments par Segmentation Sémantique', image: videoElement, sector: 'Deep Learning', readMoreLink: '/portfolio/44c3a' },
    { title: 'Autre Projet', image: videoElement, sector: 'AI', readMoreLink: '/portfolio/1234' },
  ];

  const handleDragDown = () => {
    setShowMenu(true);
  };

  const handleTransitionComplete = () => {
    // Handle any action after transition completes
  };

  const handleClose = () => {
    setShowMenu(false);
  };

  useEffect(() => {
    if (showMenu) {
      const timer = setTimeout(() => {
        setHideContent(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setHideContent(false);
    }
  }, [showMenu]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose(); // Close the menu when Escape is pressed
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMenu]);

  return (
    <Router>
      <Header onClose={handleClose} />
      <Transition className={showMenu ? 'show' : ''} projects={projects} onTransitionComplete={handleTransitionComplete} />
      {!hideContent && (
        <RoutesWrapper projects={projects} onDragDown={handleDragDown} />
      )}
    </Router>
  );
};

interface RoutesWrapperProps {
  projects: Array<{ title: string, image: HTMLVideoElement, sector: string, readMoreLink: string }>;
  onDragDown: () => void;
}

const RoutesWrapper: React.FC<RoutesWrapperProps> = ({ projects, onDragDown }) => {
  const location = useLocation();
  const [deactivate, setDeactivate] = useState(false);

  useEffect(() => {
    // Disable DragDetector when on the Work or specific ProjectView component
    if (location.pathname.startsWith('/portfolio/projects')||(location.pathname === '/portfolio/44c3a')) {
      setDeactivate(true);
      console.log("DragDetector deactivated");
    } else {
      setDeactivate(false);
    }
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/portfolio" element={<Home />} />
        <Route path="/portfolio/projects" element={<Work projects={projects} />} />
        <Route path="/portfolio/44c3a" element={<ProjectView projects={projects}  />} />
        <Route path="/portfolio/about" element={<About />} />
        <Route path="/portfolio/contact" element={<Contact />} />
      </Routes>
      {!deactivate && <DragDetector onDragDown={onDragDown} />}
    </>
  );
};

export default App;
