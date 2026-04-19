---
project_name: 'AI4Devs-tdd-202602-Seniors'
user_name: 'PB'
date: '2026-04-16'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
existing_patterns_found: 9
status: 'complete'
rule_count: 68
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Backend Runtime:** Node.js (split root/back/front package setup)
- **Backend Framework:** `express@^4.19.2`
- **Backend Language:** `typescript@^4.9.5` (strict mode in backend tsconfig)
- **Backend ORM/DB Access:** `prisma@^5.13.0`, `@prisma/client@^5.13.0`
- **Database:** PostgreSQL (Docker Compose local setup)
- **Backend API Docs:** `swagger-jsdoc@^6.2.8`, `swagger-ui-express@^5.0.0`
- **Backend Uploads:** `multer@^1.4.5-lts.1`
- **Frontend Framework:** `react@^18.3.1`, `react-dom@^18.3.1`
- **Frontend Tooling:** `react-scripts@5.0.1` (Create React App)
- **Frontend Language Mix:** TypeScript config/entry + JavaScript components/services (`allowJs: true`)
- **Frontend Routing/UI:** `react-router-dom@^6.23.1`, `react-bootstrap@^2.10.2`, `bootstrap@^5.3.3`
- **Frontend Testing Libs:** `@testing-library/*` installed
- **Cross-cutting Env Config:** `dotenv@^16.4.5`
- **Version Constraint:** Keep `prisma` and `@prisma/client` versions aligned.

## Critical Implementation Rules

### Language-Specific Rules

- **TypeScript strictness is mandatory:** both backend and frontend use `strict: true`; avoid `any` and prefer explicit DTO/domain types.
- **Backend module style:** backend compiles/runs as CommonJS (`module: commonjs`); keep imports compatible with `esModuleInterop: true`.
- **Frontend mixed TS/JS reality:** frontend has `allowJs: true`; do not force TS migration inside feature work unless explicitly requested.
- **No emit from frontend TS:** frontend `tsconfig` uses `noEmit: true`; rely on CRA build pipeline, not direct `tsc` output files.
- **Async/error handling in backend:** route/controller layers must propagate typed validation/service errors to consistent HTTP responses.
- **Date and payload typing:** candidate/education/work-experience payloads include date fields; validate and normalize request types before persistence.
- **Prisma typing:** use generated Prisma types at service boundaries for DB writes/reads; avoid raw SQL unless clearly justified.
- **Path/casing consistency:** `forceConsistentCasingInFileNames` is enabled; keep import paths exact-case to prevent cross-platform breakage.

### Framework-Specific Rules

- **Express layering must stay explicit:** keep route definitions in `routes/`, request orchestration in `presentation/controllers/`, and business logic in `application/services/`.
- **Validation before service execution:** candidate endpoints validate request body shape and required fields before invoking services.
- **Prisma access boundary:** database operations belong in service layer, not in routes/controllers.
- **File upload handling:** keep multipart/CV upload logic isolated in upload services/utilities and enforce file type/path checks.
- **React app entry consistency:** frontend currently has both `App.tsx` and `App.js`; avoid introducing new parallel entry patterns.
- **Component responsibility:** UI components focus on rendering/forms; API calls stay in `frontend/src/services/*`.
- **Routing pattern:** use React Router v6 APIs consistently; avoid v5-era route patterns.
- **UI consistency:** prefer existing `react-bootstrap`/`bootstrap` stack over introducing a second UI framework.

### Testing Rules

- **Story-level requirement:** every non-trivial story includes automated tests for new behavior and regressions for bug fixes.
- **TDD loop is default:** write/adjust a failing test first (Red), implement minimum code to pass (Green), then refactor safely.
- **Backend test focus:** prioritize service-level and route-level integration tests for candidate creation, nested data persistence, and upload flows.
- **Frontend test focus:** test user-visible behavior (forms, validation feedback, submit flow, routing) over internal implementation details.
- **Boundary coverage:** include happy paths and validation/error paths (missing fields, invalid dates, invalid file types).
- **Test placement consistency:** keep tests co-located or in stable package-level conventions; avoid ad-hoc mixed patterns.
- **Mocking rule:** mock external boundaries (filesystem/network/third-party), not core domain logic being validated.
- **Deterministic data:** use stable fixtures/factories for candidate payloads; avoid brittle random/timestamp assertions unless controlled.
- **Quality gate:** changes should not reduce passing test baseline; when infra gaps block coverage, add missing test setup in the same story.
- **Standard local commands:** test automation must be runnable via package scripts (e.g., `npm test`/`yarn test`) in changed package(s).

