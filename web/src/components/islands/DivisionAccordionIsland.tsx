import React, { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';

interface Division {
  name: string;
  colorToken: string;
  subtitle?: string;
  description?: string;
}

interface Props {
  block: {
    heading?: string;
    subtext?: string;
    divisions: Division[];
  };
}

export default function DivisionAccordionIsland({ block }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const divisions = block.divisions || [];

  const toggle = (idx: number) => {
    if (openIndex === idx) return;

    if (openIndex !== null && contentRefs.current[openIndex]) {
      gsap.to(contentRefs.current[openIndex], {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.inOut',
      });
    }

    if (contentRefs.current[idx]) {
      gsap.fromTo(
        contentRefs.current[idx],
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.5, ease: 'power3.inOut' }
      );
    }
    setOpenIndex(idx);
  };

  // Initial state setup
  useLayoutEffect(() => {
    contentRefs.current.forEach((el, i) => {
      if (el && i !== openIndex) {
        gsap.set(el, { height: 0, opacity: 0 });
      }
    });
  }, []);

  return (
    <section className="division-accordion container">
      {block.heading && (
        <div className="division-header" style={{ textAlign: 'center', marginBottom: 'var(--s-9)' }}>
          <h2 className="h2" dangerouslySetInnerHTML={{ __html: block.heading.replace(/\n/g, '<br />') }} />
          {block.subtext && (
            <p className="body-lg" style={{ color: 'var(--fg-3)', marginTop: 'var(--s-5)' }} dangerouslySetInnerHTML={{ __html: block.subtext.replace(/\n/g, '<br />') }} />
          )}
        </div>
      )}

      <div className="accordion-list">
        {divisions.map((div, i) => {
          const num = String(i + 1).padStart(2, '0');
          const color = `var(--color-${div.colorToken})`;
          const isOpen = openIndex === i;

          return (
            <div key={i} className="accordion-item" style={{ borderBottom: '1px solid var(--rule)' }}>
              <button
                className="accordion-trigger"
                onClick={() => toggle(i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--s-6) 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'inherit',
                  textAlign: 'left',
                }}
                aria-expanded={isOpen}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-5)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--fg-4)' }}>{num}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: color, textTransform: 'uppercase', margin: 0, lineHeight: 1 }}>{div.name}</h3>
                </div>
                <div style={{
                  width: '24px',
                  height: '24px',
                  position: 'relative',
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  transition: 'transform 0.4s cubic-bezier(0.65, 0, 0.35, 1)'
                }}>
                  <span style={{ position: 'absolute', top: '11px', left: 0, width: '24px', height: '2px', background: 'var(--fg-1)' }} />
                  <span style={{ position: 'absolute', top: 0, left: '11px', width: '2px', height: '24px', background: 'var(--fg-1)' }} />
                </div>
              </button>

              <div
                ref={el => { contentRefs.current[i] = el; }}
                className="accordion-content"
                style={{ overflow: 'hidden' }}
              >
                <div style={{ paddingBottom: 'var(--s-6)', paddingLeft: 'calc(var(--s-5) + 20px)' }}>
                  {div.subtitle && (
                    <span style={{
                      display: 'block',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 300,
                      fontSize: '0.875rem',
                      color: 'var(--fg-4)',
                      letterSpacing: 'var(--track-wide)',
                      textTransform: 'uppercase',
                      marginBottom: 'var(--s-4)'
                    }}>
                      {div.subtitle}
                    </span>
                  )}
                  {div.description && (
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 300,
                      fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
                      color: 'var(--fg-2)',
                      lineHeight: 1.7,
                      maxWidth: '620px',
                      margin: 0
                    }} dangerouslySetInnerHTML={{ __html: div.description.replace(/\n/g, '<br />') }} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
