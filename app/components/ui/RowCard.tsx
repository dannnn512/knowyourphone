interface RowCardProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  sub?: string;
}

export function RowCard({ selected, onClick, label, sub }: RowCardProps) {
  return (
    <button
      type="button"
      className={`kp-row-card${selected ? ' is-selected' : ''}`}
      onClick={onClick}
    >
      <span className="kp-row-label">{label}</span>
      {sub && <span className="kp-row-sub">{sub}</span>}
    </button>
  );
}
