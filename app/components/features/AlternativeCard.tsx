import { Icon } from '@/components/ui/Icon';
import { PhonePlaceholder } from '@/components/ui/PhonePlaceholder';
import { formatRp } from '@/services/recommend';
import type { Alternate } from '@/types';
import type { Strings } from '@/data/en';

interface AlternativeCardProps {
  alt: Alternate;
  t: Strings;
}

export function AlternativeCard({ alt, t }: AlternativeCardProps) {
  const searchUrl = `https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(alt.name)}`;

  return (
    <article className="kp-alt-card">
      <div className="kp-alt-thumb">
        <PhonePlaceholder small name={alt.name} />
      </div>
      <div className="kp-alt-body">
        <h4 className="kp-alt-name">{alt.name}</h4>
        <dl className="kp-alt-compare">
          <div className="kp-alt-row">
            <dt>{t.betterAt}</dt>
            <dd>{alt.better_at}</dd>
          </div>
          <div className="kp-alt-row">
            <dt>{t.weakerAt}</dt>
            <dd>{alt.trade_off}</dd>
          </div>
        </dl>
        <div className="kp-alt-foot">
          <span className="kp-alt-price">{formatRp(alt.price_idr[0])}+</span>
          <a
            className="kp-alt-buy"
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Tokopedia <Icon name="external" size={12} stroke={2} />
          </a>
        </div>
      </div>
    </article>
  );
}
