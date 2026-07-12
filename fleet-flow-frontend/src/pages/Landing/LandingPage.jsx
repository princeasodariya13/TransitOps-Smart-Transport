import { useEffect, useState } from 'react';
import { useLenis } from '../../hooks/useLenis';
import { prefersReducedMotion } from '../../animations/gsapConfig';
import '../../styles/landing.css';

import Loader from './sections/Loader';
import Nav from './sections/Nav';
import CustomCursor from './sections/CustomCursor';
import Hero from './sections/Hero';
import About from './sections/About';
import Features from './sections/Features';
import HowItWorks from './sections/HowItWorks';
import Timeline from './sections/Timeline';
import Stats from './sections/Stats';
import WhyChooseUs from './sections/WhyChooseUs';
import Roles from './sections/Roles';
import Gallery from './sections/Gallery';
import Testimonials from './sections/Testimonials';
import FAQ from './sections/FAQ';
import CTA from './sections/CTA';
import LandingFooter from './sections/LandingFooter';

const SEO_TITLE = 'FleetFlow — Smart Transport Operations Platform';
const SEO_DESC =
    'Digitize vehicle, driver, dispatch, maintenance, and expense management with automatic business-rule enforcement and live operational insights.';

const useSEO = () => {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = SEO_TITLE;

        const tags = [
            { name: 'description', content: SEO_DESC },
            { property: 'og:title', content: SEO_TITLE },
            { property: 'og:description', content: SEO_DESC },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: SEO_TITLE },
            { name: 'twitter:description', content: SEO_DESC },
        ];

        const created = tags.map((t) => {
            const el = document.createElement('meta');
            if (t.name) el.setAttribute('name', t.name);
            if (t.property) el.setAttribute('property', t.property);
            el.setAttribute('content', t.content);
            document.head.appendChild(el);
            return el;
        });

        return () => {
            document.title = prevTitle;
            created.forEach((el) => el.remove());
        };
    }, []);
};

const LandingPage = () => {
    const [loading, setLoading] = useState(true);
    const reducedMotion = prefersReducedMotion() || typeof window !== 'undefined' && window.innerWidth < 700;

    useSEO();
    useLenis();

    return (
        <div className="landing">
            {loading && <Loader onDone={() => setLoading(false)} />}
            <div className="grain" />
            <CustomCursor />
            <Nav />
            <main>
                <Hero reducedMotion={reducedMotion} />
                <About />
                <Features />
                <HowItWorks />
                <Timeline />
                <Stats />
                <WhyChooseUs />
                <Roles />
                <Gallery />
                <Testimonials />
                <FAQ />
                <CTA />
            </main>
            <LandingFooter />
        </div>
    );
};

export default LandingPage;
