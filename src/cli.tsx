// @ts-nocheck
// Terminal: bun run src/cli.tsx <demo>   (or npm run demo <demo>)
import { createCliRenderer, createRoot } from "@gridland/bun"
import { DEMOS } from "./demos"
import { Runner } from "./Runner"

const id = process.argv[2]
if (!DEMOS[id]) {
  console.log(`usage: npm run demo <name>\n\ndemos: ${Object.keys(DEMOS).join(", ")}`)
  process.exit(id ? 1 : 0)
}

const renderer = await createCliRenderer({ exitOnCtrlC: true })
createRoot(renderer).render(
  <Runner
    demo={DEMOS[id]}
    onExit={() => {
      renderer.destroy()
      process.exit(0)
    }}
  />,
)
