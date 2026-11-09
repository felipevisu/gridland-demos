# Gridland Demos

Demos built with [Gridland](https://github.com/thoughtfulllc/gridland). The **same React code**
runs in the browser (drawn on a `<canvas>`) and in the terminal. Each demo runs on its own, by name.

### Visual (`demos/visual/`)

| Name | What it shows |
|------|---------------|
| `cube` | Solid cube with perspective projection, z-buffer and per-face lighting |
| `donut` | The classic `donut.c` with luminance-based color (`c` switches the palette) |
| `raymarch` | 3D scene made of SDFs, with soft shadows and specular. The light follows the arrow keys or the mouse |
| `terrain` | Flight over a wireframe terrain, synthwave style |
| `tunnel` | Infinite tunnel via polar mapping (`p` switches the pattern) |
| `starfield` | 3D starfield with a warp effect (`↑` speeds up) |
| `plasma` | Classic demoscene effect with palettes |
| `dashboard` | A "real" UI: bordered panels, bars, sparklines, a table and a log |

### Gridland features, one per demo (`demos/features/`)

| Name | What it shows |
|------|---------------|
| `layout` | `<box>`: flexbox, `gap`, padding and the 4 border styles (`d` row/column, `+`/`-` gap) |
| `text` | `<text>`, `<span>`, `<b>`, `<i>`, `<u>`, colors, backgrounds and automatic wrapping |
| `keyboard` | `useKeyboard`: shows every key and modifier you press |
| `input` | `<input>` with `onInput`/`onSubmit` (a small to-do list) |
| `select` | `<select>` with descriptions, `onChange` and `onSelect` |
| `tabs` | `<tab-select>` |
| `font` | `<ascii-font>`: big titles (`f` cycles through the 7 fonts) |
| `responsive` | `useTerminalDimensions`: the layout changes with the window size |
| `scroll` | `<scrollbox>` with 100 lines |

## Running

```bash
npm install
bun install   # the terminal needs Bun: curl -fsSL https://bun.sh/install | bash
```

**In the terminal**

```bash
npm run demo            # list the demos
npm run demo donut      # run one demo (q quits; in the input demo, esc)
```

**In the browser**

```bash
npm run dev             # http://localhost:5173 lists the demos
                        # http://localhost:5173/?demo=donut opens one
```

**Presentation** (terminal slides, built with Gridland)

```bash
npm run slides          # ←/→ navigate, q quits
```

**Standalone binary** (runs without Node or Bun)

```bash
npm run compile
./gridland-demos donut
```

Each demo's shortcuts are shown in the bottom bar.

## Structure

```
src/
├── cli.tsx          terminal entry  (createCliRenderer from @gridland/bun)
├── main.tsx         browser entry   (<TUI> from @gridland/web, ?demo=<name>)
├── Runner.tsx       one demo full screen + shortcut bar, used by both entries
├── demos.ts         registry: name → component
└── lib/
    ├── frame.tsx    character/color framebuffer, <FrameView>, clock, palettes
    └── math3d.ts    vectors, rotation and cell aspect correction
demos/
├── visual/          3D demos and effects
└── features/        one Gridland feature per file
presentation/
└── slides.tsx       terminal presentation
```

## How the 3D demos work

They all follow the same pattern:

1. `useClock()` re-renders the component ~30 times per second and returns the time `t`.
2. The demo computes a `Frame` (one character and one color per cell) with plain JS math.
3. `<FrameView>` turns the frame into `<text>` lines and groups neighboring characters of the same
   color into a single `<span>`, which keeps the reconciler light.

One important detail: terminal cells are about 2x taller than they are wide. That's why the projection
multiplies X by `CELL_ASPECT = 2`; without it, everything looks squashed.

## Creating your own demo

```tsx
// demos/visual/my-demo.tsx
// @ts-nocheck
import { createFrame, FrameView, useClock, put } from "../../src/lib/frame"

export function MyDemo({ width, height }) {
  const t = useClock()
  const f = createFrame(width, height)
  const x = (Math.sin(t) * 0.5 + 0.5) * (width - 1)
  put(f, x, height / 2, "●", "#ff4fd8")
  return <FrameView frame={f} />
}
export const myDemoHelp = [["", "a ball bouncing back and forth"]]
```

Then register it in `DEMOS` in `src/demos.ts` and run it with `npm run demo my-demo`.

You can also install ready-made components from the Gridland registry:
`bunx create-gridland add spinner` (`components.json` is already configured).
