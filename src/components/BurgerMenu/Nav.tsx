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
  onClose: () => void; // Fonction pour fermer le menu
  showMenu: boolean;
  isProjectViewRoute: boolean;
}

const Nav: React.FC<NavProps> = ({ onClose, showMenu, isProjectViewRoute }) => {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);

  const handleClick = (href: string) => {
    setSelectedIndicator(href);
    onClose(); // Fermer le menu au clic
  };

  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className={`${styles.menu} ${showMenu || isProjectViewRoute ? styles.activeMenu : ''}`}
    >
      <div className={styles.body}>
        <div className={styles.nav}>
          <div className={styles.header}>
            <p>Navigation</p>
          </div>
          {navItems.map((data, index) => (
            <Link
              key={index}
              data={{ ...data, index }}
              isActive={selectedIndicator === data.href}
              setSelectedIndicator={setSelectedIndicator}
              onClick={() => handleClick(data.href)} // Gérer le clic sur chaque lien
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
