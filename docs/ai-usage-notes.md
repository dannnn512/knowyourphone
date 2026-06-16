# AI Usage Notes

A 48-hour AI-assisted build. I used AI heavily and want to be specific about how — both where it helped and where it got something wrong that I caught.

## Where AI helped

### Framing — two distinct AI roles, never blurred

I used AI in two distinct roles on this project: an **adversarial planning advisor** (Claude in Cowork chat, explicitly prompted to push back and never validate me) and the **implementer / worker** (Claude Code CLI doing the actual code-writing on a tight clock). These are not the same role and treating them as the same would have produced bad work.

The advisor's job was to argue with me, surface assumptions I was avoiding, and tell me what trade-off I was actually making. The worker's job was to ship code without re-litigating decisions. Keeping the boundary sharp — the advisor doesn't write code, the worker doesn't redecide architecture — was the single most important meta-decision I made about how to use AI here.

Two specific moments where the advisor most earned its keep:

**The agent roster cut.** My first instinct was a 6-agent roster (main + fe + be + catalog-researcher + spec-writer + code-reviewer). The advisor cut it to 2 in real time and made me defend each one. Outcomes: `fe-engineer` for a single React app = delegating to yourself with extra steps; `be-engineer` = yak-shaving when the runtime is one edge function; `catalog-researcher` = building a static fallback that contradicted the AI-native architecture I was claiming to want. Shipping the 6-agent roster would have read as cargo-culting, not judgment. The cut is the story.

**The Cloud Prepay pivot.** Mid-build I planned grounded recommendation via Gemini Google Search. The advisor flagged the IDR 500k Cloud Prepay gate as a likely surfaceable obstacle before I'd budgeted for it. It surfaced exactly when predicted. I scoped grounding out, documented it as a known limitation, and shipped the ungrounded version. Honest scope management under business constraint — instead of either paying out of pocket for an assessment or pretending the constraint didn't exist.

The implementer (Claude Code CLI) then took the locked decisions and built. Concrete uses below.

### 1. Strategy and framing (Claude in Cowork mode)

The advisor session is where the product actually got shaped. I came in calling this "another phone recommendation quiz." The advisor pushed back twice until I said the real wedge in my own words: *don't kill the YouTube-review habit Indonesian buyers already have; accelerate it.* That reframe is what made me embed reviewer URLs on the result card in the first place, and it's the seed of the wedge sentence in SPEC.md. Without it I'd have shipped a cleaner version of the same static-quiz product the v1 already was.

The advisor also served as a mirror on bad calls. When I drafted a 6-agent roster at 5am Tuesday (main + fe + be + catalog-researcher + spec-writer + code-reviewer), the advisor refused to write a single agent file until I justified each one. By the end of that exchange I'd cut to 3, and later (after the grounding pivot) to 2 on paper. I disagreed at first. The cut was right.

`SPEC.md` itself was drafted in this same Cowork session — not by the spec-writer sub-agent. Honest acknowledgment: the spec was already locked before Claude Code CLI started building. The `spec-writer` agent file in `.claude/agents/` is a designed-but-unused template — kept as honest record of "I had this on hand if needed; I didn't need to invoke it."

### 2. Multi-agent orchestration (Claude Code CLI)

Of the two agents in `.claude/agents/`, only one actually fired during the sprint. That's deliberate restraint, not an oversight.

- **`code-reviewer`** (Sonnet, read-only — Read/Grep/Glob/Bash) — invoked once, cold-read the edge function diff after Chunk 1. Returned a mix of real findings (unpinned `@google/genai` version, missing `price_idr[0] <= price_idr[1]` validation, tightening the error-log path) and one confidently-wrong CRITICAL flagging the model identifier. The accepted findings became one small commit before Chunk 2; the wrong-CRITICAL became the "one place AI got something wrong" story below.
- **`spec-writer`** — defined, never invoked. SPEC.md was locked in the advisor session before CLI started. I left the agent template in `.claude/agents/` rather than delete it — it's an honest snapshot of what I had ready, not a claim that I used it.

The roster also originally included **`phone-researcher`**, designed to fan out and build a vetted fallback phone set with grounded YouTube URLs. I cut it from the roster after I dropped Google Search grounding from the architecture — once the runtime no longer needed a fallback set, the agent had no real job. Discipline over multi-agent theater. Git log preserves the original design if Owen wants to look.

### 3. Runtime AI inside the product itself

This is the part that isn't AI *helping* me build — it's AI *shipping as* the product. The recommendation engine is a single Gemini 3.5 Flash call from a Vercel edge function. Every user submission triggers that call and gets back a personalized recommendation — primary phone, three reasoning bullets tied to the user's specific inputs, two alternates with explicit *better at / trade-off* framing.

This was the single most important architectural decision. v1 of KnowYourPhone had a documented broken matching bug — same recommendation regardless of input. Replacing the static matcher with an LLM call doesn't just fix the bug; it makes the reasoning per-submission real (each bullet references the actual budget and use case the user picked) rather than canned strings on the phone object.

The original architecture also included Google Search grounding — the model would have looked up live Tokopedia prices and Indonesian YouTube reviews per request. Mid-build I hit the Gemini API Paid Tier requirement (IDR 500k Cloud Prepay, non-refundable) and scoped grounding out. The shipped version returns YouTube URLs when the model has confident training-data knowledge of one and empty strings otherwise. The README and SPEC document this as the first production fix.

## One place AI got something wrong that I caught

While building the Gemini edge function, I invoked the `code-reviewer` sub-agent to cold-read `app/api/recommend.ts` before moving to the frontend. It came back with a CRITICAL severity flagging `gemini-3.5-flash` as a non-existent model identifier — citing training-data priors about the Gemini 1.5/2.0 Flash naming era.

I rejected the finding with two pieces of evidence:

1. The `@google/genai@2.8.0` type definitions, which already had the right surface for the new model.
2. A live HTTP 200 smoke test I had just run using that exact model string, which returned a valid structured response in 10.9s.

The wrong-CRITICAL got caught in exactly the orchestrator loop the multi-agent playbook describes — sub-agent isolation surfaced a divergent opinion, and I adjudicated with evidence rather than deferring to the sub-agent's confidence.

The takeaway: sub-agent CRITICALs are *hypotheses, not conclusions.* They're useful precisely because they disagree with the main session, but every one needs human evidence-checking before action. If I'd silently downgraded the model to `gemini-2.0-flash` because a sub-agent said so, I'd have made the product worse for no reason.

## Honest scope of AI usage

I drove every decision. The advisor argued, the worker typed, the runtime LLM ships in the product — but every commit, every scope cut, every refusal to add a brand question I hadn't validated, every choice to add brand back later when I changed my mind, was a call I made. The advisor pushed and I either agreed or overruled. The worker built from prompts I wrote.

The risk of heavy AI use is the engineer becoming a passenger. I tried to stay the driver by writing decisions down in `SPEC.md`, `CLAUDE.md`, and `.claude/agents/*.md` *before* letting the worker generate code from them. Where I deviated from that discipline — the brand question, the wedge change, the grounding cut — it was because new information surfaced, not because an agent talked me into it.
