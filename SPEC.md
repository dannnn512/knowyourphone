# KnowYourPhone — SPEC

**Status:** v2 in progress (48-hour assessment sprint, Pixel8Labs).
**v1 reference:** Live at knowyourphone-fe.vercel.app (jiratech org). Documented broken matching engine — returns same result regardless of input. This v2 fixes that.
**Deadline:** Wed Jun 17 2026, 10:00 AM.

---

## Wedge

> Tell us about yourself. We'll tell you exactly what to buy.

*(Original drafting promised "and which YouTube review proves it." Grounding was scoped out mid-sprint when the Gemini API Paid Tier requirement surfaced — IDR 500k Cloud Prepay minimum. The recommendation engine now returns YouTube URLs when the model has confident knowledge and empty strings otherwise. Honest empty > confident hallucination.)*

## What it is

A *finder*, not a catalog. Indonesian phone-buying decision tool for 18–22-year-olds in the Rp 1.5–3 juta budget band. Answer 5 questions, get 1 primary phone + 2 alternates with grounded reasoning and a real YouTube review URL.

## The one job it has to do well

Help an Indonesian buyer in the 1.5–3 juta range pick *one* phone they can confidently buy in under 5 minutes, with a YouTube review that proves the pick.

## Target user

- Age 18–22, Indonesian, middle-lower bracket
- Budget Rp 1.5 juta – Rp 3 juta (occasionally up to Rp 4 juta)
- Keeps phone until it breaks; not an annual upgrader
- Buys on Tokopedia, Shopee, Facebook Marketplace (secondhand)
- Discovery channels: Indonesian YouTube reviewers (Gadgetin, Jagat Review, Putu Reza), WhatsApp group chats with friends

## Input flow (5 questions, single screen, no scroll on desktop)

1. **Budget** — slider Rp 1–5 juta, snaps to Rp 50,000. Manual type also supported.
2. **Brand** — searchable native `<input list="brands">` + `<datalist>` autocomplete. **Optional**, defaults to "Apa aja" (Any). Canonical list (locked): Apa aja, Xiaomi, Samsung, OPPO, iPhone, vivo, Realme, Redmi, POCO, Infinix, TECNO, iQOO, itel, Honor, Huawei, ASUS, Motorola, Nokia, Nothing. Free text allowed for resilience (user typing "Samsong" still passes through).
3. **Primary use** — Gaming / Camera / Social & Streaming / Basic / Tough Battery
4. **Keep duration** — 1–2 yrs / 2–3 yrs / 3+ yrs
5. **Condition** — New only / Open to secondhand / Secondhand preferred

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
Gemini 3.5 Flash via @google/genai@2.8.0
   - System prompt: Indonesian phone advisor, 1.5–3jt target, 5 use cases
   - User input (budget, brand, use, keep, condition, lang)
   - responseSchema enforced: { primary, alternates }
   - temperature: 0  (deterministic — same input → same output, byte-identical)
   - NO Google Search grounding (Paid Tier required, scoped out)
       │
       ▼
Validate response
   - Schema match
   - Exactly 3 reasons in primary
   - Exactly 2 alternates
   - price_idr ascending (min <= max) for primary AND each alternate
   - youtube_url may be empty string (model returns empty when uncertain)
       │
       ├── Success → return JSON to FE → ResultCard renders
       │
       └── Failure (timeout, 5xx, malformed, validation) →
            return 503 { error: "service_unavailable" }
            FE shows retry UI ("Gemini sedang sibuk, coba lagi")
```

**No static fallback catalog.** Faking a recommendation from a hardcoded list when Gemini is down would repeat the v1 lie at smaller scale. The honest path is a clear error + retry — and document it as a known limitation in the README ("production would add cache + retry-with-backoff").

## Tech stack

- React 19, Vite 6, TS, Tailwind v4, Bun (frontend)
- Vercel Edge Functions (the one backend file)
- Gemini 3.5 Flash via `@google/genai@2.8.0` (pinned)
- No grounding — Paid Tier requirement (IDR 500k Cloud Prepay) was scoped out for the assessment; lean on the model's training-data knowledge (early 2025 cutoff)

## Scope

**In scope for this sprint:**
- Replace v1 static matching with Gemini Flash matching (deterministic, temperature 0)
- Personalized reasoning bullets per submission, tied to (input × phone) facts
- YouTube URL surfaced when model has confident knowledge — empty string otherwise (honest empty > hallucination)
- Clear error UI with retry on Gemini failure (no fake fallback)
- README in Owen's 8-section format
- AI usage notes
- Loom 2–3 min walkthrough
- EN/ID toggle preserved
- WhatsApp share preserved
- Light/dark theme preserved

**Out of scope (deliberately):**
- **Google Search grounding** — surfaced mid-sprint that grounding requires Gemini API Paid Tier (Cloud Prepay IDR 500k minimum, non-refundable). Scoped out. The first production fix.
- Affiliate link wiring — Tokopedia/Shopee affiliate accounts take business setup time I don't have in 48hr. Marketplace search links remain as placeholders, documented in README.
- Real-time price scraping — scoped out with grounding. Production path: grounded retrieval via Paid Tier or third-party search API.
- Auth, user accounts, recommendation history.
- Brand preference, cicilan, form-factor questions — not in current product knowledge; defer until real user research justifies adding.
- 5+ recommendations — the product's wedge is decision compression, not lists. Stays at 1+2.
- Mobile app, native SDK, anything off-web.

## Assumptions (where I didn't have data)

1. Gemini 3.5 Flash's training-data knowledge of Indonesian phones (cutoff early 2025) is sufficient for plausible recommendations within the 1.5–3jt band. Prices and model names may be 6–18 months stale; production fix is grounded retrieval.
2. The 18–22 demographic accepts the measured ~11s loading delay if the loading copy sets honest expectations. Production path: reduce prompt size, parallelize, or move to faster grounded provider.
3. YouTube URLs returned from training-data knowledge may not match currently-live videos. The model is instructed to return empty when uncertain rather than hallucinate.
4. Free Tier rate limits (10 RPM / ~500 RPD for gemini-3.5-flash) are sufficient for assessment-day demo traffic.

## Success criteria

- **Functional:** Different inputs produce different recommendations (proves matching works — fixes the documented v1 bug).
- **Determinism:** Same input twice produces a stable primary recommendation with same Gemini params (set `temperature: 0.2`).
- **Reasoning quality:** Each of the 3 primary reasons references a specific (input × phone) fact, not generic praise. (Manually inspected.)
- **End-to-end:** Marketplace search links open with phone name pre-filled.
- **DoD:** Live URL works on a fresh device. Repo runs from README. Submitted before Wed 10am.

## Open items (for spec-writer to interview Ziddan on)

- Exact Gemini model identifier (verify in AI Studio — `gemini-3.5-flash` if available, else current Flash).
- Retry UX copy in EN/ID — "Gemini sedang sibuk, coba lagi" vs alternatives.
- Telemetry: log inputs and recommendations anonymously for prompt tuning? (Recommended yes, but out of scope for v2 unless trivial.)
