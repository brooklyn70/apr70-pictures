// Reader.jsx — full-screen article reading overlay
const { useEffect: useEffectR } = React;

function Reader({ article, onClose }) {
  useEffectR(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!article) return null;
  return (
    <div className="reader" role="dialog" aria-modal="true" aria-labelledby="reader-title">
      <div className="reader-bar">
        <span className="reader-bar-label">DISPATCH · {article.section || 'FEATURE'} · {article.folio}</span>
        <span className="reader-bar-center">VOL. 01 · NO. 01 · SPRING 2026</span>
        <button className="reader-bar-close" onClick={onClose}>CLOSE — ESC</button>
      </div>
      <div className="reader-wrap">
        <div className="reader-hero-eyebrow">{article.eyebrow || 'FEATURE'}</div>
        <h1 className="reader-hero-title" id="reader-title">{article.title}</h1>
        <p className="reader-hero-deck">{article.deck}</p>
        <div className="reader-hero-meta">
          <span><b>BY</b> {article.by || 'M.A. CARUSO'}</span>
          <span><b>FILED</b> {article.date || 'APR 14, 2026'}</span>
          <span><b>FOLIO</b> {article.folio || '012'}</span>
          <span><b>LENGTH</b> {article.length || '11 MIN READ'}</span>
        </div>
        <div className="reader-hero-image">
          <image-slot id={`reader-${article.folio || 'x'}`} placeholder="Hero image" shape="rect"></image-slot>
        </div>
        <div className="reader-body">
          {(article.body || []).map((p, i) => {
            if (p.pull) return <p className="pull" key={i}>{p.pull}</p>;
            if (p.head) return <h3 key={i}>{p.head}</h3>;
            return <p key={i} className={p.first ? 'first' : ''}>{p.text}</p>;
          })}
        </div>
        <div className="reader-end">END · DISPATCH 0086</div>
      </div>
    </div>
  );
}

window.Reader = Reader;
