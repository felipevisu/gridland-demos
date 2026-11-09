// @ts-nocheck
// Browser: http://localhost:5173/?demo=<demo>. Without ?demo, shows a list of links.
import { createRoot } from "react-dom/client"
import { TUI } from "@gridland/web"
import { DEMOS } from "./demos"
import { Runner } from "./Runner"

const id = new URLSearchParams(location.search).get("demo")

createRoot(document.getElementById("root")!).render(
  DEMOS[id] ? (
    <TUI style={{ width: "100vw", height: "100vh" }} backgroundColor="#0f0f1a" fontSize={14}>
      <Runner demo={DEMOS[id]} />
    </TUI>
  ) : (
    <ul style={{ color: "#d9d9f0", fontFamily: "monospace", padding: 32, lineHeight: 2, listStyle: "none" }}>
      {Object.keys(DEMOS).map((d) => (
        <li key={d}><a style={{ color: "#8a7dff" }} href={`?demo=${d}`}>{d}</a></li>
      ))}
    </ul>
  ),
)
