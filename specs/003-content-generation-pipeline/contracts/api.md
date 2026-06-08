# Contracts: Content Generation Pipeline

## Internal Services

### `agentService.generateContent(postId: string, topic: string)`
Orchestrator method to handle the complete flow.
- Calls `geminiService`
- Persists Slides to DB
- Calls `renderService`
- Persists Assets to DB
- Updates `Post` status to `REVIEW_PENDING`

### `geminiService.generateCarousel(topic: string)`
**Returns**: `Promise<{ slides: Slide[], caption: string, hashtags: string[] }>`

### `renderService.exportSlidesToPng(slides: Slide[])`
**Returns**: `Promise<string[]>` (Array of file paths to generated PNGs)
