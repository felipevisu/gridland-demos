// @ts-nocheck
// Exemplo de UI "de verdade": um monitor de sistema com layout flexbox,
// bordas com título, barras, sparklines, tabela navegável e um log que rola.
// Mostra os primitivos <box>, <text> e <span> sem nenhuma biblioteca extra.
import { useEffect, useRef, useState } from "react"
import { useKeyboard } from "@gridland/utils"

const C = {
  border: "#3b3b5c",
  focus: "#8a7dff",
  muted: "#6b6b8a",
  text: "#d9d9f0",
  ok: "#2bff88",
  warn: "#ffb020",
  bad: "#ff4f6d",
  accent: "#25d0ff",
}
const SPARK = "▁▂▃▄▅▆▇█"

const PROCS = [
  { name: "gridland-web", user: "felipe" },
  { name: "vite", user: "felipe" },
  { name: "bun", user: "felipe" },
  { name: "postgres", user: "db" },
  { name: "redis-server", user: "db" },
  { name: "nginx", user: "root" },
  { name: "node", user: "felipe" },
  { name: "docker", user: "root" },
]
const LOGS = [
  "GET /api/health 200 3ms",
  "cache miss: user:42",
  "job sync-repos concluído",
  "nova conexão ws de 10.0.0.12",
  "GET /r/table.json 200 12ms",
  "aviso: fila acima de 80%",
  "deploy v0.4.3 ok",
  "POST /api/chat 201 140ms",
]

const walk = (v: number, lo = 0, hi = 100, step = 12) =>
  Math.max(lo, Math.min(hi, v + (Math.random() - 0.5) * step))
const levelColor = (v: number) => (v > 80 ? C.bad : v > 55 ? C.warn : C.ok)

function Bar({ label, value, width }) {
  const w = Math.max(4, width)
  const filled = Math.round((value / 100) * w)
  return (
    <text>
      <span style={{ fg: C.muted }}>{label.padEnd(5)}</span>
      <span style={{ fg: levelColor(value) }}>{"█".repeat(filled)}</span>
      <span style={{ fg: C.border }}>{"░".repeat(w - filled)}</span>
      <span style={{ fg: C.text }}>{` ${value.toFixed(0).padStart(3)}%`}</span>
    </text>
  )
}

function Sparkline({ data, color }) {
  const max = Math.max(1, ...data)
  return <text style={{ fg: color }}>{data.map((d) => SPARK[Math.min(7, Math.floor((d / max) * 7.99))]).join("")}</text>
}

function Panel({ title, children, focused = false, ...rest }) {
  return (
    <box
      border
      borderStyle="rounded"
      borderColor={focused ? C.focus : C.border}
      title={` ${title} `}
      flexDirection="column"
      paddingX={1}
      {...rest}
    >
      {children}
    </box>
  )
}

export function DashboardDemo({ width, height }) {
  const [, tick] = useState(0)
  const s = useRef({
    cpus: [30, 50, 20, 70],
    mem: 48,
    net: Array(60).fill(0).map(() => Math.random() * 40),
    req: Array(60).fill(0).map(() => Math.random() * 40),
    procs: PROCS.map((p) => ({ ...p, cpu: Math.random() * 30, mem: Math.random() * 900 })),
    logs: [] as { time: string; msg: string }[],
  })
  const [sel, setSel] = useState(0)
  const [sortBy, setSortBy] = useState<"cpu" | "mem">("cpu")

  useEffect(() => {
    const id = setInterval(() => {
      const st = s.current
      st.cpus = st.cpus.map((v) => walk(v))
      st.mem = walk(st.mem, 20, 95, 4)
      st.net = [...st.net.slice(1), walk(st.net[st.net.length - 1], 0, 100, 30)]
      st.req = [...st.req.slice(1), walk(st.req[st.req.length - 1], 0, 100, 25)]
      st.procs = st.procs.map((p) => ({ ...p, cpu: walk(p.cpu, 0, 99, 8), mem: walk(p.mem, 20, 2000, 60) }))
      if (Math.random() < 0.35) {
        const d = new Date()
        st.logs = [
          ...st.logs,
          { time: d.toTimeString().slice(0, 8), msg: LOGS[Math.floor(Math.random() * LOGS.length)] },
        ].slice(-30)
      }
      tick((n) => n + 1)
    }, 400)
    return () => clearInterval(id)
  }, [])

  useKeyboard((e) => {
    if (e.name === "up") setSel((i) => Math.max(0, i - 1))
    if (e.name === "down") setSel((i) => Math.min(PROCS.length - 1, i + 1))
    if (e.name === "s") setSortBy((k) => (k === "cpu" ? "mem" : "cpu"))
  })

  const st = s.current
  const leftW = Math.max(30, Math.floor(width * 0.45))
  const barW = leftW - 16
  const sparkW = Math.max(10, leftW - 4)
  const procs = [...st.procs].sort((a, b) => b[sortBy] - a[sortBy])
  const logRows = Math.max(3, height - 14)

  return (
    <box flexDirection="row" width={width} height={height} gap={1}>
      <box flexDirection="column" width={leftW} gap={0}>
        <Panel title="CPU">
          {st.cpus.map((v, i) => <Bar key={i} label={`cpu${i}`} value={v} width={barW} />)}
        </Panel>
        <Panel title="Memória">
          <Bar label="ram" value={st.mem} width={barW} />
        </Panel>
        <Panel title="Rede (Mb/s)">
          <Sparkline data={st.net.slice(-sparkW)} color={C.accent} />
          <Sparkline data={st.req.slice(-sparkW)} color={C.focus} />
          <text style={{ fg: C.muted }}>
            <span style={{ fg: C.accent }}>▆ </span>download  <span style={{ fg: C.focus }}>▆ </span>upload
          </text>
        </Panel>
      </box>
      <box flexDirection="column" flexGrow={1}>
        <Panel title={`Processos (ordenado por ${sortBy})`} focused>
          <text style={{ fg: C.muted, bold: true }}>{"  PROCESSO".padEnd(18) + "USUÁRIO".padEnd(9) + "CPU%".padStart(6) + "MEM MB".padStart(9)}</text>
          {procs.map((p, i) => {
            const active = PROCS[sel].name === p.name
            return (
              <text key={p.name} style={active ? { bg: "#2a2550" } : undefined}>
                <span style={{ fg: active ? C.focus : C.muted }}>{active ? "▸ " : "  "}</span>
                <span style={{ fg: C.text }}>{p.name.padEnd(16)}</span>
                <span style={{ fg: C.muted }}>{p.user.padEnd(9)}</span>
                <span style={{ fg: levelColor(p.cpu) }}>{p.cpu.toFixed(1).padStart(6)}</span>
                <span style={{ fg: C.text }}>{p.mem.toFixed(0).padStart(9)}</span>
              </text>
            )
          })}
        </Panel>
        <Panel title="Log" flexGrow={1}>
          {st.logs.slice(-logRows).map((l, i) => (
            <text key={i}>
              <span style={{ fg: C.muted }}>{l.time} </span>
              <span style={{ fg: l.msg.startsWith("aviso") ? C.warn : C.text }}>{l.msg}</span>
            </text>
          ))}
        </Panel>
      </box>
    </box>
  )
}

export const dashboardHelp = [
  ["↑↓", "processo"],
  ["s", "ordenar"],
]
