# Implementation Plan: Post Publishing Workflow

**Branch**: `master` | **Date**: 2026-06-08 | **Spec**: [spec.md](file:///Users/vinaysaichelupuri/Documents/projects/AI-Integration/specs/004-post-publishing/spec.md)

**Input**: Feature specification from `/specs/004-post-publishing/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement the post-publishing workflow enabling users to preview generated carousels, approve them, export the HTML slides to PNG using Puppeteer, publish them to Instagram via the Graph API, and view their historical posts.

## Technical Context

**Language/Version**: TypeScript / Node.js 20+

**Primary Dependencies**: React (Frontend), Express (Backend), Puppeteer (Image Export), Instagram Graph API.

**Storage**: MongoDB (Data), Local File System (Images).

**Testing**: Jest (Unit/Integration Tests).

**Target Platform**: Web application (Frontend + Backend).

**Project Type**: Web application with background services.

**Performance Goals**: HTML to PNG export < 10s, Publishing < 1m.

**Constraints**: Instagram Professional Account and Meta Developer App required. 

**Scale/Scope**: Single creator managing an educational Instagram page.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec-First Development**: Yes, following the spec.
- **Modular Architecture**: Yes, separating into Rendering Module, Approval Workflow Module, Publishing Module, and History Module.
- **API Contract First**: Yes, defined in `contracts/api.md`.
- **Testability By Design**: E2E testing for Approval Workflow and Publishing.
- **Technology Standards**: Node.js, Express, TypeScript, MongoDB.

## Project Structure

### Documentation (this feature)

```text
specs/004-post-publishing/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   ├── services/
│   │   ├── exportService.ts
│   │   ├── instagramService.ts
│   └── api/
│       ├── postRoutes.ts
└── tests/

frontend/
├── src/
│   ├── components/
│   │   ├── PreviewCarousel.tsx
│   ├── pages/
│   │   ├── HistoryDashboard.tsx
│   └── services/
│       ├── api.ts
└── tests/
```

**Structure Decision**: Web application (Option 2) with distinct `frontend` and `backend` directories.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
