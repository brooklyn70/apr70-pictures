// Chrome.jsx — filmstrip rail + nav, adapted from website kit
const { useEffect, useRef, useState: useStateC } = React;

function FilmstripRail({ accentColor = '#E85D04', keycode = 'APR 70 PICTURES // DISPATCH VOL 01 // REEL 086' }) {
  const holesRef = useRef(null);
  useEffect(() => {
    if (!holesRef.current) return;
    const el = holesRef.current;
    const draw = () => {
      el.innerHTML = '';
      const count = Math.ceil(window.innerWidth / 30) + 4;
      for (let i = 0; i < count; i++) {
        const h = document.createElement('div');
        h.className = 'sprocket-hole';
        el.appendChild(h);
      }
    };
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);
  return (
    <div className="filmstrip">
      <div className="filmstrip-accent" style={{ background: accentColor }} />
      <div className="filmstrip-holes" ref={holesRef} />
      <div className="filmstrip-keycode">{keycode}</div>
    </div>
  );
}

function Nav() {
  const items = [
    { n: '01', label: 'Divisions', key: 'divisions' },
    { n: '02', label: 'Slate',     key: 'slate' },
    { n: '03', label: 'Partners',  key: 'partners' },
    { n: '04', label: 'News',      key: 'news', active: true },
    { n: '05', label: 'Contact',   key: 'contact' },
  ];
  return (
    <nav className="nav">
      <a className="nav-logo" href="#">
        <img src="assets/apr70_logo_full_white.svg" alt="APR 70 Pictures" />
      </a>
      <div className="nav-links">
        <span className="nav-version">v086</span>
        {items.map(it => (
          <a key={it.key} className={`nav-link ${it.active ? 'is-active' : ''}`} href="#">
            <span className="nav-num">{it.n}</span>
            <span className="nav-label">{it.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function CornerAccent() { return <div className="corner-accent" />; }

Object.assign(window, { FilmstripRail, Nav, CornerAccent });
