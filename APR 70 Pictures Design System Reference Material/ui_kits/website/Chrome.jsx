// Chrome.jsx — filmstrip rail, nav, corner accent, footer
const { useEffect, useRef, useState } = React;

function FilmstripRail({ accentColor = '#077082', keycode = 'APR 70 PICTURES // LIC NY 11101 // REEL 086' }) {
  const holesRef = useRef(null);
  useEffect(() => {
    if (!holesRef.current) return;
    const el = holesRef.current;
    el.innerHTML = '';
    const count = Math.ceil(window.innerWidth / 30) + 4;
    for (let i = 0; i < count; i++) {
      const h = document.createElement('div');
      h.className = 'sprocket-hole';
      el.appendChild(h);
    }
  }, []);
  return (
    <div className="filmstrip">
      <div className="filmstrip-accent" style={{ background: accentColor }} />
      <div className="filmstrip-holes" ref={holesRef} />
      <div className="filmstrip-keycode">{keycode}</div>
    </div>
  );
}

function Nav({ current, onNav, version = 'v086' }) {
  const items = [
    { n: '01', label: 'Divisions', key: 'divisions' },
    { n: '02', label: 'Slate',     key: 'slate' },
    { n: '03', label: 'Partners',  key: 'partners' },
    { n: '04', label: 'Contact',   key: 'contact' },
  ];
  return (
    <nav className="nav">
      <a className="nav-logo" onClick={() => onNav('home')}>
        <img src="../../assets/apr70_logo_full_white.svg" alt="APR 70 Pictures" />
      </a>
      <div className="nav-links">
        <span className="nav-version">{version}</span>
        {items.map(it => (
          <a
            key={it.key}
            className={`nav-link ${current === it.key ? 'is-active' : ''}`}
            onClick={() => onNav(it.key)}
          >
            <span className="nav-num">{it.n}</span>
            <span className="nav-label">{it.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function CornerAccent() {
  return <div className="corner-accent" />;
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-row">
        <div className="footer-col">
          <div className="footer-title">APR 70 PICTURES</div>
          <div className="footer-meta">Established in New York City, 2026.</div>
          <div className="footer-meta">1063 Jackson Avenue, PH G</div>
          <div className="footer-meta">Long Island City, NY 11101</div>
        </div>
        <div className="footer-col">
          <div className="footer-title">NAVIGATE</div>
          <a className="footer-link">About</a>
          <a className="footer-link">Work</a>
          <a className="footer-link">Partners</a>
          <a className="footer-link">Contact</a>
        </div>
        <div className="footer-col">
          <div className="footer-title">LEGAL</div>
          <div className="footer-meta mono">EIN 41-4120354</div>
          <div className="footer-meta mono">NY DOS ID 7827718</div>
          <div className="footer-meta mono">LLC FILE 260206003062</div>
        </div>
      </div>
      <div className="footer-rule" />
      <div className="footer-baseline">
        <span className="footer-small">© 2026 APR 70 LLC. All rights reserved.</span>
        <span className="footer-small mono">PRECISE. PURPOSEFUL. BUILT TO LAST.</span>
      </div>
    </footer>
  );
}

window.FilmstripRail = FilmstripRail;
window.Nav = Nav;
window.CornerAccent = CornerAccent;
window.SiteFooter = Footer;
