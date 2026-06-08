# Implementation Plan: Topic Submission

**Branch**: `002-topic-submission` | **Date**: 2026-06-08 | **Spec**: [specs/002-topic-submission/spec.md](file:///Users/vinaysaichelupuri/Documents/projects/AI-Integration/specs/002-topic-submission/spec.md)

**Input**: Feature specification from `/specs/002-topic-submission/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement a topic submission feature that allows a creator to input an educational topic to initiate the AI Instagram carousel generation process. This includes a frontend React form with basic validation, and a backend Express endpoint that checks for duplicate topics, stores the validated topic in MongoDB, and asynchronously triggers the content generation pipeline via an internal `AgentService`.

## Technical Context

**Language/Version**: TypeScript 5.8, Node.js 22

**Primary Dependencies**: React 18, Express 4, MongoDB/Mongoose 9, TailwindCSS 4

**Storage**: MongoDB (Mongoose schemas)

**Testing**: Vitest (for frontend, if applicable) / Jest (for backend)

**Target Platform**: Web Browser (Chrome/Safari)

**Project Type**: Web Application (Monorepo with Frontend and Backend)

**Performance Goals**: Response time under 10 seconds (for generation kickoff, initial topic save under 500ms).

**Constraints**: Topic text length strictly < 200 characters.

**Scale/Scope**: Single creator, low concurrency but requires reliable validation and error handling.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No violations detected against the current constitution.

## Project Structure

### Documentation (this feature)

```text
specs/002-topic-submission/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
apps/backend/
├── src/
│   ├── models/
│   │   └── Post.ts
│   ├── routes/
│   │   └── topicRoutes.ts
│   ├── controllers/
│   │   └── topicController.ts
│   └── services/
│       └── agentService.ts

apps/frontend/
├── src/
│   ├── components/
│   │   └── TopicSubmissionForm.tsx
│   ├── services/
│   │   └── api.ts
│   └── pages/
│       └── Dashboard.tsx
```

**Structure Decision**: Using the existing monorepo structure with apps/frontend and apps/backend. Added specific routes and controllers for topics.

