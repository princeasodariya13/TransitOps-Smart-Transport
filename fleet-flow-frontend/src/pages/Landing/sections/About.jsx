import { useEffect, useRef } from 'react';
import { revealUp } from '../../../animations/gsapConfig';

const About = () => {
    const rootRef = useRef(null);

    useEffect(() => {
        revealUp('.about-reveal', { trigger: rootRef.current, stagger: 0.08 });
    }, []);

    return (
        <section id="about" ref={rootRef}>
            <div className="section-inner" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: '3rem' }}>
                <div className="about-grid">
                    <div className="about-reveal" style={{ opacity: 0 }}>
                        <span className="eyebrow">The problem</span>
                        <h2 style={{ marginTop: '1rem', fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#f8fafc' }}>
                            Most fleets are still run from a notebook and a spreadsheet.
                        </h2>
                        <p style={{ marginTop: '1.25rem', fontSize: '1.05rem' }}>
                            Scheduling conflicts. Vehicles sitting idle while others are overbooked. Maintenance that gets remembered too late.
                            Licenses that expire without anyone noticing. None of it is a people problem — it's a tooling problem.
                        </p>
                    </div>
                    <div className="about-reveal" style={{ opacity: 0 }}>
                        <span className="eyebrow" style={{ color: '#f59e0b' }}>The fix</span>
                        <h2 style={{ marginTop: '1rem', fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#f8fafc' }}>
                            FleetFlow enforces the rules so no one has to remember them.
                        </h2>
                        <p style={{ marginTop: '1.25rem', fontSize: '1.05rem' }}>
                            One record per vehicle, driver, and trip. Status changes propagate automatically. The system simply
                            will not let a cargo overload, a double-booking, or an expired license through — by construction, not by policy.
                        </p>
                    </div>
                </div>
            </div>
            <style>{`
                .about-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; }
                @media (min-width: 860px) {
                    .about-grid { grid-template-columns: 1fr 1fr; gap: 4rem; }
                }
            `}</style>
        </section>
    );
};

export default About;
