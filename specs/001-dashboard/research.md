# Research: Dashboard

## 1. Monorepo Setup & Integration
- **Decision**: Use npm workspaces for monorepo management.
- **Rationale**: Best fits the Node.js/React stack and was noted in conversation history.
- **Alternatives considered**: Nx, Turborepo (might add unnecessary complexity for a single creator tool).

## 2. Testing Framework
- **Decision**: Jest and React Testing Library for frontend, Jest and Supertest for backend.
- **Rationale**: Industry standard for React and Express applications.
- **Alternatives considered**: Vitest, Mocha.

## 3. Puppeteer Integration
- **Decision**: Run Puppeteer locally as part of the backend service.
- **Rationale**: Keeps architecture simple for the MVP phase before moving to cloud functions.
- **Alternatives considered**: External screenshot API.
