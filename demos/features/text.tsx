// @ts-nocheck
// <text> + <span>/<b>/<i>/<u>: truecolor and attributes, like inline HTML.
export function TextDemo({ width, height }) {
  const n = Math.max(1, width - 4)
  return (
    <box width={width} height={height} flexDirection="column" padding={1} gap={1}>
      <text>
        <b>bold</b> <i>italic</i> <u>underline</u> <span style={{ fg: "#000", bg: "#ffd93d" }}> background </span>{" "}
        <span style={{ fg: "#ff6b6b", bold: true }}>colored bold</span>
      </text>
      <text>
        <span style={{ fg: "#8b949e" }}>{"<text>"}</span>
        <span style={{ fg: "#7ee787" }}>{"<span style={{ fg, bg, bold }}>"}</span>
        <span style={{ fg: "#e6edf3" }}>…</span>
        <span style={{ fg: "#7ee787" }}>{"</span>"}</span>
        <span style={{ fg: "#8b949e" }}>{"</text>"}</span>
      </text>
      <text>{Array.from({ length: n }, (_, i) => <span key={i} style={{ bg: hslHex(i, n) }}> </span>)}</text>
      <text fg="#8b949e">Text wraps automatically when it is longer than the box. Resize the window and watch this line reflow, no extra code needed.</text>
    </box>
  )
}

function hslHex(i, n) {
  const h = (i / n) * 6, x = 1 - Math.abs((h % 2) - 1)
  const [r, g, b] = [[1, x, 0], [x, 1, 0], [0, 1, x], [0, x, 1], [x, 0, 1], [1, 0, x]][Math.floor(h) % 6]
  return "#" + [r, g, b].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("")
}
export const textHelp = [["", "text styles"]]
