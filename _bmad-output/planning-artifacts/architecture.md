---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/prd-validation-report.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/project-context.md'
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-04-16'
project_name: 'AI4Devs-tdd-202602-Seniors'
user_name: 'PB'
date: '2026-04-16'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**  
The functional scope is centered on reliable candidate intake: create/update/view candidate profiles, nested qualification persistence, CV upload handling, deterministic validation and recovery flows, and stable frontend-backend contract behavior. Architecturally, this implies clear domain boundaries (`Candidate`, nested education/work experience, CV metadata), transaction-safe write orchestration, and explicit separation of orchestration vs domain logic. Post-MVP requirements (list/search/filter/dashboard/lifecycle/reporting) indicate the architecture should preserve extensibility for read-optimized queries and lifecycle state evolution without destabilizing MVP intake.

**Non-Functional Requirements:**  
NFRs are explicit and measurable, and they strongly constrain architecture decisions:
- Performance: p95 interaction/API and upload responsiveness under defined load.
- Security: TLS, strict RBAC outcomes, secret hygiene, upload hardening, no sensitive plaintext logs.
- Reliability: explicit recoverable failures, availability target, regression evidence per release, TDD-compatible change flow.
- Accessibility: WCAG 2.1 AA-aligned keyboard and semantic behavior.
- Integration stability: synchronized contract changes with documentation + compatibility controls.
- Scalability: 10x growth targets, no N+1 in hot paths, artifact volume operability.

These require architecture-level quality gates, observability, and testable contracts as first-class concerns.

**Scale & Complexity:**  
This is a brownfield reliability-first product evolution with moderate feature breadth and high quality discipline requirements.

- Primary domain: full-stack web candidate-intake platform
- Complexity level: medium-high
- Estimated architectural components: 8-12 core components/subsystems (web UI flow layer, API boundary, validation/error model, candidate domain services, persistence layer, upload subsystem, contract/docs synchronization, observability/support diagnostics, test/quality gate infrastructure)

### Technical Constraints & Dependencies

- Existing stack constraints: React + React-Bootstrap frontend, Express + TypeScript backend, Prisma + PostgreSQL persistence.
- Brownfield rule constraints from `project-context.md`: strict layering boundaries, no route/service coupling, validation-before-persistence, contract synchronization in same scoped change.
- Upload constraints: safe file handling and deterministic failure feedback.
- Testing constraints: TDD default loop, story-level automated coverage, regression coverage for fixes.
- Delivery constraints: small cohesive diffs, no hidden behavior changes, enforce quality gates before story completion.

### Cross-Cutting Concerns Identified

- Contract governance across frontend services, backend DTOs, and API docs.
- Validation and error taxonomy consistency (field-level user feedback + support-friendly diagnostics).
- Security posture across transport, authz, secret handling, logging, and upload scanning/validation.
- Reliability/operability via explicit failure states, trace IDs, monitoring, and release evidence.
- Accessibility and responsive behavior as non-optional acceptance criteria.
- Performance and data-access discipline (p95 targets, no N+1, load-test checkpoints).
- Test architecture alignment (TDD workflow + CI-gated regression confidence).

## Starter Template Evaluation

### Primary Technology Domain

Brownfield full-stack web application based on project requirements analysis.

### Starter Options Considered

- **Existing Brownfield Baseline**
  - Already matches the documented product and implementation constraints.
  - Preserves current Express + Prisma + PostgreSQL backend and React frontend.
  - Best fit for incremental architecture work because it avoids accidental platform rewrite.

- **Vite + React TypeScript**
  - Strong modern SPA starter and current recommendation for new React apps.
  - Would improve frontend tooling and replace deprecated CRA patterns.
  - Not selected as the architecture baseline because this project already has a running brownfield frontend and migration would be a separate effort.

- **Next.js**
  - Strong current full-stack starter with modern defaults.
  - Not selected because SSR/App Router/API-route defaults do not match the documented needs of this operational SPA, and adopting it would introduce a major architectural shift.

- **Greenfield Express + TypeScript Starter**
  - Useful for new backend projects, but redundant here because the backend already exists and the architecture must preserve current layered boundaries rather than restart them.

### Selected Starter: Existing Brownfield Baseline (No External Starter)

