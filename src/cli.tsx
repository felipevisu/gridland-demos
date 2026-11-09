// @ts-nocheck
// Entrada do terminal: o MESMO DemoHub, agora renderizado no terminal pelo @gridland/bun.
// Rode com:  bun run src/cli.tsx   (ou npm run terminal)
import { createCliRenderer, createRoot } from "@gridland/bun"
import { DemoHub } from "./DemoHub"

const renderer = await createCliRenderer({ exitOnCtrlC: true })

createRoot(renderer).render(
  <DemoHub
    onExit={() => {
      renderer.destroy()
      process.exit(0)
    }}
  />,
)
