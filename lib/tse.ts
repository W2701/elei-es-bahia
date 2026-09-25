// Acesso à API pública de resultados do TSE.
// Este é o ÚNICO arquivo do projeto que conhece as URLs do TSE.
// Documentação dos endereços: docs/01-fontes-de-dados.md

import type {
  Candidato,
  Cargo,
  Companheiro,
  Eleicao,
  Municipio,
  Resultado,
} from "@/types/eleicao";

const BASE = "https://resultados.tse.jus.br/oficial";

// Eleições disponíveis na API para a Bahia (verificadas em 24/09/2026).
export const ELEICOES: Eleicao[] = [
  {
    id: "2024-1",
    titulo: "2024 · 1º turno",
    ano: 2024,
    turno: 1,
    municipal: true,
    ciclo: "ele2024",
    codigo: "619",
    cargos: [
      { codigo: "0011", nome: "Prefeito" },
      { codigo: "0013", nome: "Vereador" },
    ],
  },
  {
    id: "2024-2",
    titulo: "2024 · 2º turno",
    ano: 2024,
    turno: 2,
    municipal: true,
    ciclo: "ele2024",
    codigo: "620",
    cargos: [{ codigo: "0011", nome: "Prefeito" }],
  },
  {
    id: "2022-1",
    titulo: "2022 · 1º turno",
    ano: 2022,
    turno: 1,
    municipal: false,
    ciclo: "ele2022",
    codigo: "546",
    cargos: [
      { codigo: "0003", nome: "Governador" },
      { codigo: "0005", nome: "Senador" },
      { codigo: "0006", nome: "Deputado Federal" },
      { codigo: "0007", nome: "Deputado Estadual" },
    ],
  },
];

// Eleição mostrada quando o usuário ainda não escolheu nenhuma
export const ELEICAO_PADRAO = "2022-1";

export function encontrarEleicao(id: string | undefined): Eleicao {
  return (
    ELEICOES.find((e) => e.id === id) ??
    ELEICOES.find((e) => e.id === ELEICAO_PADRAO)!
  );
}

// ---------------------------------------------------------------------------
// Busca genérica de JSON
// ---------------------------------------------------------------------------