**Rationale for Selection:**  
This project already has an established repository, stack, and delivery constraints. The architecture should build on the current codebase rather than replace it with a greenfield scaffold. Selecting the existing repo as the baseline avoids re-platforming risk, preserves brownfield-safe evolution, and keeps architectural decisions focused on boundaries, contracts, reliability, and quality gates instead of unnecessary bootstrap churn.

**Initialization Command:**

```bash
N/A - use existing repository as architectural baseline
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**  
Node.js + TypeScript backend, React frontend, Prisma + PostgreSQL persistence already established.

**Styling Solution:**  
Existing `react-bootstrap` + Bootstrap foundation is already present and aligned with UX direction.

**Build Tooling:**  
Current repo remains the baseline. Frontend currently uses CRA-era tooling; any migration to Vite should be treated as a later explicit story, not an initialization assumption.

**Testing Framework:**  
Use existing package-level testing setup and evolve it through TDD-first story work and regression-focused additions.

**Code Organization:**  
Preserve existing backend layering (`routes`, `presentation/controllers`, `application/services`) and frontend service/UI separation.

**Development Experience:**  
Incremental improvement on the current repo, with quality gates, contract synchronization, measurable NFR enforcement, and reproducible local workflows.

**Note:** Instead of project initialization, the first implementation-enabling story should validate the existing baseline against architecture decisions and fill any framework/testing gaps that block story execution.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Preserve **modular monolith** architecture within the existing repo rather than introducing microservices.
- Keep **PostgreSQL via Prisma** as the system of record and migration mechanism.
- Enforce **schema/DTO validation at API boundary** before service execution.
- Standardize on **REST API** for frontend-backend communication.
- Define a **single error taxonomy** spanning validation, upload, contract, auth, and unexpected failures.
- Use **role-based access control** with authenticated application users and policy checks at service/controller boundaries.
- Preserve **service-layer ownership** of business logic and persistence orchestration.
- Adopt **frontend service layer + feature-oriented UI composition** without adding a second UI/state framework.
- Make **CI quality gates** mandatory for changed areas: build/type/lint/test plus contract/documentation sync checks.

**Important Decisions (Shape Architecture):**
- Use **transactional write orchestration** for candidate + education + work experience + CV metadata flows.
- Implement **upload subsystem isolation** with validation, safe storage abstraction, and recoverable failure semantics.
- Use **OpenAPI/Swagger** as the maintained API contract surface.
- Add **traceable observability** via structured logs, request correlation/trace IDs, and failure-class reporting.
- Prefer **server-side validation + frontend display mapping**, with deterministic field-level errors.
- Keep frontend state management **local/component + service orchestration first**, adding broader state tooling only if future scope proves necessary.
- Use **read-optimized query design** for future list/search/filter/reporting without over-engineering MVP.

**Deferred Decisions (Post-MVP):**
- Distributed caching layer
- Event-driven integration architecture
- Real-time notifications
- Full CI/CD platform hardening details
- Frontend tooling migration (for example CRA-era tooling to Vite)
- Search indexing beyond database-backed filtering/querying

### Data Architecture

- **Primary database:** PostgreSQL (existing baseline; latest ecosystem context is PostgreSQL 18.x, but project baseline remains current repo versioning until explicitly upgraded)
- **ORM/data access:** Prisma (existing baseline; keep `prisma` and `@prisma/client` version-locked together)
- **Data modeling approach:** relational normalized core centered on `Candidate` aggregate with nested `Education`, `WorkExperience`, and CV/document reference metadata
- **Write consistency model:** transactional service-layer orchestration for multi-entity candidate persistence
- **Validation strategy:** boundary validation before service execution, plus typed DTO/domain mapping before Prisma writes
- **Migration strategy:** Prisma migrations only, planned and applied as explicit story-scoped changes
- **Caching strategy:** no distributed cache in MVP; rely on PostgreSQL + efficient querying; revisit when Phase 2 read-heavy flows arrive
- **Performance rule:** no N+1 in hot paths; prefer Prisma relational fetches/batched access patterns

### Authentication & Security

- **Authentication method:** application-managed authenticated user sessions/token validation integrated at backend boundary; exact provider can remain adapter-based until implementation story selects concrete mechanism
- **Authorization pattern:** role-based access control enforced on candidate operations
- **Security middleware:** transport security, CORS, request-size/file validation, auth middleware, and centralized error sanitization
- **Secrets strategy:** environment-based secret injection only
- **Sensitive data protection:** zero plaintext sensitive logging, upload hardening, and controlled CV/document metadata exposure
- **Encryption approach:** TLS in transit; storage-layer encryption delegated to infrastructure/runtime environment as applicable
- **API security strategy:** authenticated routes, deterministic 401/403 behavior, safe error responses, and upload validation before persistence

### API & Communication Patterns

- **API style:** REST
- **Contract format:** typed request/response DTOs synchronized with frontend service mappings
- **Documentation:** maintain OpenAPI/Swagger with every behavior-affecting contract change
- **Error handling standard:** centralized taxonomy with categories such as validation, upload, contract, authorization, and unexpected/system errors
- **Failure semantics:** all failures must be explicit, recoverable where possible, and traceable for support
- **Rate limiting strategy:** lightweight protective rate limiting on mutation/upload endpoints; refine with real traffic patterns later
- **Service communication:** in-process modular monolith calls only for MVP, not networked service-to-service communication

### Frontend Architecture

- **Application model:** SPA using existing React architecture
- **Routing:** React Router baseline retained from current app
- **Component architecture:** feature-oriented composition using `react-bootstrap` primitives plus custom workflow components defined in UX spec
- **State management:** local component state + lifted feature state + service-layer API orchestration; defer global state library unless cross-feature complexity proves it necessary
- **Form architecture:** extraction/review/correction flow with deterministic validation mapping and recoverable error states
- **Accessibility baseline:** WCAG 2.1 AA-aligned patterns as architecture constraint, not polish item
- **Performance optimization:** optimize high-frequency intake flows first; keep bundle strategy simple until proven pain emerges
- **UI consistency rule:** no second UI framework introduced

### Infrastructure & Deployment

- **Runtime model:** existing split frontend/backend deployment model with PostgreSQL-backed local/dev environment
- **Environment configuration:** env-driven configuration, documented immediately when new variables are introduced
- **Local reproducibility:** Docker-backed PostgreSQL plus package-script startup workflows
- **Monitoring/logging:** structured backend logs, correlation IDs, failure classification, and release evidence for changed behavior
- **CI/CD approach:** CI must validate changed packages with build/type/lint/test checks and contract/documentation synchronization checks
- **Scaling strategy:** scale vertically/simple deployment first; optimize DB access, upload handling, and response times before adding infrastructure complexity

### Decision Impact Analysis

**Implementation Sequence:**
1. Lock validation/error contract model
2. Lock candidate aggregate write orchestration and upload boundaries
3. Lock authz/security middleware expectations
4. Lock frontend service/DTO mapping patterns
5. Add observability and CI quality gates where missing
6. Expand read/query architecture for Phase 2 list/search/filter/dashboard work

**Cross-Component Dependencies:**
- Validation design affects API DTOs, frontend field-error mapping, and support diagnostics.
- Candidate aggregate modeling affects Prisma schema usage, service orchestration, and future read/query features.
- Upload isolation affects security controls, persistence references, retry semantics, and UX recovery behavior.
- Authz decisions affect route middleware, service guard patterns, and audit/retention workflows.
- Contract synchronization affects backend controllers/services, frontend services, Swagger docs, and CI gates.
- Observability standards affect backend middleware, error model, support workflows, and release readiness.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**  
10 high-risk areas where AI agents could make incompatible choices if patterns are not explicit:
- DTO and JSON naming conventions
- API endpoint and route parameter naming
- Validation placement and timing
- Error response structure
- Test placement and naming
- Upload handling boundaries
- Date/time serialization rules
- Frontend service and component responsibilities
- Logging and trace correlation format
- Loading/retry/recovery UX state handling

### Naming Patterns

**Database Naming Conventions:**
- Follow Prisma schema naming conventions already present in the repo; do not introduce parallel naming schemes.
- Prisma model names: `PascalCase` singular (for example `Candidate`, `Education`, `WorkExperience`)
- Prisma fields and TypeScript properties: `camelCase`
- Database-level table/column naming should remain Prisma-managed; avoid raw SQL naming divergence unless explicitly required.
- Foreign key fields in application code should use semantic names like `candidateId`, not prefixed forms like `fk_candidate`.

**API Naming Conventions:**
- REST resources use plural nouns for collections where applicable.
- Route params use Express style `:id`.
- JSON request/response fields use `camelCase`.
- Query parameters also use `camelCase` for consistency with frontend services.
- Avoid mixing transport naming styles (`snake_case` in API, `camelCase` in UI) unless there is an explicit adapter layer.

**Code Naming Conventions:**
- React components: `PascalCase`
- Component files: `PascalCase` for component files when file exports a component
- Utility/service/helper files: `camelCase` or domain-specific existing repo style, but do not mix multiple new conventions in the same folder
- Functions/variables: `camelCase`
- Types/interfaces/classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE` only for true constants
- Route/controller/service names should use domain terms already established in project context (`Candidate`, `Education`, `WorkExperience`, `Resume`/CV metadata)

