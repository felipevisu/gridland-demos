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
const Who = ({ who, children }) => (
  <box flexDirection="row" gap={1} width="100%" marginBottom={1}>
    <text><Tag who={who} /></text>
    <box flexGrow={1} flexShrink={1} minWidth={0}>
      <P>{children}</P>
    </box>
  </box>
)
const Output = ({ who, title, pkg, children }) => (
  <box border borderStyle="rounded" borderColor={WHO[who]} title={` ${pkg} `} flexGrow={1} flexBasis={0} flexDirection="column" paddingX={1}>
    <text><Hi fg={WHO[who]}>{title}</Hi></text>
    <Gap />
    {children}
  </box>
)
const Panel = ({ title, color, children }) => (
  <box border borderStyle="rounded" borderColor={color} title={title} flexGrow={1} flexBasis={0} flexDirection="column" paddingX={1} paddingY={1} gap={1}>
    {children}
  </box>
)
const Item = ({ name, children }) => (
  <box flexDirection="column">
    <text><Hi>{name}</Hi></text>
    <P fg={C.dim}>{children}</P>
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
      <P>
        That's the whole canvas. And that's why terminal apps are hard to build: you{"'"}d have to manipulate the screen
        <Hi> cell by cell</Hi>, by hand, on every change.
      </P>,
    ],
  },
  {
    title: "the idea",
    blocks: [
      <>
        <P>
          With Gridland you write the interface as <Hi>React components</Hi>. No cell-by-cell drawing.
        </P>
        <Gap />
        <Who who="React">the library you already know: components, props, state, hooks, re-rendering.</Who>
        <Who who="OpenTUI">
          an open-source terminal UI engine. It does the hard part: building blocks (Box, Text, Input…), layout,
          drawing characters into the cells and talking to the terminal.
        </Who>
        <Who who="Gridland">
          wraps OpenTUI so the same app also runs in the browser, and adds portable hooks, a component registry,
          project templates and single-binary builds.
        </Who>
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
    title: "how it works",
    blocks: [
      <>
        <P>Follow one tiny example from your code to the screen:</P>
        <Gap />
        <box flexDirection="row" gap={2} alignItems="center">
          <Code lines={["<box border>", "  <text>hi</text>", "</box>"]} />
          <text fg={C.dim}>→</text>
          <Code lines={["Box  { border: true }", "└ Text { content: \"hi\" }"]} />
          <text fg={C.dim}>→</text>
          <Code lines={["Box   x0 y0  6×3", "Text  x2 y1  2×1"]} />
          <text fg={C.dim}>→</text>
          <box flexDirection="column">
            <text fg={C.green}>{"╭────╮"}</text>
            <text><span style={{ fg: C.green }}>{"│ "}</span><Hi fg={C.text}>hi</Hi><span style={{ fg: C.green }}>{" │"}</span></text>
            <text fg={C.green}>{"╰────╯"}</text>
          </box>
        </box>
        <Gap />
      </>,
      <Step n="1" who="React" title="render">
        You write {"<box>"} and {"<text>"}. When state changes, React re-renders, exactly like on the web.
      </Step>,
      <Step n="2" who="OpenTUI" title="one object per tag">
        There is no HTML here. For each tag, OpenTUI keeps a plain object that remembers its props: this Box has a
        border, this Text says "hi". It plays the role the DOM plays in a browser.
      </Step>,
      <Step n="3" who="Yoga" title="layout">
        Yoga, Meta's flexbox library (also used by React Native), decides where each object goes, measured in cells:
        the Box is 6 cells wide and 3 tall, the Text sits inside it.
      </Step>,
      <Step n="4" who="OpenTUI" title="turn into cells">
        OpenTUI asks every object to draw itself into the cell grid. The Box fills its edge cells with ╭ ─ ╮ │ ╰ ╯, the
        Text puts h and i in the next two cells. The result is just characters and colors, the grid from slide 2.
      </Step>,
      <Step n="5" who="Gridland" title="show">
        The grid goes to the terminal (only the cells that changed) or to a canvas in the browser.
      </Step>,
    ],
  },
  {
    title: "one grid, two screens",
    blocks: [
      <>
        <P>The last step is the only one that changes. The same grid of cells goes to:</P>
        <Gap />
        <box flexDirection="row" gap={2} width="100%">
          <Output who="OpenTUI" title="a terminal" pkg="@gridland/bun">
            <Bullet>native core written in Zig</Bullet>
            <Bullet>compares with the last frame</Bullet>
            <Bullet>sends only the changed cells</Bullet>
          </Output>
          <Output who="Gridland" title="a browser" pkg="@gridland/web">
            <Bullet>same engine, rewritten in JS</Bullet>
            <Bullet>draws each cell on a {"<canvas>"}</Bullet>
            <Bullet>turns browser keys into the same events</Bullet>
          </Output>
        </box>
        <Gap />
        <P fg={C.dim}>Your components never know which one they are running on.</P>
      </>,
    ],
  },
  {
    title: "build it, ship it",
    blocks: [
      <>
        <box flexDirection="row" gap={2} width="100%">
          <Panel title=" build with " color={C.green}>
            <Item name="components">box, text, input, select, tabs, scrollbox, ascii-font, markdown…</Item>
            <Item name="hooks">useKeyboard, useTerminalDimensions, focus, animations</Item>
            <Item name="registry">bunx create-gridland add spinner copies the source into your repo</Item>
            <Item name="tests">render a component, check the cells</Item>
          </Panel>
          <Panel title=" ship as " color={C.key}>
            <Item name="a binary">bun build --compile: one file, no Node or npm needed</Item>
            <Item name="a web page">Vite and Next.js plugins</Item>
            <Item name="a sandbox">run it in Docker from npm, GitHub or a folder</Item>
          </Panel>
        </box>
        <Gap />
        <P>
          Good fits: <Hi>interactive docs</Hi>, a live demo of your CLI on its website, dashboards, chat-style AI tools.
        </P>
      </>,
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
