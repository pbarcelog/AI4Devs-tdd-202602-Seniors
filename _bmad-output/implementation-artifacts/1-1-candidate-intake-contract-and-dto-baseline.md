# Story 1.1: Candidate Intake Contract and DTO Baseline

Status: ready-for-dev

## Story

As a recruiter,
I want the candidate intake flow to use a stable API contract for core profile and nested data fields,
so that submissions are predictable and don't break between frontend and backend.

## Acceptance Criteria

1. **Given** the current intake frontend service payloads and backend endpoints  
   **When** candidate intake DTOs are defined and mapped at both boundaries  
   **Then** the request/response contract is consistent for candidate, education, and work experience data  
   **And** contract docs are updated in Swagger/OpenAPI for these endpoints.

2. **Given** contract tests are executed for candidate create/read flows  
   **When** DTO mapping or endpoint behavior changes  
   **Then** tests fail on mismatch and pass on aligned mappings  
   **And** no unresolved contract drift remains for covered paths.

## Tasks / Subtasks

- [ ] Define canonical DTOs for candidate create/read with nested education/work fields (AC: #1)
  - [ ] Add/adjust typed backend DTO contracts at API boundary.
  - [ ] Ensure strict typing and `camelCase` field naming; avoid `any`.
- [ ] Align backend route/controller -> service mapping to canonical DTO contract (AC: #1)
  - [ ] Keep persistence logic in service layer only.
  - [ ] Preserve deterministic error taxonomy behavior.
- [ ] Align frontend service request/response mapping to canonical contract (AC: #1)
  - [ ] Update intake service payload mapping under `frontend/src/services/*`.
  - [ ] Keep API calls out of UI components.
- [ ] Update Swagger/OpenAPI contract docs for impacted candidate endpoints (AC: #1)
  - [ ] Ensure docs match implemented request/response payload shape.
- [ ] Add contract drift tests for candidate create/read flows (AC: #2)
  - [ ] Include positive path assertions for contract shape.
  - [ ] Include mismatch assertions that fail when mapping drifts.
- [ ] Execute package quality gates for touched packages (AC: #1, #2)
  - [ ] Run build/type/lint/test scripts and confirm pass.

## Dev Notes

### Developer Context

- This is the baseline story for Epic 1; downstream stories depend on contract stability.
- Keep implementation brownfield-safe and scoped to intake contract behavior only.
- No new framework, state library, or UI framework introduction.

### Technical Requirements

- Enforce API boundary validation before service execution.
- Keep backend layering explicit: `routes/` -> `presentation/controllers/` -> `application/services/`.
- Keep Prisma access in services, not routes/controllers.
- Keep backend/frontend DTO mapping synchronized in the same story.
- Update OpenAPI/Swagger whenever behavior-affecting contract changes.

### Architecture Compliance

- Use REST and typed DTO request/response contracts.
- Preserve modular monolith boundaries and deterministic failure semantics.
- Keep explicit error categories (validation, contract, authorization, upload, unexpected) compatible with existing taxonomy.

### File Structure Requirements

- Backend likely touch points:
  - `backend/src/routes/candidateRoutes.ts`
  - `backend/src/presentation/controllers/*candidate*`
  - `backend/src/application/services/*candidate*`
  - backend Swagger/OpenAPI definition files
  - backend tests for candidate create/read contract
- Frontend likely touch points:
  - `frontend/src/services/*candidate*`
  - frontend tests for service contract mapping (if present in project pattern)

### Testing Requirements

- Follow TDD loop: write failing contract tests first, then implement to pass.
- Test both happy path and contract mismatch/drift paths.
- Use deterministic fixtures for candidate + nested education/work payloads.
- Ensure tests run via package scripts in changed packages.

### Latest Technical Information

- Project baseline versions from context:
  - Backend: `express@^4.19.2`, `typescript@^4.9.5`
  - Data layer: `prisma@^5.13.0`, `@prisma/client@^5.13.0` (must stay version-aligned)
  - API docs: `swagger-jsdoc@^6.2.8`, `swagger-ui-express@^5.0.0`
  - Frontend: `react@^18.3.1`, `react-router-dom@^6.23.1`, `react-bootstrap@^2.10.2`

### Project Structure Notes

- Story output location follows sprint tracking convention: `_bmad-output/implementation-artifacts`.
- Preserve existing package boundaries and naming consistency (`Candidate`, `Education`, `WorkExperience`).

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 1, Story 1.1]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Core Architectural Decisions, Data Architecture, API & Communication Patterns, Implementation Patterns & Consistency Rules, Project Structure & Boundaries]
- [Source: `_bmad-output/project-context.md` - Critical Implementation Rules, Testing Rules, Development Workflow Rules]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - candidate intake reliability and explicit completion feedback principles]

## Dev Agent Record

### Agent Model Used

Codex 5.3

### Debug Log References

- N/A

### Completion Notes List

- Story context created with contract, architecture, testing, and boundary guardrails.
- Ready for `dev-story` implementation execution.

### File List

- `_bmad-output/implementation-artifacts/1-1-candidate-intake-contract-and-dto-baseline.md`
