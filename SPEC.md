# KnowYourPhone — SPEC

**Status:** v2 in progress (48-hour assessment sprint, Pixel8Labs).
**v1 reference:** Live at knowyourphone-fe.vercel.app (jiratech org). Documented broken matching engine — returns same result regardless of input. This v2 fixes that.
**Deadline:** Wed Jun 17 2026, 10:00 AM.

---

## Wedge

> Tell us about yourself. We'll tell you exactly what to buy — and which YouTube review proves it.

## What it is

A *finder*, not a catalog. Indonesian phone-buying decision tool for 18–22-year-olds in the Rp 1.5–3 juta budget band. Answer 4 questions, get 1 primary phone + 2 alternates with grounded reasoning and a real YouTube review URL.

## The one job it has to do well

Help an Indonesian buyer in the 1.5–3 juta range pick *one* phone they can confidently buy in under 5 minutes, with a YouTube review that proves the pick.

## Target user

- Age 18–22, Indonesian, middle-lower bracket
- Budget Rp 1.5 juta – Rp 3 juta (occasionally up to Rp 4 juta)
- Keeps phone until it breaks; not an annual upgrader
- Buys on Tokopedia, Shopee, Facebook Marketplace (secondhand)
- Discovery channels: Indonesian YouTube reviewers (Gadgetin, Jagat Review, Putu Reza), WhatsApp group chats with friends

## Input flow (4 questions, single screen, no scroll on desktop)

1. **Budget** — slider Rp 1–5 juta, snaps to Rp 50,000. Manual type also supported.
2. **Primary use** — Gaming / Camera / Social & Streaming / Basic / Tough Battery
3. **Keep duration** — 1–2 yrs / 2–3 yrs / 3+ yrs
4. **Condition** — New only / Open to secondhand / Secondhand preferred

## Output shape

**Primary phone:**
- Name
- Price range (IDR)
- 3 reasoning bullets, generated per `input × phone` (not static)
- 1 YouTube review URL (real, validated)
- Tokopedia search link, Shopee search link
- Collapsible full specs: chipset, RAM, storage, battery mAh, camera MP, AnTuTu, display

**2 alternates:**
- Name, price, one "better at X / trade-off Y" line, Tokopedia link

**Plus:** WhatsApp share button (existing v1 behavior).

## Architecture

```
User submits form (React)
       │
       ▼
POST /api/recommend  (Vercel Edge Function)
       │
       ▼
Gemini 2.5 Flash + Google Search grounding
   - System prompt: Indonesian phone advisor, 1.5–3jt target, 5 use cases
   - User input (budget, use, keep, condition, lang)
   - Few-shot: 3 examples from fallback set
   - tools: [{ google_search: {} }]
   - responseSchema: { primary, alternates }
       │
       ▼
Validate response
   - Schema match
   - YouTube URL HEAD-check (200 OK)
   - Price within sane band (10k–20jt)
       │
       ▼
Return JSON to FE  OR  fall back to hardcoded set
       │
       ▼
ResultCard renders
```

**Fallback path:** if Gemini fails (auth error, rate limit, timeout, malformed response, validation fail), return a recommendation matched from the hardcoded `app/data/fallback-phones.json` set (5–6 phones, produced by `phone-researcher`).

## Tech stack

- React 19, Vite 6, TS, Tailwind v4, Bun (frontend)
- Vercel Edge Functions (the one backend file)
- Gemini 2.5 Flash via `@google/genai` SDK (or fetch directly)
- Google Search grounding via Gemini's `google_search` tool (no separate API key)

## Scope

**In scope for this sprint:**
- Replace v1 static matching with Gemini-grounded matching
- Personalized reasoning bullets per submission
- Real YouTube review URL on every primary recommendation
- Validated fallback set for graceful degradation
- README in Owen's 8-section format
- AI usage notes
- Loom 2–3 min walkthrough
- EN/ID toggle preserved
- WhatsApp share preserved
- Light/dark theme preserved

**Out of scope (deliberately):**
- Affiliate link wiring — Tokopedia/Shopee affiliate accounts take business setup time I don't have in 48hr. Marketplace search links remain as placeholders, documented in README.
- Real-time price scraping — Gemini grounding is the lightweight equivalent for this sprint.
- Auth, user accounts, recommendation history.
- Brand preference, cicilan, form-factor questions — not in current product knowledge; defer until real user research justifies adding.
- 5+ recommendations — the product's wedge is decision compression, not lists. Stays at 1+2.
- Mobile app, native SDK, anything off-web.

## Assumptions (where I didn't have data)

1. Gemini Google Search grounding returns Indonesian phone prices within ±10% of Tokopedia/Shopee marketplace reality. Not empirically measured.
2. The target 18–22 demographic accepts a 3–6 second LLM loading delay (existing loading state handles it).
3. Indonesian YouTube reviewers (Gadgetin, Jagat Review, Putu Reza) maintain stable archive URLs. If videos are deleted, validation catches dead links and fallback fires.
4. Gemini free tier rate limits (per minute) are sufficient for assessment-day demo traffic. Production scale needs paid tier.

## Success criteria

- **Functional:** Different inputs produce different recommendations (proves matching works — fixes the documented v1 bug).
- **Determinism:** Same input twice produces a stable primary recommendation with same Gemini params (set `temperature: 0.2`).
- **Grounding:** YouTube URL in result resolves to a real video (HEAD check passes).
- **End-to-end:** Marketplace search links open with phone name pre-filled.
- **DoD:** Live URL works on a fresh device. Repo runs from README. Submitted before Wed 10am.

## Open items (for spec-writer to interview Ziddan on)

- Hardcoded fallback set: how many phones? (Proposed: 6.)
- Few-shot examples in the runtime prompt: same as fallback set, or a curated subset?
- Telemetry: log inputs and recommendations anonymously for prompt tuning? (Recommended yes, but out of scope for v2 unless trivial.)
