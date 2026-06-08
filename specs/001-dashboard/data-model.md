# Data Model: Dashboard

## Entities

### User
Represents the authenticated creator.
- `id`: UUID
- `email`: String (unique)
- `passwordHash`: String
- `createdAt`: DateTime

### Post
Represents a content generation task.
- `id`: UUID
- `userId`: UUID (FK to User)
- `topic`: String (max 200 chars)
- `status`: Enum (`generating`, `pending_approval`, `approved`, `rejected`, `published`)
- `caption`: String
- `hashtags`: Array of Strings
- `createdAt`: DateTime
- `publishedAt`: DateTime (nullable)

### Slide
Represents an individual slide within a Post carousel.
- `id`: UUID
- `postId`: UUID (FK to Post)
- `slideNumber`: Integer (1-7)
- `title`: String
- `content`: String
- `templateType`: String (e.g., 'cover', 'definition', 'fact', 'cta')

### GeneratedAsset
Represents the rendered PNG images.
- `id`: UUID
- `postId`: UUID (FK to Post)
- `imagePath`: String (local file system path or Cloudinary URL)
- `createdAt`: DateTime
