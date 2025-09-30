# Repository Guidelines

## Project Structure & Module Organization

- Core source lives in `src/`; `Root.tsx` registers Remotion compositions and wires metadata.
- `src/VideoTemplate/` holds presentation components split by concern (`Title.tsx`, `Subtitle.tsx`, `Highlight.tsx`).
- Shared helpers live in `src/utils/` (colors, dimensions, `fitText` sizing logic) to keep compositions thin.
- Batch-render automation sits in `scripts/render-batch.ts`; sample payloads live in `dataset/` and can be duplicated per campaign.
- Bundled media is emitted to `out/`; keep rendered files out of commits.

## Build, Test, and Development Commands

- `npm run dev` launches Remotion Studio for live preview and prop tweaking.
- `npm run build` bundles the project for production playback under `out/`.
- `npm run render -- --data="./dataset/*.json"` batch-renders MP4 outputs using JSON props.
- `npx remotion render VideoTemplate out/demo.mp4 --props='{...}'` renders a single video for smoke checks.
- `npm run lint` runs the Remotion ESLint flat config and TypeScript strict-mode checks.

## Coding Style & Naming Conventions

- TypeScript with strict compiler settings is required; fix any new `tsc` diagnostics before submitting.
- Follow the Remotion ESLint flat config; run `npm run lint` locally and optionally `npx prettier --check "src/**/*.tsx"` before pushing.
- Use 2-space indentation, PascalCase for React components/composition IDs, and camelCase for utility exports and props.
- Keep composition-specific constants in `src/VideoTemplate/constants.ts`; share-only utilities belong in `src/utils/`.

## Testing Guidelines

- No automated test runner ships yet; validate UI flows via `npm run dev` and confirm final encodes with `npm run render`.
- Record the tested aspect ratios (9:16, 1:1, 16:9) in the PR description so reviewers know what was covered.
- If you add automated tests, co-locate them under `src/__tests__/` and extend `package.json` with a matching npm script.

## Commit & Pull Request Guidelines

- Use Conventional Commit prefixes (`feat:`, `fix:`, `chore:`) as seen in the git history for clear changelog context.
- Open PRs with a concise summary, linked issue (if any), and screenshots or rendered clips highlighting visual changes.
- Call out data shape updates and breaking API tweaks; flag required rerenders for downstream pipelines.
- Keep PRs scoped: prefer incremental changes over catch-all refactors to simplify review and rollback.
