# Remotion Video Template

A 10s reusable short-video template that is fully parameterized and supports batch rendering, adapting to 9:16, 1:1, and 16:9 aspect ratios.

## Quick Start

```bash
git clone https://github.com/bmxlucy/remotion-video-template
cd remotion-video-template
npm install
npm run dev
```

## Rendering

**Single video:**

```bash
npx remotion render VideoTemplate out/video.mp4 --props='{"title":"Hello World","subTitle":"My first video","highlights":[{"text":"Amazing content","bgColor":"#7c3aed"}],"ratio":"9:16"}'
```

**Batch render from JSON files:**

```bash
npm run render -- --data='./dataset/*.json'
```

## Data Format

```json
{
  "title": "5 Tips to Hook Viewers",
  "subTitle": "Grow faster with smart editing",
  "highlights": [
    { "text": "Open with a bold claim", "bgColor": "#7c3aed" },
    { "text": "Show value immediately", "bgColor": "#059669" }
  ],
  "ratio": "9:16"
}
```

## Commands

- `npm run dev` - Development server
- `npm run build` - Build for production
- `npm run lint` - Lint and type check
- `npm run render -- --data="pattern"` - Batch render
