# app/ — KnowYourPhone application code

The lead agent brief lives at the repo root: `../CLAUDE.md`. Read that first.

This directory is the Vite app (frontend + edge function). Everything in here is what gets deployed to Vercel (root directory = `app/`).

Hot spots for the v2 sprint:
- `services/recommend.ts` — becomes a thin fetch wrapper to `/api/recommend`
- `hooks/useRecommendation.ts` — now async fetch with loading/error states
- `api/recommend.ts` — the Vercel edge function (Gemini + Google Search grounding)
- `data/phones.ts` — DEPRECATED; recommendation source is the edge function
- `data/fallback-phones.json` — produced by `phone-researcher`, used as runtime fallback and as few-shot in the prompt
- `types/index.ts` — `Recommendation` gets `youtubeUrl` added
