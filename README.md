# Slay CTF

Landing page for Slay CTF 2026, built with Next.js, Three.js (React Three Fiber) and GSAP.

## Run it

```bash
npm install
npm run dev
```

Check smoothness on a production build, because dev mode is much slower:

```bash
npm run build
npm start
```

## Update event details

Every event fact lives in `src/config/event.ts`. Change it there and the whole site follows.

## Structure

| Folder | Holds |
| --- | --- |
| `src/app` | Next.js routes, the root layout, global styles and the share image |
| `src/config` | Event facts |
| `src/sections` | One file per page section, in scroll order on `page.tsx` |
| `src/features/arena` | 3D scenes and the wrapper that mounts and pauses them |
| `src/features/story` | The scroll story: intro, core meter, chapters, finale and scroll scene helper |
| `src/features/breach-game` | The Breach Simulator: puzzle rules and its interface |
| `src/features/terminal` | The in-page terminal and flag hunt |
| `src/components/layout` | Nav and footer |
| `src/components/motion` | Reusable motion: cursor, smooth scroll, magnetic buttons, text effects |
| `src/components/ui` | Shared building blocks such as section headings |

Sections compose features. Import files directly rather than through barrel files, so the heavy 3D code stays in its own lazy-loaded chunk.

## Performance notes

- 3D scenes load near the viewport, pause off screen, and lower their own quality if the frame rate drops.
- Avoid `backdrop-blur` and `mix-blend-mode` on anything that sits over the 3D canvas. Both make the browser recomposite the page every frame.
