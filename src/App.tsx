import { useState, useEffect } from 'react';
import { HashRouter as Router, useLocation,Routes, Route } from 'react-router-dom';
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
  const [showMenu, setShowMenu] = useState(() => {
    const savedMenuState = sessionStorage.getItem('showMenu');
    return savedMenuState === 'true';
  });
  const [hideContent, setHideContent] = useState(() => {
    const savedContentState = sessionStorage.getItem('hideContent');
    return savedContentState === 'true';
  });

  const [isProjectViewRoute, setIsProjectViewRoute] = useState(false); // New state to track project view route

  const videoElement = document.createElement('video');
  videoElement.src = './portfolio/projects/archeovision/temple.mp4';
  videoElement.loop = true;
  videoElement.muted = true;

  const projects = [
    { title: 'Détection automatique de pigments par Segmentation Sémantique', image: videoElement, sector: 'Deep Learning', readMoreLink: '/portfolio/#/projects/archeovision' },
    { title: 'Prédiction des votes durant les élections présidentielles', image: "./portfolio/projects/test.png", sector: 'Machine Learning', readMoreLink: '/portfolio/1234' },
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
      sessionStorage.setItem('showMenu', 'true');
      const timer = setTimeout(() => {
        setHideContent(true);
        sessionStorage.setItem('hideContent', 'true');
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      sessionStorage.setItem('showMenu', 'false');
      setHideContent(false);
      sessionStorage.setItem('hideContent', 'false');
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
      <Header onClose={handleClose} showMenu={showMenu} isProjectViewRoute={isProjectViewRoute} />
      <RoutesWrapper 
        projects={projects} 
        onDragDown={handleDragDown} 
        showMenu={showMenu} 
        handleTransitionComplete={handleTransitionComplete} 
        hideContent={hideContent} 
        setIsProjectViewRoute={setIsProjectViewRoute} // Pass down the setter
      />
    </Router>
  );
};


interface RoutesWrapperProps {
  projects: Array<{ title: string, image: HTMLVideoElement|string, sector: string, readMoreLink: string }>;
  onDragDown: () => void;
  showMenu: boolean;
  handleTransitionComplete: () => void;
  hideContent: boolean;
  setIsProjectViewRoute: (value: boolean) => void; // New prop for setting project view route
}

const RoutesWrapper: React.FC<RoutesWrapperProps> = ({ projects, onDragDown, showMenu, handleTransitionComplete, hideContent, setIsProjectViewRoute }) => {
  const location = useLocation(); // Use useLocation here
  const [deactivate, setDeactivate] = useState(false);

  useEffect(() => {
    const isProjectView = location.pathname.startsWith('/projects');
    setIsProjectViewRoute(isProjectView); // Set the project view route status
    setDeactivate(isProjectView); // Deactivate DragDetector based on the route
  }, [location.pathname, setIsProjectViewRoute]);

  // Condition for not displaying Transition if on the /projects/:id route
  const isProjectViewRoute = location.pathname.startsWith('/projects/');

  return (
    <>
      {!isProjectViewRoute && (
        <Transition className={showMenu ? 'show' : ''} projects={projects} onTransitionComplete={handleTransitionComplete} />
      )}
      {!hideContent && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Work projects={projects} />} />
          <Route path="/projects/:id" element={<ProjectView projects={projects} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      )}
      {!deactivate && <DragDetector onDragDown={onDragDown} />}
    </>
  );
};

export default App;
