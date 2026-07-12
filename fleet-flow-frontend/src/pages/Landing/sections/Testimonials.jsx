import { useEffect, useRef } from 'react';
import { Quote } from 'lucide-react';
import { revealUp } from '../../../animations/gsapConfig';
import { TESTIMONIALS } from '../data/content';

const Testimonials = () => {
    const rootRef = useRef(null);

    useEffect(() => {
        revealUp('.quote-card', { trigger: rootRef.current, stagger: 0.12 });
    }, []);

    return (
        <section ref={rootRef}>
            <div className="section-inner">
                <div className="section-head">
                    <span className="eyebrow">From the yard, not the pitch deck</span>
                    <h2 style={{ color: '#f8fafc' }}>What changes on the ground</h2>
                </div>

                <div className="quote-grid">
                    {TESTIMONIALS.map((t) => (
                        <figure key={t.name} className="quote-card glass" style={{ opacity: 0, padding: '2rem' }}>
                            <Quote size={22} color="#f59e0b" />
                            <blockquote style={{ marginTop: '1.25rem', fontSize: '1rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                                {t.quote}
                            </blockquote>
                            <figcaption style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                                {t.name} · {t.org}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>

            <style>{`
                .quote-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
                @media (min-width: 860px) { .quote-grid { grid-template-columns: repeat(3, 1fr); } }
            `}</style>
        </section>
    );
};

export default Testimonials;
