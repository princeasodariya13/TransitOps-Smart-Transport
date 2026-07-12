import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../animations/gsapConfig';

export const useLenis = () => {
    useEffect(() => {
        if (prefersReducedMotion()) return undefined;

        const lenis = new Lenis({
            duration: 1.1,
            smoothWheel: true,
        });

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf);
        };
    }, []);
};
