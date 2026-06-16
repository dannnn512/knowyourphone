import { useState } from 'react';
import { Header } from '@/components/features/Header';
import { InputForm } from '@/components/features/InputForm';
import { ResultCard } from '@/components/features/ResultCard';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import { useRecommendation } from '@/hooks/useRecommendation';
import type { UserInput } from '@/types';

const DEFAULT_INPUT: UserInput = {
  budget: 2_000_000,
  brand: 'Apa aja',
  use: '',
  keep: '',
  condition: '',
};

export default function App() {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggle: toggleTheme } = useTheme();
  const [screen, setScreen] = useState<'input' | 'result'>('input');
  const [formState, setFormState] = useState<UserInput>(DEFAULT_INPUT);
  const [submittedInput, setSubmittedInput] = useState<UserInput | null>(null);
  const { recommendation, loading, error, retry } = useRecommendation(submittedInput, lang);

  function handleSubmit() {
    setSubmittedInput({ ...formState });
    setScreen('result');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function handleStartOver() {
    setScreen('input');
    setSubmittedInput(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  return (
    <div className="kp-app">
      <div className="kp-phone-stage">
        <Header
          lang={lang}
          setLang={setLang}
          theme={theme}
          onThemeToggle={toggleTheme}
          showStartOver={screen === 'result'}
          onStartOver={handleStartOver}
          t={t}
        />
        <div className="kp-scroll" key={screen}>
          {screen === 'input' && (
            <InputForm
              lang={lang}
              state={formState}
              onStateChange={setFormState}
              onSubmit={handleSubmit}
              t={t}
            />
          )}
          {screen === 'result' && loading && (
            <main className="kp-result">
              <div className="kp-loading">
                <div className="kp-loading-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <p>{t.loading}</p>
              </div>
            </main>
          )}
          {screen === 'result' && !loading && error && (
            <main className="kp-result">
              <div className="kp-error">
                <h2 className="kp-error-title">{t.error_title}</h2>
                <p className="kp-error-body">{t.error_body}</p>
                <button className="kp-error-retry" onClick={retry}>
                  {t.retry_button}
                </button>
              </div>
            </main>
          )}
          {screen === 'result' && !loading && !error && recommendation && (
            <ResultCard
              recommendation={recommendation}
              lang={lang}
              t={t}
              onStartOver={handleStartOver}
            />
          )}
        </div>
      </div>
    </div>
  );
}
