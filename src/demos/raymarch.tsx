// @ts-nocheck
// Ray marching em tempo real: cada célula do terminal dispara um raio numa cena
// descrita por funções de distância (SDF): esfera, toro girando e um chão xadrez.
// Tem luz difusa, especular e sombra suave. Mova a luz com as setas ou o mouse.
import { useRef, useState } from "react"
import { useKeyboard } from "@gridland/utils"
import { createFrame, FrameView, useClock, palette, putText, RAMP } from "../lib/frame"
import { CELL_ASPECT, norm, dot, sub, type V3 } from "../lib/math3d"

const PAL = {
  sphere: palette(["#12001f", "#7a2cff", "#c99bff", "#ffffff"]),
  torus: palette(["#1f0d00", "#ff7a1a", "#ffd08a", "#ffffff"]),
  floorA: palette(["#050a14", "#1e3a5f", "#5d8fc9"]),
  floorB: palette(["#050a14", "#14263d", "#33557d"]),
}

function sdTorus(p: V3, R: number, r: number) {
  const q = Math.sqrt(p[0] * p[0] + p[2] * p[2]) - R
  return Math.sqrt(q * q + p[1] * p[1]) - r
}

// devolve [distância, material]
function scene(p: V3, t: number): [number, number] {
  // esfera "respirando"
  const sy = Math.sin(t * 1.5) * 0.25
  const dS = Math.sqrt(p[0] * p[0] + (p[1] - sy) ** 2 + p[2] * p[2]) - 0.85
  // toro inclinado girando ao redor da esfera
  const a = t * 0.9, b = 0.6
  let x = p[0], y = p[1] - sy, z = p[2]
  ;[x, z] = [x * Math.cos(a) - z * Math.sin(a), x * Math.sin(a) + z * Math.cos(a)]
  ;[y, z] = [y * Math.cos(b) - z * Math.sin(b), y * Math.sin(b) + z * Math.cos(b)]
  const dT = sdTorus([x, y, z], 1.6, 0.22)
  const dF = p[1] + 1.25
  let d = dS, m = 1
  if (dT < d) { d = dT; m = 2 }
  if (dF < d) { d = dF; m = 3 }
  return [d, m]
}

function normal(p: V3, t: number): V3 {
  const e = 0.002
  return norm([
    scene([p[0] + e, p[1], p[2]], t)[0] - scene([p[0] - e, p[1], p[2]], t)[0],
    scene([p[0], p[1] + e, p[2]], t)[0] - scene([p[0], p[1] - e, p[2]], t)[0],
    scene([p[0], p[1], p[2] + e], t)[0] - scene([p[0], p[1], p[2] - e], t)[0],
  ])
}

function softShadow(p: V3, l: V3, t: number) {
  let res = 1, d = 0.05
  for (let i = 0; i < 18 && d < 6; i++) {
    const h = scene([p[0] + l[0] * d, p[1] + l[1] * d, p[2] + l[2] * d], t)[0]
    if (h < 0.002) return 0
    res = Math.min(res, (8 * h) / d)
    d += Math.max(0.05, h)
  }
  return Math.max(0, Math.min(1, res))
}

export function RaymarchDemo({ width, height, originX = 0, originY = 0 }) {
  const [paused, setPaused] = useState(false)
  const light = useRef({ az: -2.0, el: 0.8 })
  const orbit = useRef(0)
  const t = useClock(20, paused)

  useKeyboard((e) => {
    const L = light.current
    if (e.name === "space") setPaused((p) => !p)
    if (e.name === "left") L.az -= 0.2
    if (e.name === "right") L.az += 0.2
    if (e.name === "up") L.el = Math.min(1.5, L.el + 0.1)
    if (e.name === "down") L.el = Math.max(0.1, L.el - 0.1)
    if (e.name === "a") orbit.current -= 0.15
    if (e.name === "d") orbit.current += 0.15
  })

  const f = createFrame(width, height)
  const { az, el } = light.current
  const lightDir = norm([Math.cos(az) * Math.cos(el), Math.sin(el), Math.sin(az) * Math.cos(el)])

  // câmera orbitando lentamente
  const ca = orbit.current + t * 0.15
  const ro: V3 = [Math.sin(ca) * 3.8, 1.1, -Math.cos(ca) * 3.8]
  const fwd = norm(sub([0, 0, 0], ro))
  const right = norm([fwd[2], 0, -fwd[0]])
  // up = fwd × right
  const up: V3 = [
    fwd[1] * right[2] - fwd[2] * right[1],
    fwd[2] * right[0] - fwd[0] * right[2],
    fwd[0] * right[1] - fwd[1] * right[0],
  ]
  const half = height / 2

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = (x - width / 2) / CELL_ASPECT / half
      const v = -(y - half) / half
      const rd = norm([
        fwd[0] * 1.3 + right[0] * u + up[0] * v,
        fwd[1] * 1.3 + right[1] * u + up[1] * v,
        fwd[2] * 1.3 + right[2] * u + up[2] * v,
      ])
      let d = 0, m = 0
      for (let i = 0; i < 64; i++) {
        const p: V3 = [ro[0] + rd[0] * d, ro[1] + rd[1] * d, ro[2] + rd[2] * d]
        const [h, mat] = scene(p, t)
        if (h < 0.003) { m = mat; break }
        d += h
        if (d > 20) break
      }
      const idx = y * width + x
      if (!m) {
        // céu: um leve degradê com estrelas
        const star = ((x * 73856093) ^ (y * 19349663)) % 97 === 0
        f.chars[idx] = star ? "·" : " "
        f.colors[idx] = star ? "#3a3a5a" : null
        continue
      }
      const p: V3 = [ro[0] + rd[0] * d, ro[1] + rd[1] * d, ro[2] + rd[2] * d]
      const n = normal(p, t)
      const diff = Math.max(0, dot(n, lightDir))
      const sh = softShadow(p, lightDir, t)
      const h = norm(sub(lightDir, rd))
      const spec = m === 3 ? 0 : Math.pow(Math.max(0, dot(n, h)), 24)
      const fog = Math.exp(-0.012 * d * d)
      let lum = (0.18 + diff * sh * 0.8 + spec * sh * 0.6) * fog
      lum = Math.min(1, lum)
      let pal = m === 1 ? PAL.sphere : m === 2 ? PAL.torus : PAL.floorA
      if (m === 3 && (Math.floor(p[0]) + Math.floor(p[2])) & 1) pal = PAL.floorB
      f.chars[idx] = RAMP[Math.min(RAMP.length - 1, 1 + Math.floor(lum * (RAMP.length - 1)))]
      f.colors[idx] = pal[Math.min(pal.length - 1, Math.floor(lum * pal.length))]
    }
  }

  putText(f, 1, 0, `luz az ${az.toFixed(1)} el ${el.toFixed(1)}${paused ? "  [pausado]" : ""}`, "#6b6b8a")

  return (
    <box
      onMouseMove={(e) => {
        // o mouse vira a direção da luz (no navegador ou em terminais com mouse)
        const mx = (e.x - originX) / Math.max(1, width)
        const my = (e.y - originY) / Math.max(1, height)
        light.current.az = mx * Math.PI * 2
        light.current.el = 0.1 + (1 - my) * 1.4
      }}
    >
      <FrameView frame={f} />
    </box>
  )
}

export const raymarchHelp = [
  ["←→↑↓/mouse", "luz"],
  ["a/d", "câmera"],
  ["espaço", "pausar"],
]
