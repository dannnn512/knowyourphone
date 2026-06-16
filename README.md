# KnowYourPhone

> Tell us about yourself. We'll tell you exactly what to buy — and which YouTube review proves it.

**Live URL:** [fill in after Vercel deploy]
**Repo:** https://github.com/dannnn512/knowyourphone

---

## What it is, and how to run it

KnowYourPhone is an Indonesian phone-buying **finder** (not a catalog). Answer 4 questions — budget, primary use, how long you'll keep it, and condition preference — and get one recommended phone, two ranked alternates, and the YouTube review video that proves the pick.

The recommendation engine is an LLM call: Gemini 2.5 Flash with Google Search grounding, called from a Vercel edge function. No static phone catalog — results are grounded against live search every submission.

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

**The one job:** Help them pick *one* phone they can confidently buy in under 5 minutes, paired with a YouTube review that confirms the pick.

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
- The AI-powered matching engine itself (Gemini 2.5 Flash + Google Search grounding) — this is the v1 bug fix and the main thing Owen is evaluating.
- Personalized reasoning bullets generated per `input × recommended phone`, not static.
- One real YouTube review URL on the primary recommendation, validated server-side.
- Fallback hardcoded set for graceful degradation when Gemini fails.
- EN/ID language toggle (preserved from v1).
- WhatsApp share (preserved from v1).
- Multi-agent setup for the build: `phone-researcher`, `spec-writer`, `code-reviewer` — see `.claude/agents/` and `docs/ai-usage-notes.md`.

**Out of scope, deliberately:**
- Affiliate link wiring — Tokopedia and Shopee affiliate programs require business setup time I didn't have in 48 hours. Marketplace links are placeholder search URLs. Documented as the first revenue fix.
- Real-time price scraping — Gemini Google Search grounding is the lightweight equivalent for this sprint.
- Auth, user accounts, recommendation history.
- Brand preference, cicilan, or form-factor questions — they aren't in the current product knowledge for a reason (would change the product without user research backing). Deferred until I can validate the v2 matching first.
- Expanding to 5+ recommendations — the product's wedge is decision *compression*, not lists. Holds at 1 primary + 2 alternates per the original product principle.

## Where I didn't have answers, what I assumed

1. **Gemini grounding accuracy.** Assumed Google Search grounding returns Indonesian phone prices within ±10% of Tokopedia/Shopee reality. Not empirically measured in 48 hours.
2. **Loading latency tolerance.** Assumed the 18–22 demographic accepts a 3–6 second LLM loading delay. The existing v1 loading state handles it; in a real study I'd measure dropout.
3. **YouTube URL stability.** Assumed Indonesian reviewer archive URLs are stable. If a video gets deleted, the server-side HEAD check catches it and the fallback path fires.
4. **Free-tier rate limits.** Assumed Gemini free tier is sufficient for assessment demo traffic. Production scale needs paid tier.

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
