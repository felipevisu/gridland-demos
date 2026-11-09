// @ts-nocheck
// <scrollbox>: content taller than the screen, scrolled by keyboard and mouse.
const LINES = Array.from({ length: 100 }, (_, i) => i + 1)

export function ScrollDemo({ width, height }) {
  return (
    <box width={width} height={height} padding={1}>
      <scrollbox focused flexGrow={1} border borderStyle="rounded" borderColor="#c792ea" title=" 100 lines ">
        {LINES.map((n) => (
          <text key={n}>
            <span style={{ fg: "#6b6b8a" }}>{String(n).padStart(3, " ") + "  "}</span>
            <span style={{ fg: n % 10 === 0 ? "#c792ea" : "#e6edf3" }}>{`line ${n}${n % 10 === 0 ? "  ← every 10th" : ""}`}</span>
          </text>
        ))}
      </scrollbox>
    </box>
  )
}
export const scrollHelp = [["↑/↓", "scroll"]]
