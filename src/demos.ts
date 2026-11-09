// @ts-nocheck
// Demo registry: id → component. Used by the terminal (cli.tsx) and the browser (main.tsx).
import { CubeDemo, cubeHelp } from "../demos/visual/cube"
import { DonutDemo, donutHelp } from "../demos/visual/donut"
import { RaymarchDemo, raymarchHelp } from "../demos/visual/raymarch"
import { TunnelDemo, tunnelHelp } from "../demos/visual/tunnel"
import { TerrainDemo, terrainHelp } from "../demos/visual/terrain"
import { StarfieldDemo, starfieldHelp } from "../demos/visual/starfield"
import { PlasmaDemo, plasmaHelp } from "../demos/visual/plasma"
import { DashboardDemo, dashboardHelp } from "../demos/visual/dashboard"
import { LayoutDemo, layoutHelp } from "../demos/features/layout"
import { TextDemo, textHelp } from "../demos/features/text"
import { KeyboardDemo, keyboardHelp } from "../demos/features/keyboard"
import { InputDemo, inputHelp } from "../demos/features/input"
import { SelectDemo, selectHelp } from "../demos/features/select"
import { TabsDemo, tabsHelp } from "../demos/features/tabs"
import { AsciiFontDemo, asciiFontHelp } from "../demos/features/asciifont"
import { ResponsiveDemo, responsiveHelp } from "../demos/features/responsive"
import { ScrollDemo, scrollHelp } from "../demos/features/scroll"

// typing: the demo captures regular keys, so only esc quits.
export const DEMOS = {
  // visual
  cube: { C: CubeDemo, help: cubeHelp },
  donut: { C: DonutDemo, help: donutHelp },
  raymarch: { C: RaymarchDemo, help: raymarchHelp },
  terrain: { C: TerrainDemo, help: terrainHelp },
  tunnel: { C: TunnelDemo, help: tunnelHelp },
  starfield: { C: StarfieldDemo, help: starfieldHelp },
  plasma: { C: PlasmaDemo, help: plasmaHelp },
  dashboard: { C: DashboardDemo, help: dashboardHelp },
  // features
  layout: { C: LayoutDemo, help: layoutHelp },
  text: { C: TextDemo, help: textHelp },
  keyboard: { C: KeyboardDemo, help: keyboardHelp },
  input: { C: InputDemo, help: inputHelp, typing: true },
  select: { C: SelectDemo, help: selectHelp },
  tabs: { C: TabsDemo, help: tabsHelp },
  font: { C: AsciiFontDemo, help: asciiFontHelp },
  responsive: { C: ResponsiveDemo, help: responsiveHelp },
  scroll: { C: ScrollDemo, help: scrollHelp },
}
