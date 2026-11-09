# Gridland Demos

Oito demos feitas com [Gridland](https://github.com/thoughtfulllc/gridland). O **mesmo código React**
roda no navegador (desenhado num `<canvas>`) e no terminal.

| # | Demo | O que mostra |
|---|------|--------------|
| 1 | **Cubo 3D** | Cubo sólido com projeção em perspectiva, z-buffer e luz por face |
| 2 | **Donut 3D** | O clássico `donut.c` com cores por luminância (tecla `c` troca a paleta) |
| 3 | **Ray Marching** | Cena 3D com SDFs (esfera, toro, chão xadrez), sombra suave e especular. A luz segue as setas ou o mouse |
| 4 | **Terreno** | Voo sobre um terreno em wireframe, estilo synthwave |
| 5 | **Túnel** | Túnel infinito por mapeamento polar (`p` troca o padrão) |
| 6 | **Estrelas** | Campo de estrelas 3D com efeito warp (`↑` acelera) |
| 7 | **Plasma** | Efeito demoscene clássico com paletas |
| 8 | **Dashboard** | UI "de verdade": painéis com borda, barras, sparklines, tabela e log |

## Rodando

```bash
npm install

# no navegador (http://localhost:5173)
npm run dev

# no terminal (precisa do Bun: curl -fsSL https://bun.sh/install | bash)
bun install
bun run src/cli.tsx

# gera um binário único que roda sem Node nem Bun
bun build --compile src/cli.tsx --outfile gridland-demos
./gridland-demos
```

**Atalhos:** `tab` ou `1`–`8` trocam de demo, `espaço` pausa, `q` sai (no terminal).
Os atalhos de cada demo aparecem na barra de baixo.

## Estrutura

```
src/
├── App.tsx          entrada do navegador  (<TUI> do @gridland/web)
├── cli.tsx          entrada do terminal   (createCliRenderer do @gridland/bun)
├── DemoHub.tsx      abas + barra de atalhos, compartilhado pelas duas entradas
├── lib/
│   ├── frame.tsx    framebuffer de caracteres/cores, <FrameView>, relógio, paletas
│   └── math3d.ts    vetores, rotação e correção de aspecto da célula
└── demos/           uma demo por arquivo
```

## Como as demos 3D funcionam

Todas seguem o mesmo padrão:

1. `useClock()` re-renderiza o componente ~30 vezes por segundo e devolve o tempo `t`.
2. A demo calcula um `Frame` (um caractere e uma cor por célula) com matemática pura em JS.
3. `<FrameView>` converte o frame em linhas `<text>` e agrupa caracteres vizinhos de mesma
   cor num único `<span>`, o que mantém o reconciler leve.

Um detalhe importante: células de terminal são cerca de 2x mais altas que largas. Por isso a projeção
multiplica X por `CELL_ASPECT = 2`; sem isso, tudo sai achatado.

## Criando sua própria demo

```tsx
// src/demos/minha-demo.tsx
// @ts-nocheck
import { createFrame, FrameView, useClock, put } from "../lib/frame"

export function MinhaDemo({ width, height }) {
  const t = useClock()
  const f = createFrame(width, height)
  const x = (Math.sin(t) * 0.5 + 0.5) * (width - 1)
  put(f, x, height / 2, "●", "#ff4fd8")
  return <FrameView frame={f} />
}
export const minhaDemoHelp = [["", "uma bolinha indo e voltando"]]
```

Depois registre a demo na lista `DEMOS` em `src/DemoHub.tsx`.

Também dá para instalar componentes prontos do registry do Gridland:
`bunx create-gridland add spinner` (o `components.json` já está configurado).
