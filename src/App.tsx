import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
  const [isProjectViewRoute, setIsProjectViewRoute] = useState(false);
  const videoElement = document.createElement('video');
  videoElement.src = './portfolio/projects/archeovision/temple.mp4';
  videoElement.loop = true;
  videoElement.muted = true;

  const projects = [
    { title: 'Détection automatique de pigments par Segmentation Sémantique', image: videoElement, sector: 'Deep Learning', readMoreLink: '/portfolio/#/projects/archeovision' },
    { title: 'Prédiction des votes durant les élections présidentielles', image: "./portfolio/projects/test.png", sector: 'Machine Learning', readMoreLink: '/portfolio/#/projects/election' },
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
      <Header onClose={handleClose} showMenu={showMenu} isProjectViewRoute={isProjectViewRoute}/>
      <RoutesWrapper projects={projects} onDragDown={handleDragDown} showMenu={showMenu} handleTransitionComplete={handleTransitionComplete} hideContent={hideContent} setIsProjectViewRoute={setIsProjectViewRoute}/>
    </Router>
  );
};

interface RoutesWrapperProps {
  projects: Array<{ title: string, image: HTMLVideoElement|string, sector: string, readMoreLink: string }>;
  onDragDown: () => void;
  showMenu: boolean;
  handleTransitionComplete: () => void;
  hideContent: boolean;
  setIsProjectViewRoute:(x:boolean) => void;
}

const RoutesWrapper: React.FC<RoutesWrapperProps> = ({ projects, onDragDown, showMenu, handleTransitionComplete, hideContent,setIsProjectViewRoute }) => {
  const location = useLocation(); // Utilisez useLocation ici
  const [deactivate, setDeactivate] = useState(false);

  useEffect(() => {
    // Désactive DragDetector lorsque sur la route Work ou sur une route ProjectView spécifique
    if (location.pathname.startsWith('/projects') ) {
      setDeactivate(true);
      setIsProjectViewRoute(true);
      console.log("DragDetector deactivated");
    } else {
      setDeactivate(false);
      setIsProjectViewRoute(false)
      console.log(location.pathname);
    }
    if (location.pathname.startsWith('/about')||location.pathname.startsWith('/contact'))  {
      setDeactivate(true);
      setIsProjectViewRoute(false);
      console.log("DragDetector deactivated");
    }
  }, [location.pathname, setIsProjectViewRoute]);

  // Condition pour ne pas afficher Transition si on est sur la route /projects/:id

    const isProjectViewRoute = location.pathname.startsWith('/projects/') ;
    // Update the state correctly
   

  return (
    <>
      {/* Affiche Transition seulement si on n'est PAS sur la route ProjectView */}
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
      {hideContent && isProjectViewRoute&&(
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
