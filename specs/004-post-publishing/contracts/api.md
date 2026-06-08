# Phase 1: API Contracts - Post Publishing Workflow

## Backend APIs

### `POST /api/posts/:id/export`
- **Description**: Trigger the HTML to PNG export engine for a generated post.
- **Request Body**: None
- **Response**:
  - `200 OK`: `{ "message": "Export completed", "assets": [{ "id": "...", "imagePath": "..." }] }`
  - `500 Internal Server Error`

### `POST /api/posts/:id/status`
- **Description**: Update the status of a post (e.g., Approve, Reject, Regenerate).
- **Request Body**: `{ "status": "approved" | "rejected" | "draft" }`
- **Response**:
  - `200 OK`: `{ "message": "Status updated successfully", "post": { ... } }`

### `POST /api/posts/:id/publish`
- **Description**: Trigger the Instagram publishing workflow for an approved post.
- **Request Body**: None
- **Response**:
  - `200 OK`: `{ "message": "Publishing initiated/completed" }`
  - `500 Internal Server Error`: (If Instagram API fails)

### `GET /api/posts`
- **Description**: Retrieve content history with optional filtering.
- **Query Params**: `topic` (string, optional), `status` (string, optional)
- **Response**:
  - `200 OK`: `{ "posts": [ { ... }, { ... } ] }`
