# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds TypeScript source; `src/index.ts` bootstraps the MCP server, `src/config/` handles env + Supabase, and core modules live under `mcp/`, `repositories/`, `services/`, and `types/`.
- `supabase/migrations/` stores SQL schema migrations; run them sequentially to keep Supabase in sync.
- `agents/` keeps prompt artifacts such as `kickstart.md`; ensure it mirrors `CLIO_SPEC.md`.
- `docs/` captures design references, `scripts/` is for local automation, and `env.example` documents required variables.

## Environment & Supabase Setup
- Copy `env.example` to `.env`, fill in Supabase URL and keys, and keep secrets out of git.
- Apply database changes with the Supabase CLI (`supabase db push` or `supabase db reset --env-file .env`) before running the server.
- Ensure Supabase is reachable while developing so MCP tool calls can execute end to end.

## Build, Test, and Development Commands
- `npm run dev` launches the TypeScript entrypoint with `ts-node`, honoring `.env` for rapid iteration.
- `npm run build` transpiles to `dist/` and performs a strict type check.
- `npm start` executes the compiled server from `dist/index.js`; run after building.
- `npm run format` invokes Prettier over `src`, `scripts`, and `docs` to enforce consistent styling.

## Coding Style & Naming Conventions
- Stick to ESM with TypeScript, 2-space indentation, and Prettier defaults.
- Keep files and folders lowercase or camelCase (e.g., `supabaseClient.ts`) and mirror directory intent (`services`, `repositories`).
- Use PascalCase for classes, camelCase for functions and values, and preserve MCP tool identifiers in `namespace.action` form per `CLIO_SPEC.md`.

## Testing Guidelines
- No dedicated test runner ships yet; use `npm run build` as the type-sanity gate before every PR.
- Stage exploratory or smoke tests in `src/tests/` or colocated `*.spec.ts` files, run through `node --test` or targeted scripts, and record the command in the PR checklist.
- Validate SQL changes by applying `supabase/migrations/` to a fresh database and noting the result in review notes.

## Commit & Pull Request Guidelines
- Follow recent history by writing short, sentence-case imperative commit subjects (e.g., `Add Supabase collection seed script`) and keep body lines wrapped.
- Reference linked issues and highlight Supabase or agent-facing changes directly in the PR description, including manual verification steps or sample tool outputs.
- Update accompanying docs (`CLIO_SPEC.md`, `agents/`) whenever behavioral contracts change, and request at least one reviewer familiar with Supabase migrations.
