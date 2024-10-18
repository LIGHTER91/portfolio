import React from 'react';

interface ProjectProps {
  title: string;
  image: string;
}

const Project: React.FC<ProjectProps> = ({ title, image }) => {
  return (
    <div className="project">
      <img src={image} alt={title} className="project-image" />
      <h3 className="project-title">{title}</h3>
    </div>
  );
};

export default Project;
