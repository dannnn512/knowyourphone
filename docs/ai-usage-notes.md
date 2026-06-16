# AI Usage Notes

A 48-hour AI-assisted build. I used AI heavily and want to be specific about how — both where it helped and where it got something wrong that I caught.

## Where AI helped

### 1. Strategy and framing (Claude in Cowork mode, long-form chat)

I used Claude as a brutal-honesty advisor, not a yes-machine. The most valuable single moment: I came in framing this as "another phone recommendation quiz." Claude pushed back hard — twice — until I named the actual wedge in my own words: *don't kill the YouTube-review habit Indonesian buyers already have; accelerate it.* That reframe shaped the product, the README, and the decision to embed reviewer URLs on the result card. Without that push I'd have shipped a cleaner static demo.

I also used Claude as a mirror on bad calls. When I proposed a 6-agent roster (main + fe + be + catalog-researcher + spec-writer + code-reviewer) at 5am Tuesday, Claude cut it to 3 sub-agents with specific reasoning: a separate BE service buys nothing for this product and costs 5+ hours; a `fe-engineer` agent is redundant when the main session *is* the FE engineer. I disagreed initially. The cut was right.

### 2. Multi-agent orchestration (Claude Code CLI)

Three sub-agents, each with a mutually exclusive trigger and tool scoping:

- **`phone-researcher`** (Gemini-backed via WebFetch, parallel fan-out, Haiku model) — produced the vetted fallback phone set with current prices and validated YouTube URLs. Six phones in parallel finished in ~8 minutes instead of ~60 serially.
- **`spec-writer`** (Sonnet, Read/Write only) — interviewed me at the start of Tuesday and produced `SPEC.md` so implementer code had an unambiguous contract.
- **`code-reviewer`** (Sonnet, read-only — Read/Grep/Glob/Bash) — cold-read the diff before deploy. Caught [TODO: fill in specifically what it caught during the build].

Each agent file is in `.claude/agents/` if you want to see how tool scoping and triggers were set up.

### 3. Runtime AI inside the product itself

This isn't AI helping me build — it's AI shipping *as* the product. The recommendation engine is a single Gemini 2.5 Flash call with Google Search grounding, running in a Vercel edge function. Every user submission triggers a grounded LLM call that returns the recommended phone + reasoning + real YouTube URL.

This was the single most important architectural decision. v1 of KnowYourPhone had a documented broken static-matching bug. Replacing the static engine with grounded LLM matching doesn't just fix the bug — it also makes the personalized reasoning real (each bullet is tied to user input) and the YouTube URL real (grounded by search, not invented).

## One place AI got something wrong that I caught

[TODO: fill in during build. Strong candidates to look out for:
- Gemini hallucinating a phone model name or YouTube URL that doesn't exist (fallback path or HEAD check catches this — note the specific case)
- Claude proposing a backend service I cut because it was scope creep
- An agent over-formatting copy with bullet lists where conversational prose was the v1 tone
- Catalog data with a wrong price point that didn't match marketplace reality
Be specific — exact moment, what Claude/Gemini said, what was wrong, what I did instead.]

## Honest scope of AI usage

I drove every decision. AI generated drafts, fanned out research, and made the matching engine itself work — but every commit, every cut, every refusal to add a brand-question, was a call I made. The risk of heavy AI use is the engineer becoming a passenger; I tried to stay the driver by writing decisions down (`SPEC.md`, `CLAUDE.md`, `.claude/agents/*.md`) *before* letting any agent generate code from them.
