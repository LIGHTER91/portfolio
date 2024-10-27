import { useMemo } from 'react';
import Spark from './Scene/Spark';
import Stars from './Scene/Star';
import { Canvas } from '@react-three/fiber';
import Card from './CardContact/Card';
import './Contact.css'; // Import your CSS file for styling

const Contact = () => {
  const memoizedSpark = useMemo(() => <Spark />, []);
  const memoizedStars = useMemo(() => <Stars />, []);

  return (
    <div className="contact-container">
      <Canvas className="canvas">
        <group>
          {memoizedSpark}
          {memoizedStars}
        </group>
      </Canvas>
      <div className="card-container">
      <Card 
        name="LINKEDIN" 
        link='https://www.linkedin.com/in/lucien-lachaud-330273257/'
        className="card-contact" 
        id="card1"
      /><Card 
      name="MAIL" 
      link='mailto:lucien.lachaud@orange.fr'
      className="card-contact" 
      id="card2"
    />
      </div>
     
    </div>
  );
};

export default Contact;
