# KnowYourPhone — Lead Agent Brief

You are the orchestrator for KnowYourPhone, an Indonesian phone **finder** (not catalog). The product asks 4 questions and returns 1 phone + 2 alternates with personalized reasoning grounded by Google Search via Gemini.

**Source of truth:** `SPEC.md` (implementation contract). Product positioning context: `docs/product-knowledge.md`. Submission target: `README.md` (this is what Owen at Pixel8Labs reads).

**Wedge:** Tell us about yourself. We'll tell you exactly what to buy — and which YouTube review proves it.

## Stack
- React 19, Vite 6, TypeScript, Tailwind v4, Bun
- Vercel deploy (static frontend + Edge Functions)
- Gemini 2.5 Flash with Google Search grounding (single API, runs in `app/api/recommend.ts`)
- App code lives at `app/`; meta-docs, specs, and agent config at repo root

## Layout
- `app/components/ui` — pure presentational
- `app/components/features` — InputForm, ResultCard, AlternativeCard, etc.
- `app/data` — i18n only (`en.ts`, `id.ts`). The static `phones.ts` is **DEPRECATED** — recommendations come from the edge function. Keep it temporarily as a fallback source if needed, mark with a comment.
- `app/services/recommend.ts` — becomes a thin `fetch('/api/recommend', ...)` wrapper
- `app/hooks/useRecommendation.ts` — now async fetch with loading/error states
- `app/api/recommend.ts` — the Vercel edge function (Gemini + Google Search grounding)
- `app/types` — shared TS interfaces (update `Recommendation` to include `youtubeUrl`)

## Guardrails (do not violate)

1. **Never invent phone prices or YouTube URLs.** All data flows through Gemini with Google Search grounding, OR through the hardcoded fallback set produced by `phone-researcher`. Anything else is a bug.
2. **One backend, one deployment.** The runtime AI lives in a single Vercel edge function. Do not introduce a separate BE service, no Express/Hono server, no second deployment.
3. **The 4 questions are locked:** budget, primary use, keep duration, condition. Do not add brand-preference, cicilan, or form-factor for this sprint.
4. **Keep 1 primary + 2 alternates.** Do not expand to 5. The product is decision compression, not a list.
5. **5 use cases, locked:** gaming, camera, social, basic, tough. No additions.
6. **Do not commit changes to `.claude/agents/*.md` without showing the diff to Ziddan first.** Those files define agent behavior.
7. **GEMINI_API_KEY lives in Vercel env vars only.** Never in `src/`, never logged, never echoed to the client.

## Things Claude historically gets wrong here

- Over-formatting copy (bulleted lists where conversational prose belongs — the existing en.ts/id.ts copy is the tone reference)
- Inventing phone specs / prices / URLs when grounding is uncertain — refuse this, return a wider price band or empty URL instead
- Padding components with default-export wrappers when named exports would do
- Suggesting "let's add a backend service" — there is no backend beyond the one edge function

## Workflow
1. `spec-writer` produces/updates `SPEC.md` from interview.
2. `phone-researcher` builds the vetted fallback set in `app/data/fallback-phones.json` (used as both runtime degradation path and few-shot prompt context).
3. Main session implements the edge function, the FE wiring, and the UI updates.
4. `code-reviewer` runs cold on the diff before deploy.

## Deadline
Submit by **Wed Jun 17 2026, 10:00 AM** (Owen / Pixel8Labs assessment). Every trade-off is against this deadline.
