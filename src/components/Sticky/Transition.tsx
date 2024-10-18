import React, { useEffect, useState } from 'react';
import './Transition.css';
import DropdownMenu from './DropDownMenu'; // Import DropdownMenu

interface TransitionProps {
  className?: string;
  onTransitionComplete: () => void; // Callback to notify when the transition is complete
}

const Transition: React.FC<TransitionProps> = ({ className, onTransitionComplete }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // Trigger to show DropdownMenu after the transition animation
  useEffect(() => {
    if (className?.includes('show')) {
      const timer = setTimeout(() => {
        setShowDropdown(true);
        onTransitionComplete(); // Notify the parent component
      }, 1000); // Same duration as the transition

      return () => clearTimeout(timer);
    } else {
      setShowDropdown(false);
    }
  }, [className, onTransitionComplete]);

  return (
    <div className={`transition ${className}`}>
      <div className="transition-background" />
      {showDropdown && <DropdownMenu className='show' />} {/* Show DropdownMenu */}
    </div>
  );
};

export default Transition;
