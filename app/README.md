# app/ — local dev

## Setup

```
bun install
```

Create `app/.env.local`:

```
GEMINI_API_KEY=your_key_here
```

## Run

The `/api/recommend` edge function is only served by Vercel's dev runtime, not Vite:

```
bunx vercel dev
```

(do NOT use `bun dev` — that's Vite only, no `/api` route).

## Smoke test

```
curl -X POST http://localhost:3000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"budget":2500000,"brand":"Apa aja","use":"gaming","keep":"mid","condition":"new","lang":"id"}'
```
