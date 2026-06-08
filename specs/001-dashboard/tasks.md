# Tasks: Dashboard

**Input**: Design documents from `/specs/001-dashboard/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize npm workspaces for monorepo in `/package.json`
- [x] T002 Initialize `apps/backend` Express app in `apps/backend/package.json`
- [x] T003 Initialize `apps/frontend` React app (Vite or CRA) in `apps/frontend/package.json`
- [x] T004 [P] Configure TypeScript and ESLint for both apps

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Setup database connection in `apps/backend/src/config/db.ts`
- [x] T006 [P] Implement authentication middleware in `apps/backend/src/middleware/auth.ts`
- [x] T007 [P] Create base routing structure in `apps/backend/src/app.ts`
- [x] T008 [P] Setup environment configuration in `apps/backend/src/config/env.ts`
- [x] T009 [P] Setup TailwindCSS in frontend in `apps/frontend/tailwind.config.js`
- [x] T010 [P] Setup Axios and base API client in `apps/frontend/src/services/api.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Secure Access (Priority: P1) 🎯 MVP

**Goal**: As a creator, I need to log into the platform securely so that only I can manage and publish my Instagram content.

**Independent Test**: Can be fully tested by attempting to access the dashboard with valid and invalid credentials, and verifies authentication barriers are in place.

### Implementation for User Story 1

- [x] T011 [P] [US1] Create User model in `apps/backend/src/models/User.ts`
- [x] T012 [US1] Implement AuthController and routes in `apps/backend/src/controllers/auth.ts`
- [x] T013 [P] [US1] Create AuthContext and provider in `apps/frontend/src/context/AuthContext.tsx`
- [x] T014 [P] [US1] Implement Login page in `apps/frontend/src/pages/Login.tsx`
- [x] T015 [P] [US1] Implement ProtectedRoute wrapper in `apps/frontend/src/components/ProtectedRoute.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Topic Submission & Generation (Priority: P1)

**Goal**: As a creator, I want to submit a topic from my dashboard so that the system can begin generating a carousel and caption for me.

**Independent Test**: Can be fully tested by submitting various topics (valid and invalid lengths) and verifying the generation process initiates successfully.

### Implementation for User Story 2

- [ ] T016 [P] [US2] Create Post model in `apps/backend/src/models/Post.ts`
- [ ] T017 [US2] Implement Generation Service (Gemini API integration) in `apps/backend/src/services/generation.ts`
- [ ] T018 [US2] Implement Generation routes and controllers in `apps/backend/src/controllers/generation.ts`
- [ ] T019 [US2] Implement duplicate topic detection logic in `apps/backend/src/controllers/generation.ts`
- [ ] T020 [P] [US2] Create Dashboard page component in `apps/frontend/src/pages/Dashboard.tsx`
- [ ] T021 [US2] Create Topic Submission form with offline/retry handling in `apps/frontend/src/components/TopicForm.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Content Preview & Approval Workflow (Priority: P1)

**Goal**: As a creator, I want to preview the generated carousel slides and caption, so that I can approve, reject, or request regeneration before it goes live.

**Independent Test**: Can be fully tested by loading a mock generated post, interacting with the slide navigation, and testing the state changes when clicking Approve, Reject, or Regenerate.

### Implementation for User Story 3

- [ ] T022 [P] [US3] Create Slide and GeneratedAsset models in `apps/backend/src/models/Slide.ts` and `apps/backend/src/models/Asset.ts`
- [ ] T023 [US3] Implement HTML to PNG renderer (Puppeteer) in `apps/backend/src/services/renderer.ts`
- [ ] T024 [US3] Implement Instagram Graph API publishing service in `apps/backend/src/services/instagram.ts`
- [ ] T025 [US3] Implement Approval/Reject endpoints in `apps/backend/src/controllers/post.ts`
- [ ] T026 [P] [US3] Implement Carousel preview component in `apps/frontend/src/components/CarouselPreview.tsx`
- [ ] T027 [US3] Implement Approval action buttons with offline retry queues in `apps/frontend/src/components/ApprovalControls.tsx`

**Checkpoint**: All P1 user stories should now be independently functional

---

## Phase 6: User Story 4 - Content History (Priority: P2)

**Goal**: As a creator, I want to view my past generated posts and search them by topic, so that I can reference old content or republish it.

**Independent Test**: Can be fully tested by seeding the database with past posts and verifying that the history list and search filters work correctly.

### Implementation for User Story 4

- [ ] T028 [P] [US4] Implement Post fetching and filtering endpoints in `apps/backend/src/controllers/history.ts`
- [ ] T029 [P] [US4] Implement History page in `apps/frontend/src/pages/History.tsx`
- [ ] T030 [US4] Implement History List and Search components in `apps/frontend/src/components/HistoryList.tsx`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T031 [P] Error boundaries and global loading states in `apps/frontend/src/App.tsx`
- [ ] T032 Refactor components for responsiveness and accessibility
- [ ] T033 Validate system against requirements in `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Integrates with User Story 1 (requires auth)
- **User Story 3 (P1)**: Integrates with User Story 2 (previews generated posts)
- **User Story 4 (P2)**: Independent, but relies on US2 data structures

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Models within a story marked [P] can run in parallel
- Frontend UI structures marked [P] can run in parallel with Backend models