### Structure Patterns

**Project Organization:**
- Backend:
  - `routes/` for route declarations only
  - `presentation/controllers/` for HTTP orchestration
  - `application/services/` for business logic and persistence orchestration
  - Prisma access belongs in services, not routes/controllers
- Frontend:
  - UI components render and manage view-local interaction
  - API calls belong in `frontend/src/services/*`
  - Avoid introducing a second parallel app-entry or routing root
- Organize by feature/domain first where possible, while respecting existing repo boundaries.

**File Structure Patterns:**
- Tests should follow package-local existing conventions; prefer co-located or stable package-level placement over ad hoc one-off folders.
- Validation helpers should live near boundary-layer logic, not scattered through UI and services simultaneously.
- Upload-related utilities should remain isolated in upload-specific service/util areas.
- API contract documentation updates should stay near existing Swagger/OpenAPI setup, not in disconnected docs.

### Format Patterns

**API Response Formats:**
- Success responses should be predictable and minimal; avoid mixing wrapped and unwrapped success formats arbitrarily.
- Error responses must follow a single structured format with:
  - stable machine-readable code/category
  - human-readable message
  - field-level details when applicable
  - trace/correlation identifier when useful for support
- Validation errors must be distinguishable from upload, auth, contract, and unexpected system failures.
- HTTP status usage must be deterministic:
  - `2xx` for success
  - `4xx` for client/validation/auth/contract issues
  - `5xx` for true server-side unexpected failures

