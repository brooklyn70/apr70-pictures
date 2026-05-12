// ProjectCard.jsx — entry in the Slate grid
function ProjectCard({ project, division, divColor, tag, year, desc, idx }) {
  return (
    <a className="project-card" tabIndex={0}>
      <div className="project-card-head">
        <span className="project-card-div mono" style={{ color: divColor }}>{division}</span>
        <span className="project-card-idx mono">{String(idx).padStart(2, '0')}</span>
      </div>
      <div className="project-card-image">
        <div className="project-card-image-inner" style={{ background: `linear-gradient(135deg, ${divColor}22, #0a0a0a)` }}>
          <span className="project-card-image-mono mono">HERO STILL · {project.toUpperCase()}</span>
        </div>
      </div>
      <h3 className="project-card-title">{project}</h3>
      <p className="project-card-desc">{desc}</p>
      <div className="project-card-foot">
        <span className="project-card-meta mono">{tag}</span>
        <span className="project-card-link mono">VIEW DOSSIER →</span>
      </div>
    </a>
  );
}

window.ProjectCard = ProjectCard;
