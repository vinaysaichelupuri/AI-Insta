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
