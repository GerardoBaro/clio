Excellent — here’s a concise, Codex-ready **`CLIO_SPEC.md`** that you can drop into your repo root.
It’s formatted so Claude Code or any MCP-aware LLM can parse it deterministically while staying readable to humans.

---

````markdown
# CLIO_SPEC.md
**Project:** Clio  
**Goal:** Flexible, LLM-accessible data system built on Supabase and an MCP tool layer.

---

## 1. Overview

Clio is a system where users (and LLMs acting for them) can create and manage **named data collections**.  
Each collection behaves like a logical table whose rows are **entries** stored as JSON.

- **structure_proxy** – JSON describing the expected keys and types of entries.
- **entry_data** – JSON with the actual user data.
- **Entries** also include metadata: `created_at`, `updated_at`, `created_by`, and soft-delete flag.
- Collections can be private or shared with other users.

All actions are mediated through Supabase (PostgreSQL + Auth) and exposed to LLMs through an **MCP toolset**.

---

## 2. Core capabilities

### Collections
- Create, update, list, and delete logical collections.
- Define or update `structure_proxy` (a schema-like descriptor).
- Manage access control (owner / writer / reader).
- Track which collections a user owns or can access.

### Entries
- Insert, read, update, and delete entries.
- Filter and aggregate JSON data.
- Maintain consistent key usage through `structure_proxy`.

### Sharing
- Grant or revoke access for other users.
- Visibility: `private` | `shared`.

---

## 3. Supabase schema (SQL)

```sql
create schema if not exists clio;

create table if not exists clio.collections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  structure_proxy jsonb not null,
  visibility text not null default 'private',
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, name)
);

create table if not exists clio.collection_members (
  collection_id uuid not null references clio.collections(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','writer','reader')),
  added_at timestamptz not null default now(),
  primary key (collection_id, user_id)
);

create table if not exists clio.entries (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references clio.collections(id) on delete cascade,
  entry_data jsonb not null,
  created_by uuid not null references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_deleted boolean not null default false
);

create index if not exists idx_entries_collection on clio.entries(collection_id) where is_deleted=false;
create index if not exists idx_collections_owner on clio.collections(owner_id) where is_deleted=false;
```

---

## 4. Access control (RLS summary)

* **Collections** visible to members or owner.
* **Entries** readable by readers/writers/owners; writable by writers/owners.
* **Collection members** managed only by the owner.

Policies use `auth.uid()` to identify current user.

---

## 5. MCP tool interface

### 5.1 Tool list

| Tool                                        | Purpose                          |
| ------------------------------------------- | -------------------------------- |
| `collections.create`                        | Create new collection            |
| `collections.update`                        | Edit metadata or structure_proxy |
| `collections.delete`                        | Soft/hard delete                 |
| `collections.list`                          | List owned or shared collections |
| `collections.share` / `collections.unshare` | Manage members                   |
| `entries.insert`                            | Insert (or upsert) entries       |
| `entries.query`                             | Filtered read                    |
| `entries.update`                            | Patch JSON entry                 |
| `entries.delete`                            | Soft/hard delete                 |
| `entries.aggregate`                         | Group or summarize data          |
| `introspection.structure`                   | Return current structure_proxy   |

All tool calls return structured JSON responses and standard errors:
`NOT_FOUND`, `FORBIDDEN`, `VALIDATION_ERROR`, `CONFLICT`, `RATE_LIMITED`, `INTERNAL`.

---

## 6. Example `structure_proxy`

### Habits

```json
{
  "version": 1,
  "required_keys": ["performed_at", "success"],
  "fields": {
    "performed_at": {"type": "string", "format": "date-time"},
    "success": {"type": "boolean"},
    "location": {"type": "string"},
    "notes": {"type": "string"}
  },
  "dedupe_keys": ["performed_at"]
}
```

### Shared Expenses

```json
{
  "version": 1,
  "required_keys": ["timestamp", "amount", "currency", "category"],
  "fields": {
    "timestamp": {"type": "string", "format": "date-time"},
    "amount": {"type": "number"},
    "currency": {"type": "string"},
    "category": {"type": "string"},
    "merchant": {"type": "string"},
    "location": {"type": "string"}
  },
  "dedupe_keys": ["timestamp", "amount", "merchant"]
}
```

---

## 7. Typical workflows

### Habit tracking (single user)

1. `collections.create(name="habits/routineA", visibility="private", structure_proxy=...)`
2. `entries.insert(collection_id=<id>, entry_data={performed_at, success, ...})`
3. `entries.aggregate` to compute success rate by week.

### Shared expenses (two users)

1. `collections.create(name="expenses/relationship", visibility="shared", members=[userA:owner, userB:writer])`
2. Both users add entries.
3. `entries.aggregate` groups by month/category.

---

## 8. Validation & versioning

* Server checks `required_keys` and types from `structure_proxy`.
* Strict mode rejects invalid keys; lenient mode warns.
* Optional `auto_extend` allows adding new keys automatically.
* `structure_proxy.version` increments when changed.

---

## 9. Aggregation mini-DSL

Example:

```json
{
  "collection_id": "<cid>",
  "pipeline": [
    {"$match": {"success": true}},
    {"$timeBucket": {"key": "performed_at", "interval": "week"}},
    {"$group": {"by": ["$bucket"], "metrics": [{"op": "avg", "key": "success"}]}},
    {"$sort": [{"key": "bucket", "direction": "asc"}]}
  ]
}
```

---

## 10. Non-functional expectations

* **Security**: full RLS, JWT-based user context.
* **Performance**: <200 ms p95 typical query for ≤50 k entries/collection.
* **Scalability**: ≥10 k collections, ≥10 M entries total.
* **Reliability**: 99.9 % availability target.
* **Cost**: single physical `entries` table, soft deletes, JSONB indexes only as needed.
* **Observability**: structured logs, audit table, metrics, trace hooks.

---

## 11. Developer guidance

* Treat each collection as a **logical view** identified by `collection_id`.
* Always fetch `structure_proxy` before writing, to avoid key drift.
* Prefer `entries.aggregate` for analysis instead of client-side computation.
* MCP calls must be idempotent when safe (especially creation and updates).
* Handle Supabase errors with structured `code` and `message` fields.
* Follow naming convention: `<namespace>.<action>` for all tools.

---

**End of CLIO_SPEC.md**

```

---

Would you like me to add a short **“CODING_GUIDELINES.md”** next (with naming, file layout, and how MCP connects to Supabase for local dev)? That would make Codex’s workspace fully self-contained.
```
