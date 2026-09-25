// Formatos dos dados usados no site.
// A API do TSE usa nomes curtos (ex.: "nmu", "vap"). Aqui damos nomes claros
// em português, e o arquivo lib/tse.ts faz a "tradução".

export type Cargo = {
  codigo: string; // código do cargo no TSE, ex.: "0003" = Governador
  nome: string;
};

export type Eleicao = {
  id: string; // identificador usado na URL do site, ex.: "2022-1"
  titulo: string; // ex.: "2022 · 1º turno"
  ano: number;
  turno: number;
  municipal: boolean; // true = prefeito/vereador (precisa escolher um município)
  ciclo: string; // pasta do ciclo na API do TSE, ex.: "ele2022"
  codigo: string; // código da eleição na API do TSE, ex.: "546"
  cargos: Cargo[];
};

export type Municipio = {
  codigoTse: string; // código usado pelo TSE, ex.: "35335"
  codigoIbge: string; // código usado pelo IBGE, ex.: "2911709"
  nome: string;
  capital: boolean;
  regiaoIntermediaria: string; // divisão regional do IBGE
  regiaoImediata: string;
};

// Vice (prefeito/governador) ou suplente (senador)
export type Companheiro = {
  tipo: string; // "Vice", "1º suplente", "2º suplente"
  nome: string;
  nomeUrna: string;
  partido: string;
};

export type Candidato = {
  sequencial: string; // código único do candidato no TSE (SQ_CANDIDATO)
  numero: string;
  nomeUrna: string;
  nomeCompleto: string;
  partidoSigla: string;
  partidoNome: string;
  coligacao: string | null; // nome da coligação ou federação, se houver
  composicao: string | null; // partidos que formam a coligação/federação
  votos: number;
  percentual: number; // % dos votos válidos, calculado pelo TSE
  situacao: string; // texto oficial: "Eleito", "Não eleito", "2º turno"...
  destinoVotos: string; // "Válido" ou, por ex., "Anulado"
  companheiros: Companheiro[];
  foto: string; // URL da foto oficial no servidor do TSE
};

export type Totais = {
  eleitorado: number;
  comparecimento: number;
  percentualComparecimento: string;
  abstencao: number;
  percentualAbstencao: string;
  validos: number;
  brancos: number;
  nulos: number;
};

export type Resultado = {
  eleicao: Eleicao;
  cargo: Cargo;
  municipio: Municipio | null; // null = Bahia inteira
  atualizadoEm: string; // data informada pelo TSE
  totais: Totais;
  candidatos: Candidato[];
};
