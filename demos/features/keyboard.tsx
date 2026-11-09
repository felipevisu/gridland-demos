// @ts-nocheck
// useKeyboard: the same hook receives keys in the terminal and the browser.
import { useState } from "react"
import { useKeyboard } from "@gridland/utils"

export function KeyboardDemo({ width, height }) {
  const [log, setLog] = useState([])

  useKeyboard((e) => {
    const mods = [e.ctrl && "ctrl", e.meta && "meta", e.shift && "shift"].filter(Boolean)
    setLog((l) => [{ name: e.name || JSON.stringify(e.sequence), mods }, ...l].slice(0, Math.max(1, height - 6)))
  })

  return (
    <box width={width} height={height} flexDirection="column" padding={1}>
      <text fg="#8b949e">{"useKeyboard((e) => …)  — press any key"}</text>
      <text> </text>
      {log.length === 0 && <text fg="#6b6b8a">waiting…</text>}
      {log.map((k, i) => (
        <text key={i}>
          <span style={{ fg: i === 0 ? "#000" : "#25d0ff", bg: i === 0 ? "#25d0ff" : undefined, bold: true }}>{` ${k.name} `}</span>
          <span style={{ fg: "#8b949e" }}>{k.mods.length ? `  ${k.mods.join(" + ")}` : ""}</span>
        </text>
      ))}
    </box>
  )
}
export const keyboardHelp = [["any key", "see event"]]
