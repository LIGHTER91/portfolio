import React, { useState } from 'react';
import styles from './Nav.module.css';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { menuSlide } from './Anim';
import Link from './Link';
import Curve from './Curve';

const navItems = [
  { title: "Home", href: "/portfolio/" },
  { title: "Work", href: "portfolio/work" },
  { title: "About", href: "portfolio/about" },
  { title: "Contact", href: "portfolio/contact" },
];

interface NavProps {
  onClose: () => void; // Fonction pour fermer le menu
}

const Nav: React.FC<NavProps> = () => {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);

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
              setSelectedIndicator={(href) => {
                setSelectedIndicator(href);
              }}
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
