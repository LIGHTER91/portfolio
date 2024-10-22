import React from 'react';
import './ProjectView.css'; // Make sure to import your CSS

interface ProjectViewProps {
  project: {
    title: string;
    image: string | HTMLVideoElement;
    sector?: string;
    description?: string;
    readMoreLink?: string;
  };
  onClose: () => void;
}

const ProjectView: React.FC<ProjectViewProps> = ({ project, onClose }) => {
  return (
    <div className={`project-view-container ${project ? 'show' : ''}`}>
      <div className="project-view">
        <h2>{project.title}</h2>
        {project.sector && <p><strong>Secteur:</strong> {project.sector}</p>}
        <p>{project.description}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ProjectView;
