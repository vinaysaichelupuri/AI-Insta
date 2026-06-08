# Phase 0: Research & Technical Decisions

## Feature Context
Topic submission involves a simple frontend form where the user enters an educational topic, and a backend endpoint that validates the topic, checks for duplicates, and stores it to trigger the generation process.

## Research Findings

### Decision: Form State Management
- **Decision**: Use standard React controlled components (`useState`).
- **Rationale**: The topic submission form consists of a single text input field. Introducing a library like React Hook Form or Formik is unnecessary overhead for a single field.
- **Alternatives considered**: React Hook Form, Formik.

### Decision: Duplicate Topic Checking
- **Decision**: Backend validation using MongoDB regex query (case-insensitive).
- **Rationale**: To reliably check for duplicates across the entire user history, the backend must query the database. A case-insensitive match (e.g., matching "Black Holes" with "black holes") prevents accidental duplicates.
- **Alternatives considered**: Frontend caching of previous topics (not scalable), exact match only (poor user experience).

### Decision: API Endpoint Design
- **Decision**: Expose a `POST /api/topics` endpoint.
- **Rationale**: Standard RESTful design for creating a new resource. The endpoint will handle validation, duplicate checking (returning a specific status code or flag if a warning is needed), and saving to the database.
- **Alternatives considered**: GraphQL mutation, WebSockets. REST is sufficient and matches existing stack.
