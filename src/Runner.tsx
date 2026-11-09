// @ts-nocheck
// One demo full screen + a shortcut bar. Same component in the terminal and the browser.
import { useKeyboard, useTerminalDimensions } from "@gridland/utils"

export function Runner({ demo, onExit }) {
  const { width, height } = useTerminalDimensions()
  const { C: Demo, help, typing } = demo
  const exitKey = typing ? "esc" : "q"

  useKeyboard((e) => {
    if (onExit && (e.name === "escape" || (!typing && e.name === "q"))) onExit()
  })

  const keys = [...help, ...(onExit ? [[exitKey, "quit"]] : [])].filter(([k]) => k)
  return (
    <box flexDirection="column" width={width} height={height} backgroundColor="#0f0f1a">
      <Demo width={width} height={Math.max(5, height - 1)} originX={0} originY={0} />
      <text>
        {keys.flatMap(([k, label], i) => [
          <span key={`k${i}`} style={{ fg: "#25d0ff", bold: true }}>{` ${k}`}</span>,
          <span key={`l${i}`} style={{ fg: "#6b6b8a" }}>{` ${label} `}</span>,
        ])}
      </text>
    </box>
  )
}
