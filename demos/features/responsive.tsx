// @ts-nocheck
// useTerminalDimensions: the layout reacts to the terminal/window size.
import { useTerminalDimensions } from "@gridland/utils"

export function ResponsiveDemo({ width, height }) {
  const term = useTerminalDimensions()
  const wide = width >= 70
  return (
    <box width={width} height={height} flexDirection="column" padding={1} gap={1}>
      <text>
        <span style={{ fg: "#8b949e" }}>terminal: </span>
        <span style={{ fg: "#25d0ff", bold: true }}>{`${term.width} × ${term.height}`}</span>
        <span style={{ fg: "#8b949e" }}>{`   layout: `}</span>
        <span style={{ fg: "#7ee787", bold: true }}>{wide ? "wide (row)" : "narrow (column)"}</span>
      </text>
      <box flexDirection={wide ? "row" : "column"} gap={1} flexGrow={1}>
        {["sidebar", "content", "details"].map((t) => (
          <box key={t} border borderStyle="rounded" borderColor="#3b3b5c" title={` ${t} `} flexGrow={t === "content" ? 2 : 1} />
        ))}
      </box>
      <text fg="#8b949e">resize the window to see the layout change</text>
    </box>
  )
}
export const responsiveHelp = [["resize", "change layout"]]
