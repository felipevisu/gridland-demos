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
        {[
          ["sidebar", "#25d0ff", "#0b2a33"],
          ["content", "#7ee787", "#0f2a14"],
          ["details", "#ffd93d", "#2e2708"],
        ].map(([t, color, bg]) => (
          <box
            key={t}
            border
            borderStyle="heavy"
            borderColor={color}
            backgroundColor={bg}
            title={` ${t} `}
            titleAlignment="center"
            flexGrow={t === "content" ? 2 : 1}
            flexBasis={0}
            justifyContent="center"
            alignItems="center"
          >
            <text>
              <span style={{ fg: color, bold: true }}>{t}</span>
              <span style={{ fg: "#e6edf3" }}>{t === "content" ? "  flexGrow={2}" : "  flexGrow={1}"}</span>
            </text>
          </box>
        ))}
      </box>
      <text fg="#8b949e">resize the window to see the layout change</text>
    </box>
  )
}
export const responsiveHelp = [["resize", "change layout"]]
