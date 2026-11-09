// @ts-nocheck
// "Infinite" 3D tunnel: for each cell we compute angle and depth (1/radius)
// and use them as texture coordinates. The flying illusion comes from shifting the texture over time.
import { useState } from "react"
import { useKeyboard } from "@gridland/utils"
import { createFrame, FrameView, useClock, hsl, putText, BLOCKS } from "../../src/lib/frame"
import { CELL_ASPECT } from "../../src/lib/math3d"

const PATTERNS = ["checker", "rings", "spiral"]

export function TunnelDemo({ width, height }) {
  const [paused, setPaused] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [pattern, setPattern] = useState(0)
  const t = useClock(30, paused)

  useKeyboard((e) => {
    if (e.name === "space") setPaused((p) => !p)
    if (e.name === "up") setSpeed((s) => Math.min(4, s + 0.25))
    if (e.name === "down") setSpeed((s) => Math.max(-2, s - 0.25))
    if (e.name === "p") setPattern((p) => (p + 1) % PATTERNS.length)
  })

  const f = createFrame(width, height)
  // the tunnel center wanders, like a camera taking turns
  const cx = width / 2 + Math.sin(t * 0.7) * width * 0.12
  const cy = height / 2 + Math.cos(t * 0.5) * height * 0.12
  const travel = t * speed * 1.4

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = (x - cx) / CELL_ASPECT
      const dy = y - cy
      const r = Math.sqrt(dx * dx + dy * dy) + 0.0001
      const ang = Math.atan2(dy, dx) / Math.PI // -1..1
      const depth = (height * 0.9) / r
      const u = depth + travel
      const v = ang * 6 + t * 0.2
      let val
      if (pattern === 0) val = ((Math.floor(u * 2) + Math.floor(v * 2)) & 1) ? 1 : 0.35
      else if (pattern === 1) val = 0.5 + 0.5 * Math.sin(u * 6)
      else val = 0.5 + 0.5 * Math.sin(u * 4 + v * Math.PI * 2)
      // darken with depth (fog)
      const fog = Math.min(1, r / (height * 0.6))
      const lum = val * fog
      const i = y * width + x
      if (lum < 0.06) continue
      f.chars[i] = BLOCKS[Math.min(4, 1 + Math.floor(lum * 4))]
      // quantized colors: fewer distinct colors = fewer <span>s per line
      const hue = Math.round((u * 0.05 + 0.55) * 24) / 24
      const light = Math.round((0.15 + lum * 0.45) * 12) / 12
      f.colors[i] = hsl(hue, 0.85, light)
    }
  }

  putText(f, 1, 0, `pattern: ${PATTERNS[pattern]}  speed ${speed.toFixed(2)}x`, "#6b6b8a")
  return <FrameView frame={f} />
}

export const tunnelHelp = [
  ["↑↓", "speed"],
  ["p", "pattern"],
  ["space", "pause"],
]
