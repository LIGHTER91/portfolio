
import DropdownMenu from "./Sticky/DropDownMenu";
const Work = () => {
  const videoElement = document.createElement('video');
  videoElement.src = './portfolio/projects/temple.mp4';
  videoElement.loop = true;
  videoElement.muted = true; 
  const projects = [
    { title: 'Détection automatique de pigments par Segmentation Sémantique ', image: videoElement ,sector:'Deep Learning', description:''},
   
  ];
    return <DropdownMenu projects={projects} className={ 'show' } />
  };
  
  export default Work;
  