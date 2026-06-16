# KnowYourPhone — Product Knowledge
**Last updated:** May 2026
**Status:** V1 Live at knowyourphone-fe.vercel.app
**Built by:** Ziddan (sole builder)

---

## What It Is

KnowYourPhone is an Indonesian phone recommendation tool. Not a comparison site. Not a spec database. A decision tool — the digital equivalent of asking your tech-savvy friend who actually knows the market.

> "Tell us about yourself. We'll tell you exactly what to buy."

---

## The Problem It Solves

Indonesian consumers aged 18–22 in the middle-lower bracket (budget Rp 1.5–3 juta) face a specific pain:

- Too many phones at the same price range, each winning at one thing
- YouTube reviews (Gadgetin etc.) are great for specs — but the unit gets sold before they can act, and the reviewer's use case doesn't match theirs
- Tokopedia/Shopee sorting overwhelms with options
- Facebook Marketplace (secondhand) has zero guidance
- GSMArena is too technical, English-first, not Indonesia-aware

**The real gap:** nobody answers *"given YOUR budget, YOUR priority, and what's actually available right now in Indonesia — here is what you should buy, and here is why."*

---

## Target User

**Primary:**
- Age: 18–22
- Indonesian, middle-lower class
- Budget: Rp 1.5 juta – Rp 3 juta (occasionally up to Rp 4 juta)
- Keeps phone until it breaks — not an annual upgrader
- Buys on: Tokopedia, Shopee, Facebook Marketplace (secondhand)
- Discovery: Indonesian YouTube reviews, asks friends in WhatsApp group chats

**User priority profiles:**
- Female → camera first, aesthetic second, price third
- Male → gaming performance and battery first, price second
- Gojek/delivery workers → battery endurance above all

---

## Core Value Proposition

| Others give | KnowYourPhone gives |
|---|---|
| "This phone has good specs" | "This phone is right for YOU" |
| Generic rankings | Priority-matched recommendation |
| Review from months ago | Availability-aware results |
| One result | Main pick + 2 ranked alternatives |
| Raw specs | Plain language reasoning |
| Global pricing | Indonesia pricing + Tokopedia/Shopee links |

---

## User Flow

### Input (single screen, all visible at once — no scroll on desktop)
1. **Budget** — slider Rp 1–5 juta + manual type, rounds to nearest Rp 50.000
2. **Primary use** — Gaming / Camera / Social Media & Streaming / Basic Use / Tough Battery (Gojek/delivery/outdoor)
3. **How long keeping** — 1–2 years / 2–3 years / 3+ years
4. **Condition** — New only / Open to secondhand / Secondhand preferred

### Result
1. Phone name + image (hero)
2. "Why it fits you" — plain language reasoning bullets tied to user's actual input
3. Tokopedia + Shopee buy buttons
4. Price range
5. "See full specs" — collapsible inline, hidden by default (chipset, RAM, storage, battery mAh, camera MP, AnTuTu, display size)
6. WhatsApp share button
7. 2 alternatives — each with "better at / trade-off" framing + price + Tokopedia link

---

## Design Decisions

- **Light mode default, dark mode toggle**
- **English default, Bahasa Indonesia toggle**
- Clean, minimal, slightly premium — not stiff, not childish
- Mobile-first, also works on desktop (two-column layout on 1280px+)
- Jakarta Sans typography
- Teal accent color
- YOUR PICKS live summary panel on desktop input screen (updates as user selects)
- No cluttered spec tables — this is a decision tool, not a database browser

---

## Tech Stack

- **Frontend:** React 19 + Vite 6
- **Package manager:** Bun
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (static)
- **Architecture:**
  - `/components/ui` — pure presentational, dumb components
  - `/components/features` — InputForm, ResultCard, AlternativeCard
  - `/data` — phones.ts (phone database), en.ts + id.ts (i18n strings)
  - `/services/recommend.ts` — pure recommendation logic, no UI
  - `/hooks` — useRecommendation, useLanguage, useTheme
  - `/types` — shared TypeScript interfaces

---

## Monetization

**Phase 1 (now):** Affiliate links — Tokopedia and Shopee affiliate programs. Revenue only on actual purchase clicks. Aligns incentive with user trust.

**Phase 2:** Freemium
- Free: standard recommendation flow
- Premium (Rp 15–25k/month or one-time): price drop alerts, "buy now or wait?" forecasting, current phone vs upgrade comparison

**Phase 3:** Expand to laptops (same problem, higher AOV = higher affiliate commission), then PC components, accessories

---

## Why It Can Win

1. **Indonesia-first** — built for Indonesian prices, channels, and buyer behavior from day one
2. **Availability-aware** — accounts for stock reality, offers alternatives when main pick is rare
3. **Honest** — will tell you "don't upgrade yet" when that's the right answer. Trust is the product.
4. **WhatsApp-native sharing** — primary social layer for the target demographic. Shareable result card = organic distribution
5. **Secondhand market aware** — Facebook Marketplace is a real buying channel for this audience; no other tool accounts for it

---

## Current Status (V1)

**What's working:**
- Full input form with slider, use case cards, longevity and condition selection
- Result page with recommendation, reasoning, buy links, alternatives
- EN/ID language toggle
- Light/Dark theme toggle
- Deployed and live on Vercel
- WhatsApp share button

**What's still dummy/hardcoded:**
- Phone database is static — 6–8 phones, manually curated
- Recommendation engine not yet dynamically matching to input (V1 returns same result regardless of selection)
- No real Tokopedia/Shopee affiliate tracking yet
- No real stock availability data

**Immediate next fixes (priority order):**
1. Fix recommendation engine — results must change based on actual user input
2. Add collapsible full specs section (per user feedback from Nopan and Saktot)
3. Make reasoning bullets dynamic per use case selection
4. Register Tokopedia + Shopee affiliate accounts and replace placeholder links
5. Expand phone database to 20–30 phones covering Rp 1.5–4 juta range properly

---

## User Feedback (V1, May 2026)

**Nopan:** "Kasih list aja jangan ditembak 1 HP" + "full spec, AnTuTu segala macem"
→ Interpreted as: trust gap, not a feature request. Fix: collapsible specs + more concrete reasoning bullets.

**Saktot:** "Tambahin full spek HP nya sama comparison merk lain"
→ Same trust signal. Same fix. Not becoming GSMArena.

**Key insight from feedback:** users aren't asking for spec sheets — they're saying the current reasoning doesn't give them enough confidence to buy. The fix is more specific, data-backed reasoning — not a comparison table.

---

## Open Questions

1. Tokopedia vs Shopee affiliate — which pays better commission for electronics?
2. Domain: knowyourphone.id vs .com vs .app?
3. Facebook Marketplace availability — scrape or manual tracking?
4. When to introduce AI layer on top of recommendation engine? (Month 2+ only — after real logic works)
5. Laptop category — when to expand? (After affiliate revenue is proven on phones)

---

## Distribution Strategy

- **WhatsApp sharing** — built into result page, primary viral mechanic
- **SEO** — target "hp bagus 2 juta", "hp gaming murah 2026", "hp kamera bagus under 3 juta" (migrate to Next.js when traffic justifies)
- **LinkedIn build-in-public** — post launched May 2026
- **Direct** — seed with close network first, then expand

---

*KnowYourPhone wins not by being the biggest, but by being the most useful for one specific moment: when someone is about to spend 2 juta and doesn't know what to buy.*
