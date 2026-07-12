import { Link } from 'react-router-dom';
import logo from '../../../logo.png';
import { NAV_LINKS } from '../data/content';

const LandingFooter = () => (
    <footer style={{ borderTop: '1px solid var(--line)', padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.25rem, 5vw, 4rem)' }}>
        <div className="section-inner footer-grid">
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <img src={logo} alt="FleetFlow logo" width={28} height={28} style={{ borderRadius: 7 }} />
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#f1f5f9', fontWeight: 600 }}>FleetFlow</span>
                </div>
                <p style={{ marginTop: '1rem', maxWidth: '32ch', fontSize: '0.88rem' }}>
                    Smart transport operations — vehicles, drivers, trips, and maintenance, under one set of rules.
                </p>
            </div>

            <nav aria-label="Footer">
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'JetBrains Mono', monospace" }}>
                    Platform
                </span>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {NAV_LINKS.map((l) => (
                        <li key={l.href}>
                            <a href={l.href} className="nav-link">{l.label}</a>
                        </li>
                    ))}
                </ul>
            </nav>

            <nav aria-label="Account">
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'JetBrains Mono', monospace" }}>
                    Account
                </span>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <li><Link to="/login" className="nav-link">Sign in</Link></li>
                    <li><Link to="/register" className="nav-link">Create account</Link></li>
                </ul>
            </nav>
        </div>

        <div className="section-inner" style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--line)', fontSize: '0.8rem', color: '#475569' }}>
            © {new Date().getFullYear()} FleetFlow. Built for operations teams that would rather trust the system than remember the rules.
        </div>

        <style>{`
            .footer-grid { display: grid; grid-template-columns: 1fr; gap: 2.5rem; }
            @media (min-width: 700px) { .footer-grid { grid-template-columns: 1.4fr 1fr 1fr; } }
        `}</style>
    </footer>
);

export default LandingFooter;
