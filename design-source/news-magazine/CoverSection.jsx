// CoverSection.jsx — magazine masthead + cover
const { useState: useStateCv } = React;

function Masthead({ issue, title = 'DIS·PATCH' }) {
  const parts = String(title).split('·');
  return (
    <div className="masthead">
      <div className="masthead-row">
        <div className="masthead-left">{issue.volume} · {issue.number}</div>
        <div className="masthead-wordmark">
          {parts.map((p, i) => (
            <React.Fragment key={i}>
              {p}
              {i < parts.length - 1 && <span className="amp">·</span>}
            </React.Fragment>
          ))}
        </div>
        <div className="masthead-right">{issue.season}</div>
      </div>
      <div className="masthead-indicia">
        <span><b>APR 70 PICTURES</b> QUARTERLY</span>
        <span>{issue.isoDate}</span>
        <span>{issue.offices}</span>
        <span>{issue.printRun} · {issue.reel}</span>
      </div>
    </div>
  );
}

function Cover({ cover, issue }) {
  return (
    <section className="cover" aria-labelledby="cover-title">
      <div className="cover-left">
        <div>
          <div className="cover-eyebrow">{cover.kicker}</div>
        </div>
        <div className="cover-title-stack">
          <span className="cover-kicker">THE INAUGURAL ISSUE</span>
          <h1 id="cover-title" className="cover-line">
            {cover.lines.map((l, i) => (
              <React.Fragment key={i}>
                <span className={l.accent ? 'accent-word' : l.outline ? 'outline' : ''}>{l.text}</span>{' '}
              </React.Fragment>
            ))}
          </h1>
          <p className="cover-deck">{cover.deck}</p>
        </div>
        <div className="cover-footer">
          <span>{cover.byline}</span>
          <span>FOLIO · 001</span>
        </div>
        <div className="cover-spine" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => <div className="h" key={i} />)}
        </div>
      </div>
      <div className="cover-right">
        <div className="cover-image-wrap">
          <image-slot
            id="cover-hero"
            placeholder="Cover image — drop a still here (set photo, archive frame, portrait)"
            shape="rect"
          ></image-slot>
          <div className="cover-image-vignette" />
          <div className="cover-coverlines">
            {cover.coverlines.map((cl, i) => (
              <div className="cover-coverline" key={i}>
                <span className="cover-coverline-num">{cl.num}</span>
                <span className="cover-coverline-head">{cl.head}</span>
                <span className="cover-coverline-deck">{cl.deck}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cover-seal" aria-hidden="true">
          <div className="cover-seal-top">SPRING</div>
          <div className="cover-seal-big">26</div>
          <div className="cover-seal-sub">QUARTERLY</div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Masthead, Cover });
