import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useParams, useNavigate,useLocation } from 'react-router-dom'; // Import useParams
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
  const { projectId } = useParams<{ projectId: string }>();
  const [currentProject, setCurrentProject] = useState<Project>(projects[0]);
  const navigate = useNavigate();
  const [buttonOpacity, setButtonOpacity] = useState(1);
  const location = useLocation();
 
  useEffect(() => {
   
  let link=location.pathname
  link="/portfolio/#"+link
    const project = projects.find((p) => p.readMoreLink?.includes(link)) || projects[0];
    console.log(project.title)
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
  }, [projects, projectId, location.pathname]); // Depend on projectId

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
        <div className={`project-details ${ 'show' }`} >
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
      {currentProject.title=='Détection automatique de pigments par Segmentation Sémantique'&&<div className="content-sections">
        <div className="grain-effect"></div>
     
            <img className="imagep" src="./portfolio/projects/archeovision/unet_architecture.png" alt="Context Image 1"  aria-description='Unet Model'/>
            <div className="container">
            <p id='firstpart' >
            Ce projet a pour objectif de développer une méthode de détection automatique de pigments imperceptibles à l’œil nu, présente au Temple d’Apollon à Delphes. Grâce aux avancées en segmentation d'image et aux modèles d'apprentissage profond, notre équipe a conçu une approche robuste pour identifier avec précision les traces de pigments tout en réduisant les faux positifs, causés par des éléments perturbateurs comme des lichens et des moisissures.
            </p>
        
    
       
            <p id='secondpart'>
            Notre solution repose principalement sur le modèle de segmentation U-Net, adapté pour cette tâche exigeante. Les données utilisées proviennent d’une collection d’images haute-résolution du site, complétées par un processus d'augmentation pour enrichir le modèle d’apprentissage car le manque diversité de roches dans le dataset d'entraînement pouvait rendre le modèle incappable de se généraliser aux nouvelles données. L'outil final offre une analyse visuelle précise, permettant aux chercheurs de révéler et étudier ces pigments, essentiels pour reconstituer l’aspect originel des structures antiques.
            <br/>Pour en savoir plus, consultez notre {' '} 
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

      </div>}
      {currentProject.title=='Prédiction des votes durant les élections présidentielles'&&<div className="content-sections">
        <div className="grain-effect"></div>
        <div className="container_e">
          
        <p className="p_p" >
        Ce projet a pour but de prédire des résultats liés à l'élection présidentielle française de 2022 en utilisant un modèle de régression linéaire avec sélection de variables. En s'appuyant sur des données socio-économiques et démographiques de 2021, notre objectif principal était d'explorer et de comprendre les facteurs influençant le taux d'abstention et les scores des candidats au premier tour.
        </p>
        <div className="containertable">
  <h1>Résultats de la Régression OLS</h1>
  <p><strong>Modèle :</strong> OLS | <strong>Méthode :</strong> Moindres carrés</p>
  <p><strong>Variable dépendante :</strong> MACRON Emmanuel | <strong>R-squared :</strong> 0.990 | <strong>Adj. R-squared :</strong> 0.989</p>
  <p><strong>F-statistic :</strong> 738.2 | <strong>Prob (F-statistic) :</strong> 2.15e-63</p>
  <p><strong>Observations :</strong> 76 | <strong>Date :</strong> Lun, 22 Avr 2024 | <strong>Heure :</strong> 17:56:58</p>

  <table>
    <thead>
      <tr>
        <th>Variable</th>
        <th>Coef.</th>
        <th>Std Err</th>
        <th>t</th>
        <th>P{'>'}|t|</th>
        <th>[0.025</th>
        <th>0.975]</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Médiane du niveau de vie 2021</td>
        <td>0.0015</td>
        <td>0.000</td>
        <td>8.653</td>
        <td>0.000</td>
        <td>0.001</td>
        <td>0.002</td>
      </tr>
      <tr>
        <td>Taux de pauvreté 2021</td>
        <td>0.0632</td>
        <td>0.200</td>
        <td>0.317</td>
        <td>0.752</td>
        <td>-0.335</td>
        <td>0.461</td>
      </tr>
      <tr>
        <td>Part des diplômés d'un BAC+5 ou plus dans la pop. non scolarisée de 15 ans ou + 2020</td>
        <td>-0.1867</td>
        <td>0.146</td>
        <td>-1.279</td>
        <td>0.205</td>
        <td>-0.478</td>
        <td>0.105</td>
      </tr>
      <tr>
        <td>% Abs/Ins_1erTour</td>
        <td>-0.1223</td>
        <td>0.115</td>
        <td>-1.060</td>
        <td>0.293</td>
        <td>-0.353</td>
        <td>0.108</td>
      </tr>
      <tr>
        <td>Taux de chômage annuel moyen des 15 à 24 ans 2022</td>
        <td>-0.2669</td>
        <td>0.140</td>
        <td>-1.905</td>
        <td>0.061</td>
        <td>-0.546</td>
        <td>0.013</td>
      </tr>
      <tr>
        <td>Part postes de l'admin. publique, enseignement, santé et action sociale dans les étab. actifs au 31/12 2021</td>
        <td>-0.0701</td>
        <td>0.073</td>
        <td>-0.957</td>
        <td>0.342</td>
        <td>-0.216</td>
        <td>0.076</td>
      </tr>
      <tr>
        <td>Médecin généraliste (en nombre) 2021</td>
        <td>0.0011</td>
        <td>0.002</td>
        <td>0.604</td>
        <td>0.548</td>
        <td>-0.003</td>
        <td>0.005</td>
      </tr>
      <tr>
        <td>Police - Gendarmerie (en nombre) 2021</td>
        <td>0.0363</td>
        <td>0.039</td>
        <td>0.934</td>
        <td>0.354</td>
        <td>-0.041</td>
        <td>0.114</td>
      </tr>
      <tr>
        <td>Service d'urgences (en nombre) 2021</td>
        <td>-0.0027</td>
        <td>0.165</td>
        <td>-0.016</td>
        <td>0.987</td>
        <td>-0.331</td>
        <td>0.326</td>
      </tr>
    </tbody>
  </table>

  <div className="notes">
    <p><strong>Omnibus :</strong> 0.499 | <strong>Prob (Omnibus) :</strong> 0.779</p>
    <p><strong>Durbin-Watson :</strong> 2.018 | <strong>Jarque-Bera (JB) :</strong> 0.168</p>
    <p><strong>Skew :</strong> 0.093 | <strong>Prob (JB) :</strong> 0.920 | <strong>Kurtosis :</strong> 3.134</p>
    <p><strong>Cond. No. :</strong> 1.78e+04</p>
  </div>
</div>
          <div className='secondpart'>

          
        <h2>Objectifs et Approche</h2>
        <ul>
      <li>
        <strong>Prédiction du Taux d'Abstention</strong> : Nous avons développé un modèle de régression linéaire afin d'estimer le taux d'abstention au premier tour. La technique de régularisation Lasso a été appliquée pour sélectionner les variables les plus pertinentes et réduire la multicolinéarité.
      </li>
      <li>
        <strong>Prédiction des Scores des Candidats</strong> : Un modèle similaire a été utilisé pour prédire les scores des candidats, en s’appuyant sur des facteurs socio-économiques comme le niveau de vie médian, le taux de pauvreté, le taux de chômage, et le niveau d'éducation de la population.
      </li>
    </ul>

    <h2>Résultats</h2>
    <p >Le modèle a obtenu un score de performance (<em>R-squared</em>) impressionnant de 0,990 pour la prédiction du taux d’abstention, soulignant l'impact du niveau de vie, du taux de pauvreté et de l'éducation sur ce taux. Bien que des défis de multicolinéarité aient été relevés, l'analyse a révélé des tendances significatives entre les caractéristiques socio-économiques et les comportements électoraux.</p>

 </div>
 </div>
  </div>}
  {currentProject.title == 'Reinforcement Learning Projet: Université' && 
  <div className="content-sections">
    <div className="grain-effect"></div>

    <img className="imagep" src="./portfolio/projects/archeovision/ptsbleus.png" alt="Environment Image" aria-description="Environment Simulation" />

    <div className="container">
      <p id='firstpart'>
        Ce projet s'inscrit dans le cadre du cours d’apprentissage par renforcement (Reinforcement Learning) à l’Université de Bordeaux. Il vise à modéliser et résoudre une situation simulée où des robots doivent collaborer pour accomplir diverses tâches dans un environnement potentiellement dangereux pour les humains. 
        <br /> Les missions principales des robots sont les suivantes : 
        <ul>
          <li>Trouver du matériel dans un hangar (H) où les emplacements varient chaque jour.</li>
          <li>Nettoyer un entrepôt (E) en identifiant et éliminant la saleté.</li>
          <li>Se recharger dans un garage (G) où les stations de recharge changent également de place chaque jour.</li>
        </ul>
      </p>

      <p id='secondpart'>
        Les robots sont modélisés sous forme d'agents évoluant sur des grilles représentant les pièces H, E et G. L'objectif est de tester différentes solutions algorithmiques, notamment des approches avec ou sans modèle (model-based/model-free) ainsi que des stratégies single-agent et multi-agent. 
        <br />Ce projet offre une excellente opportunité d'approfondir les concepts pratiques et théoriques de l'apprentissage par renforcement tout en explorant des solutions collaboratives et dynamiques.
        <br />Pour en savoir plus, consultez notre {' '}
        <a href="https://gitlab.emi.u-bordeaux.fr/lulachaud/unettraining_temple.git" target="_blank">
          dépôt GitLab
        </a>.
      </p>
    </div>

    <div className="download-container">
      <a href="./portfolio/projects/archeovision/ptsbleus.png" download className="download-button">
        Télécharger le rapport
      </a>
    </div>

    <img className="imagep" src="./portfolio/projects/reinforcement-learning/simulation-result.png" alt="Simulation Result Image" aria-description="Simulation Result" />
  </div>
}

    </React.Fragment>
  );
};

export default ProjectView;
