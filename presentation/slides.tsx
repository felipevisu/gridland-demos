// @ts-nocheck
// Gridland talk, rendered in the terminal by Gridland itself.
// Run: bun run presentation/slides.tsx  (or npm run slides)
// Each slide is a list of blocks, all shown at once.
import { useState } from "react"
import { createCliRenderer, createRoot } from "@gridland/bun"
import { useKeyboard, useTerminalDimensions } from "@gridland/utils"
import { DonutDemo } from "../demos/visual/donut"

const C = {
  bg: "#0b0f0c",
  green: "#7ee787",
  dim: "#8b949e",
  text: "#e6edf3",
  border: "#30363d",
  key: "#25d0ff",
  pink: "#ff7ab6",
  yellow: "#ffd93d",
  react: "#61dafb",
  opentui: "#ffb454",
  yoga: "#ff7ab6",
}

// color per project, used by every "who does it" tag
const WHO = { React: C.react, OpenTUI: C.opentui, Gridland: C.green, Yoga: C.yoga }

// ---------- building blocks ----------

const P = ({ children, fg = C.text }) => <text fg={fg}>{children}</text>
const Gap = () => <text> </text>
const Hi = ({ children, fg = C.green }) => <span style={{ fg, bold: true }}>{children}</span>
const Dim = ({ children }) => <span style={{ fg: C.dim }}>{children}</span>
const Bullet = ({ children }) => (
  <text>
    <span style={{ fg: C.green }}>{"› "}</span>
    {children}
  </text>
)
const Code = ({ title, lines, width }) => (
  <box border borderStyle="rounded" borderColor={C.border} title={title ? ` ${title} ` : undefined} paddingX={1} width={width} flexDirection="column">
    {lines.map((l, i) => (
      <text key={i} fg={l.trim().startsWith("//") || l.trim().startsWith("#") ? C.dim : C.text}>{l || " "}</text>
    ))}
  </box>
)
const Tag = ({ who, width = 10 }) => (
  <span style={{ fg: "#000000", bg: WHO[who], bold: true }}>{` ${who} `.padEnd(width)}</span>
)
const Layer = ({ who, what, lines }) => (
  <box border borderStyle="rounded" borderColor={WHO[who]} flexDirection="column" paddingX={1} marginBottom={1}>
    <text>
      <Tag who={who} /> <Dim>{what}</Dim>
    </text>
    {lines.map((l, i) => <P key={i}>{l}</P>)}
  </box>
)
const Compare = ({ rows }) => (
  <box flexDirection="column">
    <text>
      <Dim>{"".padEnd(16)}</Dim>
      <Hi fg={C.dim}>{"React on the web".padEnd(28)}</Hi>
      <Hi>{"React with Gridland".padEnd(42)}</Hi>
      <Dim>who</Dim>
    </text>
    {rows.map(([label, web, here, who]) => (
      <text key={label}>
        <Dim>{label.padEnd(16)}</Dim>
        <span style={{ fg: C.dim }}>{web.padEnd(28)}</span>
        <span style={{ fg: C.text }}>{here.padEnd(42)}</span>
        <Tag who={who} />
      </text>
    ))}
  </box>
)
const Step = ({ n, who, title, children }) => (
  <box flexDirection="row" gap={2} marginBottom={1} width="100%">
    <box flexDirection="column" width={22}>
      <text><Hi fg={WHO[who]}>{`${n}. ${title}`}</Hi></text>
      <text><Tag who={who} /></text>
    </box>
    <box flexGrow={1} flexShrink={1} minWidth={0}>
      <P>{children}</P>
    </box>
  </box>
)

