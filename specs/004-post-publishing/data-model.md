# Phase 1: Data Model - Post Publishing Workflow

## Entities

### Post
- **Fields**:
  - `id`: String/ObjectId
  - `topic`: String
  - `status`: Enum (draft, rendering, pending_review, approved, published, rejected)
  - `caption`: String
  - `hashtags`: Array of Strings
  - `createdAt`: Date
  - `publishedAt`: Date (Optional)
- **Relationships**:
  - Has many `Slides`
  - Has many `GeneratedAssets`
- **Validation Rules**:
  - Status must be a valid enum value.

### Slides
- **Fields**:
  - `id`: String/ObjectId
  - `postId`: String/ObjectId (Foreign Key)
  - `slideNumber`: Integer (1-7)
  - `title`: String
  - `content`: Object/String
  - `templateType`: String
- **Relationships**:
  - Belongs to `Post`

### GeneratedAssets
- **Fields**:
  - `id`: String/ObjectId
  - `postId`: String/ObjectId (Foreign Key)
  - `imagePath`: String (Local file path for Phase 1)
  - `createdAt`: Date
- **Relationships**:
  - Belongs to `Post`
