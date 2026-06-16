/**
 * KnowYourPhone — Recommendation Edge Function
 *
 * POST /api/recommend
 * Body: { budget, brand, use, keep, condition, lang }
 * 200:  { primary, alternates }
 * 4xx:  validation errors
 * 5xx:  { error: "api_key_missing" | "service_unavailable" }
 *
 * No static fallback. Gemini failure -> 503. FE shows retry UI.
 * GEMINI_API_KEY is never echoed, logged, or surfaced to the client.
 */

import { GoogleGenAI, Type } from '@google/genai';

export const config = { runtime: 'edge' };

const MODEL = 'gemini-3.5-flash';

type UseCase = 'gaming' | 'camera' | 'social' | 'basic' | 'tough';
type Keep = 'short' | 'mid' | 'long';
type Condition = 'new' | 'open' | 'pref';
type Lang = 'en' | 'id';

interface Input {
  budget: number;
  brand: string;
  use: UseCase;
  keep: Keep;
  condition: Condition;
  lang: Lang;
}

const USE_VALUES: UseCase[] = ['gaming', 'camera', 'social', 'basic', 'tough'];
const KEEP_VALUES: Keep[] = ['short', 'mid', 'long'];
const COND_VALUES: Condition[] = ['new', 'open', 'pref'];
const LANG_VALUES: Lang[] = ['en', 'id'];

function parseBody(raw: unknown): Input | null {
  if (!raw || typeof raw !== 'object') return null;
  const b = raw as Record<string, unknown>;
  if (typeof b.budget !== 'number' || !Number.isFinite(b.budget) || b.budget <= 0) return null;
  if (typeof b.brand !== 'string' || b.brand.length === 0 || b.brand.length > 60) return null;
  if (typeof b.use !== 'string' || !USE_VALUES.includes(b.use as UseCase)) return null;
  if (typeof b.keep !== 'string' || !KEEP_VALUES.includes(b.keep as Keep)) return null;
  if (typeof b.condition !== 'string' || !COND_VALUES.includes(b.condition as Condition)) return null;
  if (typeof b.lang !== 'string' || !LANG_VALUES.includes(b.lang as Lang)) return null;
  return {
    budget: b.budget,
    brand: b.brand,
    use: b.use as UseCase,
    keep: b.keep as Keep,
    condition: b.condition as Condition,
    lang: b.lang as Lang,
  };
}

const SYSTEM_PROMPT = `You are an Indonesian phone-buying advisor for buyers aged 18-22 in the Rp 1.5–3 juta band who buy on Tokopedia, Shopee, and Facebook Marketplace.

You are working from training-data knowledge of Indonesian phones as of early 2025. Prices and YouTube URLs are approximate. The user understands this is a non-grounded recommendation.

Given the user's budget, brand preference, primary use, keep duration, and condition preference, recommend ONE primary phone and TWO alternates.

Rules:
- If brand is "Apa aja", consider all brands. Otherwise filter strongly toward the requested brand.
- The primary's reasons array MUST be exactly 3 short bullets, each tied to a specific (input × phone) fact: e.g., "Untuk gaming di budget Rp 2.5jt, chipset Dimensity 8300 di Phone X menjalankan Genshin di setting tinggi." Generic praise like "phone X is great" is forbidden.
- youtube_url is OPTIONAL. Return an empty string "" if you are not confident the URL is a real, currently-live Indonesian reviewer video. NEVER fabricate a URL. Honest empty beats confident hallucination. When you do return one, prefer established Indonesian reviewers (Gadgetin, Jagat Review, Putu Reza, GadgetGaul, NextRen, Gadgetnauts) and set youtube_channel accordingly; otherwise leave both empty.
- Output language: if lang === "id" all reasons/better_at/trade_off are in conversational Bahasa Indonesia, not translated English. If lang === "en", English.
- Stock value: "in" if widely available new, "limited" if hard to find new, "second" if mostly recommended via Facebook Marketplace / Tokopedia second.
- Use IDR (Rupiah). Price ranges should be realistic 10% bands around the median Tokopedia/Shopee listing as of early 2025.

Return ONLY valid JSON matching the requested schema. No prose outside JSON.`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    primary: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        price_idr: {
          type: Type.ARRAY,
          items: { type: Type.NUMBER },
          minItems: '2',
          maxItems: '2',
        },
        reasons: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          minItems: '3',
          maxItems: '3',
        },
        youtube_url: { type: Type.STRING },
        youtube_channel: { type: Type.STRING },
        specs: {
          type: Type.OBJECT,
          properties: {
            chipset: { type: Type.STRING },
            ram: { type: Type.STRING },
            storage: { type: Type.STRING },
            battery_mah: { type: Type.STRING },
            main_camera_mp: { type: Type.STRING },
            antutu: { type: Type.STRING },
            display: { type: Type.STRING },
          },
          required: ['chipset', 'ram', 'storage', 'battery_mah', 'main_camera_mp', 'antutu', 'display'],
        },
        stock: { type: Type.STRING, enum: ['in', 'limited', 'second'] },
      },
      required: ['id', 'name', 'price_idr', 'reasons', 'specs', 'stock'],
    },
    alternates: {
      type: Type.ARRAY,
      minItems: '2',
      maxItems: '2',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          price_idr: {
            type: Type.ARRAY,
            items: { type: Type.NUMBER },
            minItems: '2',
            maxItems: '2',
          },
          better_at: { type: Type.STRING },
          trade_off: { type: Type.STRING },
        },
        required: ['id', 'name', 'price_idr', 'better_at', 'trade_off'],
      },
    },
  },
  required: ['primary', 'alternates'],
};

