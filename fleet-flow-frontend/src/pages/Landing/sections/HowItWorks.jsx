import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../../animations/gsapConfig';
import { WORKFLOW_STEPS } from '../data/content';

const HowItWorks = () => {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const stepRefs = useRef([]);

    useEffect(() => {
        if (prefersReducedMotion() || window.innerWidth < 860) return undefined;

        const ctx = gsap.context(() => {
            const steps = stepRefs.current;
            gsap.set(steps, { opacity: 0.25 });
            gsap.set(steps[0], { opacity: 1 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=200%',
                    scrub: 0.6,
                    pin: true,
                },
            });

            steps.forEach((step, i) => {
                if (i === 0) return;
                tl.to(steps[i - 1], { opacity: 0.25, duration: 0.3 }, i - 0.3)
                    .to(step, { opacity: 1, duration: 0.3 }, i - 0.3);
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="how-it-works" ref={sectionRef} style={{ padding: 0 }}>
            <div ref={trackRef} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: 'clamp(4rem, 9vw, 8rem) clamp(1.25rem, 5vw, 4rem)' }}>
                <div className="section-inner">
                    <div className="section-head">
                        <span className="eyebrow">From registration to report</span>
                        <h2 style={{ color: '#f8fafc' }}>How a single trip moves through the system</h2>
                    </div>

                    <div className="howitworks-steps">
                        {WORKFLOW_STEPS.map((step, i) => (
                            <div
                                key={step.index}
                                ref={(el) => { stepRefs.current[i] = el; }}
                                className="glass step-card"
                                style={{ padding: '2rem' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#64748b', fontSize: '0.85rem' }}>
                                        {step.index}
                                    </span>
                                    <span className="status-pill" data-tone={i === 3 ? 'amber' : 'signal'}>{step.tag}</span>
                                </div>
                                <h3 style={{ marginTop: '1.25rem', fontSize: '1.2rem', color: '#f1f5f9' }}>{step.title}</h3>
                                <p style={{ marginTop: '0.6rem', fontSize: '0.92rem' }}>{step.copy}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .howitworks-steps { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
                @media (min-width: 860px) {
                    .howitworks-steps { grid-template-columns: repeat(4, 1fr); }
                }
            `}</style>
        </section>
    );
};

export default HowItWorks;
