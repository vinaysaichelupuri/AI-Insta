---
description: "Task list for feature implementation"
---

# Tasks: Post Publishing Workflow

**Input**: Design documents from `/specs/004-post-publishing/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify Puppeteer installation and OS dependencies for backend/
- [x] T002 Verify Instagram Graph API environment variables in backend/.env

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Update Post, Slides, and GeneratedAssets models to match data-model.md in backend/src/models/Post.ts
- [x] T004 Define frontend interfaces for the new APIs in frontend/src/services/api.ts
- [x] T005 [P] Implement Instagram OAuth flow and secure token storage in backend/src/api/authRoutes.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Preview Content Before Publishing (Priority: P1) 🎯 MVP

**Goal**: As a creator, I want to preview the generated carousel slides and the caption so that I can ensure the content meets my quality standards before it is published.

**Independent Test**: Can be fully tested by generating a post and verifying that all rendered slides and the caption are displayed accurately in the preview interface, with options to approve, reject, or regenerate.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T006 [P] [US1] Unit test for `POST /api/posts/:id/status` in backend/tests/api/postRoutes.test.ts
- [x] T007 [P] [US1] E2E test for Approval Workflow in tests/e2e/approvalWorkflow.spec.ts

### Implementation for User Story 1

- [x] T008 [P] [US1] Implement `POST /api/posts/:id/status` backend endpoint in backend/src/api/postRoutes.ts
- [x] T009 [US1] Wire 'regenerate' status action to trigger content generation module in backend/src/api/postRoutes.ts
- [x] T010 [P] [US1] Create frontend PreviewCarousel component in frontend/src/components/PreviewCarousel.tsx
- [x] T011 [US1] Integrate `POST /api/posts/:id/status` into the frontend PreviewCarousel component in frontend/src/components/PreviewCarousel.tsx
- [x] T012 [US1] Add basic validation and error handling for preview actions in frontend/src/components/PreviewCarousel.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Publish to Instagram (Priority: P1)

**Goal**: As a creator, I want the system to automatically publish my approved carousel and caption to my Instagram account so that I don't have to manually download and upload the media.

**Independent Test**: Can be fully tested by taking an approved set of images and a caption, and verifying they are successfully posted to a linked Instagram test account via the platform's API.

### Tests for User Story 2 ⚠️

- [x] T013 [P] [US2] Unit test for `POST /api/posts/:id/publish` in backend/tests/api/postRoutes.test.ts
- [x] T014 [P] [US2] E2E test for Instagram Publishing in tests/e2e/instagramPublishing.spec.ts

### Implementation for User Story 2

- [x] T015 [P] [US2] Implement instagramService in backend/src/services/instagramService.ts
- [x] T016 [US2] Implement `POST /api/posts/:id/publish` backend endpoint in backend/src/api/postRoutes.ts
- [x] T017 [US2] Integrate publish endpoint into the frontend preview/approval flow in frontend/src/components/PreviewCarousel.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Export HTML to Images (Priority: P2)

**Goal**: As the system, I need to convert HTML/CSS rendered slides into high-quality image files so that they can be uploaded to Instagram.

**Independent Test**: Can be fully tested by passing HTML content for 7 slides and verifying that 7 image files of 1080x1350 resolution are produced without visual artifacts.

### Tests for User Story 3 ⚠️

- [x] T018 [P] [US3] Unit test for `POST /api/posts/:id/export` in backend/tests/api/postRoutes.test.ts

### Implementation for User Story 3

- [x] T019 [P] [US3] Implement exportService using Puppeteer in backend/src/services/exportService.ts
- [x] T020 [US3] Implement `POST /api/posts/:id/export` backend endpoint in backend/src/api/postRoutes.ts
- [x] T021 [US3] Ensure export trigger happens automatically after generation or upon approval in backend/src/api/postRoutes.ts

**Checkpoint**: All P1 and P2 user stories should now be independently functional

---

## Phase 6: User Story 4 - View Content History (Priority: P3)

**Goal**: As a creator, I want to view my past generated and published posts so that I can reuse topics, review previous captions, or track my publishing activity.

**Independent Test**: Can be fully tested by viewing the history dashboard and verifying that past posts are listed and can be filtered by topic.

### Tests for User Story 4 ⚠️

- [x] T022 [P] [US4] Unit test for `GET /api/posts` with filtering in backend/tests/api/postRoutes.test.ts

### Implementation for User Story 4

- [x] T023 [P] [US4] Implement `GET /api/posts` backend endpoint with filtering in backend/src/api/postRoutes.ts
- [x] T024 [P] [US4] Create frontend HistoryDashboard page in frontend/src/pages/HistoryDashboard.tsx
- [x] T025 [US4] Integrate history endpoint into the dashboard page in frontend/src/pages/HistoryDashboard.tsx

**Checkpoint**: All user stories should now be fully functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T026 Write and execute performance benchmark tests for HTML to PNG export (<10s) and history retrieval (<2s) in tests/performance/postPublishing.perf.test.ts
- [x] T027 Code cleanup and refactoring across frontend and backend
- [x] T028 Update backend documentation for the new APIs

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch components and endpoints for User Story 1 together:
Task: "Implement POST /api/posts/:id/status backend endpoint in backend/src/api/postRoutes.ts"
Task: "Create frontend PreviewCarousel component in frontend/src/components/PreviewCarousel.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories
