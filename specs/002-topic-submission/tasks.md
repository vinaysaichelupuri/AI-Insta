# Tasks: Topic Submission

**Input**: Design documents from `/specs/002-topic-submission/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Setup the backend `topicRoutes.ts` file in `apps/backend/src/routes/topicRoutes.ts` and link it in the main Express app
- [x] T002 Setup the `api.ts` configuration in `apps/frontend/src/services/api.ts` if not already present

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T003 Create `Post` model in `apps/backend/src/models/Post.ts` based on data-model.md
- [x] T004 Create `topicController.ts` file in `apps/backend/src/controllers/topicController.ts`

---

## Phase 3: User Story 1 - Submit New Topic (Priority: P1) 🎯 MVP

**Goal**: As a creator, I want to submit a new educational topic so that the system can begin generating Instagram carousel content for me.

**Independent Test**: Can be fully tested by entering a valid text string (e.g., "Black Holes") and verifying that it is accepted and triggers the next step in the workflow.

### Implementation for User Story 1

- [x] T005 [US1] Create `agentService.ts` in `apps/backend/src/services/` with a stub function to asynchronously trigger content generation
- [x] T005b [US1] Implement `POST /api/topics` endpoint in `apps/backend/src/controllers/topicController.ts` to save the topic and call `agentService.triggerGeneration()`
- [x] T006 [US1] Route `POST /api/topics` in `apps/backend/src/routes/topicRoutes.ts` to `topicController`
- [x] T007 [P] [US1] Implement the `submitTopic` function in `apps/frontend/src/services/api.ts`
- [x] T008 [US1] Create the `TopicSubmissionForm` component in `apps/frontend/src/components/TopicSubmissionForm.tsx` to handle basic submission
- [x] T009 [US1] Integrate `TopicSubmissionForm` into `apps/frontend/src/pages/Dashboard.tsx`

---

## Phase 4: User Story 2 - Handle Invalid Inputs (Priority: P2)

**Goal**: As a user, I want to be informed if my topic is invalid (empty or too long) so that I can correct it before processing.

**Independent Test**: Can be tested independently by attempting to submit empty fields or extremely long strings and verifying that appropriate error messages are displayed.

### Implementation for User Story 2

- [x] T010 [P] [US2] Add backend validation (empty check, < 200 chars) in `apps/backend/src/controllers/topicController.ts`
- [x] T011 [P] [US2] Add frontend validation and error message display in `apps/frontend/src/components/TopicSubmissionForm.tsx`

---

## Phase 5: User Story 3 - Warn on Duplicate Topics (Priority: P2)

**Goal**: As a creator, I want to be warned if I submit a topic I've already covered, so that I don't accidentally generate duplicate content unless I intend to.

**Independent Test**: Can be tested independently by submitting a topic that already exists in the user's history and verifying that a warning is presented.

### Implementation for User Story 3

- [x] T012 [P] [US3] Add duplicate topic check logic in `apps/backend/src/controllers/topicController.ts` returning 409 Conflict if duplicate found
- [x] T013 [P] [US3] Handle 409 duplicate warning and implement confirmation dialog in `apps/frontend/src/components/TopicSubmissionForm.tsx`

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T014 Run quickstart.md validation manually
- [x] T015 Verify the full flow from Dashboard submission to Database storage
- [x] T016 Write tests/scripts to validate Performance criteria (SC-001: submission <10s, SC-004: duplicate warning <1s)

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities
- Backend validation (T010) and frontend validation (T011) can be done in parallel.
- Duplicate check logic (T012) and frontend warning modal (T013) can be done in parallel.
