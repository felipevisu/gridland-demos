// @ts-nocheck
// <input>: native text field with cursor, onInput and onSubmit.
import { useState } from "react"

export function InputDemo({ width, height }) {
  const [value, setValue] = useState("")
  const [items, setItems] = useState(["buy coffee", "write slides"])

  return (
    <box width={width} height={height} flexDirection="column" padding={1} gap={1}>
      <box border borderStyle="rounded" borderColor="#7ee787" title=" new todo " height={3}>
        <input
          focused
          value={value}
          placeholder="type and press enter…"
          onInput={setValue}
          onSubmit={(v) => {
            if (v.trim()) setItems((l) => [...l, v.trim()])
            setValue("")
          }}
          textColor="#e6edf3"
          cursorColor="#7ee787"
        />
      </box>
      <box flexDirection="column">
        {items.map((it, i) => (
          <text key={i}>
            <span style={{ fg: "#7ee787" }}>{"[ ] "}</span>
            <span style={{ fg: "#e6edf3" }}>{it}</span>
          </text>
        ))}
      </box>
      <text fg="#8b949e">{`${value.length} chars typed`}</text>
    </box>
  )
}
export const inputHelp = [["enter", "add"]]
