import { lazy, Suspense, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SplitType from 'split-type';
import { ArrowRight, ChevronDown, PlayCircle } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../../../animations/gsapConfig';
import { useMagnetic } from '../../../hooks/useMagnetic';

const RouteNetwork = lazy(() => import('../../../components/ThreeScene/RouteNetwork'));

const Hero = ({ reducedMotion }) => {
    const headlineRef = useRef(null);
    const primaryCtaRef = useMagnetic(0.3);
    const ghostCtaRef = useMagnetic(0.3);

    useEffect(() => {
        if (!headlineRef.current) return undefined;

        if (prefersReducedMotion()) {
            gsap.set('.hero-fade', { opacity: 1, y: 0 });
            return undefined;
        }

        const split = new SplitType(headlineRef.current, { types: 'lines,words' });
        const tl = gsap.timeline({ delay: 0.15 });

        tl.fromTo(
            split.words,
            { yPercent: 120, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 1, ease: 'power4.out', stagger: 0.03 }
        ).fromTo(
            '.hero-fade',
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1 },
            '-=0.5'
        );

        return () => split.revert();
    }, []);

    return (
        <section id="top" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: 0 }}>
            <Suspense
                fallback={
                    <div
                        aria-hidden="true"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background:
                                'radial-gradient(60% 50% at 70% 30%, rgba(56,189,248,0.16), transparent), radial-gradient(40% 40% at 20% 80%, rgba(245,158,11,0.08), transparent)',
                        }}
                    />
                }
            >
                <RouteNetwork reduced={reducedMotion} />
            </Suspense>
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(5,7,13,0.2) 0%, rgba(5,7,13,0.55) 60%, #05070d 100%)',
                }}
            />
            <div className="section-inner" style={{ position: 'relative', paddingTop: '8rem', paddingBottom: '6rem', width: '100%' }}>
                <span className="eyebrow hero-fade" style={{ opacity: 0 }}>Smart transport operations</span>

                <h1
                    ref={headlineRef}
                    style={{
                        marginTop: '1.25rem',
                        fontSize: 'clamp(2.6rem, 6.5vw, 5.4rem)',
                        maxWidth: '15ch',
                        color: '#f8fafc',
                    }}
                >
                    Every vehicle, driver, and trip — under one set of rules.
                </h1>

                <p className="hero-fade" style={{ opacity: 0, marginTop: '1.75rem', maxWidth: '46ch', fontSize: '1.15rem' }}>
                    FleetFlow replaces the logbook and the spreadsheet with a platform that enforces capacity limits, license validity, and dispatch conflicts automatically — before they become a problem in the yard.
                </p>

                <div className="hero-fade" style={{ opacity: 0, marginTop: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    <Link ref={primaryCtaRef} to="/register" className="btn btn-primary">
                        Get started free <ArrowRight size={18} />
                    </Link>
                    <a ref={ghostCtaRef} href="#how-it-works" className="btn btn-ghost">
                        <PlayCircle size={18} /> See how it works
                    </a>
                </div>

                <div className="hero-fade" style={{ opacity: 0, marginTop: '4rem', display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
                    {[
                        ['4', 'operational modules'],
                        ['0', 'manual status updates'],
                        ['1', 'source of truth'],
                    ].map(([n, label]) => (
                        <div key={label}>
                            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.7rem', color: '#f1f5f9' }}>{n}</div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                {label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <a
                href="#about"
                aria-label="Scroll to learn more"
                className="scroll-indicator"
                style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#64748b',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                }}
            >
                <ChevronDown size={20} />
            </a>

            <style>{`
                .scroll-indicator { animation: bob 2.2s ease-in-out infinite; }
                @keyframes bob { 0%,100% { transform: translate(-50%,0); } 50% { transform: translate(-50%,8px); } }
            `}</style>
        </section>
    );
};

export default Hero;
