# Quickstart: Content Generation Pipeline

## Local Setup

1. Install backend dependencies (including Puppeteer):
```bash
cd apps/backend
npm install
npm install puppeteer @google/genai
```

2. Add your Gemini API key to `apps/backend/.env`:
```env
GEMINI_API_KEY=your_key_here
```

3. Ensure the `assets/` directory exists for local image storage:
```bash
mkdir -p apps/backend/assets/generated
```

4. Run the backend server:
```bash
npm run dev
```

## Testing the Pipeline Manually

You can test the generation manually by invoking the orchestrator script or by hitting the existing `POST /api/topics` endpoint which will asynchronously trigger `agentService`. Check your terminal for background execution logs.
