import { useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { revealUp } from '../../../animations/gsapConfig';
import { FAQS } from '../data/content';

const FAQItem = ({ item, isOpen, onToggle, id }) => (
    <div className="glass faq-item" style={{ padding: 0 }}>
        <h3 style={{ margin: 0 }}>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={`${id}-panel`}
                id={`${id}-button`}
                className="faq-trigger"
            >
                <span>{item.q}</span>
                <Plus size={18} className="faq-icon" style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }} />
            </button>
        </h3>
        <div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-button`}
            className="faq-panel"
            style={{ maxHeight: isOpen ? '220px' : '0px' }}
        >
            <p style={{ padding: '0 1.75rem 1.5rem', fontSize: '0.92rem' }}>{item.a}</p>
        </div>
    </div>
);

const FAQ = () => {
    const rootRef = useRef(null);
    const [openIndex, setOpenIndex] = useState(0);

    useEffect(() => {
        revealUp('.faq-item', { trigger: rootRef.current, stagger: 0.06, y: 18 });
    }, []);

    return (
        <section id="faq" ref={rootRef}>
            <div className="section-inner" style={{ maxWidth: 780, margin: '0 auto' }}>
                <div className="section-head" style={{ maxWidth: 'none', textAlign: 'left' }}>
                    <span className="eyebrow">Questions</span>
                    <h2 style={{ color: '#f8fafc' }}>Answers straight from the rulebook</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {FAQS.map((item, i) => (
                        <FAQItem
                            key={item.q}
                            id={`faq-${i}`}
                            item={item}
                            isOpen={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                        />
                    ))}
                </div>
            </div>

            <style>{`
                .faq-trigger {
                    width: 100%; display: flex; align-items: center; justify-content: space-between;
                    background: none; border: none; color: #f1f5f9; font-size: 1rem; font-weight: 500;
                    text-align: left; cursor: pointer; padding: 1.5rem 1.75rem; font-family: var(--font-body);
                }
                .faq-icon { transition: transform .3s ease; color: #38bdf8; flex-shrink: 0; }
                .faq-panel { overflow: hidden; transition: max-height .4s ease; }
            `}</style>
        </section>
    );
};

export default FAQ;
