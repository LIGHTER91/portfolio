import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/BurgerMenu/BurgerMenu';
import Home from './components/Home';
import Work from './components/Work';
import About from './components/About';
import Contact from './components/Contact';
import DragDetector from './components/Sticky/DragDetector';
import Transition from './components/Sticky/Transition';

const App = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [hideContent, setHideContent] = useState(false);

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
        console.log("hidecontent")
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
      <Header onClose={handleClose}/>
      <Transition className={showMenu ? 'show' : ''} onTransitionComplete={handleTransitionComplete} />
      {!hideContent && (
        <Routes>
          <Route path="/portfolio" element={<Home />} />
          <Route path="portfolio/work" element={<Work />} />
          <Route path="portfolio/about" element={<About />} />
          <Route path="portfolio/contact" element={<Contact />} />
        </Routes>
      )}
      {!hideContent &&(<DragDetector onDragDown={handleDragDown} />)}
    </Router>
  );
};

export default App;
