import { useState, useEffect } from 'react';
import { matchPhones } from '@/services/recommend';
import type { UserInput, Recommendation } from '@/types';

export function useRecommendation(input: UserInput | null) {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!input) return;
    setLoading(true);
    const timer = setTimeout(() => {
      setRecommendation(matchPhones(input));
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input?.budget, input?.use, input?.keep, input?.condition]);

  return { recommendation, loading };
}
