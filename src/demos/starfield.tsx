// @ts-nocheck
// Campo de estrelas 3D (warp). Cada estrela é um ponto (x, y, z) que se aproxima da câmera;
// projetamos x/z e y/z na tela e desenhamos um rastro entre a posição anterior e a atual.
import { useRef, useState } from "react"
import { useKeyboard } from "@gridland/utils"
import { createFrame, put, FrameView, useClock, palette, putText } from "../lib/frame"
import { CELL_ASPECT } from "../lib/math3d"

const PAL = palette(["#1b1b3a", "#5d6bff", "#bfe3ff", "#ffffff"], 10)
const N = 420

function spawn(far = true) {
  return { x: (Math.random() - 0.5) * 20, y: (Math.random() - 0.5) * 12, z: far ? 10 + Math.random() * 10 : Math.random() * 20 }
}

export function StarfieldDemo({ width, height }) {
  const [paused, setPaused] = useState(false)
  const [warp, setWarp] = useState(1)
  const stars = useRef(Array.from({ length: N }, () => spawn(false)))
  const last = useRef(0)
  const t = useClock(30, paused)

  useKeyboard((e) => {
    if (e.name === "space") setPaused((p) => !p)
    if (e.name === "up") setWarp((w) => Math.min(6, w + 0.5))
    if (e.name === "down") setWarp((w) => Math.max(0.5, w - 0.5))
  })

  const dt = Math.min(0.1, t - last.current)
  last.current = t

  const f = createFrame(width, height)
  const cx = width / 2, cy = height / 2
  const fov = height * 0.6

  for (const s of stars.current) {
    const pz = s.z
    s.z -= dt * 6 * warp
    if (s.z < 0.3) Object.assign(s, spawn(true))
    const sx = cx + (s.x / s.z) * fov * CELL_ASPECT
    const sy = cy + (s.y / s.z) * fov
    if (sx < 0 || sy < 0 || sx >= width || sy >= height) { Object.assign(s, spawn(true)); continue }
    const bright = 1 - Math.min(1, s.z / 20)
    const col = PAL[Math.min(9, Math.floor(bright * 10))]
    // rastro: da posição antiga até a atual
    if (warp > 1.5 && pz > s.z) {
      const ox = cx + (s.x / pz) * fov * CELL_ASPECT
      const oy = cy + (s.y / pz) * fov
      const steps = Math.min(30, Math.ceil(Math.max(Math.abs(sx - ox), Math.abs(sy - oy))))
      for (let k = 0; k < steps; k++) {
        const u = k / steps
        put(f, ox + (sx - ox) * u, oy + (sy - oy) * u, "·", PAL[Math.max(0, Math.floor(bright * 6))])
      }
    }
    put(f, sx, sy, bright > 0.8 ? "@" : bright > 0.55 ? "*" : bright > 0.3 ? "+" : ".", col)
  }

  putText(f, 1, 0, `warp ${warp.toFixed(1)}${paused ? "  [pausado]" : ""}`, "#6b6b8a")
  return <FrameView frame={f} />
}

export const starfieldHelp = [
  ["↑↓", "warp"],
  ["espaço", "pausar"],
]
