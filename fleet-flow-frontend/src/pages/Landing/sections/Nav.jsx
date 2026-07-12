import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../../logo.png';
import { NAV_LINKS } from '../data/content';

const Nav = () => {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                padding: scrolled ? '0.7rem clamp(1.25rem,5vw,4rem)' : '1.25rem clamp(1.25rem,5vw,4rem)',
                background: scrolled ? 'rgba(5,7,13,0.72)' : 'transparent',
                backdropFilter: scrolled ? 'blur(14px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(148,163,184,0.14)' : '1px solid transparent',
                transition: 'all 0.4s ease',
            }}
        >
            <nav className="section-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} aria-label="Primary">
                <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
                    <img src={logo} alt="FleetFlow logo" width={32} height={32} style={{ borderRadius: 8 }} />
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: '#f1f5f9', fontSize: '1.05rem' }}>
                        FleetFlow
                    </span>
                </a>

                <div className="nav-links" style={{ display: 'none', gap: '2rem', alignItems: 'center' }}>
                    {NAV_LINKS.map((l) => (
                        <a key={l.href} href={l.href} className="nav-link">
                            {l.label}
                        </a>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Link to="/login" className="btn btn-ghost nav-cta-desktop">Sign in</Link>
                    <Link to="/register" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
                        Get started
                    </Link>
                    <button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        aria-expanded={open}
                        className="nav-burger"
                        style={{ background: 'none', border: 'none', color: '#f1f5f9', display: 'none', cursor: 'pointer' }}
                    >
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {open && (
                <div
                    style={{
                        marginTop: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        paddingBottom: '1rem',
                    }}
                >
                    {NAV_LINKS.map((l) => (
                        <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="nav-link">
                            {l.label}
                        </a>
                    ))}
                    <Link to="/login" onClick={() => setOpen(false)} className="nav-link">Sign in</Link>
                </div>
            )}

            <style>{`
                .nav-link { font-size: 0.9rem; color: #cbd5e1; text-decoration: none; transition: color .25s ease; }
                .nav-link:hover { color: #38bdf8; }
                @media (min-width: 900px) {
                    .nav-links { display: flex !important; }
                }
                @media (max-width: 899px) {
                    .nav-cta-desktop { display: none; }
                    .nav-burger { display: inline-flex !important; }
                }
            `}</style>
        </header>
    );
};

export default Nav;
