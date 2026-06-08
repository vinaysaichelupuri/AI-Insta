# Phase 0: Research - Post Publishing Workflow

## Decision 1: HTML to PNG Export Engine
- **Decision**: Use Puppeteer to load HTML content and take screenshots of the elements.
- **Rationale**: Puppeteer is a robust headless browser control library for Node.js, capable of rendering complex CSS accurately and exporting high-quality PNGs with specific viewport sizes (1080x1350).
- **Alternatives considered**: `html2canvas` (often has issues with complex CSS or external fonts), native canvas rendering (too complex to maintain templates in code).

## Decision 2: Instagram Publishing Integration
- **Decision**: Use Instagram Graph API (Content Publishing API) with long-lived access tokens.
- **Rationale**: It is the official and supported way to publish carousel posts programmatically.
- **Alternatives considered**: Unofficial scrapers/APIs (high risk of account ban, unstable).
