import { useRef, useState } from 'react';
import { Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three'; // Make sure to import THREE

interface TitleProps {
  onComplete: () => void; // Explicitly define the type for onComplete
}

const Title: React.FC<TitleProps> = ({ onComplete }) => {
  const { size } = useThree();
  const isMobile = size.width < 768;

  const textScale = isMobile ? 0.75 : 1;
  const text = "LUCIEN LACHAUD";

  const [opacities, setOpacities] = useState(Array(text.length).fill(0));
  const letterRefs = useRef<(THREE.Mesh | null)[]>([]); // Update the type for refs
  const letterSpacing = 1.1;
  const spaceLetterSpacing = 0.5;
  const wordWidth = text
    .split('')
    .reduce(
      (acc, char) =>
        acc + (char === ' ' ? spaceLetterSpacing : letterSpacing) * textScale,
      0
    );

  const customOrder = [7, 0, 13, 4, 10, 2, 9, 8, 6, 1, 11, 3, 12, 5];
  const [currentIndex, setCurrentIndex] = useState(0);

  useFrame(() => {
    setOpacities((prevOpacities) => {
      return prevOpacities.map((opacity, index) => {
        const char = text[index];
        if (customOrder[currentIndex] === index) {
          if (char === ' ') {
            return 1; // Spaces are fully visible immediately
          }
          return Math.min(opacity + 0.03, 1); // Increment opacity
        }
        return opacity;
      });
    });

    const currentLetterIndex = customOrder[currentIndex];
    if (opacities[currentLetterIndex] >= 1 && currentIndex < customOrder.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }

    // Check if the last letter is fully visible to notify completion
    if (currentIndex === customOrder.length - 1 && opacities[currentLetterIndex] >= 1) {
      onComplete(); // Notify that the animation is complete
    }

  });

  let currentPosition = -(wordWidth - 0.8) / 2;

  return (
    <>
      {text.split('').map((letter, index) => {
        const isSpace = letter === ' ';
        const spacing = isSpace ? spaceLetterSpacing : letterSpacing;

        const position: [number, number, number] = [currentPosition, 1, -6]; // Use tuple type

        currentPosition += spacing * textScale;

        return (
          <Text
            key={index}
            ref={(el) => (letterRefs.current[index] = el)}
            font={'portfolio/fonts/ppneuemontreal-bold.otf'}
            position={position}
            fontSize={textScale}
            anchorX="center"
            anchorY="middle"
            material-opacity={opacities[index]} // Bind opacity to mesh material
          >
            {letter}
          </Text>
        );
      })}
    </>
  );
};

export default Title; 
