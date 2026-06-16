import { PHONES } from '@/data/phones';
import type { Phone, UserInput, Recommendation, Language, UseCase } from '@/types';

export const BUDGET_RANGE = { min: 1_000_000, max: 5_000_000, step: 50_000 };

export function formatRp(n: number): string {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

export function clampBudget(n: number): number {
  const { min, max, step } = BUDGET_RANGE;
  return Math.max(min, Math.min(max, Math.round(n / step) * step));
}

export function matchPhones(input: UserInput): Recommendation {
  const { budget, use, keep, condition } = input;
  const keepYears = keep === 'short' ? 2 : keep === 'mid' ? 3 : 4;

  const scored = PHONES.map((phone) => {
    let score = 0;
    const mid = (phone.price[0] + phone.price[1]) / 2;
    const dist = Math.abs(budget - mid);

    if (budget >= phone.price[0] - 200_000 && budget <= phone.price[1] + 200_000) {
      score += 10;
    }
    score += Math.max(0, 8 - dist / 250_000);

    if (use && phone.tags.includes(use as UseCase)) score += 6;

    if (phone.longevity >= keepYears) score += 3;
    else score -= (keepYears - phone.longevity) * 2;

    const isSecondhand = phone.stock === 'second';
    if (condition === 'new' && isSecondhand) score -= 20;
    if (condition === 'pref' && isSecondhand) score += 4;
    if (condition === 'open' && isSecondhand) score += 1;

    return { phone, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return {
    primary: scored[0].phone,
    alts: [scored[1].phone, scored[2].phone],
  };
}

export function personalLine(phone: Phone, input: UserInput, lang: Language): string {
  const useLabels: Record<Language, Record<UseCase, string>> = {
    en: {
      gaming: 'gaming',
      camera: 'photography',
      social: 'social media & streaming',
      basic: 'everyday use',
      tough: 'long-haul battery',
    },
    id: {
      gaming: 'gaming',
      camera: 'fotografi',
      social: 'sosmed & streaming',
      basic: 'pemakaian harian',
      tough: 'baterai tahan lama',
    },
  };

  const useLabel = input.use ? useLabels[lang][input.use as UseCase] : '';
  const budget = formatRp(input.budget);

  if (lang === 'id') return `Pas di anggaran ${budget} dan cocok untuk ${useLabel}.`;
  return `Lands inside your ${budget} budget and matches your ${useLabel} priority.`;
}

export function reasonLines(phone: Phone, input: UserInput, lang: Language): string[] {
  const personal = personalLine(phone, input, lang);
  const reasons = lang === 'id' ? phone.idReasons : phone.enReasons;
  return [personal, ...reasons.slice(0, 3)];
}

export interface Comparison {
  better: string;
  worse: string;
}

export function compareTo(alt: Phone, primary: Phone, lang: Language): Comparison {
  const altCheap = (alt.price[0] + alt.price[1]) / 2 < (primary.price[0] + primary.price[1]) / 2;
  const altLasts = alt.longevity > primary.longevity;
  const altGaming = alt.tags.includes('gaming') && !primary.tags.includes('gaming');
  const altCamera = alt.tags.includes('camera') && !primary.tags.includes('camera');
  const altBattery = alt.tags.includes('tough') && !primary.tags.includes('tough');

  const comparisons: Record<Language, Record<string, Comparison>> = {
    en: {
      cheap:   { better: 'Cheaper for similar features',  worse: 'Slightly weaker camera' },
      lasts:   { better: 'Longer software support',       worse: 'Pricier upfront' },
      gaming:  { better: 'Better for heavy games',        worse: 'Camera a step behind' },
      camera:  { better: 'Stronger camera',               worse: 'Less raw performance' },
      battery: { better: 'Bigger battery, lasts longer',  worse: 'Less polished display' },
      default: { better: 'Different strengths',           worse: 'Different trade-offs' },
    },
    id: {
      cheap:   { better: 'Lebih murah dengan fitur mirip',    worse: 'Kamera sedikit di bawah' },
      lasts:   { better: 'Dukungan software lebih lama',      worse: 'Harga awal lebih mahal' },
      gaming:  { better: 'Lebih kuat untuk game berat',       worse: 'Kamera kurang menonjol' },
      camera:  { better: 'Kamera lebih bagus',                worse: 'Performa mentah lebih rendah' },
      battery: { better: 'Baterai lebih awet',                worse: 'Layar kurang premium' },
      default: { better: 'Kelebihan berbeda',                 worse: 'Kompromi berbeda' },
    },
  };

  const src = comparisons[lang];
  let key = 'default';
  if (altGaming) key = 'gaming';
  else if (altCamera) key = 'camera';
  else if (altBattery) key = 'battery';
  else if (altLasts) key = 'lasts';
  else if (altCheap) key = 'cheap';

  return src[key];
}
