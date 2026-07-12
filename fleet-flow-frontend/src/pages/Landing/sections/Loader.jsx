import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../../animations/gsapConfig';

const Loader = ({ onDone }) => {
    const rootRef = useRef(null);
    const barRef = useRef(null);
    const pctRef = useRef(null);

    useEffect(() => {
        if (prefersReducedMotion()) {
            onDone();
            return undefined;
        }

        const counter = { val: 0 };
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(rootRef.current, {
                    yPercent: -100,
                    duration: 0.7,
                    ease: 'power4.inOut',
                    onComplete: onDone,
                });
            },
        });

        tl.to(counter, {
            val: 100,
            duration: 1.3,
            ease: 'power2.inOut',
            onUpdate: () => {
                if (pctRef.current) pctRef.current.textContent = Math.floor(counter.val);
                if (barRef.current) barRef.current.style.width = `${counter.val}%`;
            },
        });

        return () => tl.kill();
    }, [onDone]);

    return (
        <div
            ref={rootRef}
            role="status"
            aria-live="polite"
            aria-label="Loading FleetFlow"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                background: '#05070d',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.5rem',
            }}
        >
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', color: '#f1f5f9', letterSpacing: '0.02em' }}>
                FleetFlow
            </span>
            <div style={{ width: 220, height: 2, background: 'rgba(148,163,184,0.2)', borderRadius: 2, overflow: 'hidden' }}>
                <div ref={barRef} style={{ width: 0, height: '100%', background: 'linear-gradient(90deg,#38bdf8,#f59e0b)' }} />
            </div>
            <span ref={pctRef} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#64748b' }}>
                0
            </span>
        </div>
    );
};

export default Loader;
