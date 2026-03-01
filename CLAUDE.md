# CLAUDE.md

This file provides guidance for AI assistants (Claude Code and similar tools) working in this repository.

## Repository Overview

**Name:** Claude
**Status:** Early-stage / bootstrapping
**Current content:** Minimal — a single `README.md` with a title placeholder.

This repository is set up and ready for development. The conventions below establish a baseline for how AI assistants should operate here as the codebase grows.

---

## Git Workflow

### Branch Naming

- Feature branches created by Claude Code follow the pattern:
  `claude/<task-slug>-<session-id>`
- Human-created branches should use descriptive names:
  `feature/<description>`, `fix/<description>`, `chore/<description>`
- The primary integration branch is `master`.

### Commit Conventions

- Write clear, imperative commit messages (e.g., "Add user authentication module").
- Keep commits focused — one logical change per commit.
- Do not skip pre-commit hooks (`--no-verify`) unless explicitly instructed.
- Do not amend published commits; create new commits instead.

### Pushing

- Always push with tracking: `git push -u origin <branch-name>`
- Branch names pushed by Claude Code must start with `claude/` and include the matching session ID or the push will fail.
- Retry on network failure with exponential backoff: 2s → 4s → 8s → 16s (max 4 retries).
- Never force-push to `master`.

### Pull Requests

- Open PRs targeting `master` unless otherwise specified.
- PR titles should be concise (under 70 characters).
- Include a short summary and a test plan in the PR body.

---

## Development Guidelines for AI Assistants

### General Principles

- **Read before editing.** Always read a file before modifying it.
- **Minimal changes.** Only change what is necessary for the task. Do not refactor surrounding code, add docstrings, or introduce abstractions beyond what is asked.
- **No speculative features.** Do not add logging, error handling, or configuration for hypothetical future scenarios.
- **No new files without cause.** Prefer editing existing files over creating new ones.
- **Security first.** Avoid introducing OWASP Top 10 vulnerabilities (SQLi, XSS, command injection, etc.). Fix any security issues immediately if discovered.

### Reversibility and Risk

Before taking any action that is hard to reverse or affects shared state, pause and confirm with the user:

- Deleting files or branches
- Force-pushing or resetting git history
- Dropping database tables or data
- Modifying CI/CD pipelines
- Sending messages or posting to external services

Local, reversible actions (editing files, running tests) can proceed without confirmation.

### Code Quality

- Keep solutions simple — the minimum complexity needed for the task.
- Three similar lines of code is better than a premature abstraction.
- Trust internal framework guarantees; only validate at system boundaries (user input, external APIs).
- Remove dead code completely rather than commenting it out or adding backwards-compatibility shims.

---

## Project Structure

The repository is currently empty beyond this file and `README.md`. As the project grows, this section should be updated to reflect:

```
/
├── CLAUDE.md          # This file — AI assistant guidance
├── README.md          # Human-facing project documentation
├── src/               # Application source code (to be created)
├── tests/             # Test suite (to be created)
└── ...
```

Update this section when directories are added.

---

## Development Commands

No build system or package manager is configured yet. Update this section as the project is built out.

| Command | Description |
|---------|-------------|
| *(none yet)* | *(to be defined)* |

---

## Testing

No test framework is configured yet. When tests are added:

- Document how to run the full test suite here.
- Document how to run a single test file.
- AI assistants should run tests after making changes and ensure they pass before committing.

---

## Environment and Configuration

No environment variables or configuration files are required at this time. When they are added:

- Document required variables and their purpose.
- Never commit secrets, credentials, or `.env` files.
- Provide a `.env.example` template for required variables.

---

## Keeping This File Updated

This `CLAUDE.md` should be updated whenever:

- A new technology, language, or framework is added to the project.
- Build, test, or deployment commands change.
- New coding conventions are established.
- The directory structure changes significantly.

AI assistants working in this repo should propose updates to this file as part of significant structural changes.
