// ContactGrid.jsx — 2x2 colored tile grid from v083
function ContactGrid() {
  const tiles = [
    { label: 'OFFICE', title: 'Long Island City', body: '1063 Jackson Avenue, PH G\nQueens, NY 11101', bg: '#077082', fg: '#fff' },
    { label: 'LEGAL ENTITY', title: 'APR 70 LLC', body: 'EIN 41-4120354\nNY DOS ID 7827718', bg: '#E85D04', fg: '#000' },
    { label: 'COMMUNICATION', title: 'Direct Inquiries', body: 'info@apr70.com\nSelect projects, 2026.', bg: '#445a6f', fg: '#fff' },
    { label: 'LEADERSHIP', title: 'Marc Andrew Caruso', body: 'Founder / Sole Member\nWGA-affiliated writer', bg: '#c9a84c', fg: '#1c1208' },
  ];
  return (
    <section className="contact-grid">
      {tiles.map((t, i) => (
        <div key={i} className="contact-tile" style={{ background: t.bg, color: t.fg }}>
          <div className="contact-tile-label mono">{t.label}</div>
          <div className="contact-tile-title">{t.title}</div>
          <div className="contact-tile-body">{t.body}</div>
          <div className="contact-tile-corner mono">{String(i + 1).padStart(2, '0')} / 04</div>
        </div>
      ))}
    </section>
  );
}

window.ContactGrid = ContactGrid;
