import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Nav from './Nav'; // Ensure you have this Nav component
import styles from './BurgerMenu.module.css'; // Adjust the path as needed

const Header: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  // Function to close the navigation menu
  const handleClose = () => {
    setIsActive(false);
  };

  return (
    <>
      <div onClick={() => setIsActive(!isActive)} className={styles.button}>
        <div className={`${styles.burger} ${isActive ? styles.burgerActive : ''}`}></div>
      </div>

      <AnimatePresence mode="wait">
        {isActive && (
          <Nav onClose={handleClose} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
