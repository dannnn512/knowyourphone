import { Icon } from '@/components/ui/Icon';
import { BudgetSlider } from '@/components/ui/BudgetSlider';
import { UseCard } from '@/components/ui/UseCard';
import { RowCard } from '@/components/ui/RowCard';
import { SummaryPanel } from './SummaryPanel';
import type { UserInput, Language } from '@/types';
import type { Strings } from '@/data/en';

interface InputFormProps {
  lang: Language;
  state: UserInput;
  onStateChange: (state: UserInput) => void;
  onSubmit: () => void;
  t: Strings;
}

const BRAND_OPTIONS = [
  'Apa aja', 'Xiaomi', 'Samsung', 'OPPO', 'iPhone', 'vivo', 'Realme',
  'Redmi', 'POCO', 'Infinix', 'TECNO', 'iQOO', 'itel', 'Honor', 'Huawei',
  'ASUS', 'Motorola', 'Nokia', 'Nothing',
] as const;

export function InputForm({ lang, state, onStateChange, onSubmit, t }: InputFormProps) {
  const update = (partial: Partial<UserInput>) => onStateChange({ ...state, ...partial });
  const canSubmit = !!state.use && !!state.keep && !!state.condition;

  const useCases = [
    { id: 'gaming', icon: 'gamepad', label: t.use_gaming, sub: t.use_gaming_sub },
    { id: 'camera', icon: 'camera',  label: t.use_camera, sub: t.use_camera_sub },
    { id: 'social', icon: 'play',    label: t.use_social, sub: t.use_social_sub },
    { id: 'basic',  icon: 'phone',   label: t.use_basic,  sub: t.use_basic_sub  },
  ] as const;

  const keepOptions = [
    { id: 'short', label: t.keep_short, sub: t.keep_short_sub },
    { id: 'mid',   label: t.keep_mid,   sub: t.keep_mid_sub   },
    { id: 'long',  label: t.keep_long,  sub: t.keep_long_sub  },
  ] as const;

  const condOptions = [
    { id: 'new',  label: t.cond_new  },
    { id: 'open', label: t.cond_open },
    { id: 'pref', label: t.cond_pref },
  ] as const;

  return (
    <main className="kp-input" data-screen-label="Input">
      <div className="kp-input-questions">
        <div className="kp-hero">
          <h1 className="kp-h1">
            {lang === 'en' ? (
              <>The right phone, <em>matched to you.</em></>
            ) : (
              <>HP yang tepat, <em>sesuai kamu.</em></>
            )}
          </h1>
          <p className="kp-hero-sub">{t.tagline}</p>
        </div>

        <section className="kp-q">
          <div className="kp-q-head">
            <span className="kp-q-num">01</span>
            <h2 className="kp-q-title">{t.q_budget}</h2>
          </div>
          <BudgetSlider value={state.budget} onChange={(v) => update({ budget: v })} />
          <p className="kp-q-hint">{t.q_budget_hint}</p>
        </section>

        <section className="kp-q">
          <div className="kp-q-head">
            <span className="kp-q-num">02</span>
            <h2 className="kp-q-title">{t.q_brand}</h2>
          </div>
          <input
            type="text"
            list="brands"
            className="kp-brand-input"
            value={state.brand}
            placeholder={t.brand_any}
            onChange={(e) => update({ brand: e.target.value })}
          />
          <datalist id="brands">
            {BRAND_OPTIONS.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
          <p className="kp-q-hint">{t.q_brand_hint}</p>
        </section>

        <section className="kp-q">
          <div className="kp-q-head">
            <span className="kp-q-num">03</span>
            <h2 className="kp-q-title">{t.q_use}</h2>
          </div>
          <div className="kp-grid-2">
            {useCases.map((o) => (
              <UseCard
                key={o.id}
                selected={state.use === o.id}
                onClick={() => update({ use: o.id })}
                icon={o.icon}
                label={o.label}
                sub={o.sub}
              />
            ))}
            <UseCard
              wide
              selected={state.use === 'tough'}
              onClick={() => update({ use: 'tough' })}
              icon="battery"
              label={t.use_tough}
              sub={t.use_tough_sub}
            />
          </div>
        </section>

        <section className="kp-q">
          <div className="kp-q-head">
            <span className="kp-q-num">04</span>
            <h2 className="kp-q-title">{t.q_keep}</h2>
          </div>
          <div className="kp-row-3">
            {keepOptions.map((o) => (
              <RowCard
                key={o.id}
                selected={state.keep === o.id}
                onClick={() => update({ keep: o.id })}
                label={o.label}
                sub={o.sub}
              />
            ))}
          </div>
        </section>

        <section className="kp-q">
          <div className="kp-q-head">
            <span className="kp-q-num">05</span>
            <h2 className="kp-q-title">{t.q_cond}</h2>
          </div>
          <div className="kp-row-3">
            {condOptions.map((o) => (
              <RowCard
                key={o.id}
                selected={state.condition === o.id}
                onClick={() => update({ condition: o.id })}
                label={o.label}
              />
            ))}
          </div>
        </section>

        <button className="kp-cta" onClick={onSubmit} disabled={!canSubmit}>
          <span>{t.cta}</span>
          <Icon name="arrow-right" size={18} stroke={2} />
        </button>
        <div style={{ height: 24 }} />
      </div>

      <SummaryPanel lang={lang} state={state} onSubmit={onSubmit} t={t} />
    </main>
  );
}