**Data Exchange Formats:**
- Dates in API payloads should use a single normalized format, preferably ISO-8601 strings at boundaries.
- JSON fields use `camelCase`.
- Booleans remain `true/false`, never `1/0`.
- Nullability should be explicit: prefer `null` only when semantically meaningful, otherwise omit optional fields consistently.
- Single-item responses should not be wrapped as arrays.

### Communication Patterns

**Event System Patterns:**
- MVP architecture is in-process modular monolith, so no cross-service event bus is required.
- If internal domain events are introduced later, use `domain.action` or `EntityAction` consistently, but do not mix both.
- Event introduction is deferred unless required by a specific story.

**State Management Patterns:**
- Frontend state should default to:
  - local component state for view-local interactions
  - lifted feature state for multi-component flows
  - service-layer orchestration for server communication
- Avoid introducing a global state library unless the story explicitly justifies it.
- Loading, retry, and recovery state names should align with UX language:
  - `idle`
  - `loading` / `processing`
  - `needsReview`
  - `retryRequired`
  - `saved`
  - `error`

### Process Patterns

**Error Handling Patterns:**
- Validation happens before service execution.
- Controllers translate typed/service/boundary errors into consistent HTTP responses.
- Silent failures are forbidden.
- User-facing messages should explain:
  - what failed
  - what was preserved
  - what to do next
- Logs should contain diagnostic detail; user responses should contain safe, actionable detail.

**Loading State Patterns:**
- Every async workflow that matters to the user must expose explicit loading and completion state.
- Upload, extraction/review, and save flows must support recoverable retry patterns.
- Preserve user effort on failure wherever technically possible.
- Loading and retry UI should be consistent across features, especially around candidate intake flows.

### Enforcement Guidelines

**All AI Agents MUST:**
- Validate and normalize request data before calling service-layer persistence logic.
- Keep frontend-backend contract updates in the same scoped change as behavior changes.
- Add or update automated tests for changed behavior and regression-sensitive paths.
- Preserve existing layer boundaries and avoid introducing business logic into routes/controllers/components.
- Use explicit error categories and avoid custom one-off response formats.
- Keep API and UI naming conventions consistent with `camelCase` application boundaries.

