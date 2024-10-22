
import DropdownMenu from "./Sticky/DropDownMenu";
import './Work.css'
interface WorkProps {
  projects: Array<{ title: string, image: HTMLVideoElement, sector: string, readMoreLink: string }>;

}
const Work: React.FC<WorkProps>  = ({ projects  }) => {

    return <DropdownMenu projects={projects} className={ 'show' } />
  };
  
  export default Work;
  