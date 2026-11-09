// @ts-nocheck
// <box>: flexbox (Yoga) in the terminal: direction, gap, padding, borders and titles.
import { useState } from "react"
import { useKeyboard } from "@gridland/utils"

const STYLES = ["rounded", "single", "double", "heavy"]
const COLORS = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff"]

export function LayoutDemo({ width, height }) {
  const [row, setRow] = useState(true)
  const [gap, setGap] = useState(1)

  useKeyboard((e) => {
    if (e.name === "d") setRow((r) => !r)
    if (e.name === "+" || e.name === "=") setGap((g) => Math.min(6, g + 1))
    if (e.name === "-") setGap((g) => Math.max(0, g - 1))
  })

  return (
    <box width={width} height={height} flexDirection={row ? "row" : "column"} gap={gap} padding={1}>
      {STYLES.map((s, i) => (
        <box
          key={s}
          flexGrow={1}
          border
          borderStyle={s}
          borderColor={COLORS[i]}
          title={` ${s} `}
          titleAlignment="center"
          justifyContent="center"
          alignItems="center"
        >
          <text fg={COLORS[i]}>{`flexGrow={1}`}</text>
        </box>
      ))}
    </box>
  )
}
export const layoutHelp = [["d", "row/column"], ["+/-", "gap"]]
