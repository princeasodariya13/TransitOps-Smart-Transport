import { useEffect, useRef } from 'react';
import { revealUp } from '../../../animations/gsapConfig';
import { WHY_POINTS } from '../data/content';

const WhyChooseUs = () => {
    const rootRef = useRef(null);

    useEffect(() => {
        revealUp('.why-row', { trigger: rootRef.current, stagger: 0.1, y: 22 });
    }, []);

    return (
        <section ref={rootRef}>
            <div className="section-inner">
                <div className="section-head">
                    <span className="eyebrow">Why FleetFlow</span>
                    <h2 style={{ color: '#f8fafc' }}>Rules that hold, not rules that are suggested</h2>
                    <p>The mandatory business rules aren't a checklist for someone to follow — they're built into what the interface will let you do.</p>
                </div>

                <div className="why-list">
                    {WHY_POINTS.map((p) => (
                        <div key={p.title} className="why-row glass" style={{ opacity: 0, padding: '1.75rem 2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                            <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 10, background: 'var(--amber-soft)', color: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <p.icon size={20} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.05rem', color: '#f1f5f9' }}>{p.title}</h3>
                                <p style={{ marginTop: '0.4rem', fontSize: '0.92rem' }}>{p.copy}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .why-list { display: grid; grid-template-columns: 1fr; gap: 1rem; }
                @media (min-width: 860px) { .why-list { grid-template-columns: 1fr 1fr; } }
            `}</style>
        </section>
    );
};

export default WhyChooseUs;
