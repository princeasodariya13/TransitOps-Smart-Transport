import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../animations/gsapConfig';

export const useMagnetic = (strength = 0.35) => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || prefersReducedMotion()) return undefined;
        if (window.matchMedia('(hover: none)').matches) return undefined;

        const handleMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(el, {
                x: x * strength,
                y: y * strength,
                duration: 0.5,
                ease: 'power3.out',
            });
        };

        const handleLeave = () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        };

        el.addEventListener('mousemove', handleMove);
        el.addEventListener('mouseleave', handleLeave);
        return () => {
            el.removeEventListener('mousemove', handleMove);
            el.removeEventListener('mouseleave', handleLeave);
        };
    }, [strength]);

    return ref;
};
