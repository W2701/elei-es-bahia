// Lista dos municípios da Bahia.
// Junta duas fontes oficiais:
// - TSE: código eleitoral do município (usado nas URLs de resultado)
// - IBGE: nome com acentuação correta e região geográfica
// As duas se ligam pelo código do IBGE, que o próprio TSE informa (campo "cdi").

import type { Municipio } from "@/types/eleicao";
import { buscarJson, URL_MUNICIPIOS_TSE } from "@/lib/tse";

const URL_MUNICIPIOS_IBGE =
  "https://servicodados.ibge.gov.br/api/v1/localidades/estados/29/municipios";

const UM_DIA = 60 * 60 * 24; // a lista de municípios quase nunca muda

type MunicipiosTse = {
  abr: { cd: string; mu: { cd: string; cdi: string; nm: string; c: string }[] }[];
};

type MunicipioIbge = {
  id: number;
  nome: string;
  "regiao-imediata": {
    nome: string;
    "regiao-intermediaria": { nome: string };
  };
};

// A API do IBGE envia "Ilhéus ¿ Itabuna" (o travessão chega como "¿").
function corrigirTexto(texto: string) {
  return texto.replace(" ¿ ", " – ");
}

export async function buscarMunicipios(): Promise<Municipio[]> {
  const tse = await buscarJson<MunicipiosTse>(URL_MUNICIPIOS_TSE, UM_DIA);
  const bahia = tse?.abr.find((uf) => uf.cd.toLowerCase() === "ba");
  if (!bahia) throw new Error("Lista de municípios do TSE indisponível.");

  // O IBGE é complementar: se falhar, o site continua funcionando sem as regiões.
  let ibge: MunicipioIbge[] = [];
  try {
    ibge = (await buscarJson<MunicipioIbge[]>(URL_MUNICIPIOS_IBGE, UM_DIA)) ?? [];
  } catch {
    ibge = [];
  }

  const municipios = bahia.mu.map((m) => {
    const doIbge = ibge.find((i) => String(i.id) === m.cdi);
    return {
      codigoTse: m.cd,
      codigoIbge: m.cdi,
      nome: doIbge?.nome ?? m.nm,
      capital: m.c === "s",
      regiaoIntermediaria: corrigirTexto(
        doIbge?.["regiao-imediata"]["regiao-intermediaria"].nome ?? "Não informada",
      ),
      regiaoImediata: corrigirTexto(doIbge?.["regiao-imediata"].nome ?? "Não informada"),
    };
  });

  return municipios.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

// Remove acentos e deixa minúsculo: "Camaçari" -> "camacari"
// Assim a busca funciona mesmo se a pessoa digitar sem acento.
export function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

// Aceita o código do TSE ("35335") ou o nome ("guanambi")
export function encontrarMunicipio(lista: Municipio[], termo: string) {
  const busca = normalizar(termo);
  return (
    lista.find((m) => m.codigoTse === termo) ??
    lista.find((m) => normalizar(m.nome) === busca) ??
    null
  );
}

// Municípios cujo nome contém o termo (para sugestões)
export function sugerirMunicipios(lista: Municipio[], termo: string) {
  const busca = normalizar(termo);
  return lista.filter((m) => normalizar(m.nome).includes(busca)).slice(0, 8);
}
