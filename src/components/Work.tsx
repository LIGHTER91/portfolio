import React from "react";
import DropdownMenu from "./Sticky/DropDownMenu";
import DropdownMenuMobile from "./Sticky/DropDownMenuMobile";
import './Work.css';

interface WorkProps {
  projects: Array<{ title: string, image: HTMLVideoElement | string, sector: string, readMoreLink: string }>;
}

const Work: React.FC<WorkProps> = ({ projects }) => {
  // Check if the user is on a mobile or tablet device
  const isMobileOrTablet = /Mobi|Tablet|Android|iPad|iPhone/.test(navigator.userAgent);

  return (
    <>
      {isMobileOrTablet ? (
        <DropdownMenuMobile projects={projects} className={'show'}/>
      ) : (
        <DropdownMenu projects={projects} className={'show'} />
      )}
    </>
  );
};

export default Work;
