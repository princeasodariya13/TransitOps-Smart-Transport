import { useEffect, useRef } from 'react';
import { revealUp } from '../../../animations/gsapConfig';
import { ROLES } from '../data/content';

const Roles = () => {
    const rootRef = useRef(null);

    useEffect(() => {
        revealUp('.role-card', { trigger: rootRef.current, stagger: 0.1 });
    }, []);

    return (
        <section id="roles" ref={rootRef}>
            <div className="section-inner">
                <div className="section-head">
                    <span className="eyebrow">Built for the whole team</span>
                    <h2 style={{ color: '#f8fafc' }}>One platform, four working views</h2>
                    <p>Role-based access means everyone sees exactly what their job needs — nothing more, nothing missing.</p>
                </div>

                <div className="role-grid">
                    {ROLES.map((r) => (
                        <div key={r.role} className="role-card glass" style={{ opacity: 0, padding: '2rem' }}>
                            <r.icon size={22} color="#38bdf8" />
                            <span className="status-pill" style={{ marginTop: '1.25rem', display: 'inline-flex' }}>{r.role}</span>
                            <h3 style={{ marginTop: '1rem', fontSize: '1.1rem', color: '#f1f5f9' }}>{r.headline}</h3>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{r.copy}</p>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .role-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
                @media (min-width: 700px) { .role-grid { grid-template-columns: 1fr 1fr; } }
                @media (min-width: 1080px) { .role-grid { grid-template-columns: repeat(4, 1fr); } }
            `}</style>
        </section>
    );
};

export default Roles;
