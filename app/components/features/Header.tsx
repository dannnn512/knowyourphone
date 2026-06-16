import { Icon } from '@/components/ui/Icon';
import type { Language, Theme } from '@/types';
import type { Strings } from '@/data/en';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  onThemeToggle: () => void;
  showStartOver: boolean;
  onStartOver: () => void;
  t: Strings;
}

export function Header({ lang, setLang, theme, onThemeToggle, showStartOver, onStartOver, t }: HeaderProps) {
  return (
    <header className="kp-header">
      <div className="kp-header-left">
        {showStartOver ? (
          <button className="kp-start-over kp-mobile-only" onClick={onStartOver}>
            <Icon name="arrow-left" size={16} stroke={2} />
            <span>{t.startOver}</span>
          </button>
        ) : (
          <div className="kp-brand kp-mobile-only">
            <span className="kp-brand-dot" />
            <span className="kp-brand-name">{t.appName}</span>
          </div>
        )}
        <a
          href="#"
          className="kp-brand kp-desktop-only"
          onClick={(e) => { e.preventDefault(); if (showStartOver) onStartOver(); }}
        >
          <span className="kp-brand-dot" />
          <span className="kp-brand-name">{t.appName}</span>
        </a>
      </div>
      <div className="kp-header-right">
        {showStartOver && (
          <button className="kp-start-over kp-desktop-only" onClick={onStartOver}>
            <Icon name="refresh" size={14} stroke={2} />
            <span>{t.startOver}</span>
          </button>
        )}
        <div className="kp-seg" role="group" aria-label="Language">
          <button
            className={`kp-seg-btn${lang === 'en' ? ' is-on' : ''}`}
            onClick={() => setLang('en')}
          >
            EN
          </button>
          <button
            className={`kp-seg-btn${lang === 'id' ? ' is-on' : ''}`}
            onClick={() => setLang('id')}
          >
            ID
          </button>
        </div>
        <button className="kp-theme-btn" onClick={onThemeToggle} aria-label="Toggle theme">
          <Icon name={theme === 'light' ? 'moon' : 'sun'} size={16} stroke={2} />
        </button>
      </div>
    </header>
  );
}
