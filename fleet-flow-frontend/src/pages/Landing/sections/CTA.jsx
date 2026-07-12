import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { revealUp } from '../../../animations/gsapConfig';
import { useMagnetic } from '../../../hooks/useMagnetic';

const CTA = () => {
    const rootRef = useRef(null);
    const ctaRef = useMagnetic(0.25);

    useEffect(() => {
        revealUp('.cta-content > *', { trigger: rootRef.current, y: 20 });
    }, []);

    return (
        <section ref={rootRef}>
            <div className="section-inner">
                <div
                    className="glass cta-content"
                    style={{
                        padding: 'clamp(2.5rem, 6vw, 5rem)',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(56,189,248,0.1), rgba(245,158,11,0.06))',
                    }}
                >
                    <span className="eyebrow" style={{ opacity: 0, justifyContent: 'center' }}>Ready when you are</span>
                    <h2 style={{ opacity: 0, marginTop: '1rem', fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: '#f8fafc' }}>
                        Put the rulebook where it belongs — in the software.
                    </h2>
                    <p style={{ opacity: 0, marginTop: '1rem', maxWidth: '46ch', marginLeft: 'auto', marginRight: 'auto' }}>
                        Free to set up. No credit card. Your fleet, drivers, and trips — live in minutes.
                    </p>
                    <div style={{ opacity: 0, marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link ref={ctaRef} to="/register" className="btn btn-primary">
                            Get started free <ArrowRight size={18} />
                        </Link>
                        <Link to="/login" className="btn btn-ghost">Sign in</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
