interface IconProps {
  name: string;
  size?: number;
  stroke?: number;
  className?: string;
}

export function Icon({ name, size = 24, stroke = 1.75, className = '' }: IconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor' as const,
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  };

  switch (name) {
    case 'gamepad':
      return (
        <svg {...props}>
          <line x1="6" y1="12" x2="10" y2="12" />
          <line x1="8" y1="10" x2="8" y2="14" />
          <line x1="15" y1="13" x2="15.01" y2="13" />
          <line x1="18" y1="11" x2="18.01" y2="11" />
          <rect x="2" y="6" width="20" height="12" rx="6" />
        </svg>
      );
    case 'camera':
      return (
        <svg {...props}>
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      );
    case 'play':
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="M10 9.5v5l4-2.5-4-2.5z" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...props}>
          <rect x="6" y="2" width="12" height="20" rx="2.5" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
      );
    case 'battery':
      return (
        <svg {...props}>
          <rect x="2" y="8" width="17" height="8" rx="1.5" />
          <line x1="21" y1="11" x2="21" y2="13" />
          <line x1="5" y1="11" x2="5" y2="13" />
          <line x1="8" y1="11" x2="8" y2="13" />
          <line x1="11" y1="11" x2="11" y2="13" />
          <line x1="14" y1="11" x2="14" y2="13" />
        </svg>
      );
    case 'check':
      return <svg {...props}><polyline points="20 6 9 17 4 12" /></svg>;
    case 'arrow-right':
      return (
        <svg {...props}>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="13 6 19 12 13 18" />
        </svg>
      );
    case 'arrow-left':
      return (
        <svg {...props}>
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="11 18 5 12 11 6" />
        </svg>
      );
    case 'sun':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="3" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="21" />
          <line x1="3" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="21" y2="12" />
          <line x1="5.6" y1="5.6" x2="6.9" y2="6.9" />
          <line x1="17.1" y1="17.1" x2="18.4" y2="18.4" />
          <line x1="5.6" y1="18.4" x2="6.9" y2="17.1" />
          <line x1="17.1" y1="6.9" x2="18.4" y2="5.6" />
        </svg>
      );
    case 'moon':
      return <svg {...props}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>;
    case 'dot':
      return <svg {...props}><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" /></svg>;
    case 'refresh':
      return (
        <svg {...props}>
          <polyline points="3 4 3 10 9 10" />
          <path d="M3.5 14a9 9 0 1 0 2.4-9.4L3 7" />
        </svg>
      );
    case 'external':
      return (
        <svg {...props}>
          <path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
          <polyline points="14 3 21 3 21 10" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg {...props}>
          <path d="M21 12a9 9 0 1 1-3.6-7.2L21 4l-1 3.6A9 9 0 0 1 21 12z" />
          <path d="M8.5 9.5c0 3 2 5 5 5l1.5-1.5-2-1-1 1c-1-.5-1.5-1-2-2l1-1-1-2-1.5 1.5z" />
        </svg>
      );
    default:
      return null;
  }
}