**Pattern Enforcement:**
- Verify through code review, story acceptance criteria, test coverage, and contract/doc sync checks.
- Document deviations in story notes or architecture updates rather than silently drifting.
- Update patterns only when a repeated need emerges across multiple stories.

### Pattern Examples

**Good Examples:**
- `candidateId` used consistently in DTOs, services, and UI mappings
- Controller validates request, then calls service, then maps typed result/error to HTTP response
- Frontend service maps API response to UI model while component focuses on rendering and interaction
- Validation error response includes code, message, and field issues in a stable shape
- Upload failure returns explicit retryable state instead of generic `500`

**Anti-Patterns:**
- Raw Prisma/database calls inside route handlers
- Frontend components making ad hoc `fetch`/`axios` calls directly while other parts use services
- Mixed `snake_case` and `camelCase` JSON in the same API surface
- Different error payload shapes for each endpoint
- Introducing Redux/Zustand/global state without clear cross-feature need
- Hiding failure details in logs only, with vague user-facing errors

## Project Structure & Boundaries

### Complete Project Directory Structure
```text
AI4Devs-tdd-202602-Seniors/
├── README.md
├── package.json
├── docker-compose.yml
├── .env
├── .env.example
├── _bmad/
├── _bmad-output/
│   ├── project-context.md
│   ├── planning-artifacts/
│   │   ├── prd.md
│   │   ├── prd-validation-report.md
│   │   ├── ux-design-specification.md
│   │   └── architecture.md
│   └── implementation-artifacts/
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .eslintrc.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── server.ts
│   │   ├── app.ts
│   │   ├── routes/
│   │   │   ├── candidateRoutes.ts
│   │   │   ├── uploadRoutes.ts
│   │   │   └── index.ts
│   │   ├── presentation/
│   │   │   ├── controllers/
│   │   │   │   ├── candidateController.ts
│   │   │   │   ├── uploadController.ts
│   │   │   │   └── healthController.ts
│   │   │   ├── middleware/
│   │   │   │   ├── authMiddleware.ts
│   │   │   │   ├── errorMiddleware.ts
│   │   │   │   ├── requestContextMiddleware.ts
│   │   │   │   └── validationMiddleware.ts
│   │   │   └── dto/
│   │   │       ├── candidateDtos.ts
│   │   │       ├── uploadDtos.ts
│   │   │       └── errorDtos.ts
│   │   ├── application/
│   │   │   ├── services/
│   │   │   │   ├── candidateService.ts
│   │   │   │   ├── uploadService.ts
│   │   │   │   ├── candidateQueryService.ts
│   │   │   │   └── authzService.ts
│   │   │   └── validators/
│   │   │       ├── candidateValidator.ts
│   │   │       └── uploadValidator.ts
│   │   ├── domain/
│   │   │   ├── candidate/
│   │   │   │   ├── candidateTypes.ts
│   │   │   │   ├── candidateErrors.ts
│   │   │   │   └── candidatePolicies.ts
│   │   │   ├── upload/
│   │   │   │   ├── uploadTypes.ts
│   │   │   │   └── uploadErrors.ts
│   │   │   └── shared/
│   │   │       ├── errorCodes.ts
│   │   │       ├── resultTypes.ts
│   │   │       └── auditTypes.ts
│   │   ├── infrastructure/
│   │   │   ├── prisma/
│   │   │   │   ├── prismaClient.ts
│   │   │   │   └── repositories/
│   │   │   │       ├── candidateRepository.ts
│   │   │   │       └── uploadRepository.ts
│   │   │   ├── storage/
│   │   │   │   ├── fileStorage.ts
│   │   │   │   └── localFileStorage.ts
│   │   │   ├── logging/
│   │   │   │   └── logger.ts
│   │   │   └── config/
│   │   │       ├── env.ts
│   │   │       └── constants.ts
│   │   ├── docs/
│   │   │   └── swagger.ts
│   │   └── tests/
│   │       ├── integration/
│   │       │   ├── candidateRoutes.test.ts
│   │       │   └── uploadRoutes.test.ts
│   │       ├── services/
│   │       │   ├── candidateService.test.ts
│   │       │   └── uploadService.test.ts
│   │       ├── fixtures/
│   │       │   ├── candidateFixtures.ts
│   │       │   └── uploadFixtures.ts
│   │       └── helpers/
│   │           └── testApp.ts
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── public/
│   └── src/
│       ├── index.tsx
│       ├── App.tsx
│       ├── routes/
│       │   ├── AppRouter.tsx
│       │   └── routeConfig.tsx
│       ├── pages/
│       │   ├── CandidateIntakePage.tsx
│       │   ├── CandidateDetailPage.tsx
│       │   ├── CandidateListPage.tsx
│       │   └── ErrorStatePage.tsx
│       ├── components/
│       │   ├── layout/
│       │   ├── shared/
│       │   └── candidate/
│       │       ├── CvUploadDropzone.tsx
│       │       ├── ExtractionStatusGuidancePanel.tsx
│       │       ├── ConfidenceField.tsx
│       │       ├── ExtractionReviewSection.tsx
│       │       ├── RecoveryActionBar.tsx
│       │       └── FlowProgressHeader.tsx
│       ├── services/
│       │   ├── apiClient.ts
│       │   ├── candidateService.ts
│       │   ├── uploadService.ts
│       │   └── errorMappingService.ts
│       ├── hooks/
│       │   ├── useCandidateIntake.ts
│       │   └── useRecoveryState.ts
│       ├── types/
│       │   ├── candidate.ts
│       │   ├── api.ts
│       │   └── uiState.ts
│       ├── utils/
│       │   ├── dateFormat.ts
│       │   └── accessibility.ts
│       ├── styles/
│       │   └── theme.css
│       └── tests/
│           ├── pages/
│           ├── components/
│           ├── services/
│           └── fixtures/
└── test-artifacts/
    ├── atdd/
    ├── test-design/
    └── traceability/
```

