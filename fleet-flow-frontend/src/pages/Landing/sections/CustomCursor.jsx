import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../../animations/gsapConfig';

const CustomCursor = () => {
    const dotRef = useRef(null);
    const ringRef = useRef(null);

    useEffect(() => {
        if (prefersReducedMotion() || window.matchMedia('(hover: none)').matches) return undefined;

        const dot = dotRef.current;
        const ring = ringRef.current;
        const ringPos = { x: 0, y: 0 };

        const move = (e) => {
            gsap.set(dot, { x: e.clientX, y: e.clientY });
            gsap.to(ringPos, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
                ease: 'power3.out',
                onUpdate: () => gsap.set(ring, { x: ringPos.x, y: ringPos.y }),
            });
        };

        const grow = () => gsap.to(ring, { scale: 1.8, duration: 0.3 });
        const shrink = () => gsap.to(ring, { scale: 1, duration: 0.3 });

        window.addEventListener('mousemove', move);
        document.querySelectorAll('.landing a, .landing button').forEach((el) => {
            el.addEventListener('mouseenter', grow);
            el.addEventListener('mouseleave', shrink);
        });

        return () => {
            window.removeEventListener('mousemove', move);
        };
    }, []);

    return (
        <div className="custom-cursor-root" aria-hidden="true">
            <div ref={dotRef} className="cursor-dot" />
            <div ref={ringRef} className="cursor-ring" />
            <style>{`
                @media (hover: none) { .custom-cursor-root { display: none; } }
                .cursor-dot, .cursor-ring {
                    position: fixed; top: 0; left: 0; pointer-events: none; z-index: 200;
                    border-radius: 999px; transform: translate(-50%, -50%);
                }
                .cursor-dot { width: 6px; height: 6px; background: #38bdf8; margin-left: -3px; margin-top: -3px; }
                .cursor-ring { width: 32px; height: 32px; border: 1px solid rgba(56,189,248,0.5); margin-left: -16px; margin-top: -16px; }
                @media (max-width: 899px) { .custom-cursor-root { display: none; } }
            `}</style>
        </div>
    );
};

export default CustomCursor;
