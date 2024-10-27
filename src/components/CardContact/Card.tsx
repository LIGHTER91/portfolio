import React, { useState } from 'react';
import './Card.css'; // Import du CSS pour le style

interface CardProps {
  name: string;
  link: string;
  className?: string; 
  id:string;// Permet des classes supplémentaires
}

const Card: React.FC<CardProps> = ({ name, link, className ,id}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    // Délai pour la redirection après l'animation
    setTimeout(() => {
      // Si le lien est un email, l'ouvre avec mailto:
      if (link.startsWith('mailto:')) {
        window.location.href = link;
      } else {
        // Redirige vers le lien dans un nouvel onglet pour les autres URL
        window.open(link, '_blank');
      }
    }, 300); // Durée de l'animation
  };

  return (
    <div 
      className={`card ${className} ${isAnimating ? 'animate' : ''}`} 
      onClick={handleClick}
      id={id}
    >
      <h2 className="card-title">{name}</h2>
    </div>
  );
};

export default Card;
