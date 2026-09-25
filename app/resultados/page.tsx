// Página de resultados.
// Tudo o que o usuário escolhe fica na URL. Exemplo:
// /resultados?eleicao=2024-1&cargo=0011&municipio=35335&busca=silva
// Assim qualquer resultado pode ser compartilhado por link.

import type { Metadata } from "next";
import Link from "next/link";
import type { Municipio, Resultado } from "@/types/eleicao";
import { ELEICOES, buscarResultado, encontrarEleicao } from "@/lib/tse";
import {
  buscarMunicipios,
  encontrarMunicipio,
  normalizar,
  sugerirMunicipios,
} from "@/lib/municipios";
import Aviso from "@/components/Aviso";
import ListaCandidatos from "@/components/ListaCandidatos";
import ResumoVotacao from "@/components/ResumoVotacao";

export const metadata: Metadata = { title: "Resultados" };

// Lê um parâmetro da URL como texto
function lerTexto(valor: string | string[] | undefined) {
  return typeof valor === "string" ? valor.trim() : "";
}

export default async function PaginaResultados(props: PageProps<"/resultados">) {
  const parametros = await props.searchParams;

  // 1. Descobrir o que o usuário escolheu
  const eleicao = encontrarEleicao(lerTexto(parametros.eleicao));
  const cargo =
    eleicao.cargos.find((c) => c.codigo === lerTexto(parametros.cargo)) ?? eleicao.cargos[0];
  const termoMunicipio = lerTexto(parametros.municipio);
  const busca = lerTexto(parametros.busca);

  // 2. Buscar a lista de municípios
  let municipios: Municipio[] = [];
  let erro = "";
  try {
    municipios = await buscarMunicipios();
  } catch (e) {
    erro = (e as Error).message;
  }

  const municipio = termoMunicipio ? encontrarMunicipio(municipios, termoMunicipio) : null;
  const municipioNaoEncontrado = termoMunicipio !== "" && !municipio && !erro;
  const precisaMunicipio = eleicao.municipal && !municipio;

  // 3. Buscar o resultado no TSE (só quando temos tudo o que precisamos)
  let resultado: Resultado | null = null;
  if (!erro && !municipioNaoEncontrado && !precisaMunicipio) {
    try {
      resultado = await buscarResultado(eleicao, cargo, municipio);
    } catch (e) {
      erro = (e as Error).message;
    }
  }

  // 4. Filtrar candidatos pelo texto da busca
  const candidatos = (resultado?.candidatos ?? []).filter((c) => {
    if (!busca) return true;
    const alvo = normalizar(`${c.nomeUrna} ${c.nomeCompleto} ${c.numero} ${c.partidoSigla}`);
    return alvo.includes(normalizar(busca));
  });

  // Monta links mantendo as escolhas atuais
  function link(mudancas: { eleicao?: string; cargo?: string; municipio?: string }) {
    const p = new URLSearchParams();
    p.set("eleicao", mudancas.eleicao ?? eleicao.id);
    if (mudancas.cargo) p.set("cargo", mudancas.cargo);
    const mun = mudancas.municipio ?? municipio?.codigoTse;
    if (mun) p.set("municipio", mun);
    return `/resultados?${p.toString()}`;
  }

  const local = municipio ? municipio.nome : "Bahia";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-sm uppercase tracking-wide text-tinta-suave">Resultados</p>
      <h1 className="mt-1 font-serif text-3xl font-semibold sm:text-4xl">
        {cargo.nome}
        {!precisaMunicipio && ` · ${local}`}
      </h1>
      <p className="mt-2 text-tinta-suave">Eleição {eleicao.titulo}</p>

      {/* ---------------- Filtros ---------------- */}
      <section aria-label="Filtros" className="mt-8 space-y-5 border-y border-linha py-6">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-tinta-suave">
            Eleição
          </p>
          <div className="flex flex-wrap gap-2">
            {ELEICOES.map((e) => (
              <Link
                key={e.id}
                href={link({ eleicao: e.id })}
                aria-current={e.id === eleicao.id ? "page" : undefined}
                className={`border px-3 py-1.5 text-sm ${
                  e.id === eleicao.id
                    ? "border-azul bg-azul text-white"
                    : "border-linha bg-superficie hover:border-azul"
                }`}
              >
                {e.titulo}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-tinta-suave">
            Cargo
          </p>
          <div className="flex flex-wrap gap-2">
            {eleicao.cargos.map((c) => (
              <Link
                key={c.codigo}
                href={link({ cargo: c.codigo })}
                aria-current={c.codigo === cargo.codigo ? "page" : undefined}
                className={`border px-3 py-1.5 text-sm ${
                  c.codigo === cargo.codigo
                    ? "border-tinta bg-tinta text-white"
                    : "border-linha bg-superficie hover:border-tinta"
                }`}
              >
                {c.nome}
              </Link>
            ))}
          </div>
        </div>

        {/* Formulário comum: ao enviar, os campos viram parâmetros na URL */}
        <form action="/resultados" className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <input type="hidden" name="eleicao" value={eleicao.id} />
          <input type="hidden" name="cargo" value={cargo.codigo} />

          <label className="block text-sm">
            <span className="text-tinta-suave">
              Município {eleicao.municipal ? "" : "(vazio = Bahia inteira)"}
            </span>
            <input
              name="municipio"
              list="lista-municipios"
              defaultValue={municipio?.nome ?? termoMunicipio}
              placeholder="Ex.: Guanambi"
              autoComplete="off"
              className="mt-1 block w-full border border-linha bg-superficie px-3 py-2"
            />
          </label>
          <datalist id="lista-municipios">
            {municipios.map((m) => (
              <option key={m.codigoTse} value={m.nome} />
            ))}
          </datalist>

          <label className="block text-sm">
            <span className="text-tinta-suave">Buscar candidato (nome, número ou partido)</span>
            <input
              name="busca"
              type="search"
              defaultValue={busca}
              placeholder="Ex.: Silva, 13, PSOL"
              className="mt-1 block w-full border border-linha bg-superficie px-3 py-2"
            />
          </label>

          <button type="submit" className="bg-azul px-5 py-2 text-white hover:bg-azul-escuro">
            Ver resultados
          </button>
        </form>
      </section>

      {/* ---------------- Conteúdo ---------------- */}
      <div className="mt-8 space-y-6">
        {erro && (
          <Aviso titulo="Não foi possível carregar os dados agora" tipo="erro">
            {erro} O servidor do TSE pode estar temporariamente indisponível. Tente
            novamente em alguns minutos.
          </Aviso>
        )}

        {municipioNaoEncontrado && (
          <Aviso titulo={`Município "${termoMunicipio}" não encontrado na Bahia`}>
            {sugerirMunicipios(municipios, termoMunicipio).length > 0 ? (
              <p>
                Você quis dizer:{" "}
                {sugerirMunicipios(municipios, termoMunicipio).map((m, i) => (
                  <span key={m.codigoTse}>
                    {i > 0 && ", "}
                    <Link href={link({ municipio: m.codigoTse })} className="text-azul underline">
                      {m.nome}
                    </Link>
                  </span>
                ))}
              </p>
            ) : (
              <p>Confira a grafia ou veja a lista completa em Municípios.</p>
            )}
          </Aviso>
        )}

        {!erro && !municipioNaoEncontrado && precisaMunicipio && (
          <Aviso titulo="Escolha um município">
            Eleições municipais (prefeito e vereador) têm resultado separado para cada um
            dos 417 municípios. Digite o nome no campo acima ou consulte a{" "}
            <Link href="/municipios" className="text-azul underline">
              lista por região
            </Link>
            .
          </Aviso>
        )}

        {!erro && !municipioNaoEncontrado && !precisaMunicipio && !resultado && (
          <Aviso titulo="Resultado não disponível">
            O TSE não publicou resultado de {cargo.nome.toLowerCase()} para {local} nesta
            eleição. No 2º turno, só aparecem os locais onde houve segunda votação.
          </Aviso>
        )}

        {resultado && (
          <>
            <div className="flex flex-wrap justify-between gap-x-6 gap-y-1 text-sm text-tinta-suave">
              {municipio ? (
                <p>
                  Região intermediária de {municipio.regiaoIntermediaria} · Região imediata
                  de {municipio.regiaoImediata} <span className="text-xs">(IBGE)</span>
                </p>
              ) : (
                <p>Todo o estado da Bahia</p>
              )}
              <p>Totalização do TSE: {resultado.atualizadoEm}</p>
            </div>

            <ResumoVotacao totais={resultado.totais} />

            <div>
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-serif text-2xl font-semibold">Candidatos</h2>
                <p className="text-sm text-tinta-suave">
                  {busca
                    ? `${candidatos.length} de ${resultado.candidatos.length} candidatos para "${busca}"`
                    : `${resultado.candidatos.length} candidatos, ordenados por número de votos`}
                </p>
              </div>

              {candidatos.length > 0 ? (
                <ListaCandidatos candidatos={candidatos} />
              ) : (
                <Aviso titulo="Nenhum candidato encontrado">
                  Nenhum nome, número ou partido corresponde a &quot;{busca}&quot;.
                </Aviso>
              )}
            </div>

            <p className="border-t border-linha pt-4 text-xs text-tinta-suave">
              <strong>Dado oficial:</strong> nomes, números, partidos, votos, situação e
              fotos vêm do servidor de resultados do TSE. O percentual é calculado pelo
              próprio TSE sobre os votos válidos.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
