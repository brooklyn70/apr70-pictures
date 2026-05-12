// DivisionRow.jsx — homepage split-screen division block w/ ghost numeral
function DivisionRow({ num, ghost, title, tagline, subtitle, color, textColor = '#fff', projects = [], onEnter }) {
  return (
    <div
      className="division-row"
      style={{ background: color, color: textColor }}
      onClick={onEnter}
    >
      <div className="division-ghost" style={{ color: textColor, opacity: textColor === '#fff' ? 0.08 : 0.12 }}>{ghost}</div>
      <div className="division-inner">
        <div className="division-top">
          <span className="division-num mono">{num}</span>
          <span className="division-kicker mono">{tagline}</span>
        </div>
        <div className="division-main">
          <h2 className="division-title">{title}</h2>
          <div className="division-sub">{subtitle}</div>
        </div>
        <div className="division-bottom">
          <div className="division-projects">
            {projects.map((p, i) => (
              <div key={i} className="division-project mono">
                <span>{p.name}</span>
                <span className="division-project-meta">{p.meta}</span>
              </div>
            ))}
          </div>
          <div className="division-cta mono">Enter division →</div>
        </div>
      </div>
    </div>
  );
}

window.DivisionRow = DivisionRow;
