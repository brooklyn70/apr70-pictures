// TaglineBand.jsx — "Auteur. Driven. Development." band with 2 CTAs
function TaglineBand({ onSlate, onDivisions }) {
  return (
    <section className="tagline-band">
      <div className="tagline-rule" />
      <h2 className="tagline-h">Auteur. Driven. Development.</h2>
      <p className="tagline-p">Precise, purposeful, and built to last.</p>
      <div className="tagline-ctas">
        <button className="btn-solid" onClick={onDivisions}>Learn more about our divisions</button>
        <button className="btn-ghost" onClick={onSlate}>View Slate</button>
      </div>
      <div className="tagline-rule" />
    </section>
  );
}

function SectionHeader({ kicker, title, sub }) {
  return (
    <header className="section-header">
      <div className="section-header-rule">
        <span className="rule-fade-left" />
        <span className="section-header-kicker mono">{kicker}</span>
        <span className="rule-fade-right" />
      </div>
      {title && <h2 className="section-header-title">{title}</h2>}
      {sub && <p className="section-header-sub">{sub}</p>}
    </header>
  );
}

window.TaglineBand = TaglineBand;
window.SectionHeader = SectionHeader;
