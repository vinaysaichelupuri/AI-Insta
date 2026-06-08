# API Contract: Topic Submission

## `POST /api/topics`

Creates a new topic submission and initiates the content generation process.

### Request Body

```json
{
  "topic": "string (required, max 200 characters)",
  "confirmDuplicate": "boolean (optional, defaults to false)"
}
```

- `topic`: The educational subject to generate content for.
- `confirmDuplicate`: If `true`, bypasses the duplicate topic warning and forces the creation of a new post for the same topic.

### Responses

#### 201 Created
Topic successfully stored, and generation process started.
```json
{
  "id": "ObjectId",
  "topic": "Black Holes",
  "status": "PENDING",
  "createdAt": "2026-06-08T12:00:00Z"
}
```

#### 400 Bad Request
Validation failed (e.g., empty topic, topic too long).
```json
{
  "error": "ValidationError",
  "message": "Topic must be between 1 and 200 characters."
}
```

#### 409 Conflict
A previous post with the same topic exists, and `confirmDuplicate` was `false` or not provided.
```json
{
  "error": "DuplicateTopic",
  "message": "You have already generated content for this topic. Proceed anyway?",
  "requiresConfirmation": true
}
```

#### 500 Internal Server Error
An unexpected error occurred during processing.
```json
{
  "error": "ServerError",
  "message": "An internal error occurred."
}
```
