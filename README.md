# AI-Integration Monorepo

Monorepo containing:
- `apps/frontend`: React app (Vite + TypeScript)
- `apps/backend`: Node.js Express API (TypeScript)

## Prerequisites
- Node.js 18+
- npm 9+

## Setup
```bash
npm install
```

## Meta / Instagram setup
Add these backend env vars in `apps/backend/.env` before testing publishing:

```bash
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
META_GRAPH_VERSION=v19.0
META_SCOPES=instagram_business_basic,instagram_business_content_publish
BASE_URL=http://localhost:4000
```

Your Instagram account must be a Professional account. Add `http://localhost:5173/instagram/callback` to the Instagram Login redirect URIs in Meta, then use the dashboard's `Connect Instagram` button to complete OAuth and store the long-lived token plus detected Instagram account ID.

## Run apps
```bash
npm run dev:frontend
npm run dev:backend
```

## Build apps
```bash
npm run build
```

## Workspace-specific commands
```bash
npm run build --workspace=@ai-integration/frontend
npm run build --workspace=@ai-integration/backend
```
