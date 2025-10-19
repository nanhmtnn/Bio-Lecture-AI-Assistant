## Repository snapshot for AI coding agents

This is a small Next.js (app router) TypeScript project that integrates with Google's GenAI SDK to generate lecture content. The goal of this file is to surface the concrete, discoverable patterns that make an AI assistant productive immediately.

### Big picture
- Framework: Next.js (app directory) — server and client components live under `app/`.
- AI integration: server-side API routes under `app/api/*/route.ts` call the GenAI SDK.
- Shared client: `lib/gemini.ts` exports an `ai` client configured from `process.env.GOOGLE_API_KEY`.

### Key files to inspect (high value)
- `app/api/generate-lecture/route.ts` — builds a large, strict prompt and expects the model to return a single valid JSON object. Important: the route parses the model text as JSON and returns `raw_output` if parse fails.
- `app/api/test-gemini/route.ts` — minimal example of creating a `GoogleGenAI` instance and calling `models.generateContent`.
- `lib/gemini.ts` — central `ai` client used by routes. Update here if you change how the SDK is instantiated.
- `components/lecture-results.tsx` — present but empty; UI components may be stubs and expect the API shape returned by `generate-lecture`.
- `package.json` — dev scripts: `npm run dev` (uses `next dev --turbopack`), `build` and `start`.

### Environment & runtime
- Required: `GOOGLE_API_KEY` (read in `lib/gemini.ts` and `app/api/test-gemini/route.ts`). Keep it in your local env or a `.env` for dev.
- Node / Next: project uses Next 15, React 19. Local dev runs via `npm run dev` (turbopack enabled).

### Prompting and output contract (very important)
- `generate-lecture` enforces a strict JSON output schema in the prompt. Agents modifying or generating prompts must preserve that requirement: the API expects either a parsable JSON object or will return `{ raw_output, warning: 'Response not valid JSON' }`.
- Do NOT add Markdown, HTML, or additional explanation into the model prompt's expected JSON output. The prompt explicitly says: "return only a single JSON object".
- If you change the schema, update both the human-readable prompt in `generate-lecture/route.ts` and any front-end code or components that consume the JSON shape.

### SDK usage patterns & examples
- Preferred call: `ai.models.generateContent({ model: 'gemini-2.0-flash', contents: <string>, generationConfig: { temperature, maxOutputTokens } })` (see `generate-lecture/route.ts`).
- When instantiating the SDK manually (example in `test-gemini/route.ts`), pass the `apiKey` from `process.env.GOOGLE_API_KEY`.

### Error handling & observability
- Routes log errors to server console via `console.error` and return JSON error payloads with appropriate HTTP status codes (see both routes).
- When editing routes, keep the parse-then-fallback pattern (`try { JSON.parse(text) } catch { return raw_output }`) unless you intentionally change response handling and update consumers.

### Conventions and small patterns
- All API handlers are exported as named async functions (`export async function GET/POST(req: Request)`) — they run on the server.
- Responses use `NextResponse.json(...)` rather than manual Response construction.
- TypeScript-first: prefer explicit types where helpful, although some files use `any` for quick prototyping (see error handling in routes).

### Developer workflows (quick)
- Dev server: `npm run dev` — opens Next dev on port 3000.
- Build: `npm run build` (uses turbopack flags already set in `package.json`).
- Lint: `npm run lint`.

### When you change prompts or model settings
1. Update the prompt text in the relevant `app/api/*/route.ts` file.
2. Run the dev server and call the endpoint (or use `app/page.tsx` if a UI exists) to validate the returned JSON shape.
3. If the JSON schema changed, update any components (e.g., `components/lecture-results.tsx`) and document the change in this file.

If anything above is unclear or you want the instructions to be stricter (for example, enforce unit tests for API routes), tell me which parts to expand and I'll iterate.
