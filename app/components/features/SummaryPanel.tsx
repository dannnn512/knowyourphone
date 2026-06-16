import { Icon } from '@/components/ui/Icon';
import { formatRp } from '@/services/recommend';
import type { UserInput, Language } from '@/types';
import type { Strings } from '@/data/en';

interface SummaryPanelProps {
  lang: Language;
  state: UserInput;
  onSubmit: () => void;
  t: Strings;
}

export function SummaryPanel({ lang, state, onSubmit, t }: SummaryPanelProps) {
  const useMap: Record<string, { icon: string; label: string }> = {
    gaming: { icon: 'gamepad', label: t.use_gaming },
    camera: { icon: 'camera', label: t.use_camera },
    social: { icon: 'play',   label: t.use_social },
    basic:  { icon: 'phone',  label: t.use_basic },
    tough:  { icon: 'battery', label: t.use_tough },
  };
  const keepMap: Record<string, string> = {
    short: t.keep_short,
    mid: t.keep_mid,
    long: t.keep_long,
  };
  const condMap: Record<string, string> = {
    new: t.cond_new,
    open: t.cond_open,
    pref: t.cond_pref,
  };

  const filled = [!!state.budget, !!state.use, !!state.keep, !!state.condition];
  const completion = filled.filter(Boolean).length;
  const ready = completion === 4;

  return (
    <aside className="kp-summary" aria-label="Your selections">
      <div className="kp-summary-inner">
        <div className="kp-summary-head">
          <span className="kp-summary-eyebrow">{t.yourPicks}</span>
          <span className="kp-summary-progress">{completion}/4</span>
        </div>
        <div className="kp-summary-progress-bar">
          <div className="kp-summary-progress-fill" style={{ width: `${(completion / 4) * 100}%` }} />
        </div>
        <dl className="kp-summary-list">
          <div className="kp-summary-row">
            <dt>{t.budget}</dt>
            <dd className="is-filled">{formatRp(state.budget)}</dd>
          </div>
          <div className="kp-summary-row">
            <dt>{t.forLabel}</dt>
            <dd className={state.use ? 'is-filled' : ''}>
              {state.use ? (
                <span className="kp-summary-pill">
                  <Icon name={useMap[state.use].icon} size={13} stroke={2} />
                  {useMap[state.use].label}
                </span>
              ) : t.notYetSelected}
            </dd>
          </div>
          <div className="kp-summary-row">
            <dt>{t.keepFor}</dt>
            <dd className={state.keep ? 'is-filled' : ''}>
              {state.keep ? keepMap[state.keep] : t.notYetSelected}
            </dd>
          </div>
          <div className="kp-summary-row">
            <dt>{t.condition}</dt>
            <dd className={state.condition ? 'is-filled' : ''}>
              {state.condition ? condMap[state.condition] : t.notYetSelected}
            </dd>
          </div>
        </dl>
        <button className="kp-cta kp-summary-cta" onClick={onSubmit} disabled={!ready}>
          <span>{t.cta}</span>
          <Icon name="arrow-right" size={18} stroke={2} />
        </button>
        <p className="kp-summary-foot">{t.matchedAgainst}</p>
      </div>
    </aside>
  );
}
