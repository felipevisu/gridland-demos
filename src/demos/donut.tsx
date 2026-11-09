// @ts-nocheck
// O clássico "donut.c" (Andy Sloane) reescrito em React + Gridland,
// com cor por luminância e paletas trocáveis.
import { useState } from "react"
import { useKeyboard } from "@gridland/utils"
import { createFrame, FrameView, useClock, palette, putText, RAMP } from "../lib/frame"
import { CELL_ASPECT } from "../lib/math3d"

const PALETTES = [
  { name: "sunset", pal: palette(["#2a0b1f", "#ff3d6e", "#ffb347", "#fff4d6"]) },
  { name: "oceano", pal: palette(["#03122b", "#1565ff", "#3df2ff", "#e9ffff"]) },
  { name: "matrix", pal: palette(["#021a05", "#11aa22", "#5cff6e", "#eaffea"]) },
  { name: "neon", pal: palette(["#14002b", "#8a2be2", "#ff2fd0", "#fff0ff"]) },
]

export function DonutDemo({ width, height }) {
  const [paused, setPaused] = useState(false)
  const [pi, setPi] = useState(0)
  const t = useClock(30, paused)

  useKeyboard((e) => {
    if (e.name === "space") setPaused((p) => !p)
    if (e.name === "c") setPi((i) => (i + 1) % PALETTES.length)
  })

  const { pal, name } = PALETTES[pi]
  const f = createFrame(width, height)
  const zbuf = new Float32Array(width * height)
  const A = t * 1.0
  const B = t * 0.5
  const cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(B), sB = Math.sin(B)
  const R1 = 1, R2 = 2, K2 = 5
  const K1 = Math.min(height, width / CELL_ASPECT) * K2 * 0.28

  // quanto maior a tela, mais densa a amostragem
  const dTheta = 0.07 * (40 / Math.max(40, height))
  const dPhi = 0.02 * (40 / Math.max(40, height))

  for (let theta = 0; theta < 6.283; theta += dTheta) {
    const ct = Math.cos(theta), st = Math.sin(theta)
    for (let phi = 0; phi < 6.283; phi += dPhi) {
      const cp = Math.cos(phi), sp = Math.sin(phi)
      const circleX = R2 + R1 * ct
      const circleY = R1 * st
      const x = circleX * (cB * cp + sA * sB * sp) - circleY * cA * sB
      const y = circleX * (sB * cp - sA * cB * sp) + circleY * cA * cB
      const z = K2 + cA * circleX * sp + circleY * sA
      const ooz = 1 / z
      const xp = Math.floor(width / 2 + K1 * ooz * x * CELL_ASPECT * 0.5)
      const yp = Math.floor(height / 2 - K1 * ooz * y * 0.5)
      if (xp < 0 || yp < 0 || xp >= width || yp >= height) continue
      const L = cp * ct * sB - cA * ct * sp - sA * st + cB * (cA * st - ct * sA * sp)
      const i = yp * width + xp
      if (ooz > zbuf[i]) {
        zbuf[i] = ooz
        const lum = Math.max(0, L) / 1.414
        f.chars[i] = RAMP[Math.min(RAMP.length - 1, 1 + Math.floor(lum * (RAMP.length - 1)))]
        f.colors[i] = pal[Math.min(pal.length - 1, 2 + Math.floor(lum * (pal.length - 2)))]
      }
    }
  }

  putText(f, 1, 0, `paleta: ${name}${paused ? "  [pausado]" : ""}`, "#6b6b8a")
  return <FrameView frame={f} />
}

export const donutHelp = [
  ["espaço", "pausar"],
  ["c", "paleta"],
]
