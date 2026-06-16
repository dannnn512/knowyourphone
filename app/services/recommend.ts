import type { UserInput, Recommendation, Language } from '@/types';

export const BUDGET_RANGE = { min: 1_000_000, max: 5_000_000, step: 50_000 };

export function formatRp(n: number): string {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

export function clampBudget(n: number): number {
  const { min, max, step } = BUDGET_RANGE;
  return Math.max(min, Math.min(max, Math.round(n / step) * step));
}

export async function fetchRecommendation(
  input: UserInput,
  lang: Language,
): Promise<Recommendation> {
  const body = {
    budget: input.budget,
    brand: input.brand || 'Apa aja',
    use: input.use,
    keep: input.keep,
    condition: input.condition,
    lang,
  };

  const res = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let code = 'service_unavailable';
    try {
      const errBody = await res.json();
      if (typeof errBody?.error === 'string') code = errBody.error;
    } catch {
      /* keep default */
    }
    throw new Error(code);
  }

  return (await res.json()) as Recommendation;
}
