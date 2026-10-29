import React from 'react';
import { Project } from '../../types/portfolio';

interface CenterDescriptionProps {
  project: Project | null;
  onClick: () => void;
}

export const CenterDescription: React.FC<CenterDescriptionProps> = ({ project, onClick }) => {
  return (
    <div
      className={`space-center-desc ${project ? 'is-active' : ''}`}
      id="spaceCenterDesc"
      aria-live="polite"
      onClick={onClick}
      data-slug={project?.slug || ''}
      data-cursor={project ? 'Learn More' : undefined}
      style={{ cursor: project ? 'pointer' : 'default' }}
    >
      <h2 className="sc-title" id="spaceCenterTitle">
        {project?.title || ''}
      </h2>
      <p className="sc-desc" id="spaceCenterDescText">
        {project?.description || project?.short || ''}
      </p>
      <div className="sc-cat" id="spaceCenterCat">
        {project?.category || ''}
      </div>
    </div>
  );
};
