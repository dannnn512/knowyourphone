import { useEffect, useRef, useState } from 'react';

interface BrandComboboxProps {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
}

export function BrandCombobox({ value, onChange, options, placeholder }: BrandComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const filtered = q === '' ? options : options.filter((o) => o.toLowerCase().includes(q));

  useEffect(() => {
    if (!open) return;
    function onDocDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, [open]);

  function commit(v: string) {
    onChange(v);
    setOpen(false);
    setQuery('');
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered.length > 0) commit(filtered[0]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      setQuery('');
      e.currentTarget.blur();
    }
  }

  return (
    <div className="kp-combo" ref={rootRef}>
      <input
        type="text"
        className="kp-brand-input"
        value={open ? query : value}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
      />
      {open && (
        <ul className="kp-combo-panel" role="listbox">
          {filtered.length > 0 ? (
            filtered.map((opt) => (
              <li
                key={opt}
                className={`kp-combo-option${opt === value ? ' is-selected' : ''}`}
                role="option"
                aria-selected={opt === value}
                onMouseDown={(e) => {
                  e.preventDefault();
                  commit(opt);
                }}
              >
                {opt}
              </li>
            ))
          ) : (
            <li className="kp-combo-empty">—</li>
          )}
        </ul>
      )}
    </div>
  );
}
