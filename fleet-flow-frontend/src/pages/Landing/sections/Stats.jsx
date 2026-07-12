import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../../animations/gsapConfig';
import { STATS } from '../data/content';

const Stats = () => {
    const rootRef = useRef(null);
    const valueRefs = useRef([]);

    useEffect(() => {
        const targets = valueRefs.current;

        if (prefersReducedMotion()) {
            targets.forEach((el, i) => {
                if (el) el.textContent = STATS[i].value.toFixed(STATS[i].decimals) + STATS[i].suffix;
            });
            return undefined;
        }

        const ctx = gsap.context(() => {
            targets.forEach((el, i) => {
                if (!el) return;
                const counter = { val: 0 };
                gsap.to(counter, {
                    val: STATS[i].value,
                    duration: 1.6,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: rootRef.current, start: 'top 75%', once: true },
                    onUpdate: () => {
                        el.textContent = counter.val.toFixed(STATS[i].decimals) + STATS[i].suffix;
                    },
                });
            });
            gsap.from('.stat-card', {
                opacity: 0,
                y: 24,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: { trigger: rootRef.current, start: 'top 78%', once: true },
            });
        }, rootRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={rootRef}>
            <div className="section-inner">
                <div className="section-head">
                    <span className="eyebrow">By the numbers</span>
                    <h2 style={{ color: '#f8fafc' }}>What automated rule-checking looks like at scale</h2>
                </div>

                <div className="stats-grid">
                    {STATS.map((s, i) => (
                        <div key={s.label} className="glass stat-card" style={{ padding: '2rem', opacity: 1 }}>
                            <s.icon size={20} color="#f59e0b" />
                            <div
                                ref={(el) => { valueRefs.current[i] = el; }}
                                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.6rem)', color: '#f8fafc', marginTop: '1rem' }}
                            >
                                0
                            </div>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.88rem' }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
                @media (min-width: 860px) { .stats-grid { grid-template-columns: repeat(4, 1fr); } }
            `}</style>
        </section>
    );
};

export default Stats;
