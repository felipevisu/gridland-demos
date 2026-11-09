// @ts-nocheck
// <tab-select>: ready-made horizontal tabs.
import { useState } from "react"

const TABS = [
  { name: "Terminal", description: "@gridland/bun renders to your TTY", value: 0 },
  { name: "Browser", description: "@gridland/web renders to a <canvas>", value: 1 },
  { name: "Binary", description: "bun build --compile → one file, no runtime", value: 2 },
]

export function TabsDemo({ width, height }) {
  const [i, setI] = useState(0)
  return (
    <box width={width} height={height} flexDirection="column" padding={1} gap={1}>
      <tab-select
        focused
        options={TABS}
        tabWidth={14}
        width={Math.min(width - 2, 14 * TABS.length + 2)}
        showDescription={false}
        onChange={(idx) => setI(idx)}
        selectedBackgroundColor="#ffd93d"
        selectedTextColor="#000000"
      />
      <box border borderStyle="rounded" borderColor="#ffd93d" flexGrow={1} justifyContent="center" alignItems="center">
        <text fg="#e6edf3">{TABS[i].description}</text>
      </box>
    </box>
  )
}
export const tabsHelp = [["←/→", "switch tab"]]
