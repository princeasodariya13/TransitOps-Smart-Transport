import { useEffect, useRef } from 'react';
import { revealUp } from '../../../animations/gsapConfig';
import { FEATURES } from '../data/content';

const Features = () => {
    const rootRef = useRef(null);

    useEffect(() => {
        revealUp('.feature-card', { trigger: rootRef.current, stagger: 0.09, y: 28 });
    }, []);

    return (
        <section id="features" ref={rootRef}>
            <div className="section-inner">
                <div className="section-head">
                    <span className="eyebrow">The platform</span>
                    <h2 style={{ color: '#f8fafc' }}>Six modules. One operational record.</h2>
                    <p>Every part of the lifecycle — from registration to ROI — reads and writes to the same source of truth.</p>
                </div>

                <div className="feature-grid">
                    {FEATURES.map((f) => (
                        <article
                            key={f.title}
                            className={`feature-card glass ${f.span ? `span-${f.span}` : ''}`}
                            style={{ opacity: 0, padding: '2rem' }}
                        >
                            <div
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 12,
                                    background: 'var(--signal-soft)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--signal)',
                                }}
                            >
                                <f.icon size={22} />
                            </div>
                            <h3 style={{ marginTop: '1.5rem', fontSize: '1.25rem', color: '#f1f5f9' }}>{f.title}</h3>
                            <p style={{ marginTop: '0.6rem', fontSize: '0.95rem' }}>{f.copy}</p>
                            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.6rem', color: '#38bdf8' }}>
                                    {f.stat}
                                </span>
                                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>
                                    {f.statLabel}
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            <style>{`
                .feature-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.25rem;
                }
                .feature-card { transition: transform .4s cubic-bezier(.16,1,.3,1), border-color .3s ease; }
                .feature-card:hover { transform: translateY(-6px); border-color: rgba(56,189,248,0.4); }
                @media (min-width: 700px) {
                    .feature-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (min-width: 1080px) {
                    .feature-grid { grid-template-columns: repeat(3, 1fr); }
                    .span-wide { grid-column: span 2; }
                    .span-tall { grid-row: span 2; }
                }
            `}</style>
        </section>
    );
};

export default Features;
