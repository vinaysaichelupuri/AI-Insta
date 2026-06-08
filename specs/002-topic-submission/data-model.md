# Data Model: Topic Submission

## Entities

### Post
The primary entity that stores the submitted topic and tracks the generation progress. While it will eventually contain slides, captions, etc., for this module we focus on the fields relevant to topic submission.

**Fields**:
- `id` (ObjectId): Unique identifier for the post.
- `topic` (String): The educational topic submitted by the user. Must be non-empty and < 200 characters.
- `status` (String): Current status of the generation process. Initial value upon submission is `PENDING` or `GENERATING`.
- `createdAt` (Date): Timestamp when the topic was submitted.
- `publishedAt` (Date): Timestamp when the post was published (null initially).

**Validation Rules**:
- `topic` is strictly required.
- `topic` length must be <= 200 characters.
- `status` must be a valid enum (e.g., `PENDING`, `GENERATING`, `REVIEW`, `PUBLISHED`, `FAILED`).

**Relationships**:
- One-to-Many with `Slide` (future module)
- One-to-Many with `GeneratedAsset` (future module)

## State Transitions
1. `null` -> User submits topic -> `PENDING`
2. Topic saved successfully -> System triggers generation -> `GENERATING`