### Architectural Boundaries

**API Boundaries:**
- `backend/src/routes/` exposes HTTP endpoints only.
- `presentation/controllers/` translates HTTP requests/responses and delegates work.
- `application/services/` owns orchestration, validation coordination, transactions, and persistence workflows.
- `infrastructure/prisma/repositories/` and storage adapters are the data/IO boundary.
- Authentication and authorization checks happen at middleware + service policy boundaries.

**Component Boundaries:**
- `frontend/src/pages/` compose workflow-level screens.
- `frontend/src/components/candidate/` holds candidate-intake-specific UX components.
- `frontend/src/services/` owns backend communication and transport mapping.
- `frontend/src/hooks/` encapsulates reusable feature interaction logic, not raw API transport details.
- Components do not call backend endpoints directly.

**Service Boundaries:**
- `candidateService.ts` owns candidate aggregate write/read orchestration.
- `uploadService.ts` owns CV validation, storage abstraction, and metadata association.
- `candidateQueryService.ts` is the future-safe read/query boundary for list/search/filter expansion.
- `authzService.ts` centralizes role/policy checks instead of scattering them across controllers.

**Data Boundaries:**
- Prisma schema and migrations define the persistence contract.
- Repositories isolate Prisma access patterns.
- File storage is abstracted behind `storage/` so storage backend changes do not ripple through domain logic.
- No caching layer in MVP; data comes from PostgreSQL-backed reads and writes.

### Requirements to Structure Mapping

**Feature/Epic Mapping:**
- **Candidate Profile Management (`FR1`-`FR6`)**
  - Backend: `candidateService.ts`, `candidateController.ts`, candidate repository, DTOs, validators
  - Frontend: `CandidateIntakePage.tsx`, candidate services, candidate types, related component flows
- **Qualification Data (`FR7`-`FR12`)**
  - Backend: candidate aggregate orchestration + nested persistence logic
  - Frontend: review/edit sections and candidate form state hooks
- **CV/Document Handling (`FR13`-`FR18`)**
  - Backend: `uploadService.ts`, upload validators, storage adapters, upload routes/controller
  - Frontend: `CvUploadDropzone.tsx`, `RecoveryActionBar.tsx`, upload service
- **Validation & Error Handling (`FR19`-`FR24`)**
  - Backend: validation middleware, validators, error DTOs, error middleware
  - Frontend: error mapping service, confidence/recovery/status components
- **Workflow UX (`FR25`-`FR30`)**
  - Frontend: guided flow pages/components/hooks/theme/accessibility helpers
