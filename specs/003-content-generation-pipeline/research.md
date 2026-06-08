# Research: Content Generation Pipeline

## 1. AI Integration
- **Decision**: Use `@google/genai` (Gemini SDK) for text generation.
- **Rationale**: The project explicitly specifies Gemini API in the tech stack. It's fast and natively supports structured JSON output.
- **Alternatives considered**: OpenAI, Anthropic (rejected due to explicit requirement).

## 2. Image Rendering
- **Decision**: Use Puppeteer with a local HTML templating system (Handlebars or EJS) to generate slides.
- **Rationale**: The PRD explicitly forbids AI image generation and mandates an HTML-to-PNG export engine. Puppeteer is the standard headless browser for this task.
- **Alternatives considered**: Canvas API, Satori (Vercel) - Puppeteer is more robust for full CSS support matching the design system.

## 3. Asynchronous Pipeline
- **Decision**: Use a simple background worker or native Node.js asynchronous execution (Promises) for MVP, upgrading to a queue (e.g., BullMQ) if concurrency issues arise.
- **Rationale**: Required for the 40-second execution time so the API doesn't hang the main thread indefinitely.
- **Alternatives considered**: Message Queues (RabbitMQ/BullMQ).
