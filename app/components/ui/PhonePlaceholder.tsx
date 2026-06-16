interface PhonePlaceholderProps {
  name: string;
  small?: boolean;
}

export function PhonePlaceholder({ name, small }: PhonePlaceholderProps) {
  return (
    <div className={`kp-phone-shot${small ? ' is-small' : ''}`}>
      <div className="kp-phone-shot-bg" aria-hidden="true">
        <div className="kp-phone-shape">
          <div className="kp-phone-screen">
            <div className="kp-phone-notch" />
          </div>
        </div>
      </div>
      {!small && (
        <div className="kp-phone-shot-caption">product photo · {name}</div>
      )}
    </div>
  );
}
