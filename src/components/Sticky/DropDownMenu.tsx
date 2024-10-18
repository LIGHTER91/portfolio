import React from 'react';
import './DropDownMenu.css';

interface DropdownMenuProps {
  className?: string; // Accepte une propriété className
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ className }) => {
  return (
    <div className={`dropdown-menu ${className}`}>
      <div className="dropdown-background" />
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
        <li>Item 4</li>
      </ul>
    </div>
  );
};

export default DropdownMenu;