### Code Quality & Style Rules

- **Backend lint/format baseline:** backend follows ESLint with Prettier integration (`plugin:prettier/recommended`); include lint/format fixes with the related change.
- **Type-first design:** prefer explicit interfaces/types for request DTOs, service inputs/outputs, and domain entities; avoid untyped object flows.
- **Folder boundary discipline:** preserve backend boundaries (`application`, `domain`, `presentation`, `routes`) and avoid cross-layer leakage.
- **Naming consistency:** keep domain terms (`Candidate`, `Education`, `WorkExperience`, `Resume`) consistent across API, services, and UI.
- **Service extraction rule:** if controller/component code mixes orchestration and business rules, extract business logic into service functions.
- **Comments policy:** comment only non-obvious decisions/constraints; avoid describing self-evident code.
- **Config-aware changes:** when behavior depends on env/config, update relevant docs/defaults (dotenv vars, Prisma references, API docs).
- **Small cohesive diffs:** keep changes scoped to one behavior/story to reduce regression risk and simplify review.

### Development Workflow Rules

- **BMAD-first flow:** for substantive work, follow `Create PRD -> Create Architecture -> Create Epics/Stories -> Sprint Planning -> Story Cycle`.
- **Story-driven implementation:** avoid broad coding without an active story scope and acceptance criteria.
- **TDD completion gate:** a story is not complete unless newly added/changed behavior has passing automated tests and those tests fail when behavior is removed.
- **Database change discipline:** Prisma schema changes include migration planning, client regeneration, and verification of candidate data flows.
- **API contract sync:** when backend request/response behavior changes, update API docs/spec and frontend service usage in the same story cycle.
- **Environment reproducibility:** keep local setup reproducible (Docker/Postgres + backend/frontend scripts) and document new env vars immediately.
- **Quality gate before completion:** run and pass relevant build/type/lint/test checks before marking a story done.
- **No hidden side-effects:** avoid mixing unrelated refactors with feature/bug stories unless explicitly approved.
- **Brownfield safety rule:** preserve existing behavior unless acceptance criteria explicitly require change; add regression checks for touched flows.

### Critical Don't-Miss Rules

- **Do not bypass validation paths:** never persist candidate input without validation and normalization first.
- **Do not break nested persistence contracts:** candidate flows may include education/work-experience/CV structures; keep handling backward compatible unless story says otherwise.
- **Do not introduce route/service coupling:** keep business and data access logic out of routes/controllers.
- **Do not drift frontend-backend contracts:** when API payload shape changes, update frontend service mapping in the same scoped change.
- **Do not leave upload surfaces weak:** enforce file type/size expectations and safe filename/path handling for CV uploads.
- **Do not mix app entry paradigms further:** since both `App.tsx` and `App.js` exist, do not add a third startup/routing root.
- **Do not ship silent failures:** surface async errors as explicit HTTP/UI feedback, not log-only handling.
- **Do not weaken test confidence:** for fixes add regression tests; for features add behavior tests before story closure.
- **Security baseline:** keep secrets in env vars; never hardcode credentials or DB connection strings in source.
- **Performance baseline:** avoid repeated DB calls in loops for candidate aggregates; prefer batched relational queries with Prisma.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code.
- Follow all rules unless acceptance criteria explicitly override them.
- Prefer stricter/safer interpretations when requirements are ambiguous.
- Update this file when new recurring patterns emerge.

**For Humans:**

- Keep this file lean and focused on non-obvious implementation rules.
- Update it whenever stack versions or architectural boundaries change.
- Review it periodically and remove rules that no longer provide unique value.

Last Updated: 2026-04-16
