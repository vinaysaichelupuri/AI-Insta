# AI-Insta Constitution

## Core Principles

### I. Spec-First Development (NON-NEGOTIABLE)

Every feature begins with a specification before implementation.

Requirements:

* PRD → Epic → Feature Spec → Tasks
* No coding before approved specification
* Every task must map back to an approved requirement
* Implementation must never introduce functionality not defined in specifications
* Any requirement change must update the specification first

Rule:

"Spec is the source of truth."

---

### II. AI-Agent Driven Engineering

Development is performed through specialized AI agents with clearly defined responsibilities.

Planner Agent Responsibilities:

* Analyze requirements
* Create architecture
* Define APIs
* Define database schema
* Create implementation tasks
* Identify dependencies
* Assess risks

Developer Agent Responsibilities:

* Implement approved tasks only
* Follow architecture decisions
* Generate tests
* Update documentation

Rule:

Agents cannot modify responsibilities outside their defined scope.

---

### III. Modular Architecture

The system must be developed as independent modules.

Current Modules:
* Content Generation Module
* Carousel Rendering Module
* Approval Workflow Module
* Instagram Publishing Module
* Scheduler Module
* History Module

Requirements:

* Loose coupling
* Clear interfaces
* Independent testing
* Independent deployment readiness

Rule:

Modules communicate through contracts, not direct assumptions.

---

### IV. API Contract First

Every API must be defined before implementation.

Requirements:

* Endpoint definition
* Request schema
* Response schema
* Error schema
* Validation rules

Rule:

Backend implementation must match approved contracts exactly.

---

### V. Testability By Design

Every feature must be testable.

Required Tests:

* Unit Tests
* Integration Tests
* End-to-End Tests

Critical Flows Requiring E2E Coverage:

* Topic Collection
* Content Generation
* Approval Workflow
* Instagram Publishing
* Regeneration Flow

Rule:

No feature is complete without validation.

---

## Technology Standards

### Backend

Required Stack:

* Node.js
* TypeScript
* Express

Requirements:

* Strict TypeScript mode enabled
* Layered architecture
* Dependency injection preferred

Layers:

* Routes
* Controllers
* Services
* Repositories
* Infrastructure

---

### Database

Primary Database:

* MongoDB

Requirements:

* Schema validation
* Indexing strategy documented
* Soft delete support where applicable

Collections:

* Posts
* Slides
* Images
* Approval Requests
* Publishing Logs

---

### AI Layer

Primary Provider:

* OpenAI

Responsibilities:

* Topic Expansion
* Carousel Generation
* Caption Generation

Requirements:

* Prompt versioning
* Prompt templates stored centrally
* AI responses logged
* Regeneration history maintained

Rule:

Prompts are treated as production assets.

---

### Storage

Primary Storage:

* Cloudinary

Requirements:

* Versioned assets
* Secure URLs
* Lifecycle management

---

### External Integrations

Supported Integrations:

* Instagram Graph API
* Cloudinary
* OpenAI

Requirements:

* Retry mechanisms
* Rate limit handling
* Failure logging
* Idempotent operations

Rule:

External service failures must never corrupt internal state.

---

## Security Requirements

### Secrets Management

Forbidden:

* Hardcoded API keys
* Hardcoded access tokens

Required:

* Environment variables
* Secret rotation support

---

### Authentication

Requirements:

* Admin-only actions protected
* Webhook verification mandatory
* Signature validation mandatory

---

### Data Protection

Requirements:

* Encrypt sensitive credentials
* Mask secrets in logs
* Store minimum required data

---

## AI Content Quality Standards

Every generated post must satisfy:

### Accuracy

* Factually correct
* No hallucinated information

### Readability

* Simple language
* Mobile-first formatting

### Educational Value

Each carousel must include:

* Hook
* Explanation
* Key Learnings
* Interesting Fact
* Summary

### Brand Consistency

All posts must:

* Follow page tone
* Follow page style guide
* Follow template structure

---

## Development Workflow

### Feature Lifecycle

1. PRD Created
2. Specification Approved
3. Architecture Reviewed
4. Tasks Generated
5. Tests Defined
6. Implementation Started
7. Validation Completed
8. Production Ready

Rule:

No stage may be skipped.

---

### Pull Request Requirements

Every PR must include:

* Requirement Reference
* Test Evidence
* Screenshots (if applicable)
* API Changes
* Database Changes

---

### Definition of Done

A feature is complete only when:

* Specification satisfied
* Tests passing
* Documentation updated
* Logging added
* Error handling added
* Review completed

---

## Operational Standards

### Observability

Required:

* Structured logging
* Error tracking
* Request tracing

Critical Events:

* Topic Received
* Content Generated
* Approval Requested
* Approval Received
* Post Published
* Publishing Failed

---

### Reliability

Targets:

* 99% message delivery success
* 99% publishing success
* Automatic retries for transient failures

---

### Performance

Targets:

Content Generation:

* Under 30 seconds

Carousel Rendering:

* Under 2 minutes

Instagram Publishing:

* Under 1 minute

---

## Governance

This constitution overrides all development preferences, implementation shortcuts, and undocumented practices.

Any change must include:

1. Reason for change
2. Impact analysis
3. Migration strategy
4. Approval from project owner

All planners, developers, reviewers, and AI agents must verify compliance before marking work complete.

Version: 1.0.0
Ratified: 2026-06-08
Last Amended: 2026-06-08
