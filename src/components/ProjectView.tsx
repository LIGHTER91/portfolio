import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useParams } from 'react-router-dom'; // Import useParams
import './ProjectView.css';

interface Project {
  title: string;
  image: string | HTMLVideoElement;
  sector?: string;
  description?: string;
  readMoreLink?: string;
}

interface ProjectViewProps {
    projects: Array<{ title: string, image: HTMLVideoElement|string, sector: string, readMoreLink: string }>;
}

const Plane: React.FC<{ texture: THREE.Texture }> = ({ texture }) => (
  <mesh>
    <planeGeometry args={[16, 8]} />
    <meshBasicMaterial map={texture} />
  </mesh>
);

const ProjectView: React.FC<ProjectViewProps> = ({ projects }) => {
  const textureRef = useRef<THREE.Texture | null>(null);
  const { projectId } = useParams<{ projectId: string }>(); // Get projectId from URL
  const [currentProject, setCurrentProject] = useState<Project>(projects[0]);
  
  useEffect(() => {
    const project = projects.find((p) => p.readMoreLink?.includes(projectId as string)) || projects[0];
    setCurrentProject(project);

    const loader = new THREE.TextureLoader();

    if (typeof project.image === 'string') {
      loader.load(project.image, (loadedTexture) => {
        textureRef.current = loadedTexture;
      });
    } else {
      const videoElement = document.createElement('video');
      videoElement.src = './portfolio/projects/archeovision/temple.mp4';
      videoElement.loop = true;
      videoElement.muted = true;
      const video = videoElement as HTMLVideoElement;
      const videoTexture = new THREE.VideoTexture(video);
      video.crossOrigin = 'anonymous';
      video.muted = true;

      video.play().catch((error) => console.log("Error playing video:", error));
      textureRef.current = videoTexture;
    }
  }, [projects, projectId]); // Depend on projectId

  return (
    <React.Fragment>
      <div className="project-view-container">
        <Canvas>
          {textureRef.current && <Plane texture={textureRef.current} />}
        </Canvas>
        <div className={`project-details ${ 'show' }`}>
          <div className="project-details-div">
            <h2 className="project-details-h2">{currentProject.title}</h2>
            {currentProject.sector && (
              <p className="p-p">
                <strong>Secteur:</strong> {currentProject.sector}
              </p>
            )}
            {currentProject.description && <p className="description">{currentProject.description}</p>}
          </div>
        </div>
      </div>
      <div className="additional-text">
        <h3>Contexte et Objectif</h3>
        <p>
        Le projet a été développé dans un contexte archéologique
         pour la détection de pigments invisibles à l'œil nu sur des blocs de pierres historiques. 
         Ces pigments, découverts grâce à des techniques de numérisation avancées, 
         fournissent des informations cruciales pour la reconstitution du temple d’Apollon à Delphes. 
         Mon objectif était de développer un modèle de segmentation d’image permettant de détecter ces pigments avec une haute précision, 
         tout en réduisant le nombre de faux positifs liés à la présence d’éléments parasites tels que les lichens et la pollution.
        </p>
        <h3>Analyse et Approche</h3>
        <p>
        Dans l'approche initiale, plusieurs modèles d'apprentissage automatique ont été envisagés, 
        notamment les architectures de réseaux neuronaux U-Net, Mask R-CNN, 
        et DeepLab. Chacun de ces modèles a été testé et comparé pour leur capacité à 
        identifier de petites traces de pigments dans des images complexes. 
        Ce processus d'évaluation m'a permis de mieux comprendre les performances et les limitations de chaque modèle, 
        et de choisir la meilleure solution adaptée au projet.
        </p>
      </div>
    </React.Fragment>
  );
};

export default ProjectView;
