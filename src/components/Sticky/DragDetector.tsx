import { useEffect, useRef } from 'react';

interface DragDetectorProps {
  onDragDown: () => void; // Function to call on drag down
  pressDuration?: number; // Duration in ms for detecting the drag
}

const DragDetector: React.FC<DragDetectorProps> = ({ onDragDown, pressDuration = 500 }) => {
  const isDragging = useRef(false);
  const startY = useRef(0);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useRef<boolean>(navigator.maxTouchPoints > 0);

  const handleMouseDown = (event: MouseEvent) => {
    if (isMobile.current) return;
    
    isDragging.current = false;
    startY.current = event.clientY;

    // Start the press timer
    pressTimer.current = setTimeout(() => {
      isDragging.current = true;
    }, pressDuration) as unknown as NodeJS.Timeout;
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging.current) return;

    const deltaY = event.clientY - startY.current;
    if (deltaY > 100) { // Trigger drag after 100px movement
      onDragDown();
      isDragging.current = false;
      clearTimeout(pressTimer.current!);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  // Handle touch events
  const handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 1) { // Single touch only
      startY.current = event.touches[0].clientY;

      // Start the timer for mobile long press
      pressTimer.current = setTimeout(() => {
        isDragging.current = true;
        onDragDown();
      }, 1000); // 1 second press duration for mobile
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (!isDragging.current) return;

    const deltaY = event.touches[0].clientY - startY.current;
    if (deltaY > 100) {
      onDragDown();
      isDragging.current = false;
      clearTimeout(pressTimer.current!);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}>
      {/* Invisible component to capture drag events */}
    </div>
  );
};

export default DragDetector;
