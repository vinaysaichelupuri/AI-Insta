# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

The Content Generation Pipeline automatically takes a submitted topic, generates a 7-slide educational content structure and an Instagram caption using Gemini AI, and then renders those slides into 1080x1350 PNG images using an HTML-to-Image templating engine (Puppeteer).

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript, Node.js 18+

**Primary Dependencies**: `@google/genai` (Gemini API), `puppeteer`, `handlebars`

**Storage**: MongoDB (Mongoose), Local file system for initial image storage

**Testing**: Jest

**Target Platform**: Node.js backend

**Project Type**: Backend service/module

**Performance Goals**: Content Generation < 30s, Image rendering < 10s

**Constraints**: Strict adherence to design system (no AI images), minimal latency

**Scale/Scope**: Background processing pipeline for topic generation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

*GATE: Passed*

- Validated adherence to strict modern typography.
- Confirmed use of explicit templates and local browser engine over AI-generated artwork.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
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
│   ├── services/
│   │   ├── agentService.ts      # Main pipeline orchestrator
│   │   ├── geminiService.ts     # Interface to @google/genai
│   │   └── renderService.ts     # HTML to PNG Puppeteer logic
│   ├── templates/               # Handlebars/HTML templates
│   └── models/                  # Post, Slide, Asset models
```

**Structure Decision**: The logic will reside entirely within `apps/backend` as background services triggered by the API controller.

## Complexity Tracking

> No violations detected.
