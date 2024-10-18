import  { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components
import Header from './components/BurgerMenu/BurgerMenu';
import Home from './components/Home';
import Work from './components/Work';
import About from './components/About';
import Contact from './components/Contact';
import DragDetector from './components/Sticky/DragDetector';
import Transition from './components/Sticky/Transition'; // Import Transition component

const App = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [hideContent, setHideContent] = useState(false);

  const handleDragDown = () => {
    setShowMenu(true); // Show the transition component
  };

  const handleTransitionComplete = () => {
    // This function can be used if you need to handle anything after the transition
  };

  useEffect(() => {
    if (showMenu) {
      const timer = setTimeout(() => {
        setHideContent(true); // Hide content after the transition appears
      }, 1000); // Adjust based on the animation duration

      return () => clearTimeout(timer);
    } else {
      setHideContent(false);
    }
  }, [showMenu]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showMenu) {
          setShowMenu(false);
          setHideContent(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMenu]);

  return (
    <Router>
      <Header />
      <Transition className={showMenu ? 'show' : ''} onTransitionComplete={handleTransitionComplete} />
      {!hideContent && (
        <Routes>
          <Route path="/portfolio" element={<Home />} />
          <Route path="portfolio/work" element={<Work />} />
          <Route path="portfolio/about" element={<About />} />
          <Route path="portfolio/contact" element={<Contact />} />
        </Routes>
      )}
      <DragDetector onDragDown={handleDragDown} />
    </Router>
  );
};

export default App;
