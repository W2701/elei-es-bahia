# Etapa 1 — Fontes de dados

Pesquisa feita em 24/09/2026.

## Fonte principal: servidor de resultados do TSE

Os dados são buscados **direto de URLs públicas do TSE**, dentro do código.
Não é preciso baixar arquivos nem usar chave de acesso.

Endereço base: `https://resultados.tse.jus.br/oficial`

É o mesmo servidor usado pelo app oficial **Resultados** do TSE. Os arquivos
são JSON públicos. O TSE não publica um manual desta API; a estrutura dos
endereços foi identificada a partir do índice que o próprio servidor publica
(`/comum/config/ele-c.json`).

| O quê | URL (exemplo) |
|---|---|
| Lista de eleições | `/comum/config/ele-c.json` |
| Municípios (com código do IBGE) | `/ele2022/546/config/mun-e000546-cm.json` |
| Resultado na Bahia inteira | `/ele2022/546/dados/ba/ba-c0003-e000546-u.json` |
| Resultado em um município | `/ele2022/546/dados/ba/ba38490-c0003-e000546-u.json` |
| Foto do candidato | `/ele2022/546/fotos/ba/50001603638.jpeg` |

Como ler o nome do arquivo `ba38490-c0003-e000546-u.json`:

- `ba`: estado (Bahia)
- `38490`: código do município no TSE (38490 = Salvador). Sem esse número, o arquivo é da Bahia inteira.
- `c0003`: cargo (0003 = Governador)
- `e000546`: código da eleição
- `u`: tipo do arquivo (resultado completo)

### Códigos usados

| Eleição | Código | Cargos disponíveis |
|---|---|---|
| 2022 — 1º turno (geral) | `ele2022/546` | Governador (0003), Senador (0005), Dep. Federal (0006), Dep. Estadual (0007) |
| 2022 — 2º turno (Governador) | `ele2022/547` | Governador — arquivo resumido `-v.json` (sem nomes, só número e votos) |
| 2024 — 1º turno (municipal) | `ele2024/619` | Prefeito (0011), Vereador (0013) |
| 2024 — 2º turno (municipal) | `ele2024/620` | Prefeito (0011) |

### O que cada resultado traz

- Candidato: nome completo, nome de urna, número, partido, coligação/federação, vice.
- Situação: "Eleito", "Não eleito", "2º turno"...
- Votos e **percentual já calculado pelo TSE**.
- Totais: eleitorado, comparecimento, abstenção, brancos, nulos e votos válidos.

## Fonte complementar: IBGE

[API de Localidades e Malhas do IBGE](https://servicodados.ibge.gov.br/api/docs):
desenho do mapa da Bahia (417 municípios). O arquivo de municípios do TSE
já traz o código do IBGE de cada município (campo `cdi`), o que permite
ligar os dois.

## Limitações conhecidas

- A API do servidor de resultados não tem documentação oficial; o formato pode mudar.
- Não encontramos 2018 e 2020 nesse servidor. Para anos antigos, a fonte
  oficial é o [Portal de Dados Abertos do TSE](https://dadosabertos.tse.jus.br/),
  que só permite download pelo navegador (downloads por programa recebem erro 403).
- Os resultados de 2026 só existirão a partir da eleição (4 de outubro de 2026).