// The live example on the "idea" slide: exactly the code shown next to it.
const COUNTER_CODE = [
  "function Counter() {",
  "  const [n, setN] = useState(0)",
  "  useKeyboard((e) => {",
  '    if (e.name === "space") setN(n + 1)',
  "  })",
  "  return (",
  '    <box border title="counter">',
  "      <text>pressed <b>{n}</b> times</text>",
  "    </box>",
  "  )",
  "}",
]
function Counter() {
  const [n, setN] = useState(0)
  useKeyboard((e) => {
    if (e.name === "space") setN((x) => x + 1)
  })
  return (
    <box border borderStyle="rounded" borderColor={C.green} title=" counter " paddingX={1} width={30}>
      <text>
        pressed <b>{n}</b> times
      </text>
    </box>
  )
}

// ---------- slides ----------

const SLIDES = [
  {
    title: "gridland",
    cover: true,
    blocks: [
      <>
        <ascii-font text="GRIDLAND" font="block" color={C.green} />
        <Gap />
        <P>
          <Hi>React</Hi> for the terminal, rendered by a real terminal UI engine.
        </P>
        <P fg={C.dim}>Open source · MIT · by Chris Roth & Jessica Cheng · github.com/thoughtfulllc/gridland</P>
      </>,
    ],
  },
  {
    title: "first, what is a TUI?",
    blocks: [
      <>
        <P>
          A <Hi>Terminal User Interface</Hi> is an app that draws a full interface inside the terminal:
          panels, lists, inputs, colors. Think htop, lazygit, vim, k9s.
        </P>
        <Gap />
      </>,
      <>
        <P>
          The terminal has no pixels and no DOM. It is a <Hi>grid of character cells</Hi>. Each cell holds:
        </P>
        <Gap />
        <box flexDirection="row" gap={2}>
          <box flexDirection="column">
            <text fg={C.border}>{"┌───┬───┬───┬───┐"}</text>
            <text>
              <span style={{ fg: C.border }}>│ </span><Hi>H</Hi><span style={{ fg: C.border }}> │ </span>
              <span style={{ fg: C.pink, bold: true }}>i</span><span style={{ fg: C.border }}> │ </span>
              <span style={{ fg: "#000", bg: C.yellow }}>!</span><span style={{ fg: C.border }}> │   │</span>
            </text>
            <text fg={C.border}>{"└───┴───┴───┴───┘"}</text>
          </box>
          <box flexDirection="column">
            <Bullet>one character</Bullet>
            <Bullet>a foreground color and a background color</Bullet>
            <Bullet>attributes: bold, italic, underline…</Bullet>
          </box>
        </box>
        <Gap />
      </>,
      <P fg={C.dim}>That's the whole canvas. Everything you'll see today is made of these cells.</P>,
    ],
  },
  {
    title: "why TUIs are hard",
    blocks: [
      <>
        <P>To paint one green "H" at row 5, column 12, you send the terminal bytes like:</P>
        <Gap />
        <Code lines={["\\x1b[5;12H\\x1b[38;2;126;231;135mH"]} width={44} />
        <P fg={C.dim}>"move the cursor to 5;12, set the color to RGB(126,231,135), print H"</P>
        <Gap />
      </>,
      <>
        <P>Now do that for a whole screen, 60 times per second, and also:</P>
        <Bullet>work out where every panel goes when the window is resized</Bullet>
        <Bullet>repaint only what changed, or the screen flickers</Bullet>
        <Bullet>decode raw keyboard and mouse bytes into "ctrl+c" or "click at 40,7"</Bullet>
        <Gap />
      </>,
      <P>
        Libraries like curses, Ink or Bubble Tea help, but the result <Hi>only lives in a terminal</Hi>.
      </P>,
    ],
  },
  {
    title: "the idea",
    blocks: [
      <>
        <P>
          Write the interface as <Hi>React components</Hi>. Layout is flexbox, state is hooks, input is a hook.
          Gridland and the engine under it take care of cells, colors, diffs and key decoding.
        </P>
        <Gap />
      </>,
      ({ contentW }) => (
        <box flexDirection="row" gap={3}>
          <Code title="Counter.tsx" lines={COUNTER_CODE} width={Math.min(48, Math.floor(contentW * 0.55))} />
          <box flexDirection="column" gap={1}>
            <P fg={C.dim}>this is running right now ↓ press space</P>
            <Counter />
          </box>
        </box>
      ),
    ],
  },
  {
    title: "who does what",
    blocks: [
      <>
        <P>Three projects stacked on top of each other. Each one has a clear job:</P>
        <Gap />
      </>,
      <Layer
        who="React"
        what="the library you already know"
        lines={[
          "Components, props, useState, useEffect, re-rendering when state changes. Nothing new here.",
          "Includes react-reconciler: React's official kit for targets other than the DOM (React Native uses the same idea).",
        ]}
      />,
      <Layer
        who="OpenTUI"
        what="the terminal UI engine"
        lines={[
          "The building blocks: Box, Text, Input, Select… (called renderables).",
          "Layout (using Yoga), painting characters into the grid, and a native core in Zig that talks to the terminal.",
          "Also the React binding: it tells React that <box> means \"create a Box\".",
        ]}
      />,
      <Layer
        who="Gridland"
        what="everything around it, so it runs anywhere"
        lines={[
          "The browser backend (@gridland/web), hooks that work in both places (@gridland/utils), focus handling,",
          "the component registry, create-gridland, Vite/Next.js plugins and compiling to a single binary.",
        ]}
      />,
    ],
  },
  {
    title: "same react, new target",
    blocks: [
      <>
        <P>If you know React on the web, you already know 80% of this. Only the layers under React change:</P>
        <Gap />
      </>,
      <Compare
        rows={[
          ["you write", "<div> <span>", "<box> <text>", "React"],
          ["React talks to", "React DOM", "OpenTUI's React binding", "OpenTUI"],
          ["it creates", "DOM nodes", "renderables (JS objects)", "OpenTUI"],
          ["layout by", "the browser's CSS engine", "Yoga (flexbox library)", "Yoga"],
          ["units", "pixels", "character cells", "OpenTUI"],
          ["shown by", "the browser", "terminal (OpenTUI) or canvas (Gridland)", "Gridland"],
        ]}
      />,
      <>
        <Gap />
        <P>
          <Hi fg={C.opentui}>{"<box>"}</Hi> and <Hi fg={C.opentui}>{"<text>"}</Hi> look like HTML tags, but they are not.
          They are OpenTUI components: the binding turns each one into a Box or Text object. Even in the browser
          there is no {"<box>"} in the page, only one {"<canvas>"} with everything drawn on it.
        </P>
        <Gap />
        <P>
          <Hi fg={C.yoga}>Yoga</Hi> is an open-source flexbox engine by Meta, the same one React Native uses.
          It is C++ compiled to WebAssembly. You give it "row, gap 1, grow"; it gives back x, y, width and height.
        </P>
      </>,
    ],
  },
  {
    title: "one frame, step by step",
    blocks: [
      <Step n="1" who="React" title="state changes">
        You press space, setN(n + 1) runs, React re-renders Counter and works out what changed. Exactly like on the web.
      </Step>,
      <Step n="2" who="OpenTUI" title="update the tree">
        Instead of touching DOM nodes, the binding updates the Text object inside the Box: new content "pressed 1 times".
      </Step>,
      <Step n="3" who="Yoga" title="layout">
        Every Box and Text gets a position and size in cells: "this border starts at column 4, row 2, is 30 wide".
      </Step>,
      <Step n="4" who="OpenTUI" title="paint">
        Not a library, just a step: each renderable writes its characters and colors into the cell grid. A Box writes
        ╭─╮ border characters, a Text writes its letters.
      </Step>,
      <Step n="5" who="Gridland" title="show it">
        The grid reaches the screen. Terminal: OpenTUI's Zig core sends only the cells that changed. Browser: Gridland
        draws the grid on a canvas.
      </Step>,
    ],
  },
  {
    title: "the cell buffer",
    blocks: [
      <>
        <P>The contract between "your app" and "the screen" is a few flat typed arrays, one slot per cell:</P>
        <Gap />
        <Code
          lines={[
            "char       Uint32Array        codepoint of each cell",
            "fg         Float32Array × 4   foreground RGBA",
            "bg         Float32Array × 4   background RGBA",
            "attributes Uint32Array        bit flags: bold, italic, underline…",
          ]}
          width={72}
        />
        <Gap />
      </>,
      <>
        <P>
          No objects per cell, no DOM. A 200×50 screen is just 10,000 slots, cheap to fill every frame
          and cheap to compare with the previous frame.
        </P>
        <Gap />
      </>,
      <P fg={C.dim}>
        Mouse clicks use a second grid of the same size, the hit grid, which stores which component owns each cell.
      </P>,
    ],
  },
  {
    title: "output 1: a real terminal",
    blocks: [
      <>
        <P>
          <Hi>@gridland/bun</Hi> loads OpenTUI's native core, written in <Hi>Zig</Hi>, through Bun's FFI
          (libopentui.dylib on this Mac).
        </P>
        <Gap />
      </>,
      <>
        <Bullet>keeps two buffers: the frame on screen and the next one</Bullet>
        <Bullet>diffs them and writes escape codes <Hi>only for the cells that changed</Hi></Bullet>
        <Bullet>switches to the alternate screen, so your shell is restored on exit</Bullet>
        <Bullet>parses keyboard and mouse input, including the modern kitty keyboard protocol</Bullet>
        <Gap />
      </>,
      <P fg={C.dim}>That's why the 3D demos stay smooth: most cells don't change between two frames.</P>,
    ],
  },
  {
    title: "output 2: a browser canvas",
    blocks: [
      <>
        <P>
          <Hi>@gridland/web</Hi> swaps the native core for JavaScript versions with the <Hi>same buffer layout</Hi>,
          so every OpenTUI component works unchanged.
        </P>
        <Gap />
      </>,
      <>
        <Bullet>measures the width of "M" in a monospace font to get the cell size</Bullet>
        <Bullet>paints runs of same-color cells with fillRect, then each character with fillText</Bullet>
        <Bullet>translates DOM keyboard and mouse events into the same key events the terminal produces</Bullet>
        <Gap />
      </>,
      <P>
        Result: one component tree, two backends. Gridland's own website is a Gridland app running this way.
      </P>,
    ],
  },
  {
    title: "what you build with",
    blocks: [
      <>
        <P><Hi>Components</Hi> <Dim>(lowercase JSX tags, like HTML)</Dim></P>
        <P fg={C.dim}>box · text · span · input · textarea · select · tab-select · scrollbox · ascii-font · code · markdown · diff</P>
        <Gap />
      </>,
      <>
        <P><Hi>Hooks</Hi> <Dim>(from @gridland/utils, work in both backends)</Dim></P>
        <P fg={C.dim}>useKeyboard · useTerminalDimensions · useOnResize · useTimeline · focus system with useInteractive</P>
        <Gap />
      </>,
      <>
        <P><Hi>A component registry</Hi> <Dim>(shadcn style)</Dim></P>
        <P fg={C.dim}>
          bunx create-gridland add spinner copies the component's source into your repo. You own it and edit it,
          instead of depending on a black-box package.
        </P>
        <Gap />
      </>,
      <>
        <P><Hi>Testing utilities</Hi> <Dim>render a component and assert on the captured cells</Dim></P>
      </>,
    ],
  },
  {
    title: "shipping it",
    blocks: [
      <>
        <P><Hi>As a CLI</Hi></P>
        <P fg={C.dim}>
          bun build --compile bundles your app and the Bun runtime into one executable. Users download a file and run it:
          no Node, no npm install.
        </P>
        <Gap />
      </>,
      <>
        <P><Hi>On the web</Hi></P>
        <P fg={C.dim}>Vite and Next.js plugins, so a terminal UI can live inside an existing site or docs page.</P>
        <Gap />
      </>,
      <>
        <P><Hi>Sandboxed</Hi></P>
        <P fg={C.dim}>Run a TUI in an isolated Docker container, straight from an npm package, a GitHub repo or a local folder.</P>
        <Gap />
      </>,
      <P>
        Good fits: <Hi>interactive docs</Hi>, a live demo of your CLI on its landing page, internal dashboards, chat-style AI tools.
      </P>,
    ],
  },
  {
    title: "live demo",
    demo: true,
    blocks: [
      <>
        <Code
          lines={[
            "# start a project",
            "bunx create-gridland my-app",
            "",
            "# official demos (also: gradient, chat)",
            "bunx @gridland/demo landing",
            "",
            "# this repo: one demo per feature",
            "npm run demo layout     # flexbox + borders",
            "npm run demo input      # text input",
            "npm run demo raymarch   # 3D in the terminal",
            "",
            "# ship a single binary",
            "bun build --compile src/cli.tsx --outfile my-app",
          ]}
        />
        <P fg={C.dim}>this donut → is a React component, ~70 lines of math</P>
      </>,
    ],
  },
  {
    title: "thanks",
    cover: true,
    blocks: [
      <>
        <ascii-font text="THANKS" font="block" color={C.green} />
        <Gap />
        <P fg={C.dim}>github.com/thoughtfulllc/gridland · gridland.io</P>
      </>,
    ],
  },
]

