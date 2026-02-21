# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Next.js dev server with Turbopack (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run all tests with Vitest
npx vitest run src/lib/__tests__/file-system.test.ts  # Run a single test file
npm run setup        # Full setup: install deps + prisma generate + migrate
npm run db:reset     # Reset database (drops all data)
```

## Architecture

UIGen is an AI-powered React component generator. Users describe components in a chat interface, Claude generates the code, and a live preview renders it in-browser — all without writing files to disk.

### Core Data Flow

1. User sends a message via `ChatInterface` → `POST /api/chat`
2. Server streams Claude's response using Vercel AI SDK's `streamText()` with tool calls
3. Tools (`str_replace_editor`, `file_manager`) modify the **virtual file system** (in-memory)
4. Client receives streamed tool calls → updates file system context → triggers preview refresh
5. `PreviewFrame` transforms JSX via Babel standalone, maps imports to esm.sh CDN, renders in sandboxed iframe

### Key Directories

- **`src/app/`** — Next.js App Router. Routes: `/` (home), `/[projectId]` (project view), `/api/chat` (LLM endpoint)
- **`src/lib/`** — Core business logic: virtual file system (`file-system.ts`), AI provider (`provider.ts`), auth (`auth.ts`), AI tools (`tools/`), system prompt (`prompts/`), React contexts (`contexts/`)
- **`src/components/`** — UI split into `chat/`, `editor/`, `preview/`, `auth/`, and `ui/` (shadcn primitives)
- **`src/actions/`** — Next.js server actions for auth and project CRUD
- **`prisma/`** — SQLite database. Models: `User` (auth) and `Project` (stores messages + file system as JSON)

### AI Integration

- **Model**: `claude-haiku-4-5` via `@ai-sdk/anthropic`, selected in `src/lib/provider.ts`
- **Mock fallback**: If no `ANTHROPIC_API_KEY` in `.env`, a `MockLanguageModel` returns static component code for demo purposes
- **Tools**: `str_replace_editor` (create/edit/view files) and `file_manager` (rename/delete) — defined in `src/lib/tools/`
- **System prompt**: `src/lib/prompts/generation.tsx` — uses prompt caching (ephemeral)
- **Streaming**: Uses Vercel AI SDK data streams with up to 40 tool-call steps

### Virtual File System

`src/lib/file-system.ts` — All generated code lives in memory. Supports create, read, update, delete, rename, and str_replace operations. Serialized to JSON for database persistence. No files are written to disk.

### Preview Pipeline

`src/lib/transform/jsx-transformer.ts` transforms JSX using `@babel/standalone`, rewrites imports to esm.sh CDN URLs, and creates blob URLs for browser execution. Preview renders in an iframe with restricted permissions.

### Auth

JWT-based (via `jose`) with HTTP-only cookies. Anonymous users can use the app without signing up (work stored in `sessionStorage`). Middleware (`src/middleware.ts`) protects `/api/projects` and `/api/filesystem` routes.

## Path Aliases

`@/*` maps to `./src/*` (configured in tsconfig.json).

## Prisma

The database schema is defined in `prisma/schema.prisma`. Reference it anytime you need to understand the structure of data stored in the database. Generated client output is at `src/generated/prisma/`. After schema changes, run `npx prisma generate && npx prisma migrate dev`.

## UI Components

Uses shadcn/ui (New York style) with Radix primitives and Tailwind CSS v4. Config in `components.json`.
