# Feature Specification: Topic Submission

**Feature Branch**: `002-topic-submission`

**Created**: 2026-06-08

**Status**: Draft

**Input**: User description: "module-2 create spec file" (Based on Module 2 of implementation-plan.md)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Submit New Topic (Priority: P1)

As a creator, I want to submit a new educational topic so that the system can begin generating Instagram carousel content for me.

**Why this priority**: This is the core interaction that kicks off the entire automation process. Without it, the platform cannot function.

**Independent Test**: Can be fully tested by entering a valid text string (e.g., "Black Holes") and verifying that it is accepted and triggers the next step in the workflow.

**Acceptance Scenarios**:

1. **Given** I am on the dashboard, **When** I enter "Photosynthesis" in the topic input and submit, **Then** the topic is saved and the content generation process begins.

---

### User Story 2 - Handle Invalid Inputs (Priority: P2)

As a user, I want to be informed if my topic is invalid (empty or too long) so that I can correct it before processing.

**Why this priority**: Input validation prevents system errors downstream and ensures the AI receives appropriate prompts.

**Independent Test**: Can be tested independently by attempting to submit empty fields or extremely long strings and verifying that appropriate error messages are displayed.

**Acceptance Scenarios**:

1. **Given** I am on the dashboard, **When** I try to submit an empty topic, **Then** I see an error message indicating the topic is required.
2. **Given** I am on the dashboard, **When** I enter a topic longer than 200 characters and submit, **Then** I see an error message indicating the maximum length limit.

---

### User Story 3 - Warn on Duplicate Topics (Priority: P2)

As a creator, I want to be warned if I submit a topic I've already covered, so that I don't accidentally generate duplicate content unless I intend to.

**Why this priority**: Prevents wasted resources and helps the creator maintain a diverse content feed.

**Independent Test**: Can be tested independently by submitting a topic that already exists in the user's history and verifying that a warning is presented.

**Acceptance Scenarios**:

1. **Given** I have previously generated content for "Atoms", **When** I enter "Atoms" as a new topic and submit, **Then** I receive a warning that I have already used this topic.

### Edge Cases

- What happens when a user enters special characters or emojis in the topic?
- How does the system handle rapid, repeated submissions (double-clicking the submit button)?
- Does the duplicate topic check consider case sensitivity (e.g., "black holes" vs "Black Holes")?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a text input field for topic entry.
- **FR-002**: System MUST validate that the topic is not empty before submission.
- **FR-003**: System MUST validate that the topic is strictly under 200 characters.
- **FR-004**: System MUST check the submitted topic against the user's previously submitted topics.
- **FR-005**: System MUST display a warning if the entered topic matches a previously generated topic, allowing the user to either cancel or proceed.
- **FR-006**: System MUST store the validated topic upon successful submission.
- **FR-007**: System MUST trigger the content generation process immediately after successfully storing the topic.

### Key Entities

- **Topic**: Represents the subject matter provided by the user (e.g., "Machine Learning"). Contains the text string and metadata regarding its submission status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can submit a topic and initiate generation in under 10 seconds.
- **SC-002**: 100% of valid submitted topics successfully trigger the content generation process.
- **SC-003**: Invalid inputs (empty or > 200 chars) are caught and displayed to the user 100% of the time without causing system failure or unhandled exceptions.
- **SC-004**: Warning for duplicate topics is displayed within 1 second of submission for matching topics.

## Assumptions

- Users have basic typing capabilities and understand the general subjects they want to cover.
- A "duplicate topic warning" means the user is alerted but can choose to proceed and generate content for the same topic again if desired.
- Duplicate detection is case-insensitive and ignores leading/trailing whitespace.
