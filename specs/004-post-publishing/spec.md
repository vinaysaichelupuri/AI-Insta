# Feature Specification: Post Publishing Workflow

**Feature Branch**: `[###-feature-name]`

**Created**: 2026-06-08

**Status**: Draft

**Input**: User description: "create the spec file for @[docs/implementation-plan.md] module-6,7,8,9"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Preview Content Before Publishing (Priority: P1)

As a creator, I want to preview the generated carousel slides and the caption so that I can ensure the content meets my quality standards before it is published.

**Why this priority**: Content quality is paramount. The user must review the AI-generated content before any publishing actions are taken to maintain their brand's reputation.

**Independent Test**: Can be fully tested by generating a post and verifying that all rendered slides and the caption are displayed accurately in the preview interface, with options to approve, reject, or regenerate.

**Acceptance Scenarios**:

1. **Given** a successfully generated and rendered carousel post, **When** I navigate to the preview section, **Then** I see all slides (1 to 7) in order and the complete caption with hashtags.
2. **Given** I am on the preview screen, **When** I click "Approve", **Then** the post status is updated to "approved" and it moves to the publishing phase.
3. **Given** I am on the preview screen, **When** I click "Regenerate" or "Reject", **Then** the appropriate status is recorded and I am allowed to start over.

---

### User Story 2 - Publish to Instagram (Priority: P1)

As a creator, I want the system to automatically publish my approved carousel and caption to my Instagram account so that I don't have to manually download and upload the media.

**Why this priority**: Automating the publishing process is the core value proposition of the product, saving the creator significant time and effort.

**Independent Test**: Can be fully tested by taking an approved set of images and a caption, and verifying they are successfully posted to a linked Instagram test account via the platform's API.

**Acceptance Scenarios**:

1. **Given** an approved carousel post with 7 images, **When** the publishing workflow is triggered, **Then** the images are uploaded as a single carousel post to the linked Instagram Professional account along with the generated caption.
2. **Given** the publishing process has started, **When** it completes successfully, **Then** the post status in the system is updated to "published" with a timestamp.

---

### User Story 3 - Export HTML to Images (Priority: P2)

As the system, I need to convert HTML/CSS rendered slides into high-quality image files so that they can be uploaded to Instagram.

**Why this priority**: Instagram requires image files for carousel posts. This background process is an essential technical step bridging the content generation and publishing phases.

**Independent Test**: Can be fully tested by passing HTML content for 7 slides and verifying that 7 image files of 1080x1350 resolution are produced without visual artifacts.

**Acceptance Scenarios**:

1. **Given** 7 rendered HTML slides, **When** the export engine processes them, **Then** exactly 7 image files are generated.
2. **Given** a generated image file, **When** its properties are inspected, **Then** its resolution is exactly 1080x1350 pixels and the visual quality matches the HTML rendering.

---

### User Story 4 - View Content History (Priority: P3)

As a creator, I want to view my past generated and published posts so that I can reuse topics, review previous captions, or track my publishing activity.

**Why this priority**: While not critical for the immediate publishing flow, a history dashboard provides long-term value by helping the creator manage their content library.

**Independent Test**: Can be fully tested by viewing the history dashboard and verifying that past posts are listed and can be filtered by topic.

**Acceptance Scenarios**:

1. **Given** I have previously generated posts, **When** I navigate to the Content History section, **Then** I see a list of my past posts showing their topic, status, and creation date.
2. **Given** I am in the Content History section, **When** I search for a specific topic keyword, **Then** only posts matching that keyword are displayed.
3. **Given** I am viewing a historical post, **When** I click on it, **Then** I can see its generated slides, caption, and final status.

### Edge Cases

- What happens when the Instagram API rate limits the application or returns an authentication error during publishing?
- How does the system handle an interruption (e.g., server crash) during the HTML-to-image export process?
- What happens if the creator tries to approve a post that has already been rejected or published?
- How are expired or invalid social media access tokens handled during the publishing step?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an interface for the user to preview all generated carousel slides and the caption.
- **FR-002**: System MUST allow the user to transition a post's status to "Approved", "Rejected", or trigger a "Regenerate" action.
- **FR-003**: System MUST include a background engine to export rendered HTML slide templates into 1080x1350 resolution image files.
- **FR-004**: System MUST integrate with the appropriate social media APIs to publish carousel posts (up to 10 media items) to a linked Professional Account.
- **FR-005**: System MUST update the post record with a "published" status and a timestamp upon successful API publishing.
- **FR-006**: System MUST maintain a persistent history of all generated posts, including their metadata (topic, status, dates), captions, and references to image assets.
- **FR-007**: System MUST provide a search functionality to filter historical posts by their topic.
- **FR-008**: System MUST authenticate the user's social media account and securely store the necessary access tokens.

### Key Entities

- **Post**: Represents a single content generation request and its lifecycle. Attributes include `id`, `topic`, `status` (draft, rendering, pending_review, approved, published, rejected), `caption`, `hashtags`, `createdAt`, `publishedAt`.
- **GeneratedAssets**: Represents the exported image files for a post. Attributes include `id`, `postId`, `imagePath`, `createdAt`.
- **Slides**: Represents the structural content of the carousel (from generation). Attributes include `id`, `postId`, `slideNumber`, `title`, `content`, `templateType`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of approved posts with valid social media credentials are successfully published.
- **SC-002**: Export engine converts 7 slides into images in under 10 seconds.
- **SC-003**: The publishing action completes in under 1 minute from approval (excluding external API processing delays).
- **SC-004**: Users can retrieve and view their content history page in under 2 seconds, even with 100+ past posts.
- **SC-005**: Exported images have exactly 1080x1350 resolution and maintain readability equivalent to the preview.

## Assumptions

- Users have a valid Professional Account and a linked Page on the target platform.
- The Developer App is already created and has the necessary permissions configured for development/production use.
- The hosting environment supports running background processes for the image export engine.
- Images are stored securely on the local file system (Phase 1) and will be migrated to cloud storage later.
