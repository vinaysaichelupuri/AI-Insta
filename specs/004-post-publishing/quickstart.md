# Phase 1: Quickstart - Post Publishing Workflow

## Development Setup

1. **Environment Variables**:
   - `INSTAGRAM_ACCESS_TOKEN`: Your Meta/Instagram Graph API long-lived access token.
   - `INSTAGRAM_ACCOUNT_ID`: The ID of the Instagram Professional Account.
   - `PUPPETEER_EXECUTABLE_PATH`: (Optional) path to Chrome if Puppeteer struggles to download chromium.

2. **Puppeteer**:
   - Ensure the backend server has required OS dependencies to run Puppeteer (e.g., `libnss3`, `libatk1.0-0` on Linux/Ubuntu).

3. **Running the Export Engine locally**:
   - The export engine relies on the backend being able to render the HTML templates or the frontend providing them.

## Key Workflows

- **Preview & Approve**: The frontend will display the generated content and allow the creator to approve it via `POST /api/posts/:id/status`.
- **Exporting Images**: Upon generation or approval, `POST /api/posts/:id/export` uses Puppeteer to save images locally.
- **Publishing**: `POST /api/posts/:id/publish` uploads the images to Meta servers, creates a carousel container, and publishes it.