function userPrompt(input: Input): string {
  return `User input:
- budget: ${input.budget} IDR
- brand preference: ${input.brand}
- primary use: ${input.use}
- keep duration: ${input.keep}
- condition: ${input.condition}
- lang: ${input.lang}

Recommend now.`;
}

function isAcceptableYouTube(url: unknown): boolean {
  if (typeof url !== 'string') return false;
  if (url.length === 0) return true;
  try {
    const u = new URL(url);
    return /(^|\.)youtube\.com$/.test(u.hostname) || u.hostname === 'youtu.be';
  } catch {
    return false;
  }
}

function validateShape(data: unknown): data is {
  primary: {
    id: string; name: string; price_idr: [number, number];
    reasons: [string, string, string]; youtube_url: string; youtube_channel: string;
    specs: Record<string, string>; stock: 'in' | 'limited' | 'second';
  };
  alternates: Array<{
    id: string; name: string; price_idr: [number, number];
    better_at: string; trade_off: string;
  }>;
} {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  const p = d.primary as Record<string, unknown> | undefined;
  if (!p) return false;
  if (typeof p.id !== 'string' || typeof p.name !== 'string') return false;
  if (!Array.isArray(p.price_idr) || p.price_idr.length !== 2) return false;
  if (!p.price_idr.every((n) => typeof n === 'number' && n > 0)) return false;
  if ((p.price_idr[0] as number) > (p.price_idr[1] as number)) return false;
  if (!Array.isArray(p.reasons) || p.reasons.length !== 3) return false;
  if (!p.reasons.every((r) => typeof r === 'string' && r.length > 0)) return false;
  if (p.youtube_url !== undefined && !isAcceptableYouTube(p.youtube_url)) return false;
  if (p.youtube_channel !== undefined && typeof p.youtube_channel !== 'string') return false;
  if (!p.specs || typeof p.specs !== 'object') return false;
  if (!['in', 'limited', 'second'].includes(p.stock as string)) return false;

  const alts = d.alternates;
  if (!Array.isArray(alts) || alts.length !== 2) return false;
  for (const a of alts) {
    if (!a || typeof a !== 'object') return false;
    const ax = a as Record<string, unknown>;
    if (typeof ax.id !== 'string' || typeof ax.name !== 'string') return false;
    if (!Array.isArray(ax.price_idr) || ax.price_idr.length !== 2) return false;
    if (!ax.price_idr.every((n) => typeof n === 'number' && n > 0)) return false;
    if ((ax.price_idr[0] as number) > (ax.price_idr[1] as number)) return false;
    if (typeof ax.better_at !== 'string' || typeof ax.trade_off !== 'string') return false;
  }
  return true;
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'method_not_allowed' });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return jsonResponse(400, { error: 'invalid_json' });
  }

  const input = parseBody(raw);
  if (!input) {
    return jsonResponse(400, { error: 'invalid_body' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, { error: 'api_key_missing' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: userPrompt(input),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0,
        responseMimeType: 'application/json',
        responseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      console.error('[recommend] empty response text');
      return jsonResponse(503, { error: 'service_unavailable' });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      console.error('[recommend] JSON parse failed');
      return jsonResponse(503, { error: 'service_unavailable' });
    }

    if (!validateShape(parsed)) {
      console.error('[recommend] schema validation failed');
      return jsonResponse(503, { error: 'service_unavailable' });
    }

    return jsonResponse(200, parsed);
  } catch (err) {
    const e = err as { status?: unknown; code?: unknown } | null;
    const tag = e?.status ?? e?.code ?? 'unknown';
    console.error('[recommend] upstream error:', tag);
    return jsonResponse(503, { error: 'service_unavailable' });
  }
}
