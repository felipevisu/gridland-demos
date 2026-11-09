// @ts-nocheck
// Entrada do navegador: o mesmo DemoHub renderizado num <canvas> pelo @gridland/web.
import { TUI } from "@gridland/web"
import { DemoHub } from "./DemoHub"

export function App() {
  return (
    <TUI style={{ width: "100vw", height: "100vh" }} backgroundColor="#0f0f1a" fontSize={14}>
      <DemoHub />
    </TUI>
  )
}
