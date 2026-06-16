import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchRecommendation } from '@/services/recommend';
import type { UserInput, Recommendation, Language } from '@/types';

export function useRecommendation(input: UserInput | null, lang: Language) {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reqIdRef = useRef(0);

  const run = useCallback(async (i: UserInput, l: Language) => {
    const myReq = ++reqIdRef.current;
    setLoading(true);
    setError(null);
    setRecommendation(null);
    try {
      const result = await fetchRecommendation(i, l);
      if (reqIdRef.current !== myReq) return;
      setRecommendation(result);
    } catch (err) {
      if (reqIdRef.current !== myReq) return;
      setError(err instanceof Error ? err.message : 'service_unavailable');
    } finally {
      if (reqIdRef.current === myReq) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!input) return;
    run(input, lang);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, lang]);

  const retry = useCallback(() => {
    if (input) run(input, lang);
  }, [input, lang, run]);

  return { recommendation, loading, error, retry };
}
