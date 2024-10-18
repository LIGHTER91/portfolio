import React from 'react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { slide, scale } from './Anim'; // Ensure your animation definitions are correct
import styles from './Link.module.css';

interface LinkProps {
  data: {
    title: string;
    href: string;
    index: number;
  };
  isActive: boolean;
  setSelectedIndicator: (href: string) => void;
}

const LinkComponent: React.FC<LinkProps> = ({ data, isActive, setSelectedIndicator }) => {
  const { title, href, index } = data;

  return (
    <motion.div 
      className={styles.link} 
      onMouseEnter={() => setSelectedIndicator(href)} 
      custom={index} 
      variants={slide} 
      initial="initial" 
      animate="enter" 
      exit="exit"
    >
      <motion.div 
        variants={scale} 
        animate={isActive ? "open" : "closed"} 
        className={styles.indicator}
      />
      <RouterLink to={href}>{title}</RouterLink>
    </motion.div>
  );
};

export default LinkComponent;