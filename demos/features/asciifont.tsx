// @ts-nocheck
// <ascii-font>: big titles drawn with block fonts.
import { useState } from "react"
import { useKeyboard } from "@gridland/utils"

const FONTS = ["tiny", "block", "shade", "slick", "huge", "grid", "pallet"]
const COLORS = ["#7ee787", "#25d0ff", "#ff6b6b", "#ffd93d", "#c792ea"]

export function AsciiFontDemo({ width, height }) {
  const [f, setF] = useState(1)
  useKeyboard((e) => {
    if (e.name === "f") setF((x) => (x + 1) % FONTS.length)
  })
  return (
    <box width={width} height={height} flexDirection="column" justifyContent="center" alignItems="center" gap={1}>
      <ascii-font text="GRIDLAND" font={FONTS[f]} color={COLORS[f % COLORS.length]} />
      <text fg="#8b949e">{`<ascii-font text="GRIDLAND" font="${FONTS[f]}" />`}</text>
    </box>
  )
}
export const asciiFontHelp = [["f", "switch font"]]
