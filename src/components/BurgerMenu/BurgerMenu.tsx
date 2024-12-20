import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Nav from './Nav'; // Ensure you have this Nav component
import styles from './BurgerMenu.module.css'; // Adjust the path as needed

interface HeaderProps {
  onClose: () => void;
  isProjectViewRoute:boolean
  showMenu:boolean // Function to close the menu passed from App.tsx
}

const Header: React.FC<HeaderProps> = ({ onClose,isProjectViewRoute ,showMenu}) => {
  const [isActive, setIsActive] = useState(false);

  const handleMenuToggle = () => {
    setIsActive(!isActive);
    
  };
  const onClose_MenuToggle= () =>{
    setIsActive(false);
    onClose();
  };

  return (
    <>
      <div onClick={handleMenuToggle} className={styles.button}>
        <div className={`${styles.burger} ${isActive ? styles.burgerActive : ''}`}></div>
      </div>

      <AnimatePresence mode="wait">
        {isActive && (
          <Nav onClose={onClose_MenuToggle} showMenu={showMenu} isProjectViewRoute={isProjectViewRoute}/> 
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
