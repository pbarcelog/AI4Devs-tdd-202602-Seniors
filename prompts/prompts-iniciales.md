# Developer ↔ agent prompts (session log)

## Rule

Whenever you use a **new prompt** that materially affects tests, backend behaviour, or how agents should work this repo, **append it to this file** (keep the newest entries at the bottom, or group by date). Short summaries are fine; paste the full prompt when it is the source of truth for a task.

---

## Prompt 1 — Jest unit suite for insert candidate (mission spec)

**Role and objective**  
You are a senior engineer applying TDD in an existing codebase. Your task is to design and implement a Jest unit-test suite for inserting candidates into the database, using only the project’s real code and layout (backend routes, controllers, services, validation, Prisma, other) to decide which tests actually matter.

**Functional scope**  
Cover the backend “create candidate” flow end-to-end in two layers: incoming data (what arrives from the client/form or HTTP layer) and persistence (how that becomes application logic and a database write). You do not need to build the feature from scratch if it already exists; the focus is a coherent test suite that matches the current implementation.

**Coverage requirement (minimum)**  
There must be two clear families of tests:

1. **Form / request data reception:** validation, DTO to application model mapping, bad input handling; whatever the code actually does.
2. **Database save:** service/repository invocation, shape of the persisted payload, successful create outcome; whatever the code actually does.

Each family must include at least one meaningful test, not an empty placeholder.

**Deliverables (exact paths and names)**

- Test file: `backend/src/tests/tests-iniciales.test.ts`.
- Prompts file: `prompts/prompts-iniciales.md`: file to document the interaction between the developer and the agent through prompts. Include a rule that updates this file with any relevant prompts and save this prompt as the first relevant one.

**Constraints**

- Use Jest and whatever the backend package already uses (TypeScript, ts-jest if present, etc.); do not introduce a different test runner unless the project already uses it there.
- Tests must live under `backend/src/tests` with the filename above.
- Prefer true unit tests: isolate layers (validator, service, controller with mocked collaborators) according to how the project is structured.

**Best practice**  
If a test would require hitting a real database, avoid it: mock the persistence boundary (e.g. Prisma client or a repository wrapper) so tests never mutate real data. Use Prisma’s official guidance on testing and mocking the client: https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o#mock-prisma-client

**Definition of done**  
Once the tests have been implemented, run them and check whether the output is positive. When the backend test command runs under fully implemented tests, this suite passes.

**Out of scope**  
Do not rely on BMAD or `_bmad-output`; the application code is the source of truth.

---

## Prompt 2 — (append next relevant prompt below)

_(None yet.)_

## Session notes

- **2026-04-19:** Implemented `backend/src/tests/tests-iniciales.test.ts` (validator reception + `addCandidate` persistence with mocked `@prisma/client`). Added `backend/jest.config.js` (`ts-jest`, `roots: src`). Ran `yarn test` in `backend/` — all tests passed.
