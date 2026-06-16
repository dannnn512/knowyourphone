import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { PhonePlaceholder } from '@/components/ui/PhonePlaceholder';
import { AlternativeCard } from './AlternativeCard';
import { formatRp } from '@/services/recommend';
import type { Language, Recommendation } from '@/types';
import type { Strings } from '@/data/en';

interface ResultCardProps {
  recommendation: Recommendation;
  lang: Language;
  t: Strings;
  onStartOver: () => void;
}

export function ResultCard({ recommendation, lang, t, onStartOver }: ResultCardProps) {
  const { primary, alternates } = recommendation;
  const [specsOpen, setSpecsOpen] = useState(false);

  let stockLabel = t.inStock;
  let stockClass = 'in';
  if (primary.stock === 'limited') { stockLabel = t.limited; stockClass = 'limited'; }
  if (primary.stock === 'second') { stockLabel = t.checkSecond; stockClass = 'second'; }

  const [lo, hi] = primary.price_idr;

  function share() {
    const msg =
      lang === 'id'
        ? `Halo! Aku baru pakai KnowYourPhone dan rekomendasinya: *${primary.name}* (${formatRp(lo)} – ${formatRp(hi)}). Cek juga yuk!`
        : `Hey! KnowYourPhone matched me with the *${primary.name}* (${formatRp(lo)} – ${formatRp(hi)}). Worth a look!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  }

  const tokpedUrl = `https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(primary.name)}`;
  const shopeeUrl = `https://shopee.co.id/search?keyword=${encodeURIComponent(primary.name)}`;

  const hasYoutube = !!primary.youtube_url;

  return (
    <main className="kp-result" data-screen-label="Result">
      <div className="kp-r-head">
        <div className="kp-result-eyebrow">
          <span className="kp-eyebrow-dot" />
          <span>{t.result_top}</span>
        </div>
        <h2 className="kp-phone-name">{primary.name}</h2>
        <div className="kp-hero-meta">
          <span className={`kp-stock kp-stock-${stockClass}`}>
            <Icon name="dot" size={10} /> {stockLabel}
          </span>
        </div>
      </div>

      <div className="kp-r-hero">
        <PhonePlaceholder name={primary.name} />
      </div>

      <section className="kp-r-why kp-why">
        <h3 className="kp-why-title">{t.why}</h3>
        <ul className="kp-why-list">
          {primary.reasons.map((r, i) => (
            <li key={i}>
              <span className="kp-why-bullet">
                <Icon name="check" size={11} stroke={3} />
              </span>
              <span>{r}</span>
            </li>
          ))}
        </ul>

        <button
          className="kp-specs-toggle"
          onClick={() => setSpecsOpen((v) => !v)}
          aria-expanded={specsOpen}
        >
          <span>{specsOpen ? t.specsToggleHide : t.specsToggleShow}</span>
          <span className={`kp-specs-chevron${specsOpen ? ' open' : ''}`}>▾</span>
        </button>

        {specsOpen && (
          <dl className="kp-specs-grid">
            <div><dt>{t.specsChipset}</dt><dd>{primary.specs.chipset}</dd></div>
            <div><dt>{t.specsRam}</dt><dd>{primary.specs.ram}</dd></div>
            <div><dt>{t.specsStorage}</dt><dd>{primary.specs.storage}</dd></div>
            <div><dt>{t.specsBattery}</dt><dd>{primary.specs.battery_mah}</dd></div>
            <div><dt>{t.specsCamera}</dt><dd>{primary.specs.main_camera_mp}</dd></div>
            <div><dt>{t.specsAntutu}</dt><dd>{primary.specs.antutu}</dd></div>
            <div className="kp-specs-full"><dt>{t.specsDisplay}</dt><dd>{primary.specs.display}</dd></div>
          </dl>
        )}
      </section>

      {hasYoutube && (
        <section className="kp-r-review">
          <a
            className="kp-review-link"
            href={primary.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="play" size={14} stroke={2} />
            <span>
              {lang === 'id' ? 'Lihat review' : 'Watch review'}
              {primary.youtube_channel ? ` — ${primary.youtube_channel}` : ''}
            </span>
            <Icon name="external" size={12} stroke={2} />
          </a>
        </section>
      )}

      <div className="kp-r-buy">
        <div className="kp-buy">
          <a className="kp-buy-btn kp-buy-green" href={tokpedUrl} target="_blank" rel="noopener noreferrer">
            <span>Tokopedia</span>
            <Icon name="external" size={14} stroke={2} />
          </a>
          <a className="kp-buy-btn kp-buy-orange" href={shopeeUrl} target="_blank" rel="noopener noreferrer">
            <span>Shopee</span>
            <Icon name="external" size={14} stroke={2} />
          </a>
        </div>
        <div className="kp-price-block">
          <div className="kp-price-label">{t.priceRange}</div>
          <div className="kp-price-range">
            {formatRp(lo)} – {formatRp(hi)}
            <span className="kp-price-where"> {t.onTokped}</span>
          </div>
        </div>
        <button className="kp-share" onClick={share}>
          <Icon name="whatsapp" size={18} stroke={1.8} />
          <span>{t.share}</span>
        </button>
      </div>

      <section className="kp-r-alts kp-alts">
        <h3 className="kp-alts-title">{t.alternatives}</h3>
        <div className="kp-alts-grid">
          {alternates.map((alt) => (
            <AlternativeCard key={alt.id} alt={alt} t={t} />
          ))}
        </div>
      </section>

      <div className="kp-r-foot kp-foot">
        <button className="kp-restart" onClick={onStartOver}>
          <Icon name="refresh" size={14} stroke={2} />
          <span>{t.startOver}</span>
        </button>
      </div>
    </main>
  );
}
