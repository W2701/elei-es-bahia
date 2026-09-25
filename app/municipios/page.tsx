// Lista dos 417 municípios da Bahia, agrupados pelas regiões intermediárias do IBGE.
// Cada município leva ao resultado de prefeito de 2024 daquele local.

import type { Metadata } from "next";
import Link from "next/link";
import type { Municipio } from "@/types/eleicao";
import { buscarMunicipios, normalizar } from "@/lib/municipios";
import Aviso from "@/components/Aviso";

export const metadata: Metadata = { title: "Municípios" };

// Transforma o nome da região em um id para links internos: "Ilhéus - Itabuna" -> "ilheus-itabuna"
function idDaRegiao(nome: string) {
  return normalizar(nome).replace(/[^a-z0-9]+/g, "-");
}

export default async function PaginaMunicipios(props: PageProps<"/municipios">) {
  const parametros = await props.searchParams;
  const filtro = typeof parametros.q === "string" ? parametros.q.trim() : "";

  let municipios: Municipio[] = [];
  let erro = "";
  try {
    municipios = await buscarMunicipios();
  } catch (e) {
    erro = (e as Error).message;
  }

  const visiveis = filtro
    ? municipios.filter((m) => normalizar(m.nome).includes(normalizar(filtro)))
    : municipios;

  // Agrupa por região: { "Guanambi": [...], "Salvador": [...] }
  const porRegiao = new Map<string, Municipio[]>();
  for (const m of visiveis) {
    const lista = porRegiao.get(m.regiaoIntermediaria) ?? [];
    lista.push(m);
    porRegiao.set(m.regiaoIntermediaria, lista);
  }
  const regioes = [...porRegiao.keys()].sort((a, b) => a.localeCompare(b, "pt-BR"));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-sm uppercase tracking-wide text-tinta-suave">Municípios</p>
      <h1 className="mt-1 font-serif text-3xl font-semibold sm:text-4xl">
        Os {municipios.length || 417} municípios da Bahia
      </h1>
      <p className="mt-3 max-w-2xl text-tinta-suave">
        Organizados pelas regiões geográficas intermediárias do IBGE. Escolha um município
        para ver os resultados eleitorais daquele local.
      </p>

      <form action="/municipios" className="mt-8 flex max-w-md gap-2">
        <label className="sr-only" htmlFor="q">
          Filtrar municípios
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={filtro}
          placeholder="Filtrar pelo nome"
          className="flex-1 border border-linha bg-superficie px-3 py-2"
        />
        <button type="submit" className="bg-azul px-4 py-2 text-white hover:bg-azul-escuro">
          Filtrar
        </button>
      </form>

      <div className="mt-8">
        {erro && (
          <Aviso titulo="Não foi possível carregar a lista de municípios" tipo="erro">
            {erro} Tente novamente em alguns minutos.
          </Aviso>
        )}
        {!erro && visiveis.length === 0 && (
          <Aviso titulo="Nenhum município encontrado">
            Nenhum nome corresponde a &quot;{filtro}&quot;.
          </Aviso>
        )}
      </div>

      {/* Atalhos para cada região */}
      {regioes.length > 1 && (
        <nav aria-label="Regiões" className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {regioes.map((r) => (
            <a key={r} href={`#${idDaRegiao(r)}`} className="text-azul underline-offset-2 hover:underline">
              {r}
            </a>
          ))}
        </nav>
      )}

      <div className="mt-10 space-y-12">
        {regioes.map((regiao) => {
          const lista = porRegiao.get(regiao)!;
          return (
            <section key={regiao} id={idDaRegiao(regiao)} className="scroll-mt-6">
              <div className="flex items-baseline justify-between border-b border-tinta pb-2">
                <h2 className="font-serif text-2xl font-semibold">Região de {regiao}</h2>
                <p className="text-sm text-tinta-suave">{lista.length} municípios</p>
              </div>
              <ul className="mt-4 columns-2 gap-6 text-sm sm:columns-3 lg:columns-4">
                {lista.map((m) => (
                  <li key={m.codigoTse} className="break-inside-avoid py-1">
                    <Link
                      href={`/resultados?eleicao=2024-1&municipio=${m.codigoTse}`}
                      className="hover:text-azul hover:underline"
                    >
                      {m.nome}
                    </Link>
                    {m.capital && <span className="ml-1 text-xs text-tinta-suave">(capital)</span>}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
