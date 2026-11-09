// @ts-nocheck
// <select>: navigable list with descriptions, onChange and onSelect.
import { useState } from "react"

const OPTIONS = [
  { name: "Bun", description: "fast all-in-one JS runtime", value: "bun" },
  { name: "Node.js", description: "the classic", value: "node" },
  { name: "Deno", description: "secure by default", value: "deno" },
  { name: "Browser", description: "yes, Gridland runs here too", value: "web" },
]

export function SelectDemo({ width, height }) {
  const [hover, setHover] = useState(OPTIONS[0])
  const [picked, setPicked] = useState(null)

  return (
    <box width={width} height={height} flexDirection="row" padding={1} gap={2}>
      <box border borderStyle="rounded" borderColor="#4d96ff" title=" pick a runtime " width={40}>
        <select
          focused
          options={OPTIONS}
          flexGrow={1}
          onChange={(_, opt) => setHover(opt)}
          onSelect={(_, opt) => setPicked(opt)}
          selectedBackgroundColor="#4d96ff"
          selectedTextColor="#000000"
        />
      </box>
      <box flexDirection="column">
        <text><span style={{ fg: "#8b949e" }}>onChange → </span><span style={{ fg: "#e6edf3" }}>{hover?.name}</span></text>
        <text><span style={{ fg: "#8b949e" }}>onSelect → </span><span style={{ fg: "#7ee787", bold: true }}>{picked ? picked.name : "(press enter)"}</span></text>
      </box>
    </box>
  )
}
export const selectHelp = [["↑/↓", "navigate"], ["enter", "choose"]]
