import { useEffect, useRef } from 'react';
import { revealUp } from '../../../animations/gsapConfig';
import { TRIP_LIFECYCLE } from '../data/content';

const TONES = ['signal', 'amber', 'signal', 'amber'];

const Timeline = () => {
    const rootRef = useRef(null);

    useEffect(() => {
        revealUp('.tl-node', { trigger: rootRef.current, stagger: 0.1 });
    }, []);

    return (
        <section ref={rootRef}>
            <div className="section-inner">
                <div className="section-head">
                    <span className="eyebrow">Trip lifecycle</span>
                    <h2 style={{ color: '#f8fafc' }}>Every trip moves through exactly one path</h2>
                    <p>No trip can skip a state, and every transition updates vehicle and driver status on its own.</p>
                </div>

                <div className="tl-line">
                    <div className="tl-rail" aria-hidden="true" />
                    {TRIP_LIFECYCLE.map((step, i) => (
                        <div key={step.label} className="tl-node" style={{ opacity: 0 }}>
                            <span className="status-pill" data-tone={TONES[i]}>{step.label}</span>
                            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .tl-line { position: relative; display: grid; grid-template-columns: 1fr; gap: 2rem; margin-top: 1rem; }
                .tl-rail { display: none; }
                @media (min-width: 860px) {
                    .tl-line { grid-template-columns: repeat(4, 1fr); }
                    .tl-rail { display: block; position: absolute; top: 11px; left: 6%; right: 6%; height: 1px; background: var(--line-strong); }
                }
            `}</style>
        </section>
    );
};

export default Timeline;
