# Product Requirements Document (PRD)

# Project Name

AI-Insta

AI-Powered Instagram Educational Content Automation Platform

---

# Vision

AI-Insta is a platform that enables a content creator to generate, review, and publish high-quality educational Instagram carousel posts in minutes.

The platform automates:

* Topic research
* Content generation
* Caption creation
* Carousel design
* Instagram publishing

while maintaining human approval before publication.

The creator should only need to:

1. Enter a topic
2. Review generated content
3. Approve publication

The system handles everything else.

---

# Problem Statement

Educational content creators spend significant time creating Instagram posts.

Typical workflow:

1. Research topic
2. Write content
3. Design carousel
4. Create caption
5. Publish manually

Creating a single post can take between 30 minutes and 2 hours.

Most tasks are repetitive and can be automated using AI and predefined design systems.

The objective is to reduce content creation time to less than 5 minutes.

---

# Target User

Primary User:

Single creator managing an educational Instagram page.

Content Categories:

* Science
* Technology
* Artificial Intelligence
* Space
* Physics
* Biology
* History
* Geography
* Programming

---

# Success Metrics

Primary Metrics

* Posts published per day
* Average generation time
* Average approval time
* Approval rate

Secondary Metrics

* Regeneration requests
* Publishing success rate
* Topic duplication rate

---

# User Journey

## Step 1

User opens dashboard.

## Step 2

User enters topic.

Example:

"Black Holes"

## Step 3

System generates:

* Carousel content
* Caption
* Hashtags

## Step 4

System renders carousel slides.

## Step 5

User reviews content.

Options:

* Approve
* Regenerate
* Reject

## Step 6

System publishes carousel to Instagram.

---

# Functional Requirements

# Module 1: Dashboard

## Purpose

Primary interface for the creator.

## Features

* Topic submission
* Content generation
* Preview generation
* Approval workflow
* Publishing
* Content history

## Acceptance Criteria

* Accessible through browser.
* Responsive layout.
* Secure authentication.

---

# Module 2: Topic Submission

## Purpose

Collect content topic from creator.

## Input

Text topic.

Examples:

* Atoms
* Photosynthesis
* Machine Learning
* Black Holes

## Validation

* Topic required.
* Topic length < 200 characters.
* Duplicate topic warning.

## Acceptance Criteria

* Topic stored successfully.
* Generation process starts.

---

# Module 3: Content Generation Agent

## Purpose

Generate educational carousel content.

## Input

Topic

## Output

Structured carousel content.

### Slide Structure

Slide 1

Hook

Slide 2

Definition

Slide 3

Concept

Slide 4

Concept

Slide 5

Example

Slide 6

Interesting Fact

Slide 7

Call To Action

## Requirements

* Factually accurate
* Easy to understand
* Educational tone
* Reading time under 60 seconds

## Acceptance Criteria

* Exactly 7 slides generated.
* Content returned as structured JSON.

---

# Module 4: Caption Generation Agent

## Purpose

Generate Instagram caption.

## Output

Caption contains:

* Introduction
* Key takeaway
* Call to action
* Hashtags

## Acceptance Criteria

* Caption generated successfully.
* Stored with post.

---

# Module 5: Carousel Rendering Engine

## Purpose

Transform content into Instagram-ready carousel slides.

The system will NOT use AI image generation.

Instead:

Content
→ HTML Template
→ PNG Export

## Output

7 PNG images

Resolution:

1080 x 1350

Instagram Optimized

---

## Design Philosophy

Minimal

Modern

High readability

Educational

Professional

---

## Design System

Background:

White

Primary Text:

Black

Accent:

Single configurable accent color

Typography:

Heading:
Poppins Bold

Body:
Inter Regular

Visual Elements:

* Borders
* Dividers
* Highlight Boxes
* Progress Indicators
* Branding Footer

No stock images required.

No AI-generated illustrations required.

---

## Templates

### Cover Template

Large title

Subtitle

Branding

### Definition Template

Heading

Explanation

Key takeaway

### Fact Template

Highlighted information

Bullet points

### CTA Template

Summary

Follow CTA

---

## Acceptance Criteria

* Consistent branding.
* Readable on mobile devices.
* Generated within 10 seconds.

---

# Module 6: PNG Export Engine

## Purpose

Convert rendered HTML slides into images.

## Technology

Puppeteer

## Flow

HTML

↓

Headless Browser

↓

PNG Export

## Output

1080x1350 PNG files

## Acceptance Criteria

* PNG generation successful.
* Image quality maintained.

---

# Module 7: Preview Workflow

## Purpose

Allow creator review before publishing.

## Features

* Carousel preview
* Caption preview
* Slide navigation

Actions:

* Approve
* Regenerate
* Reject

## Acceptance Criteria

* User can review entire carousel.
* Approval status stored.

---

# Module 8: Instagram Publishing

## Purpose

Publish approved carousel.

## Requirements

Instagram Professional Account

Facebook Page

Meta Developer Account

Instagram Graph API

## Workflow

Create media containers

Upload carousel images

Attach caption

Publish post

Update status

## Acceptance Criteria

* Post visible on Instagram.
* Publishing status saved.

---

# Module 9: Content History

## Purpose

Store generated content.

## Features

* View previous posts
* Search by topic
* View captions
* View generated slides

## Acceptance Criteria

* Historical content retrievable.
* Search functionality works.

---

# Data Model

## Posts

Fields:

id

topic

status

caption

hashtags

createdAt

publishedAt

---

## Slides

Fields:

id

postId

slideNumber

title

content

templateType

---

## GeneratedAssets

Fields:

id

postId

imagePath

createdAt

---

# Non Functional Requirements

## Performance

Content Generation:

< 30 seconds

Carousel Rendering:

< 10 seconds

Publishing:

< 1 minute

---

## Reliability

99% generation success rate

Automatic retries for transient failures

---

## Security

Protected dashboard

Secure API key storage

Environment variable management

Input validation

---

# Tech Stack

Frontend

* React
* TypeScript
* TailwindCSS
* React Query
* React Router

Backend

* Node.js
* Express

Database

* MongoDB

AI

* Gemini API

Rendering

* React Templates
* HTML
* CSS

Image Export

* Puppeteer

Scheduling

* node-cron

Publishing

* Instagram Graph API

Storage

Phase 1:
Local File System

Phase 2:
Cloudinary

---

# Future Enhancements

Phase 2

* WhatsApp Integration
* Daily Topic Reminders
* Auto Draft Generation

Phase 3

* Voice Topic Input
* Multi-language Content
* AI Generated Reels

Phase 4

* Multiple Instagram Accounts
* Analytics Dashboard
* Trending Topic Discovery
