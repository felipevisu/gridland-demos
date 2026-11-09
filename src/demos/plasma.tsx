// @ts-nocheck
// Plasma: efeito demoscene clássico. Somamos ondas senoidais e mapeamos o valor numa paleta.
import { useState } from "react"
import { useKeyboard } from "@gridland/utils"
import { createFrame, FrameView, useClock, palette, putText, BLOCKS } from "../lib/frame"

const PALETTES = [
  { name: "lava", pal: palette(["#0d0221", "#6a0572", "#ff3864", "#ffb563", "#fff3b0", "#ff3864", "#0d0221"], 24) },
  { name: "aurora", pal: palette(["#001219", "#005f73", "#0a9396", "#94d2bd", "#e9d8a6", "#0a9396", "#001219"], 24) },
  { name: "cyber", pal: palette(["#000000", "#ff00c8", "#00e5ff", "#fffb00", "#ff00c8", "#000000"], 24) },
]

export function PlasmaDemo({ width, height }) {
  const [paused, setPaused] = useState(false)
  const [pi, setPi] = useState(0)
  const t = useClock(30, paused)

  useKeyboard((e) => {
    if (e.name === "space") setPaused((p) => !p)
    if (e.name === "c") setPi((i) => (i + 1) % PALETTES.length)
  })

  const { pal, name } = PALETTES[pi]
  const f = createFrame(width, height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = x / 12, v = y / 6
      const val =
        Math.sin(u + t) +
        Math.sin((v + t) * 0.7) +
        Math.sin((u + v + t) * 0.5) +
        Math.sin(Math.sqrt((u - 4) ** 2 + (v - 3) ** 2) + t * 1.3)
      const n = (val + 4) / 8 // 0..1
      const i = y * width + x
      f.chars[i] = BLOCKS[1 + Math.floor(((n * 7) % 1) * 3.99)]
      f.colors[i] = pal[Math.floor(n * (pal.length - 1))]
    }
  }
  putText(f, 1, 0, ` paleta: ${name} `, "#ffffff")
  return <FrameView frame={f} />
}

export const plasmaHelp = [
  ["c", "paleta"],
  ["espaço", "pausar"],
]
