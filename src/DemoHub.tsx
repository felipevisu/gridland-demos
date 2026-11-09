// @ts-nocheck
// Shell compartilhado: abas no topo, a demo ativa no meio e uma barra de atalhos embaixo.
// Este arquivo é usado tanto pelo navegador (App.tsx) quanto pelo terminal (cli.tsx).
import { useState } from "react"
import { useKeyboard, useTerminalDimensions } from "@gridland/utils"
import { CubeDemo, cubeHelp } from "./demos/cube"
import { DonutDemo, donutHelp } from "./demos/donut"
import { RaymarchDemo, raymarchHelp } from "./demos/raymarch"
import { TunnelDemo, tunnelHelp } from "./demos/tunnel"
import { TerrainDemo, terrainHelp } from "./demos/terrain"
import { StarfieldDemo, starfieldHelp } from "./demos/starfield"
import { PlasmaDemo, plasmaHelp } from "./demos/plasma"
import { DashboardDemo, dashboardHelp } from "./demos/dashboard"

const DEMOS = [
  { id: "cube", title: "Cubo 3D", C: CubeDemo, help: cubeHelp },
  { id: "donut", title: "Donut 3D", C: DonutDemo, help: donutHelp },
  { id: "raymarch", title: "Ray Marching", C: RaymarchDemo, help: raymarchHelp },
  { id: "terrain", title: "Terreno", C: TerrainDemo, help: terrainHelp },
  { id: "tunnel", title: "Túnel", C: TunnelDemo, help: tunnelHelp },
  { id: "stars", title: "Estrelas", C: StarfieldDemo, help: starfieldHelp },
  { id: "plasma", title: "Plasma", C: PlasmaDemo, help: plasmaHelp },
  { id: "dashboard", title: "Dashboard", C: DashboardDemo, help: dashboardHelp },
]

const C = {
  bg: "#0f0f1a",
  border: "#3b3b5c",
  accent: "#8a7dff",
  muted: "#6b6b8a",
  text: "#d9d9f0",
  key: "#25d0ff",
}

export function DemoHub({ onExit, initial = 0 }: { onExit?: () => void; initial?: number }) {
  const { width, height } = useTerminalDimensions()
  const [index, setIndex] = useState(initial)

  useKeyboard((e) => {
    const n = DEMOS.length
    if (e.name === "tab" && e.shift) setIndex((i) => (i - 1 + n) % n)
    else if (e.name === "tab" || e.name === "]") setIndex((i) => (i + 1) % n)
    else if (e.name === "[") setIndex((i) => (i - 1 + n) % n)
    else if (/^[1-9]$/.test(e.name ?? "") && +e.name <= n) setIndex(+e.name - 1)
    else if ((e.name === "q" || e.name === "escape") && onExit) onExit()
  })

  const demo = DEMOS[index]
  const Demo = demo.C
  // layout: abas (1) + borda (2) + barra de atalhos (1)
  const innerW = Math.max(10, width - 2)
  const innerH = Math.max(5, height - 4)

  const help = [...demo.help, ["tab/1-8", "trocar demo"], ...(onExit ? [["q", "sair"]] : [])]

  return (
    <box flexDirection="column" width={width} height={height} backgroundColor={C.bg}>
      <text>
        <span style={{ fg: C.accent, bold: true }}> ▦ gridland </span>
        {DEMOS.map((d, i) => (
          <span
            key={d.id}
            style={i === index ? { fg: C.bg, bg: C.accent, bold: true } : { fg: C.muted }}
          >
            {` ${i + 1} ${d.title} `}
          </span>
        ))}
      </text>
      <box
        border
        borderStyle="rounded"
        borderColor={C.border}
        title={` ${demo.title} `}
        titleAlignment="center"
        width={width}
        height={innerH + 2}
        overflow="hidden"
      >
        <Demo key={demo.id} width={innerW} height={innerH} originX={1} originY={2} />
      </box>
      <text>
        {help.flatMap(([k, label], i) => [
          <span key={`k${i}`} style={{ fg: C.key, bold: true }}>{` ${k}`}</span>,
          <span key={`l${i}`} style={{ fg: C.muted }}>{` ${label} `}</span>,
          i < help.length - 1 ? <span key={`s${i}`} style={{ fg: C.border }}>│</span> : null,
        ])}
      </text>
    </box>
  )
}
