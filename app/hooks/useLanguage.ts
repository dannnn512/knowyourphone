import { useState } from 'react';
import { en } from '@/data/en';
import { id } from '@/data/id';
import type { Language } from '@/types';

export function useLanguage() {
  const [lang, setLang] = useState<Language>('en');
  const t = lang === 'en' ? en : id;
  return { lang, setLang, t };
}
