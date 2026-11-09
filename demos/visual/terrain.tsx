// @ts-nocheck
// Flight over a 3D wireframe terrain, synthwave style.
// A heightmap (sum of sines) is projected in perspective and connected with lines (Bresenham).
import { useState } from "react"
import { useKeyboard } from "@gridland/utils"
import { createFrame, put, FrameView, useClock, palette, putText } from "../../src/lib/frame"
import { CELL_ASPECT } from "../../src/lib/math3d"

const HEIGHT_PAL = palette(["#2b0a4a", "#ff2fa8", "#ffb347", "#fff6c2"], 12)
const SUN_PAL = palette(["#ff2f6d", "#ffcc33"], 8)

function heightAt(x: number, z: number) {
  return (
    Math.sin(x * 0.35 + z * 0.12) * 0.9 +
    Math.sin(x * 0.11 - z * 0.27) * 1.4 +
    Math.cos(x * 0.6 + z * 0.4) * 0.35
  ) * Math.min(1, Math.abs(x) / 3) // flat valley in the middle, like a road
}

function line(f, x0, y0, x1, y1, color) {
  x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0
  // pick the character by segment slope (cells are 2x taller)
  const ax = Math.abs(x1 - x0), ay = Math.abs(y1 - y0) * 2
  const ch = ay < ax * 0.5 ? "─" : ax < ay * 0.5 ? "│" : (x1 - x0) * (y1 - y0) > 0 ? "\\" : "/"
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0)
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1
  let err = dx + dy
  for (let n = 0; n < 400; n++) {
    put(f, x0, y0, ch, color)
    if (x0 === x1 && y0 === y1) break
    const e2 = 2 * err
    if (e2 >= dy) { err += dy; x0 += sx }
    if (e2 <= dx) { err += dx; y0 += sy }
  }
}

export function TerrainDemo({ width, height }) {
  const [paused, setPaused] = useState(false)
  const [speed, setSpeed] = useState(1)
  const t = useClock(30, paused)

  useKeyboard((e) => {
    if (e.name === "space") setPaused((p) => !p)
    if (e.name === "up") setSpeed((s) => Math.min(4, s + 0.25))
    if (e.name === "down") setSpeed((s) => Math.max(0.25, s - 0.25))
  })

  const f = createFrame(width, height)
  const horizon = Math.floor(height * 0.42)

  // striped sun
  const sunR = Math.min(height * 0.32, width / CELL_ASPECT * 0.2)
  const sunCx = width / 2
  for (let y = Math.ceil(horizon - sunR + 1); y < horizon; y++) {
    const dy = horizon - y
    const band = dy % 3 === 0 && dy < sunR * 0.55
    if (band) continue
    const halfW = Math.sqrt(Math.max(0, sunR * sunR - dy * dy)) * CELL_ASPECT
    const col = SUN_PAL[Math.min(7, Math.floor(((horizon - y) / sunR) * 8))]
    for (let x = Math.floor(sunCx - halfW); x <= sunCx + halfW; x++) put(f, x, y, "█", col)
  }

  const camZ = t * 4 * speed
  const camY = 2.2
  const fov = height * 0.9
  const COLS = 25, ROWS = 26, SPACING = 1
  const z0 = Math.floor(camZ)

  const proj = (wx: number, wz: number) => {
    const wy = heightAt(wx, wz)
    const rz = wz - camZ + 0.5
    if (rz <= 0.2) return null
    return [
      width / 2 + (wx / rz) * fov * CELL_ASPECT * 0.5,
      horizon + ((camY - wy) / rz) * fov * 0.5,
      wy,
    ]
  }

  // back to front, so closer lines overwrite distant ones
  for (let r = ROWS; r >= 0; r--) {
    const wz = z0 + r * SPACING
    let prev = null
    for (let c = -COLS / 2; c <= COLS / 2; c++) {
      const p = proj(c, wz)
      if (!p) { prev = null; continue }
      const hc = HEIGHT_PAL[Math.max(0, Math.min(11, Math.floor((p[2] + 1.5) / 4 * 12)))]
      if (prev) line(f, prev[0], prev[1], p[0], p[1], hc)
      const q = proj(c, wz + SPACING)
      if (q) line(f, p[0], p[1], q[0], q[1], hc)
      prev = p
    }
  }

  putText(f, 1, 0, `speed ${speed.toFixed(2)}x${paused ? "  [paused]" : ""}`, "#6b6b8a")
  return <FrameView frame={f} />
}

export const terrainHelp = [
  ["↑↓", "speed"],
  ["space", "pause"],
]
