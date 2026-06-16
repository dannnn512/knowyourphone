/**
 * KnowYourPhone — Recommendation Edge Function
 *
 * Called by the FE on form submission. Routes user input through Gemini 2.5 Flash
 * with Google Search grounding, returns a validated phone recommendation.
 *
 * Falls back to the hardcoded set in app/data/fallback-phones.json when:
 *   - GEMINI_API_KEY is missing
 *   - Gemini returns malformed JSON
 *   - Validation fails (e.g., dead YouTube URL, price out of band)
 *   - Rate limit hit
 *
 * SHAPE:
 *   POST /api/recommend
 *   Body: { budget: number, use: UseCase, keep: KeepDuration, condition: Condition, lang: 'en' | 'id' }
 *   Response: { primary: Phone, alternates: [Phone, Phone] }
 *
 * TODO (build sprint):
 *   1. Read & validate request body
 *   2. Construct prompt: system instruction + few-shot from fallback set + user input
 *   3. Call Gemini 2.5 Flash with tools: [{ google_search: {} }] + structured output schema
 *   4. Validate response (schema, URLs reachable, prices within sane band)
 *   5. Return JSON or fallback
 *   6. Pin temperature to 0.2 for stability
 *   7. Strip the API key from any error response surfaced to client
 */

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // TODO: implement during build sprint
  return new Response(
    JSON.stringify({ error: 'Not implemented yet — see TODO in app/api/recommend.ts' }),
    { status: 501, headers: { 'Content-Type': 'application/json' } }
  );
}
