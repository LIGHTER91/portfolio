import React from 'react';
import { useParams } from 'react-router-dom';

interface ProjectViewProps {
  projects: Array<{ title: string, image: HTMLVideoElement, sector: string, readMoreLink: string }>;
}

const ProjectView: React.FC<ProjectViewProps> = ({ projects }) => {
  const { id } = useParams<{ id: string }>();

  // Ensure that id is defined before trying to find the project
  if (!id) {
    return <div>Error: Project ID not found.</div>;
  }

  const project = projects.find((project) => project.readMoreLink.includes(id));

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div>
      <h1>{project.title}</h1>
      <p><strong>Sector:</strong> {project.sector}</p>
    </div>
  );
};

export default ProjectView;
