# KnowYourPhone

> Tell us about yourself. We'll tell you exactly what to buy — and which YouTube review proves it.

**Live URL:** [fill in after Vercel deploy]
**Repo:** https://github.com/dannnn512/knowyourphone

---

## What it is, and how to run it

KnowYourPhone is an Indonesian phone-buying **finder** (not a catalog). Answer 5 questions — budget, brand preference, primary use, how long you'll keep it, and condition preference — and get one recommended phone plus two ranked alternates with reasoning tied to your specific answers.

The recommendation engine is a Gemini 3.5 Flash call from a Vercel edge function, with response schema enforcement and temperature 0 for determinism. No static phone catalog — every submission produces a fresh LLM-generated recommendation.

**One honest scope note:** the architecture was initially designed with Google Search grounding for live prices and current YouTube reviewer URLs. Mid-sprint I discovered that Gemini API Paid Tier (Cloud Prepay, IDR 500k minimum, non-refundable) is required to enable grounding. I scoped grounding out, documented it as the first production fix, and shipped the ungrounded version. The model returns YouTube URLs when it has confident training-data knowledge and empty strings otherwise — honest empty over confident hallucination.

**To run locally:**

```bash
git clone <repo-url>
cd knowyourphone/app
bun install
echo "GEMINI_API_KEY=your_key_here" > .env.local
bun dev
```

Open http://localhost:5173.

For deployment: push to a new Vercel project pointing at the `app/` directory as root, add `GEMINI_API_KEY` to project env vars.

## Who it's for, and the one job it has to do well

**Who:** Indonesian buyers aged 18–22, middle-lower income bracket, budget Rp 1.5–3 juta, who currently spend hours watching Gadgetin and Jagat Review and still can't decide between two phones at the same price point.

**The one job:** Help them pick *one* phone they can confidently buy in under 5 minutes, with reasoning specific enough to feel personalized (not generic praise).

## Why this problem, and how I know it's worth solving

A close friend spent two weekends watching reviews to pick a phone and still asked our WhatsApp group "A atau B?" the night before buying. Two more friends did the same in the past three months. None of them are tech-illiterate — they're cost-sensitive and overwhelmed, and Indonesian YouTube reviewers (great as they are) don't personalize to *their* budget × use case.

v1 of this product shipped May 2026 with a documented broken matching engine ("returns same result regardless of selection"). User feedback from two early testers (Nopan, Saktot) confirmed the diagnosis: it wasn't a feature gap, it was a **trust gap**. They didn't want more options — they wanted reasoning that earned their confidence.

That's what this v2 fixes. The LLM-powered grounded matching means every recommendation comes with reasoning tied to the user's specific input *and* a real reviewer video they can verify in 60 seconds.

## What's already out there, and why I built this anyway

- **Gadgetin / Jagat Review (YouTube):** great long-form reviews, no personalization to *your* budget × use case. Watching 4 to decide is the pain.
- **Pricebook / Carisinyal:** Indonesian phone databases. Browseable, no decision support.
- **GSMArena:** thorough specs, English-first, not Indonesia-aware (pricing, channels).
- **Tokopedia / Shopee:** marketplaces. Sorting overwhelms.

KnowYourPhone sits between a YouTube review and a marketplace checkout. Not replacing reviewers — pointing you to the *right* reviewer video for *your* situation.

## What I put in scope, what I left out, and why

**In scope:**
- The AI-powered matching engine (Gemini 3.5 Flash, deterministic at temperature 0, schema-enforced) — this is the v1 bug fix and the main thing being evaluated.
- Personalized reasoning bullets generated per `input × recommended phone`, not static.
- YouTube review URL when the model has confident knowledge, empty otherwise.
- 5th question: brand preference (searchable native datalist with 18 active Indonesian-market brands).
- Clear retry UI when Gemini fails (no fake fallback recommendations).
- EN/ID language toggle (preserved from v1).
- WhatsApp share (preserved from v1).
- Multi-agent setup for the build: `spec-writer` and `code-reviewer` — see `.claude/agents/` and `docs/ai-usage-notes.md`. (Roster started at 3 — see notes for why one was cut.)

**Out of scope, deliberately:**
- **Google Search grounding** — surfaced mid-sprint that grounding requires Gemini API Paid Tier (Cloud Prepay IDR 500k minimum). Scoped out. The first production fix and the cleanest path to fresher data + verified YouTube URLs.
- Affiliate link wiring — Tokopedia and Shopee affiliate programs require business setup time I didn't have in 48 hours. Marketplace links are placeholder search URLs. Documented as the first revenue fix.
- Real-time price scraping — scoped out with grounding. Same production path.
- Auth, user accounts, recommendation history.
- Brand preference, cicilan, or form-factor questions — they aren't in the current product knowledge for a reason (would change the product without user research backing). Deferred until I can validate the v2 matching first.
- Expanding to 5+ recommendations — the product's wedge is decision *compression*, not lists. Holds at 1 primary + 2 alternates per the original product principle.

## Where I didn't have answers, what I assumed

1. **Training-data freshness.** Gemini 3.5 Flash's knowledge of Indonesian phones cuts off ~early 2025. Prices and model names may be 6–18 months stale. Mitigation: documented limitation, production fix is grounded retrieval.
2. **Loading latency tolerance.** Measured steady-state ~11s. Assumed the 18–22 demographic accepts this if loading copy sets honest expectations. In a real study I'd measure dropout and iterate on prompt size or model choice.
3. **YouTube URL accuracy.** Without grounding, URLs come from training-data memory. The model is explicitly told to return empty when uncertain. Some recommendations will not include a video link — a transparency choice over a hallucinated one.
4. **Free-tier rate limits.** Gemini 3.5 Flash Free Tier (10 RPM / ~500 RPD) is sufficient for assessment-day demo traffic. Production scale needs paid tier + request cache + retry-with-backoff.

## Three questions I'd ask a real user before building more

1. When you watched 4 review videos and still couldn't decide — what was the *actual* uncertainty? (Trust in the reviewer? Specs that didn't translate to real life? Availability? Resale value?)
2. If the recommendation says "Phone X" and your favorite YouTuber says "Phone Y" in their review — who wins?
3. Would you pay Rp 15k/month for price-drop alerts on the phone you almost bought but didn't?

## How I'd know it's working, and what I'd do next

**Working when:**
- ≥40% of submissions click through to Tokopedia or Shopee
- ≥15% click the YouTube review link
- ≥10% share on WhatsApp
- Recommendation actually changes when input changes (the v1 bug, now fixed)
- Median latency < 6s

**Next:**
1. Wire Tokopedia + Shopee affiliate links — this is the revenue.
2. Add brand preference question *only after* measuring whether dropouts skew toward Samsung/Xiaomi tribes in submission data.
3. Anonymous telemetry: log (input, recommended phone, click-out) — feed back into prompt tuning.
4. Expand to laptops (same target user, higher AOV → higher affiliate per conversion).

---

## How I used AI

See [docs/ai-usage-notes.md](./docs/ai-usage-notes.md).
