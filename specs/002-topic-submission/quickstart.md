# Quickstart: Topic Submission

This quickstart explains how to interact with the Topic Submission feature for development and testing.

## Prerequisites
- Node.js 22 installed
- MongoDB instance running locally or via Docker
- Monorepo dependencies installed (`npm install` at root)

## Running the Application
1. Start the backend:
   ```bash
   npm run dev:backend
   ```
   The backend will start on `http://localhost:3000` (or configured port).

2. Start the frontend:
   ```bash
   npm run dev:frontend
   ```
   The frontend will be accessible at `http://localhost:5173`.

## Testing the API
You can test the topic submission API directly using `curl` or Postman.

**Valid Submission**:
```bash
curl -X POST http://localhost:3000/api/topics \
  -H "Content-Type: application/json" \
  -d '{"topic": "Black Holes", "confirmDuplicate": false}'
```

**Duplicate Warning Response (Example)**:
If you submit "Black Holes" again, the API will respond with a 409 Conflict (or a specific warning payload):
```json
{
  "warning": "DuplicateTopic",
  "message": "You have already generated content for this topic. Proceed anyway?"
}
```

**Submission with Confirmation**:
```bash
curl -X POST http://localhost:3000/api/topics \
  -H "Content-Type: application/json" \
  -d '{"topic": "Black Holes", "confirmDuplicate": true}'
```

## Testing the UI
1. Navigate to `http://localhost:5173/dashboard` (or the default route).
2. Enter a topic in the input field.
3. Click "Generate Content".
4. If the topic is new, the generation process starts.
5. If the topic is a duplicate, a warning modal/dialog will appear asking for confirmation.
