'use client';

import { SupportedLanguage } from '@/lib/ai/persona';

interface IdleScreenProps {
    onStart: () => void;
    language: SupportedLanguage;
    onLanguageChange: (lang: SupportedLanguage) => void;
}

export default function IdleScreen({ onStart, language, onLanguageChange }: IdleScreenProps) {
    const titles: Record<SupportedLanguage, string> = {
        ar: 'دار سبستيان',
        fr: 'Dar Sebastien',
        en: 'Dar Sebastien'
    };

    const subtitles: Record<SupportedLanguage, string> = {
        ar: 'المركز الثقافي الدولي بالحمامات',
        fr: 'Centre Culturel International de Hammamet',
        en: 'International Cultural Center of Hammamet'
    };

    const touchTexts: Record<SupportedLanguage, string> = {
        ar: 'المس للبدء',
        fr: 'Touchez pour commencer',
        en: 'Touch to Begin'
    };

    const isRTL = language === 'ar';

    return (
        <div
            className="idle-screen"
            onClick={onStart}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            {/* Background with gradient overlay */}
            <div className="idle-background">
                {/* Gradient background - can be replaced with video */}
                <div style={{
                    width: '100%',
                    height: '100%',
                    background: `
            radial-gradient(ellipse at 30% 20%, rgba(74, 144, 184, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(94, 196, 196, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 60%),
            linear-gradient(180deg, #0a1628 0%, #0f2847 40%, #1a3a5c 100%)
          `
                }}>
                    {/* Animated wave overlay */}
                    <svg
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: '30%',
                            opacity: 0.1
                        }}
                        viewBox="0 0 1440 320"
                        preserveAspectRatio="none"
                    >
                        <path
                            fill="url(#waveGradient)"
                            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        >
                            <animate
                                attributeName="d"
                                dur="10s"
                                repeatCount="indefinite"
                                values="
                  M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L0,320Z;
                  M0,128L48,154.7C96,181,192,235,288,229.3C384,224,480,160,576,149.3C672,139,768,181,864,197.3C960,213,1056,203,1152,181.3C1248,160,1344,128,1392,112L1440,96L1440,320L0,320Z;
                  M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L0,320Z
                "
                            />
                        </path>
                        <defs>
                            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#4a90b8" />
                                <stop offset="50%" stopColor="#5ec4c4" />
                                <stop offset="100%" stopColor="#4a90b8" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div className="idle-overlay" />
            </div>

            {/* Content */}
            <div className="idle-content">
                {/* Logo */}
                <div className="idle-logo" style={{
                    width: 160,
                    height: 160,
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, var(--color-gold) 0%, var(--color-terracotta) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 'bold',
                    color: 'var(--color-dark)',
                    boxShadow: '0 20px 60px rgba(212, 175, 55, 0.3)',
                    margin: '0 auto var(--space-xl)'
                }}>
                    DS
                </div>

                {/* Title */}
                <h1 className="idle-title" style={{
                    fontFamily: isRTL ? 'var(--font-arabic)' : 'var(--font-display)',
                }}>
                    {titles[language]}
                </h1>

                {/* Subtitle */}
                <p className="idle-subtitle" style={{
                    fontFamily: isRTL ? 'var(--font-arabic)' : 'var(--font-body)',
                }}>
                    {subtitles[language]}
                </p>

                {/* Touch Prompt */}
                <div className="touch-prompt">
                    <div className="touch-icon">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-light)" strokeWidth="2">
                            <path d="M12 12.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" />
                            <path d="M7.5 4.21V3a1 1 0 0 1 .667-.943l3.5-1.4a1 1 0 0 1 .666 0l3.5 1.4A1 1 0 0 1 16.5 3v1.21" />
                            <path d="M6.5 15h-2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1" />
                            <path d="M17.5 15h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1" />
                            <path d="M12 19v3" />
                            <path d="M7 19h10a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2Z" />
                        </svg>
                    </div>
                    <span className="touch-text" style={{
                        fontFamily: isRTL ? 'var(--font-arabic)' : 'var(--font-body)',
                    }}>
                        {touchTexts[language]}
                    </span>
                </div>

                {/* Language Selector */}
                <div style={{ marginTop: 'var(--space-2xl)' }}>
                    <div className="language-selector" style={{ justifyContent: 'center' }}>
                        {(['ar', 'fr', 'en'] as SupportedLanguage[]).map(lang => (
                            <button
                                key={lang}
                                className={`lang-btn ${language === lang ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onLanguageChange(lang);
                                }}
                                style={{ padding: 'var(--space-sm) var(--space-lg)', fontSize: '1.125rem' }}
                            >
                                {lang === 'ar' ? 'العربية' : lang === 'fr' ? 'Français' : 'English'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
