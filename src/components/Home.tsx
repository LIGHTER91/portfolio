import Scene from './Scene/Scene';
import './Home.css'; // Import the CSS file for styling

const Home: React.FC = () => {
  return (
    <>
      <Scene />
      <div className="drag-down-indicator">
        <span className="vertical-text">Press & Drag Down --{'>'}</span>
        
      </div>
    </>
  );
};

export default Home;
