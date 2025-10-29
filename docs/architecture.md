# Clio Architecture Overview

This document outlines the initial project layout for the Clio MCP server, aligning with the `CLIO_SPEC.md` kickstart document.

## Directory Layout

- `src/` — TypeScript source for the MCP server.
  - `config/` — runtime configuration (Supabase client, environment loading).
  - `mcp/` — MCP router and tool definitions exposed to LLMs.
    - `tools/` — individual tool handlers (collections, entries, aggregation, introspection).
  - `repositories/` — data-access layer that wraps Supabase queries.
  - `services/` — domain logic for collections, entries, sharing, and validation.
  - `types/` — shared TypeScript interfaces and schema helpers.
- `supabase/` — SQL migrations, seeds, and local Supabase helpers.
  - `migrations/` — versioned SQL scripts; `0001_init.sql` seeds the base schema from the kickstart doc.
- `scripts/` — local tooling (seeding, linting, task runners) kept separate from runtime code.
- `docs/` — project documentation, including this file and the imported kickstart spec.

## Runtime Stack

- Node.js with TypeScript for type-safe MCP tool implementations.
- Supabase (PostgreSQL) for persistence and RLS-backed access control.
- Environment variables (see `env.example`) to configure Supabase keys and JWT secrets.

## Control Flow Outline

1. An MCP client invokes a tool in `src/mcp/tools`.
2. The tool delegates to a service in `src/services`, where validation and authorization checks happen.
3. Services call repositories that issue typed Supabase queries.
4. Results are serialized back through the MCP protocol.

## Next Steps

- Materialize the directory tree and placeholder files that match this structure.
- Commit the kickstart spec as `CLIO_SPEC.md`.
- Scaffold TypeScript configuration (`package.json`, `tsconfig.json`) and Supabase migration files.
