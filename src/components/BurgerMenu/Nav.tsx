import React, { useState } from 'react';
import styles from './Nav.module.css';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { menuSlide } from './Anim';
import Link from './Link';
import Curve from './Curve';

const navItems = [
  { title: "INTRO", href: "/" },
  { title: "PROJECTS", href: "/projects" },
  { title: "ABOUT", href: "/about" },
  { title: "CONTACT", href: "/contact" },
];

interface NavProps {
  onClose: () => void; // Function to close the menu
}

const Nav: React.FC<NavProps> = ({ onClose }) => {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);

  const handleClick = (href: string) => {
    setSelectedIndicator(href);
    
    // Close the menu when any link is clicked
    onClose(); 
    
    // You can add any additional logic here if needed
  };

  return (
    <motion.div 
      variants={menuSlide} 
      initial="initial" 
      animate="enter" 
      exit="exit" 
      className={styles.menu}
    >
      <div className={styles.body}>
        <div className={styles.nav}>
          <div className={styles.header}>
            <p>PROJECT</p>
          </div>
          {navItems.map((data, index) => (
            <Link 
              key={index} 
              data={{ ...data, index }} 
              isActive={selectedIndicator === data.href} 
              setSelectedIndicator={setSelectedIndicator} 
              onClick={() => handleClick(data.href)} // Handle click for each link
            />
          ))}
        </div>
        <div className={styles.footer}>
          <a href="https://www.linkedin.com/in/lucien-lachaud-330273257/">LinkedIn</a>
        </div>
      </div>
      <Curve />
    </motion.div>
  );
};

export default Nav;