- **API Contract & Supportability (`FR31`-`FR41`)**
  - Backend: Swagger docs, request context middleware, logging, authz service, error taxonomy
  - Frontend: API client, error mapping, stable service contracts
- **Post-MVP Discovery & Expansion (`FR42`-`FR48`)**
  - Frontend: `CandidateListPage.tsx`, future dashboard/list views
  - Backend: `candidateQueryService.ts`, query-oriented repository methods, reporting-ready read models

**Cross-Cutting Concerns:**
- **Authentication/Authorization**
  - `presentation/middleware/authMiddleware.ts`
  - `application/services/authzService.ts`
  - frontend route guards or access-aware page composition as needed
- **Observability**
  - `requestContextMiddleware.ts`, `logging/logger.ts`, structured error payloads
- **Contract Sync**
  - `docs/swagger.ts`, DTOs, frontend `api.ts`/service mappings
- **Testing/TDD**
  - backend and frontend `tests/` plus `test-artifacts/` for broader BMAD test outputs

### Integration Points

**Internal Communication:**
- Frontend pages -> hooks/components -> services -> backend REST endpoints
- Backend routes -> controllers -> services -> repositories/storage adapters
- Shared error taxonomy and DTO conventions connect frontend/backend behavior

**External Integrations:**
- PostgreSQL through Prisma
- File storage through storage abstraction
- Swagger/OpenAPI as internal contract/documentation surface
- Future downstream exports/reporting via explicit adapter points, not embedded into core domain services yet

**Data Flow:**
1. User uploads CV / enters candidate data in frontend
2. Frontend service sends normalized `camelCase` payloads to REST API
3. Backend middleware/controller validates request shape and auth context
4. Service orchestrates candidate aggregate + upload metadata transaction
5. Repository/storage adapters persist data
6. Response returns deterministic success/error structure with traceable context
7. Frontend maps result into review/saved/retry-required UI states

### File Organization Patterns

**Configuration Files:**
- Root-level shared environment and orchestration files
- Backend-specific runtime/config under `backend/src/infrastructure/config/`
- Swagger config under `backend/src/docs/`
- Frontend theme and route config under `frontend/src/styles/` and `frontend/src/routes/`

**Source Organization:**
- Backend organized by boundary/layer with domain-aware subfolders
- Frontend organized by page/feature with services separated from rendering
- Shared domain concepts represented through typed files, not implicit object shapes

**Test Organization:**
- Backend tests grouped by level (`integration`, `services`, `fixtures`, `helpers`)
- Frontend tests grouped around pages/components/services
- Test fixtures centralized for deterministic candidate/upload cases
- Keep tests close enough to features to evolve safely, but inside stable package conventions

**Asset Organization:**
- Frontend static assets stay in `public/`
- Theme/style assets in `frontend/src/styles/`
- Candidate file uploads are not treated as app assets; they live behind backend storage abstraction

### Development Workflow Integration

**Development Server Structure:**
- Frontend and backend run as separate app surfaces against shared environment configuration and Docker-backed PostgreSQL.
- Services and boundaries are organized so story work can touch one behavior slice without cross-repo drift.

**Build Process Structure:**
- Backend build/type/lint/test runs independently from frontend checks.
- Contract/documentation updates are part of the same slice when API behavior changes.
- Prisma migrations/regeneration remain explicit backend workflow steps.

**Deployment Structure:**
- Supports separate frontend/backend deployment with shared environment contracts.
- Keeps infrastructure simple for MVP while preserving clean seams for later hardening or scaling.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**  
The chosen architecture is coherent as a brownfield modular monolith. Express + TypeScript + Prisma + PostgreSQL align with the documented repo baseline, while React SPA + React Router + React Bootstrap align with both the current frontend reality and the UX direction. No core decision requires a contradictory runtime or deployment model. Version awareness is documented at the ecosystem level while preserving the repo's current implementation baseline, which is the correct brownfield stance.

**Pattern Consistency:**  
Implementation patterns support the architectural decisions cleanly. Validation-before-service, service-layer ownership, REST DTO conventions, `camelCase` API boundaries, explicit error taxonomy, and frontend service separation all reinforce the chosen stack and prevent agent drift. Naming, formatting, and process rules are aligned with the technical rules already established in `project-context.md`.

