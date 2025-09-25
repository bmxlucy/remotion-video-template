# Agent Guidelines for Remotion Video Template

## Build/Test Commands

- **Dev server**: `npm run dev` (Remotion Studio)
- **Build**: `npm run build`
- **Lint & TypeCheck**: `npm run lint` (runs eslint + tsc)
- **Batch render**: `npm run render -- --data="./dataset/*.json"`
- **Single render**: `npx remotion render VideoTemplate out/video.mp4 --props='{...}'`

## Code Style

- **Formatting**: Prettier with 2-space tabs, bracket spacing
- **TypeScript**: Strict mode, noUnusedLocals, react-jsx
- **Imports**: React first, then Remotion, then zod/types, then relative imports
- **Props**: Use `readonly` for component props, destructure in parameters
- **Types**: Use Zod schemas for data validation, React.FC for components
- **Styling**: Inline CSS objects with camelCase, extract to constants when reused
- **Naming**: PascalCase components, camelCase props/variables, SCREAMING_SNAKE constants
- **Animation**: Use Remotion's `spring()` with fps/frame/delay pattern
- **Files**: Group related components in folders, export from index.tsx

## Project Structure

- `src/VideoTemplate/` - Main template components
- `dataset/` - JSON data files for batch rendering
- `scripts/` - Rendering scripts
