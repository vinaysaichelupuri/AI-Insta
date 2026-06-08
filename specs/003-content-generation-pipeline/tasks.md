# Tasks: Content Generation Pipeline

**Input**: Design documents from `/specs/003-content-generation-pipeline/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Install `@google/genai`, `puppeteer`, and `handlebars` dependencies in `apps/backend/package.json`
- [x] T002 [P] Create local `assets/generated` directory for image output

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T003 Create `agentService.ts` stub in `apps/backend/src/services/agentService.ts`
- [x] T004 Create `Slide` and `GeneratedAsset` mongoose models in `apps/backend/src/models/Post.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Generate Educational Text Content (Priority: P1) 🎯 MVP

**Goal**: As a creator, I want the system to take my submitted topic and automatically generate structured, factually accurate educational slides and an engaging Instagram caption.

**Independent Test**: Can be tested by invoking the generation logic with a topic string and verifying that a 7-slide JSON structure and a formatted caption string are returned.

### Implementation for User Story 1

- [x] T005 [P] [US1] Implement `geminiService.generateCarousel` in `apps/backend/src/services/geminiService.ts`
- [x] T006 [US1] Update `agentService.generateContent` to orchestrate `geminiService` and persist `Slide`s to DB in `apps/backend/src/services/agentService.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Render Carousel Images (Priority: P1)

**Goal**: As a creator, I want the system to transform the generated text content into beautiful, high-resolution Instagram-ready PNG images without using AI image generators.

**Independent Test**: Can be tested by providing a mock JSON slide object to the rendering engine and verifying that 7 PNG files of size 1080x1350 are successfully created.

### Implementation for User Story 2

- [x] T007 [P] [US2] Implement `renderService.exportSlidesToPng` using Puppeteer in `apps/backend/src/services/renderService.ts`
- [x] T008 [US2] Update `agentService.generateContent` to pass slides to `renderService` and persist `GeneratedAsset`s to DB in `apps/backend/src/services/agentService.ts`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Enforce Brand Design System (Priority: P2)

**Goal**: As a creator, I want the generated images to adhere strictly to my predefined modern, minimal design system (specific fonts, colors, and layout) so my brand looks professional.

**Independent Test**: Can be tested by visually inspecting the generated PNGs to ensure they use a white background, black primary text, the correct typography, and the designated accent color.

### Implementation for User Story 3

- [x] T009 [P] [US3] Create base Handlebars template with CSS in `apps/backend/src/templates/base.hbs`
- [x] T010 [P] [US3] Create slide-specific templates (cover, definition, fact, cta) in `apps/backend/src/templates/`
- [x] T011 [US3] Integrate templates into `renderService.ts` HTML generation step in `apps/backend/src/services/renderService.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T012 Run `quickstart.md` validation to verify end-to-end flow locally
- [x] T013 Setup error handling and transient failure retries in `agentService.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Can start after Foundational, relies on `Slide` structure generated in US1
- **User Story 3 (P2)**: Integrates directly with US2 Rendering Engine

### Parallel Opportunities

- Foundational DB models and stub services can be worked on in parallel.
- `geminiService` and HTML `templates` can be implemented simultaneously.
- `renderService` puppeteer boilerplate can be built while `geminiService` is finalized.

---

## Parallel Example: User Story 2 & 3

```bash
# Launch rendering engine and templates together:
Task: "Implement renderService.exportSlidesToPng using Puppeteer in apps/backend/src/services/renderService.ts"
Task: "Create base Handlebars template with CSS in apps/backend/src/templates/base.hbs"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Text generation)
4. **STOP and VALIDATE**: Verify JSON output is correct.

### Incremental Delivery

1. Complete text generation (US1).
2. Complete bare-bones Puppeteer export (US2) to ensure PNG creation works.
3. Enhance templates to match the exact design system (US3).
