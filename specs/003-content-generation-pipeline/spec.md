# Feature Specification: Content Generation Pipeline

**Feature Branch**: `003-content-generation-pipeline`

**Created**: 2026-06-08

**Status**: Draft

**Input**: User description: "create the spec for @[docs/implementation-plan.md] module-3,4,5"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate Educational Text Content (Priority: P1)

As a creator, I want the system to take my submitted topic and automatically generate structured, factually accurate educational slides and an engaging Instagram caption.

**Why this priority**: Without the underlying text content, the images cannot be rendered. This is the core intelligence of the pipeline.

**Independent Test**: Can be tested by invoking the generation logic with a topic string and verifying that a 7-slide JSON structure and a formatted caption string are returned.

**Acceptance Scenarios**:

1. **Given** a valid educational topic, **When** generation is triggered, **Then** the system outputs a structured 7-slide sequence (Hook, Definition, Concept, Concept, Example, Fact, CTA).
2. **Given** a generated slide sequence, **When** the caption is generated, **Then** it includes an intro, key takeaway, CTA, and relevant hashtags.

---

### User Story 2 - Render Carousel Images (Priority: P1)

As a creator, I want the system to transform the generated text content into beautiful, high-resolution Instagram-ready PNG images without using AI image generators.

**Why this priority**: Instagram requires visual media. Converting the text to images is essential for the final product.

**Independent Test**: Can be tested by providing a mock JSON slide object to the rendering engine and verifying that 7 PNG files of size 1080x1350 are successfully created.

**Acceptance Scenarios**:

1. **Given** a set of 7 structured slides, **When** the rendering engine processes them, **Then** it outputs exactly 7 PNG images at 1080x1350 resolution.
2. **Given** a slide with a specific structure (e.g., "Fact"), **When** it is rendered, **Then** it uses the correct visual template (e.g., Fact Template with highlighted info).

---

### User Story 3 - Enforce Brand Design System (Priority: P2)

As a creator, I want the generated images to adhere strictly to my predefined modern, minimal design system (specific fonts, colors, and layout) so my brand looks professional.

**Why this priority**: Visual consistency is key to a professional Instagram presence. 

**Independent Test**: Can be tested by visually inspecting the generated PNGs to ensure they use a white background, black primary text, the correct typography, and the designated accent color.

**Acceptance Scenarios**:

1. **Given** the rendering engine, **When** text is rendered, **Then** it strictly utilizes Poppins Bold for headings and Inter Regular for body text.

### Edge Cases

- What happens when the AI generates text that is too long to fit within a slide's boundaries?
- How does the system handle transient failures or rate limits from the AI generation API?
- What happens if the generated text contains inappropriate or non-educational content?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept a topic string and generate exactly 7 structured educational slides as JSON data.
- **FR-002**: System MUST ensure the generated text has an educational tone, is factually accurate, and can be read in under 60 seconds.
- **FR-003**: System MUST generate an Instagram caption containing an introduction, takeaway, CTA, and hashtags.
- **FR-004**: System MUST transform the generated JSON slide data into 7 separate 1080x1350 PNG images.
- **FR-005**: System MUST render images using a strict minimal design system (White background, black text, single accent color) without AI-generated imagery.
- **FR-006**: System MUST use "Poppins Bold" for headings and "Inter Regular" for body text.
- **FR-007**: System MUST apply specific visual templates (Cover, Definition, Fact, CTA) based on the slide's purpose.

### Key Entities

- **Slide**: Represents a single carousel image. Contains `slideNumber`, `title`, `content`, and `templateType`.
- **GeneratedAsset**: Represents the final rendered PNG image file, containing the `imagePath` and associating with the original post.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of generated carousels contain exactly 7 PNG images formatted at 1080x1350 resolution.
- **SC-002**: The complete generation pipeline (Text generation + PNG rendering) completes in under 40 seconds (30s for content, 10s for rendering) for 95% of requests.
- **SC-003**: The AI text generation achieves a 99% success rate, utilizing automatic retries for transient failures.

## Assumptions

- We assume the presence of a robust HTML-to-Image pipeline (like Puppeteer) is available in the environment to support the rendering engine.
- We assume the LLM provider responds quickly enough to meet the 30-second text generation performance goal.
- We assume standard fonts (Poppins, Inter) are accessible to the rendering engine.
