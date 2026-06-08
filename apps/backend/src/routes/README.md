# Post Publishing API Routes

- `POST /api/posts/:id/status` : Update post status ('APPROVED', 'REJECTED', 'RENDERING' etc). Triggers export to images automatically upon approval.
- `POST /api/posts/:id/publish` : Publish the approved post to Instagram via Graph API.
- `POST /api/posts/:id/export` : Manually trigger HTML to PNG export using Puppeteer.
- `GET /api/posts` : Retrieve posts with filtering by topic and status.
