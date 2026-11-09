// @ts-nocheck
// Solid 3D cube with a z-buffer and per-face lighting.
// Technique: sample points on each face, rotate them, project in perspective
// and keep only the closest point per cell (z-buffer).
import { useState } from "react"
import { useKeyboard } from "@gridland/utils"
import { createFrame, FrameView, useClock, palette, putText, RAMP } from "../../src/lib/frame"
import { rotate, dot, norm, CELL_ASPECT, type V3 } from "../../src/lib/math3d"

const FACES: { n: V3; u: V3; v: V3; pal: string[] }[] = [
  { n: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0], pal: palette(["#1a0b2e", "#ff4fd8", "#ffd6f6"]) },
  { n: [0, 0, -1], u: [1, 0, 0], v: [0, 1, 0], pal: palette(["#06202a", "#25d0ff", "#d8f7ff"]) },
  { n: [1, 0, 0], u: [0, 1, 0], v: [0, 0, 1], pal: palette(["#1f1400", "#ffb020", "#fff1cc"]) },
  { n: [-1, 0, 0], u: [0, 1, 0], v: [0, 0, 1], pal: palette(["#00200f", "#2bff88", "#d6ffe8"]) },
  { n: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1], pal: palette(["#250707", "#ff5a4f", "#ffe0dc"]) },
  { n: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1], pal: palette(["#0c0c2a", "#7b7bff", "#e2e2ff"]) },
]
const LIGHT = norm([-0.5, 0.8, -1])

export function CubeDemo({ width, height }) {
  const [paused, setPaused] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [zoom, setZoom] = useState(1)
  const t = useClock(30, paused) * speed

  useKeyboard((e) => {
    if (e.name === "space") setPaused((p) => !p)
    if (e.name === "up") setSpeed((s) => Math.min(4, s + 0.25))
    if (e.name === "down") setSpeed((s) => Math.max(0.25, s - 0.25))
    if (e.name === "+" || e.name === "=") setZoom((z) => Math.min(2, z + 0.1))
    if (e.name === "-") setZoom((z) => Math.max(0.4, z - 0.1))
  })

  const f = createFrame(width, height)
  const zbuf = new Float32Array(width * height)
  const cx = width / 2
  const cy = height / 2
  const scale = Math.min(width / CELL_ASPECT, height) * 1.25 * zoom
  const dist = 4.5
  const step = 2 / Math.max(24, Math.min(90, scale * 1.6))
  const ax = t * 0.7, ay = t * 1.0, az = t * 0.4

  for (const face of FACES) {
    const n = rotate(face.n, ax, ay, az)
    if (n[2] > 0.05) continue // face pointing away from the camera
    const lum = Math.max(0, dot(n, LIGHT)) * 0.7 + 0.3
    const ci = Math.min(15, Math.floor(lum * 15.99))
    const ch = RAMP[Math.min(RAMP.length - 1, 1 + Math.floor(lum * (RAMP.length - 1)))]
    for (let a = -1; a <= 1; a += step) {
      for (let b = -1; b <= 1; b += step) {
        const p: V3 = [
          face.n[0] + face.u[0] * a + face.v[0] * b,
          face.n[1] + face.u[1] * a + face.v[1] * b,
          face.n[2] + face.u[2] * a + face.v[2] * b,
        ]
        const r = rotate(p, ax, ay, az)
        const ooz = 1 / (r[2] + dist)
        const sx = Math.round(cx + r[0] * ooz * scale * CELL_ASPECT)
        const sy = Math.round(cy - r[1] * ooz * scale)
        if (sx < 0 || sy < 0 || sx >= width || sy >= height) continue
        const i = sy * width + sx
        if (ooz > zbuf[i]) {
          zbuf[i] = ooz
          // face edges are brighter to give an outline
          const edge = Math.abs(a) > 0.95 || Math.abs(b) > 0.95
          f.chars[i] = edge ? "@" : ch
          f.colors[i] = edge ? face.pal[15] : face.pal[ci]
        }
      }
    }
  }

  putText(f, 1, 0, `speed ${speed.toFixed(2)}x${paused ? "  [paused]" : ""}`, "#6b6b8a")
  return <FrameView frame={f} />
}

export const cubeHelp = [
  ["space", "pause"],
  ["↑↓", "speed"],
  ["+/-", "zoom"],
]
