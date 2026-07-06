// Sections.jsx — Contents, Editorial, Feature, Dispatches, Trades, Calendar, Classifieds, Archive, Colophon

function SectionRail({ num, title, meta }) {
  return (
    <div className="section-rail">
      <span className="section-rail-num">{num}</span>
      <h2 className="section-rail-title">{title}</h2>
      <span className="section-rail-meta">{meta}</span>
    </div>
  );
}

function Contents({ groups, issue, onOpen }) {
  return (
    <section className="contents" aria-labelledby="contents-title">
      <aside className="contents-side">
        <h2 className="contents-side-issue" id="contents-title">In This Issue.</h2>
        <p className="contents-side-deck">
          A first quarterly. Four features, three division dispatches, four
          departments. Read end-to-end, or pick the folio.
        </p>
        <div className="contents-side-meta">
          {issue.volume} · {issue.number}<br/>
          {issue.season}<br/>
          PRINTED IN {issue.offices}<br/>
          {issue.reel}
        </div>
      </aside>
      <div className="contents-main">
        {groups.map((g, gi) => (
          <div className="contents-group" key={gi}>
            <div className="contents-group-head">
              <span className="contents-group-label">{g.label}</span>
              <span className="contents-group-meta">{g.meta}</span>
            </div>
            {g.entries.map((e, ei) => (
              <a className="contents-entry" key={ei} onClick={() => onOpen?.(e)}>
                <span className="contents-entry-folio">{e.folio}</span>
                <span className="contents-entry-body">
                  <span className="contents-entry-title">{e.title}</span>
                  <span className="contents-entry-deck">{e.deck}</span>
                </span>
                <span className="contents-entry-by">{e.by}</span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function Editorial({ data }) {
  return (
    <section className="editor" aria-labelledby="editor-title">
      <aside className="editor-aside">
        <div className="editor-aside-portrait">
          <image-slot id="editor-portrait" placeholder="Editor portrait (b&w)" shape="rect"></image-slot>
        </div>
        <div className="editor-aside-name">Marc A. Caruso</div>
        <div className="editor-aside-role">Founder · Editor of Record</div>
        <div className="editor-aside-quote">{data.quote}</div>
      </aside>
      <div className="editor-main">
        <span className="editor-eyebrow">{data.eyebrow}</span>
        <h2 className="editor-title" id="editor-title">{data.title}</h2>
        <p className="editor-lead">{data.lead}</p>
        <div className="editor-body">
          {data.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="editor-signoff">
          <span className="editor-signoff-script">— M.</span>
          <span className="editor-signoff-name">{data.signatureMeta}</span>
        </div>
      </div>
    </section>
  );
}

function FeatureTitle({ parts }) {
  return (
    <h2 className="feature-title">
      {parts.map((p, i) =>
        typeof p === 'string'
          ? <React.Fragment key={i}>{p}{' '}</React.Fragment>
          : <span key={i} className={p.italic ? 'ital' : ''}>{p.text} </span>
      )}
    </h2>
  );
}

function Feature({ data, onOpen }) {
  return (
    <section className="feature" aria-labelledby="feature-title">
      <div className="feature-head">
        <div>
          <div className="feature-eyebrow">{data.eyebrow}</div>
          <FeatureTitle parts={data.title} />
          <p className="feature-deck">{data.deck}</p>
        </div>
        <div className="feature-meta">
          {data.meta.map(([k, v], i) => (
            <div className="feature-meta-row" key={i}>
              <span>{k}</span>
              <b>{v}</b>
            </div>
          ))}
        </div>
      </div>

      <figure className="feature-image">
        <image-slot id="feature-hero" placeholder="Feature hero — drop archive frame or set still" shape="rect"></image-slot>
        <figcaption className="feature-image-caption">
          <span><b>FIG. 01</b> &nbsp; {data.imageCaption[0]}</span>
          <span>{data.imageCaption[1]}</span>
        </figcaption>
      </figure>

      <div className="feature-body-wrap">
        <div className="feature-body">
          {data.paragraphs.map((p, i) => {
            if (p.pull) return (
              <p className="pull" key={i}>
                {p.pull}
                {p.attr && <span className="pull-attr">— {p.attr}</span>}
              </p>
            );
            if (p.small) return <p className="small" key={i}>· · · {p.small} · · ·</p>;
            return <p key={i} className={p.first ? 'first' : ''}>{p.text}</p>;
          })}
        </div>
        <aside className="feature-side">
          <div className="feature-factbox">
            <h4>{data.factbox.label}</h4>
            <dl>
              {data.factbox.fields.map(([k, v, cls], i) => (
                <React.Fragment key={i}>
                  <dt>{k}</dt>
                  <dd className={cls || ''}>{v}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
          <div>
            <h4>Related in this issue</h4>
            <ul className="feature-related-list">
              {data.related.map((r, i) => (
                <li key={i}>
                  <span>{r.idx}</span>
                  <b>{r.name}</b>
                  <span>{r.meta}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div className="feature-jumpline">
        <span>{data.jumpFrom}</span>
        <a onClick={() => onOpen?.()}>OPEN FULL STORY →</a>
        <span>{data.jumpTo}</span>
      </div>
    </section>
  );
}

function Dispatches({ items }) {
  return (
    <section className="dispatches" aria-label="Slate dispatches">
      {items.map((d, i) => (
        <article className="dispatch-card" key={i}>
          <div className="accent-bar" style={{ background: d.color }} />
          <div className="dispatch-card-head">
            <span className="dispatch-card-div" style={{ color: d.color }}>{d.div}</span>
            <span className="dispatch-card-date">{d.date}</span>
          </div>
          <h3 className="dispatch-card-title">{d.title}</h3>
          <p className="dispatch-card-body">{d.body}</p>
          <div className="dispatch-card-foot">
            <span className="dispatch-card-status">{d.status}</span>
            <span className="dispatch-card-link">{d.link} →</span>
          </div>
          <div className="dispatch-card-ghost" aria-hidden="true">{d.ghost}</div>
        </article>
      ))}
    </section>
  );
}

function Trades({ trades, calendar }) {
  return (
    <section className="trades" aria-label="Industry roundup and calendar">
      <div className="trades-main">
        {trades.map((t, i) => (
          <article className="clipping" key={i}>
            <div className="clipping-pub">
              {t.pub}
              <span>{t.city}</span>
            </div>
            <div className="clipping-body">
              <h3 className="clipping-headline">{t.headline}</h3>
              <p className="clipping-deck">{t.deck}</p>
              <div className="clipping-attr">{t.attr}</div>
            </div>
          </article>
        ))}
      </div>
      <aside className="trades-side">
        <div className="cal">
          <h3 className="cal-head">The Calendar</h3>
          {calendar.map((c, i) => (
            <div className="cal-row" key={i}>
              <span className="cal-row-date">{c.date}</span>
              <span className="cal-row-title">
                {c.title}
                <span>{c.sub}</span>
              </span>
              <span className="cal-row-tag">{c.tag}</span>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}

function Classifieds({ items }) {
  return (
    <section className="classifieds" aria-label="Back of book — open calls and notices">
      <div className="classifieds-grid">
        {items.map((c, i) => (
          <div className="classified" key={i}>
            <span className="classified-cat">{c.cat}</span>
            <span className="classified-title">{c.title}</span>
            <span className="classified-body">{c.body}</span>
            <span className="classified-meta">{c.meta}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Archive({ issues }) {
  return (
    <section className="archive" aria-label="Past issues">
      <div className="archive-strip">
        {issues.map((it, i) => (
          <a className={`archive-card ${it.current ? 'is-current' : ''}`} key={i}>
            <div className="archive-card-head">
              <span>{it.vol} · {it.no}</span>
              <span>{it.season}</span>
            </div>
            <div>
              <div className="archive-card-mast">{it.mast}</div>
              <div className="archive-card-line">{it.line}</div>
            </div>
            <div className="archive-card-foot">
              <span><b>{it.state}</b></span>
              <span>OPEN →</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Colophon({ data, issue }) {
  return (
    <footer className="colophon">
      <div className="colophon-row">
        <div className="colophon-col">
          <h5>DISPATCH — A QUARTERLY OF APR 70 PICTURES</h5>
          <p>{data.legal}</p>
          <p style={{ marginTop: 14 }}>{data.type}</p>
        </div>
        <div className="colophon-col">
          <h5>EDITORIAL</h5>
          <p>Marc A. Caruso — Editor</p>
          <p>Editorial Desk — APR 70</p>
          <p>news@apr70.com</p>
        </div>
        <div className="colophon-col">
          <h5>PUBLISHING</h5>
          <p>APR 70 LLC, Long Island City</p>
          <p>Quarterly · 4 issues/yr</p>
          <p>Subscriptions: direct</p>
        </div>
        <div className="colophon-col">
          <h5>INDICIA</h5>
          <p className="mono">{issue.volume}</p>
          <p className="mono">{issue.number}</p>
          <p className="mono">{issue.reel}</p>
        </div>
      </div>
      <div className="colophon-baseline">
        <span>© 2026 APR 70 LLC</span>
        <span>{data.baseline}</span>
        <span>SET IN FUTURA + BARLOW</span>
      </div>
    </footer>
  );
}

Object.assign(window, {
  SectionRail, Contents, Editorial, Feature, Dispatches, Trades, Classifieds, Archive, Colophon
});
