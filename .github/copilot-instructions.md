<!-- .github/copilot-instructions.md -->
# Copilot / AI Agent Instructions for n/fäss (nfast)

Purpose: give an AI coding agent the minimal, actionable knowledge to be productive in this repository.

- Big picture: This is a Next.js 14 (App Router) personal journal with an admin UI. Data is stored in PostgreSQL via Prisma. Rich text editing uses TipTap. Authentication is JWT-based with httpOnly cookies.

- Key components:
  - `app/` — Next App Router UI and server components. API routes live under `app/api/`.
  - `components/` — React UI components and the editor in `components/Editor/TipTapEditor.tsx`.
  - `lib/` — helpers: `lib/prisma.ts` (Prisma client), `lib/auth.ts` (JWT cookie helpers), `lib/slug.ts`, `lib/filters.ts`.
  - `prisma/` — `schema.prisma` defines the data model and migrations.
  - `public/uploads/` — local storage for uploaded images in development.

- Service boundaries & data flows:
  - Client UI calls App Router server functions and API routes in `app/api/*` for posts, auth, and uploads.
  - Database access always goes through the cached Prisma client in `lib/prisma.ts` (globalThis cache to avoid multiple connections).
  - Authentication uses `lib/auth.ts` to create/delete/verify a JWT stored in an httpOnly cookie named `session`.

- Project-specific conventions & patterns:
  - App Router (server components) is used — favor route handlers under `app/api/*` and server components for data fetching.
  - Prisma client is created in `lib/prisma.ts` and exported as default; import `prisma` from there (do not instantiate new PrismaClients elsewhere).
  - Environment variables: see `env.example`. `DATABASE_URL` and `JWT_SECRET` are required for full functionality. `scripts/dev.sh` and `setup-and-run.sh` try to load `.env` if present.
  - Image uploads are stored locally under `public/uploads/` in dev; the upload API handler is under `app/api/upload(s)/route.ts`.
  - TipTap editor lives at `components/Editor/TipTapEditor.tsx` and integrates with image upload endpoints.

- Dev & run commands (examples):
  - Install dependencies: `npm install`
  - Start dev server: `npm run dev` or `./scripts/dev.sh` (script loads `.env` if present and runs `prisma generate`)
  - Migrate the DB locally: `npm run db:migrate`
  - Prisma studio: `npm run db:studio`
  - Production build: `npm run build`

- Prisma & DB notes:
  - `package.json` has `predev` and `postinstall` hooks that run `prisma generate`.
  - `lib/prisma.ts` caches the Prisma client on `globalThis` to avoid connection storms in serverless/dev.
  - If `DATABASE_URL` is not set, the app may start but DB queries will fail; `scripts/dev.sh` prints a warning.

- Auth specifics:
  - JWT handling and cookie lifecycle are implemented in `lib/auth.ts` (uses `jose`).
  - Default admin credentials are noted in `README.md` (useful for local testing).

- Where to search for examples when editing features:
  - Post CRUD & API shape: `app/api/posts/route.ts` and `app/admin/posts/*` pages
  - Uploads: `app/api/upload/route.ts`, `app/api/uploads/route.ts`, `components/ImageUploadZone.tsx`
  - Editor integrations: `components/Editor/TipTapEditor.tsx`, `components/PostEditor.tsx`

- If you change DB schema:
  - Run `npx prisma migrate dev` (or `npm run db:migrate`) and ensure `prisma generate` runs. Update server code referencing changed fields.

- Testing / debugging tips:
  - Use `./scripts/dev.sh` to start the app; it clears `.next` and runs `prisma generate` first.
  - Visit `http://localhost:3000` and `http://localhost:3000/admin/login` for quick checks.
  - Use `npm run db:studio` to inspect the DB.

- When in doubt:
  - Modify server-side route handlers in `app/api/*` and corresponding UI under `app/*` or `components/*`.
  - Search for `prisma` imports to find DB usage sites.
  - If a change affects uploads or editor behavior, update both the UI component and the API route.

If any of these notes are unclear or you'd like more detail (example patches, tests to run, or a short walkthrough), tell me which area to expand.