// Busca uma URL e devolve o JSON.
// - Se o arquivo não existir (404), devolve null.
// - Se a API estiver fora do ar, lança um erro com mensagem clara.
// O Next.js guarda a resposta em cache por "segundosCache" segundos,
// para não chamar o TSE a cada visita.
export async function buscarJson<T>(
  url: string,
  segundosCache = 3600,
): Promise<T | null> {
  let resposta: Response;
  try {
    resposta = await fetch(url, {
      next: { revalidate: segundosCache },
      signal: AbortSignal.timeout(15000), // desiste depois de 15 segundos
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor de dados.");
  }

  if (resposta.status === 404) return null;
  if (!resposta.ok) {
    throw new Error(`O servidor de dados respondeu com erro ${resposta.status}.`);
  }
  return (await resposta.json()) as T;
}

// ---------------------------------------------------------------------------
// Montagem das URLs
// ---------------------------------------------------------------------------

// O TSE usa o código da eleição com 6 dígitos: "546" -> "000546"
function seisDigitos(codigo: string) {
  return codigo.padStart(6, "0");
}

// Ex.: .../ele2024/619/dados/ba/ba35335-c0011-e000619-u.json
function urlResultado(eleicao: Eleicao, cargo: Cargo, municipio: Municipio | null) {
  const local = municipio ? `ba${municipio.codigoTse}` : "ba";
  const arquivo = `${local}-c${cargo.codigo}-e${seisDigitos(eleicao.codigo)}-u.json`;
  return `${BASE}/${eleicao.ciclo}/${eleicao.codigo}/dados/ba/${arquivo}`;
}

// Ex.: .../ele2024/619/fotos/ba/50001970803.jpeg
function urlFoto(eleicao: Eleicao, sequencial: string) {
  return `${BASE}/${eleicao.ciclo}/${eleicao.codigo}/fotos/ba/${sequencial}.jpeg`;
}

// Lista de municípios publicada pelo TSE (todos os estados)
export const URL_MUNICIPIOS_TSE = `${BASE}/ele2024/619/config/mun-e000619-cm.json`;

// ---------------------------------------------------------------------------
// Formato "cru" da resposta do TSE (só os campos que usamos)
// ---------------------------------------------------------------------------

type CandidatoTse = {
  n: string; // número
  sqcand: string; // sequencial
  nm: string; // nome completo
  nmu: string; // nome de urna
  dvt: string; // destinação do voto
  st: string; // situação
  vap: string; // votos apurados
  pvapn: string; // percentual com todas as casas decimais (ex.: "80,461674753")
  vs?: { tp: string; nm: string; nmu: string; sgp: string }[]; // vice/suplentes
};

type RespostaTse = {
  dg: string; // data de geração
  hg: string; // hora de geração
  e: { te: string; c: string; pc: string; a: string; pa: string };
  v: { vv: string; vb: string; tvn: string };
  carg: {
    agr: {
      tp: string; // "i" = partido isolado, "c" = coligação, "f" = federação
      nm: string;
      com: string;
      par: { sg: string; nm: string; cand: CandidatoTse[] }[];
    }[];
  }[];
};

// ---------------------------------------------------------------------------
// Tradução do formato do TSE para o nosso formato
// ---------------------------------------------------------------------------

// O TSE escreve números decimais com vírgula ("80,46").
// O JavaScript só entende ponto ("80.46"), então trocamos antes de converter.
function paraNumero(texto: string) {
  return Number(texto.replace(",", "."));
}

function nomeDoCompanheiro(tipo: string) {
  if (tipo === "v") return "Vice";
  if (tipo === "s1") return "1º suplente";
  if (tipo === "s2") return "2º suplente";
  return tipo;
}

function converterCandidatos(dados: RespostaTse, eleicao: Eleicao): Candidato[] {
  const lista: Candidato[] = [];

  // A resposta vem aninhada: cargo -> agrupamento (coligação) -> partido -> candidatos
  for (const agrupamento of dados.carg[0]?.agr ?? []) {
    const temColigacao = agrupamento.tp === "c" || agrupamento.tp === "f";

    for (const partido of agrupamento.par) {
      for (const c of partido.cand) {
        const companheiros: Companheiro[] = (c.vs ?? []).map((v) => ({
          tipo: nomeDoCompanheiro(v.tp),
          nome: v.nm,
          nomeUrna: v.nmu,
          partido: v.sgp,
        }));

        lista.push({
          sequencial: c.sqcand,
          numero: c.n,
          nomeUrna: c.nmu,
          nomeCompleto: c.nm,
          partidoSigla: partido.sg,
          partidoNome: partido.nm,
          coligacao: temColigacao ? agrupamento.nm : null,
          composicao: temColigacao ? agrupamento.com : null,
          votos: Number(c.vap),
          percentual: paraNumero(c.pvapn),
          situacao: c.st,
          destinoVotos: c.dvt,
          companheiros,
          foto: urlFoto(eleicao, c.sqcand),
        });
      }
    }
  }

  // Ordena pela quantidade de votos (maior primeiro)
  return lista.sort((a, b) => b.votos - a.votos);
}

// ---------------------------------------------------------------------------
// Função principal: resultado de um cargo em uma eleição
// ---------------------------------------------------------------------------

// municipio = null significa "Bahia inteira".
// Devolve null quando o TSE não tem esse resultado
// (ex.: 2º turno em um município que não teve 2º turno).
export async function buscarResultado(
  eleicao: Eleicao,
  cargo: Cargo,
  municipio: Municipio | null,
): Promise<Resultado | null> {
  const dados = await buscarJson<RespostaTse>(urlResultado(eleicao, cargo, municipio));
  if (!dados || !dados.carg) return null;

  return {
    eleicao,
    cargo,
    municipio,
    atualizadoEm: `${dados.dg} às ${dados.hg}`,
    totais: {
      eleitorado: Number(dados.e.te),
      comparecimento: Number(dados.e.c),
      percentualComparecimento: dados.e.pc,
      abstencao: Number(dados.e.a),
      percentualAbstencao: dados.e.pa,
      validos: Number(dados.v.vv),
      brancos: Number(dados.v.vb),
      nulos: Number(dados.v.tvn),
    },
    candidatos: converterCandidatos(dados, eleicao),
  };
}
