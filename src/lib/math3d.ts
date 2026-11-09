// Matemática 3D mínima usada pelas demos (sem dependências).
export type V3 = [number, number, number]

export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
export const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s]
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const len = (a: V3) => Math.sqrt(dot(a, a))
export const norm = (a: V3): V3 => {
  const l = len(a) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}

/** Rotaciona um ponto em torno dos eixos X, Y e Z (nessa ordem). */
export function rotate(p: V3, ax: number, ay: number, az: number): V3 {
  let [x, y, z] = p
  let c = Math.cos(ax), s = Math.sin(ax)
  ;[y, z] = [y * c - z * s, y * s + z * c]
  c = Math.cos(ay); s = Math.sin(ay)
  ;[x, z] = [x * c + z * s, -x * s + z * c]
  c = Math.cos(az); s = Math.sin(az)
  ;[x, y] = [x * c - y * s, x * s + y * c]
  return [x, y, z]
}

/**
 * Células do terminal são ~2x mais altas que largas.
 * Multiplicamos X por este fator na projeção para as formas não ficarem achatadas.
 */
export const CELL_ASPECT = 2
