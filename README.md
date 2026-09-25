# Eleições Bahia

Portal informativo com resultados eleitorais da Bahia, buscados em tempo real
na **API pública de resultados do Tribunal Superior Eleitoral (TSE)**.

Projeto acadêmico e **apartidário**: apenas apresenta dados oficiais, sem
recomendar, classificar ou avaliar candidatos.

## O que o site faz

- Resultados de 2022 (governador, senador, deputados) e 2024 (prefeito e vereador).
- Bahia inteira ou qualquer um dos 417 municípios.
- Foto oficial, nome, número, partido, coligação, vice/suplentes, votos, % e situação de cada candidato.
- Busca de município e de candidato (nome, número ou partido).
- Municípios agrupados pelas regiões geográficas do IBGE.

## Como os dados chegam na tela

```
API do TSE (resultados.tse.jus.br)  +  API do IBGE (regiões)
        ↓  lib/tse.ts e lib/municipios.ts buscam as URLs
        ↓  e convertem a resposta para um formato simples (types/eleicao.ts)
Páginas em app/ mostram os dados usando os componentes de components/
```

## Tecnologias

- [Next.js](https://nextjs.org/): site e busca de dados no mesmo projeto
- TypeScript: JavaScript com verificação de tipos
- Tailwind CSS: estilos

## Como rodar no seu computador

Pré-requisitos: [Node.js](https://nodejs.org/) (versão 20 ou mais nova).

```bash
npm install     # instala as dependências (só na primeira vez)
npm run dev     # liga o site
```

Depois abra http://localhost:3000 no navegador. Para desligar: `Ctrl + C` no terminal.

## Estrutura de pastas

| Pasta / arquivo | O que tem |
|---|---|
| `app/page.tsx` | Página inicial |
| `app/resultados/` | Página de resultados (filtros, candidatos, votos) |
| `app/municipios/` | Lista de municípios por região |
| `app/sobre/` | Fontes, metodologia e limitações |
| `components/` | Partes reutilizáveis (cabeçalho, lista de candidatos, foto...) |
| `lib/` | Funções que buscam e organizam os dados |
| `types/` | Formato dos dados (TypeScript) |
| `docs/` | Explicação de cada etapa do projeto |

## Documentação

1. [Fontes de dados e endereços da API](docs/01-fontes-de-dados.md)