// ---------- deck ----------

function Deck({ onExit }) {
  const { width, height } = useTerminalDimensions()
  const [i, setI] = useState(0)
  const n = SLIDES.length

  useKeyboard((e) => {
    if (["right", "down", "l", "n", "return"].includes(e.name)) setI((x) => Math.min(n - 1, x + 1))
    else if (["left", "up", "h", "p", "backspace"].includes(e.name)) setI((x) => Math.max(0, x - 1))
    else if (e.name === "home") setI(0)
    else if (e.name === "end") setI(n - 1)
    else if (e.name === "q" || e.name === "escape") onExit()
  })

  const s = SLIDES[i]
  const innerH = Math.max(5, height - 4) // border box + progress + footer
  const demoW = s.demo ? Math.floor((width - 2) * 0.35) : 0
  const contentW = Math.min(width - 6 - demoW, 110)
  const progress = "━".repeat(Math.round(((i + 1) / n) * width))
  const blocks = s.blocks.map((b, k) => (
    <box key={k} flexDirection="column" width={s.cover ? undefined : contentW} alignItems={s.cover ? "center" : "flex-start"}>{typeof b === "function" ? b({ contentW }) : b}</box>
  ))

  return (
    <box flexDirection="column" width={width} height={height} backgroundColor={C.bg}>
      <box
        border
        borderStyle="rounded"
        borderColor={C.border}
        title={` ${i + 1}/${n} `}
        titleAlignment="right"
        width={width}
        height={innerH + 2}
        flexDirection="row"
        overflow="hidden"
      >
        <box flexGrow={1} flexDirection="column" justifyContent="center" alignItems="center">
          <box flexDirection="column" width={contentW} alignItems={s.cover ? "center" : "flex-start"}>
            {!s.cover && (
              <>
                <ascii-font text={s.title} font="tiny" color={C.green} />
                <Gap />
              </>
            )}
            {blocks}
          </box>
        </box>
        {s.demo && (
          <box width={demoW} height={innerH} overflow="hidden">
            <DonutDemo width={demoW} height={innerH} />
          </box>
        )}
      </box>
      <text fg={C.green}>{progress}</text>
      <text>
        <span style={{ fg: C.key, bold: true }}> ←/→</span>
        <span style={{ fg: C.dim }}> navigate </span>
        <span style={{ fg: C.border }}>│</span>
        <span style={{ fg: C.key, bold: true }}> q</span>
        <span style={{ fg: C.dim }}> quit </span>
      </text>
    </box>
  )
}

const renderer = await createCliRenderer({ exitOnCtrlC: true })
createRoot(renderer).render(
  <Deck
    onExit={() => {
      renderer.destroy()
      process.exit(0)
    }}
  />,
)
