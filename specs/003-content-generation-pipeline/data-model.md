# Data Model: Content Generation Pipeline

## 1. Slide
A sub-document or related entity to the `Post` model.

**Fields**:
- `id`: ObjectId
- `postId`: ObjectId (Reference to Post)
- `slideNumber`: Integer (1-7)
- `title`: String
- `content`: String
- `templateType`: Enum ("Cover", "Definition", "Fact", "CTA", "Concept", "Example")

**Relationships**:
- Belongs to `Post` (1:N)

## 2. GeneratedAsset
Represents the exported PNG files.

**Fields**:
- `id`: ObjectId
- `postId`: ObjectId (Reference to Post)
- `imagePath`: String (Local file path for MVP)
- `createdAt`: Date

**Relationships**:
- Belongs to `Post` (1:N)
