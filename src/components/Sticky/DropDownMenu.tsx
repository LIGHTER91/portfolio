import React from 'react';
import './DropDownMenu.css';
import Project from './Project'; // Assurez-vous que le chemin d'importation est correct

interface DropdownMenuProps {
  className?: string; // Accepte une propriété className
  projects: { title: string; image: string }[]; // Liste des projets avec titre et image
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ className, projects }) => {
  return (
    <div className={`dropdown-menu ${className}`}>
      <div className="dropdown-background" />
      <div className="dropdown-content">
        {projects.map((project, index) => (
          <Project key={index} title={project.title} image={project.image} />
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;
