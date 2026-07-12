import { useEffect, useRef } from 'react';
import { Truck, MapPin, Wrench, BarChart3 } from 'lucide-react';
import { revealUp } from '../../../animations/gsapConfig';

const KPIS = [
    { icon: Truck, label: 'Active vehicles', value: '128', tone: 'signal' },
    { icon: MapPin, label: 'Trips in progress', value: '34', tone: 'amber' },
    { icon: Wrench, label: 'In maintenance', value: '6', tone: 'signal' },
];

const Gallery = () => {
    const rootRef = useRef(null);

    useEffect(() => {
        revealUp('.gallery-frame', { trigger: rootRef.current, y: 40 });
    }, []);

    return (
        <section ref={rootRef}>
            <div className="section-inner">
                <div className="section-head">
                    <span className="eyebrow">Inside the platform</span>
                    <h2 style={{ color: '#f8fafc' }}>The dashboard your team actually opens</h2>
                    <p>Fleet utilization, active trips, and cost figures, live — filtered by vehicle type, status, or region.</p>
                </div>

                <div className="gallery-frame glass" style={{ opacity: 0, padding: 'clamp(1rem, 3vw, 2rem)' }}>
                    <div className="frame-chrome">
                        <span className="dot" style={{ background: '#f87171' }} />
                        <span className="dot" style={{ background: '#fbbf24' }} />
                        <span className="dot" style={{ background: '#34d399' }} />
                        <span style={{ marginLeft: '1rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#64748b' }}>
                            app.fleetflow.io/dashboard
                        </span>
                    </div>

                    <div className="frame-body">
                        <div className="kpi-row">
                            {KPIS.map((k) => (
                                <div key={k.label} className="kpi-tile">
                                    <div className="kpi-icon" data-tone={k.tone}>
                                        <k.icon size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.4rem', color: '#f1f5f9' }}>{k.value}</div>
                                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{k.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="chart-mock">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem' }}>
                                <BarChart3 size={16} /> Fleet utilization — last 30 days
                            </div>
                            <div className="bars">
                                {[42, 58, 51, 70, 64, 82, 76, 90, 71, 85, 66, 94].map((h, i) => (
                                    <span key={i} style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .frame-chrome { display: flex; align-items: center; gap: 0.4rem; padding-bottom: 1rem; border-bottom: 1px solid var(--line); }
                .dot { width: 9px; height: 9px; border-radius: 999px; }
                .frame-body { padding-top: 1.5rem; }
                .kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; }
                .kpi-tile { background: rgba(255,255,255,0.03); border: 1px solid var(--line); border-radius: 14px; padding: 1.1rem; display: flex; gap: 0.9rem; align-items: center; }
                .kpi-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .kpi-icon[data-tone='signal'] { background: var(--signal-soft); color: var(--signal); }
                .kpi-icon[data-tone='amber'] { background: var(--amber-soft); color: var(--amber); }
                .chart-mock { margin-top: 1.5rem; background: rgba(255,255,255,0.03); border: 1px solid var(--line); border-radius: 14px; padding: 1.25rem; }
                .bars { margin-top: 1rem; display: flex; align-items: flex-end; gap: 6px; height: 90px; }
                .bars span { flex: 1; background: linear-gradient(180deg, #38bdf8, #0284c7); border-radius: 3px 3px 0 0; opacity: 0.85; }
            `}</style>
        </section>
    );
};

export default Gallery;