**Structure Alignment:**  
The proposed structure supports the architecture decisions and creates clear physical boundaries for routes, controllers, services, repositories, storage, docs, frontend services, hooks, pages, and feature components. The structure also leaves room for post-MVP query/read expansion without forcing premature complexity into the MVP candidate-intake path.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**  
No epics were loaded yet, so validation was performed against FR categories. The architecture supports MVP candidate intake, nested qualification persistence, upload handling, deterministic validation, supportability, and future post-MVP list/search/dashboard/lifecycle expansion.

**Functional Requirements Coverage:**  
All FR groups are covered:
- Candidate profile and qualification requirements map to candidate aggregate services and validators.
- CV/document requirements map to upload services, storage adapters, and recovery-aware frontend components.
- Validation/error requirements map to middleware, DTOs, error taxonomy, and frontend error-mapping flows.
- Workflow UX requirements map to guided intake pages, status panels, and recovery state handling.
- Contract/support requirements map to REST boundaries, Swagger docs, logging, and request correlation.
- Post-MVP discovery/reporting requirements map to query-service and list/dashboard expansion seams.

**Non-Functional Requirements Coverage:**  
All NFR categories are architecturally supported:
- **Performance:** service/repository boundaries, no-N+1 rule, future query service, staged optimization points.
- **Security:** auth middleware, authz service, upload validation, env-based secrets, controlled logging.
- **Reliability:** explicit error taxonomy, retry/recovery states, CI quality gates, regression-aware service boundaries.
- **Accessibility:** WCAG-aligned UI architecture, component rules, keyboard-first patterns.
- **Integration stability:** Swagger/DTO/service sync rules and shared contract boundaries.
- **Scalability:** modular monolith seams, query-service expansion path, storage abstraction, deferred cache/event choices.

### Implementation Readiness Validation ✅

**Decision Completeness:**  
Critical architectural decisions are documented clearly enough to guide implementation. The most important blocking choices, especially around validation placement, error model, service ownership, API style, and structural layering, are explicit.

**Structure Completeness:**  
The project structure is specific and implementation-guiding rather than generic. It identifies concrete folders, ownership boundaries, and responsibility splits for both frontend and backend.

**Pattern Completeness:**  
The highest-risk AI-agent conflict points are addressed: naming, validation location, transport format, error structure, test placement, upload boundaries, and frontend/backend responsibility split.

### Gap Analysis Results

**Critical Gaps:**  
- None identified that block implementation planning.

**Important Gaps:**  
- Concrete authentication provider/session mechanism is intentionally left adapter-level and should be selected in implementation planning if auth work enters MVP scope.
- Exact API response envelope shape could be made even more explicit in later implementation specs or story acceptance criteria.
- The architecture references candidate extraction-oriented UX, but if CV extraction itself implies OCR/AI parsing infrastructure beyond upload + review, that implementation boundary should be made explicit in epics/stories.

**Nice-to-Have Gaps:**  
- A short canonical error-response example block would help implementation consistency even more.
- A short DTO example for candidate create/update would improve handoff clarity.
- A future modernization note for CRA-era tooling migration could be tracked separately as a technical-enablement story.

### Validation Issues Addressed

- Brownfield safety concerns were addressed by selecting the existing repository as the architectural baseline instead of forcing a new starter.
- Prior PRD measurability and traceability issues were already mitigated and are reflected in the architecture assumptions.
- Potential AI-agent inconsistency points were addressed with explicit naming, layering, and error-handling patterns.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions/context
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Strong alignment with existing repo reality and brownfield safety rules
- Clear backend/frontend responsibility split
- Quality, validation, and supportability are first-class architectural concerns
- Architecture leaves clean seams for post-MVP growth without overengineering MVP
- Good fit for multi-agent BMAD execution because conflict points are explicitly constrained

**Areas for Future Enhancement:**
- Make auth/session mechanism explicit if auth becomes active scope
- Add canonical response/error DTO examples in implementation planning
- Add technical-enablement story for frontend tooling modernization only if justified by delivery friction

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and layer boundaries
- Treat contract synchronization, validation-before-persistence, and regression safety as mandatory

**First Implementation Priority:**  
Create epics and stories from this architecture, starting with the MVP candidate-intake path and technical-enablement tasks needed to enforce validation, error taxonomy, and regression-safe quality gates.
