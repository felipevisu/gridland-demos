#!/bin/bash
# Instala o Bun (instalador oficial) e as dependências do projeto gridland-demos.
set -e
cd "$(dirname "$0")"
echo "==> Instalando o Bun..."
curl -fsSL https://bun.sh/install | bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
echo
echo "==> Bun $(bun --version) instalado em $BUN_INSTALL"
echo "==> Instalando dependências do projeto..."
bun install
echo
echo "Pronto! Para rodar as demos no terminal:"
echo "  cd ~/Projects/gridland-demos && bun run src/cli.tsx"
echo
read -n 1 -s -r -p "Pressione qualquer tecla para fechar..."
