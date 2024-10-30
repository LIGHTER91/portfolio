import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams
import './ProjectView.css';

interface Project {
  title: string;
  image: string | HTMLVideoElement;
  sector?: string;
  description?: string;
  readMoreLink?: string;
}

interface ProjectViewProps {
    projects: Array<{ title: string, image: HTMLVideoElement | string, sector: string, readMoreLink: string }>;
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
  const navigate = useNavigate();
  const [buttonOpacity, setButtonOpacity] = useState(1);

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

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  useEffect(() => {
    console.log('Setting up scroll listener');
  
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const newOpacity = Math.max(0, 1 - scrollTop / 200); // Change 200 to adjust the fade speed
      setButtonOpacity(newOpacity); // Update opacity based on scroll position
      console.log('Scroll position:', scrollTop); // Log scroll position
    };
  
    window.addEventListener('scroll', handleScroll, true);
  
    return () => {
      console.log('Cleaning up scroll listener');
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);
  
  
 
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
        {buttonOpacity > 0 && (
  <div
    className="back-button-container"
    onClick={handleBackClick}
    style={{ opacity: buttonOpacity, transition: 'opacity 0.5s ease' }} // Smooth transition
  >
    <div className="semi-circle">
      <div className="cross">+</div>
    </div>
  </div>
)}
      </div>
      <div className="content-sections">
        
     
            <img className="imagep" src="./portfolio/projects/archeovision/unet_architecture.png" alt="Context Image 1"  aria-description='Unet Model'/>
            <div className="container">
            <p id='firstpart' >
            Ce projet a pour objectif de développer une méthode de détection automatique de pigments imperceptibles à l’œil nu, présente dans des sites historiques comme le Temple d’Apollon à Delphes. Grâce aux avancées en segmentation d'image et aux modèles d'apprentissage profond, notre équipe a conçu une approche robuste pour identifier avec précision les traces de pigments tout en réduisant les faux positifs, causés par des éléments perturbateurs comme des lichens et des moisissures.
            </p>
        
    
       
            <p id='secondpart'>
            Notre solution repose principalement sur le modèle de segmentation U-Net, adapté pour cette tâche exigeante. Les données utilisées proviennent d’une collection d’images haute-résolution du site, complétées par un processus d'augmentation pour enrichir le modèle d’apprentissage. L'outil final offre une analyse visuelle précise, permettant aux chercheurs de révéler et étudier ces pigments, essentiels pour reconstituer l’aspect originel des structures antiques.
            Pour en savoir plus, consultez notre {' '}
    <a href="https://gitlab.emi.u-bordeaux.fr/lulachaud/unettraining_temple.git" target="_blank">
      dépôt GitLab
    </a>.
            </p>
           
            
 
     </div>
     <div className="download-container">
  <a href="./portfolio/projects/archeovision/archeovision_rapport.pdf" download className="download-button">
    Télécharger le rapport
  </a>
</div>
     <img className="imagep" src="./portfolio/projects/archeovision/ptsbleus.png" alt="Context Image 1"  aria-description='Unet Model'/>

      </div>
    </React.Fragment>
  );
};

export default ProjectView;
