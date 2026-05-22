# Skill Registry - lumora-frontend

## Compact Rules

### General
- Follow Conventional Commits.
- Use TypeScript for all new code.
- Prioritize components from `components/ui/` (Shadcn).
- Toda comunicación con el backend debe pasar por `lib/api.ts` (`apiService`).

### React/Next.js
- Use App Router (Next.js 15).
- Use React Hook Form + Zod for validation.
- Use Hooks in `hooks/` for business logic.

## User Skills

| Skill | Trigger | Location |
|-------|---------|----------|
| branch-pr | When creating a pull request, opening a PR, or preparing changes for review. | ~/.gemini/skills/branch-pr/ |
| go-testing | When writing Go tests, using teatest, or adding test coverage. | ~/.gemini/skills/go-testing/ |
| issue-creation | When creating a GitHub issue, reporting a bug, or requesting a feature. | ~/.gemini/skills/issue-creation/ |
| judgment-day | When user says "judgment day", "judgment-day", "review adversarial", "dual review". | ~/.gemini/skills/judgment-day/ |
| skill-creator | When user asks to create a new skill, add agent instructions, or document patterns for AI. | ~/.gemini/skills/skill-creator/ |
| skill-registry | When user says "update skills", "skill registry", "actualizar skills", "update registry", or after installing/removing skills. | ~/.gemini/skills/skill-registry/ |

## Project Conventions

- **Reference File**: `/Users/albertovazquez/Documents/lumora-project/GEMINI.md`
- **Frontend Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Radix UI, Firebase.
- **Form Pattern**: `react-hook-form` + `zod`.
- **API Pattern**: `lib/api.ts` (apiService).
