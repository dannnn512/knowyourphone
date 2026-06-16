import { Icon } from './Icon';

interface UseCardProps {
  selected: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  sub?: string;
  wide?: boolean;
}

export function UseCard({ selected, onClick, icon, label, sub, wide }: UseCardProps) {
  return (
    <button
      type="button"
      className={`kp-use-card${selected ? ' is-selected' : ''}${wide ? ' is-wide' : ''}`}
      onClick={onClick}
    >
      <div className="kp-use-icon">
        <Icon name={icon} size={22} stroke={1.8} />
      </div>
      <div className="kp-use-text">
        <div className="kp-use-label">{label}</div>
        {sub && <div className="kp-use-sub">{sub}</div>}
      </div>
      <div className="kp-radio" aria-hidden="true">
        {selected && <Icon name="check" size={12} stroke={3} />}
      </div>
    </button>
  );
}
