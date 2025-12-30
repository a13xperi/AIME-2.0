## Documentation Index

This folder contains the **generated reference documentation** for this repo’s public surface area:

- **HTTP APIs (servers)**: [`docs/HTTP_API.md`](./HTTP_API.md)
- **Frontend client API (TypeScript)**: [`docs/FRONTEND_API.md`](./FRONTEND_API.md)
- **React components (UI)**: [`docs/COMPONENTS.md`](./COMPONENTS.md)
- **Exported domain types (TypeScript)**: [`docs/TYPES.md`](./TYPES.md)

## What “public” means here

This documentation covers:

- **HTTP routes** exposed by:
  - `server/index.ts` (Express)
  - `backend/main.py` + `backend/routers/*` (FastAPI)
  - `putt-solver-service/main.py` (FastAPI)
  - `api/index.ts` (Vercel serverless wrapper around the Express app)
  - `api/index.js` (legacy serverless handler, still present in repo)
- **Exported frontend functions** intended to be imported and used by the app:
  - `src/api/notionApi.ts`
  - `src/utils/logger.ts`
  - `src/reportWebVitals.ts`
- **React components** exported as default exports under `src/components/*` and used by routing in `src/App.tsx`.
- **TypeScript types** exported from `src/types/index.ts` (core app models + future/advanced models used by some UI modules).

## Quick run instructions (local dev)

### Frontend (Vite)

```bash
npm install
npm run dev
```

### Express API (Notion-backed)

In a separate terminal:

```bash
npm run server
```

Environment variables are required (see `server/index.ts` for the enforced list and `.env.example` for a template).

### Python services (AIME backend + PuttSolver service)

These are separate from the Notion/Express API.

```bash
python -m venv .venv && . .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --host 0.0.0.0 --port 8080 --reload
```

In another terminal:

```bash
pip install -r putt-solver-service/requirements.txt
uvicorn putt-solver-service.main:app --host 0.0.0.0 --port 8081 --reload
```

If you run both, configure:

- `PUTTSOLVER_SERVICE_URL` for the AIME backend (`backend/main.py`).
