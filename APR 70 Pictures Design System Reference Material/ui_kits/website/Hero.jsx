// Hero.jsx — homepage hero with auto-advancing slate imagery (placeholders)
const { useState: useHeroState, useEffect: useHeroEffect } = React;

function Hero({ onExplore }) {
  // Placeholder slate "stills" — real production site pulls from /public/slate/{slug}/hero/*
  const slates = [
    { project: 'A Need Grows in Brooklyn', division: '(212) PICTURES', tag: 'DRAMA / CRIME · 10 EPS', bg: 'linear-gradient(135deg, #1a0e05 0%, #3d2610 50%, #1a0e05 100%)' },
    { project: "L.A. Dolce Vita",           division: '(310) PICTURES', tag: 'POLITICAL THRILLER · 10 EPS', bg: 'linear-gradient(135deg, #051c22 0%, #0f4654 50%, #051c22 100%)' },
    { project: 'The Mayors',                division: '(212) PICTURES', tag: 'DOCUMENTARY · 11 EPS', bg: 'linear-gradient(135deg, #0a0a0a 0%, #2a1a0e 50%, #0a0a0a 100%)' },
    { project: "U Brucculinu",              division: 'NEW RENAISSANCE CINEMA', tag: 'FEATURE FILM', bg: 'linear-gradient(135deg, #141414 0%, #2e2e2e 50%, #141414 100%)' },
  ];
  const [idx, setIdx] = useHeroState(0);
  useHeroEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % slates.length), 5200);
    return () => clearInterval(t);
  }, []);
  const cur = slates[idx];
  return (
    <section className="hero">
      {slates.map((s, i) => (
        <div key={i} className={`hero-slate ${i === idx ? 'is-active' : ''}`} style={{ background: s.bg }} />
      ))}
      <div className="hero-vignette" />
      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="rule-short" />
          <span className="mono">{cur.division}</span>
        </div>
        <h1 className="hero-title">
          Craft<br />of<br />Constraint.
        </h1>
        <div className="hero-meta-row">
          <span className="hero-counter mono">{String(idx + 1).padStart(2, '0')} / {String(slates.length).padStart(2, '0')}</span>
          <span className="hero-rule" />
          <span className="hero-now mono">NOW — {cur.project.toUpperCase()}</span>
          <span className="hero-rule" />
          <span className="hero-now mono">{cur.tag}</span>
        </div>
        <div className="hero-ctas">
          <button className="btn-solid" onClick={() => onExplore('slate')}>View Slate</button>
          <button className="btn-ghost" onClick={() => onExplore('divisions')}>Learn about our divisions</button>
        </div>
      </div>
      <div className="hero-ticks">
        {slates.map((_, i) => (
          <button
            key={i}
            className={`hero-tick ${i === idx ? 'is-active' : ''}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </section>
  );
}

window.Hero = Hero;
