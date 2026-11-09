// @ts-nocheck
// Shared demo infrastructure: a character + color "framebuffer",
// a component that draws it with Gridland's <text>/<span>, and an animation clock.
import { useEffect, useRef, useState } from "react"

/** Classic luminance ramp (dark → light). */
export const RAMP = " .,-~:;=!*#$@"
export const BLOCKS = " ░▒▓█"

export interface Frame {
  w: number
  h: number
  chars: string[]
  colors: (string | null)[]
}

export function createFrame(w: number, h: number): Frame {
  const n = Math.max(0, w * h)
  return { w, h, chars: new Array(n).fill(" "), colors: new Array(n).fill(null) }
}

export function put(f: Frame, x: number, y: number, ch: string, color: string | null) {
  x = x | 0
  y = y | 0
  if (x < 0 || y < 0 || x >= f.w || y >= f.h) return
  const i = y * f.w + x
  f.chars[i] = ch
  f.colors[i] = color
}

/** Writes text into the frame (handy for HUDs inside demos). */
export function putText(f: Frame, x: number, y: number, text: string, color: string) {
  for (let i = 0; i < text.length; i++) put(f, x + i, y, text[i], color)
}

/**
 * Draws the frame. Neighboring characters with the same color are grouped into a single <span>,
 * which greatly reduces the number of nodes the reconciler has to update each frame.
 */
export function FrameView({ frame }: { frame: Frame }) {
  const rows = []
  for (let y = 0; y < frame.h; y++) {
    const runs = []
    let start = 0
    let color = frame.colors[y * frame.w]
    let text = ""
    for (let x = 0; x < frame.w; x++) {
      const i = y * frame.w + x
      const c = frame.colors[i]
      if (c !== color) {
        runs.push(<span key={start} style={color ? { fg: color } : undefined}>{text}</span>)
        text = ""
        start = x
        color = c
      }
      text += frame.chars[i]
    }
    runs.push(<span key={start} style={color ? { fg: color } : undefined}>{text}</span>)
    rows.push(<text key={y}>{runs}</text>)
  }
  return <box flexDirection="column">{rows}</box>
}

/** Animation clock: returns time in seconds and re-renders ~fps times per second. */
export function useClock(fps = 30, paused = false) {
  const [, force] = useState(0)
  const tRef = useRef(0)
  const lastRef = useRef(Date.now())
  useEffect(() => {
    lastRef.current = Date.now()
    const id = setInterval(() => {
      const now = Date.now()
      if (!paused) tRef.current += (now - lastRef.current) / 1000
      lastRef.current = now
      force((n) => (n + 1) % 1_000_000)
    }, 1000 / fps)
    return () => clearInterval(id)
  }, [fps, paused])
  return tRef.current
}

// ---------- colors ----------

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const hex2 = (v: number) => Math.round(clamp01(v) * 255).toString(16).padStart(2, "0")

export function rgb(r: number, g: number, b: number) {
  return "#" + hex2(r) + hex2(g) + hex2(b)
}

export function hsl(h: number, s: number, l: number) {
  h = ((h % 1) + 1) % 1
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h * 12) % 12
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }
  return rgb(f(0), f(8), f(4))
}

/** Builds a palette of `steps` colors interpolated between the given stops (hex). */
export function palette(stops: string[], steps = 16): string[] {
  const parsed = stops.map((s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16) / 255))
  const out = []
  for (let i = 0; i < steps; i++) {
    const t = (i / (steps - 1)) * (parsed.length - 1)
    const k = Math.min(Math.floor(t), parsed.length - 2)
    const u = t - k
    const a = parsed[k]
    const b = parsed[k + 1]
    out.push(rgb(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u))
  }
  return out
}

/** Picks a character and color for a 0..1 luminance. */
export function shade(lum: number, pal: string[], ramp = RAMP): [string, string] {
  const l = clamp01(lum)
  const ch = ramp[Math.min(ramp.length - 1, 1 + Math.floor(l * (ramp.length - 1)))]
  const col = pal[Math.min(pal.length - 1, Math.floor(l * pal.length))]
  return [ch, col]
}
