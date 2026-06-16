# AI Usage Notes

A 48-hour AI-assisted build. I used AI heavily and want to be specific about how — both where it helped and where it got something wrong that I caught.

## Where AI helped

### 1. Strategy and framing (Claude in Cowork mode, long-form chat)

I used Claude as a brutal-honesty advisor, not a yes-machine. The most valuable single moment: I came in framing this as "another phone recommendation quiz." Claude pushed back hard — twice — until I named the actual wedge in my own words: *don't kill the YouTube-review habit Indonesian buyers already have; accelerate it.* That reframe shaped the product, the README, and the decision to embed reviewer URLs on the result card. Without that push I'd have shipped a cleaner static demo.

I also used Claude as a mirror on bad calls. When I proposed a 6-agent roster (main + fe + be + catalog-researcher + spec-writer + code-reviewer) at 5am Tuesday, Claude cut it to 3 sub-agents with specific reasoning: a separate BE service buys nothing for this product and costs 5+ hours; a `fe-engineer` agent is redundant when the main session *is* the FE engineer. I disagreed initially. The cut was right.

### 2. Multi-agent orchestration (Claude Code CLI)

Two sub-agents, each with a mutually exclusive trigger and tool scoping:

- **`spec-writer`** (Sonnet, Read/Write only) — interviewed me at the start of Tuesday and produced `SPEC.md` so implementer code had an unambiguous contract.
- **`code-reviewer`** (Sonnet, read-only — Read/Grep/Glob/Bash) — cold-read the edge function diff after Chunk 1. Returned a mix of real findings (unpinned `@google/genai` version, missing `price_idr[0] <= price_idr[1]` validation, tightening the error-log path) and one confidently-wrong CRITICAL flagging the model identifier — see the "one place AI got something wrong" section below. The accepted findings became three small commits before Chunk 2; the wrong-CRITICAL became the most useful story in this document.

Worth flagging: my roster started at **three** sub-agents. I had a `phone-researcher` agent designed to build a vetted fallback phone set (with current prices and validated YouTube URLs). I cut it after Ziddan pushed back on the fallback architecture itself — once the runtime moved to pure Gemini grounding with no static fallback, `phone-researcher` had no job left this sprint. Discipline over multi-agent theater. Owen, if you're curious: the deleted agent's design is recoverable from `git log`.

Each remaining agent file is in `.claude/agents/` if you want to see how tool scoping and triggers were set up.

### 3. Runtime AI inside the product itself

This isn't AI helping me build — it's AI shipping *as* the product. The recommendation engine is a single Gemini 2.5 Flash call with Google Search grounding, running in a Vercel edge function. Every user submission triggers a grounded LLM call that returns the recommended phone + reasoning + real YouTube URL.

This was the single most important architectural decision. v1 of KnowYourPhone had a documented broken static-matching bug. Replacing the static engine with grounded LLM matching doesn't just fix the bug — it also makes the personalized reasoning real (each bullet is tied to user input) and the YouTube URL real (grounded by search, not invented).

## One place AI got something wrong that I caught

While building the Gemini edge function, I invoked the `code-reviewer` sub-agent to cold-read `app/api/recommend.ts` before moving to the frontend. It came back with a CRITICAL severity flagging `gemini-3.5-flash` as a non-existent model identifier — citing training-data priors about the Gemini 1.5/2.0 Flash naming era.

I rejected the finding with two pieces of evidence:

1. The `@google/genai@2.8.0` type definitions, which already had the right surface for the new model.
2. A live HTTP 200 smoke test I had just run using that exact model string, which returned a valid structured response in 10.9s.

The wrong-CRITICAL got caught in exactly the orchestrator loop the multi-agent playbook describes — sub-agent isolation surfaced a divergent opinion, and I adjudicated with evidence rather than deferring to the sub-agent's confidence.

The takeaway: sub-agent CRITICALs are *hypotheses, not conclusions.* They're useful precisely because they disagree with the main session, but every one needs human evidence-checking before action. If I'd silently downgraded the model to `gemini-2.0-flash` because a sub-agent said so, I'd have made the product worse for no reason.

## Honest scope of AI usage

I drove every decision. AI generated drafts, fanned out research, and made the matching engine itself work — but every commit, every cut, every refusal to add a brand-question, was a call I made. The risk of heavy AI use is the engineer becoming a passenger; I tried to stay the driver by writing decisions down (`SPEC.md`, `CLAUDE.md`, `.claude/agents/*.md`) *before* letting any agent generate code from them.
