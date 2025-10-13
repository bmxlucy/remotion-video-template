# Commands

- **Dev**: `npm run dev` (Remotion Studio with live preview)
- **Build**: `npm run build` (bundles to `out/`)
- **Lint**: `npm run lint` (runs ESLint + TypeScript strict checks; **always run before committing**)
- **Format check**: `npx prettier --check "src/**/*.tsx"`
- **Render single**: `npx remotion render VideoTemplate out/demo.mp4 --props='{...}'`
- **Render batch**: `npm run render -- --data="./dataset/*.json"`
- **Tests**: No automated tests; validate via `npm run dev` and test renders for 9:16, 1:1, 16:9 ratios

# Code Style

- **TypeScript**: Strict mode enabled (`noUnusedLocals`, `strict`, `forceConsistentCasingInFileNames`); fix all `tsc` errors
- **Formatting**: 2-space indent, no tabs, bracket spacing; run Prettier before push
- **Imports**: Group by external → Remotion → local, alphabetize within groups
- **Naming**: PascalCase for components/composition IDs, camelCase for utils/props/variables, UPPER_SNAKE_CASE for constants
- **Types**: Use Zod schemas for composition props (`videoTemplateSchema`); infer types with `z.infer<typeof schema>`
- **React**: Functional components with `React.FC<T>`; use `useMemo`, `useRef` for perf; typed `CSSProperties` for inline styles
- **Error handling**: No explicit error boundaries; validate props via Zod at composition boundaries
- **Comments**: Minimal; use JSDoc for exported utils only if non-obvious

# Project Structure

- `src/VideoTemplate/`: Presentation components (Title, Subtitle, Highlight); constants live in `constants.ts`
- `src/hooks/`: Custom React hooks (useFitText, useLineSegments, useRenderBlocker)
- `src/utils/`: Shared helpers (colors, dimensions); keep composition logic out
- `scripts/`: Batch render automation; `dataset/`: JSON payloads
- Keep `out/` (rendered media) out of commits
