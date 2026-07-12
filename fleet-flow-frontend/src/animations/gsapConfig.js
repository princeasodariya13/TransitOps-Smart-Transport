import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const revealUp = (targets, opts = {}) => {
    if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
    }
    gsap.fromTo(
        targets,
        { opacity: 0, y: opts.y ?? 36 },
        {
            opacity: 1,
            y: 0,
            duration: opts.duration ?? 0.9,
            ease: 'power3.out',
            stagger: opts.stagger ?? 0.12,
            scrollTrigger: {
                trigger: opts.trigger ?? targets,
                start: opts.start ?? 'top 82%',
                once: true,
            },
        }
    );
};

export { gsap, ScrollTrigger };
