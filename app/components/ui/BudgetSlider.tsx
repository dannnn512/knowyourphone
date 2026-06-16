import { useState, useEffect } from 'react';
import { formatRp, BUDGET_RANGE } from '@/services/recommend';

interface BudgetSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function BudgetSlider({ value, onChange }: BudgetSliderProps) {
  const { min: MIN, max: MAX, step: STEP } = BUDGET_RANGE;
  const [text, setText] = useState(formatRp(value));
  const pct = ((value - MIN) / (MAX - MIN)) * 100;

  useEffect(() => {
    setText(formatRp(value));
  }, [value]);

  function commitText(s: string) {
    const n = parseInt(s.replace(/[^\d]/g, ''), 10);
    if (isNaN(n)) { setText(formatRp(value)); return; }
    const clamped = Math.max(MIN, Math.min(MAX, Math.round(n / STEP) * STEP));
    onChange(clamped);
  }

  return (
    <div className="kp-budget">
      <div className="kp-slider-wrap">
        <div className="kp-slider-track">
          <div className="kp-slider-fill" style={{ width: `${pct}%` }} />
        </div>
        <input
          type="range"
          min={MIN} max={MAX} step={STEP}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="kp-slider"
        />
        <div className="kp-slider-thumb" style={{ left: `${pct}%` }} />
      </div>
      <div className="kp-slider-bounds">
        <span>{formatRp(MIN)}</span>
        <span>{formatRp(MAX)}</span>
      </div>
      <div className="kp-budget-input-wrap">
        <input
          type="text"
          className="kp-budget-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => commitText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              commitText(e.currentTarget.value);
              e.currentTarget.blur();
            }
          }}
        />
      </div>
    </div>
  );
}
