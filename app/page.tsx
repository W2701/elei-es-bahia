// Página inicial.
// Os números em destaque são buscados na API do TSE, não digitados à mão.

import Link from "next/link";
import type { Municipio, Resultado } from "@/types/eleicao";
import { ELEICOES, buscarResultado, encontrarEleicao } from "@/lib/tse";
import { buscarMunicipios } from "@/lib/municipios";
import { formatarNumero } from "@/lib/formatar";

const CONSULTAS_RAPIDAS = [
  { texto: "Governador · Bahia", detalhe: "2022, 1º turno", href: "/resultados?eleicao=2022-1&cargo=0003" },
  { texto: "Senador · Bahia", detalhe: "2022, 1º turno", href: "/resultados?eleicao=2022-1&cargo=0005" },
  { texto: "Deputado Federal · Bahia", detalhe: "2022, 1º turno", href: "/resultados?eleicao=2022-1&cargo=0006" },
  { texto: "Deputado Estadual · Bahia", detalhe: "2022, 1º turno", href: "/resultados?eleicao=2022-1&cargo=0007" },
  { texto: "Prefeito · Salvador", detalhe: "2024, 1º turno", href: "/resultados?eleicao=2024-1&cargo=0011&municipio=38490" },
  { texto: "Prefeito · Camaçari", detalhe: "2024, 2º turno", href: "/resultados?eleicao=2024-2&cargo=0011&municipio=34134" },
];

export default async function Inicio() {
  // Busca dados reais para os destaques. Se falhar, a página continua funcionando.
  let municipios: Municipio[] = [];
  let governador2022: Resultado | null = null;
  try {
    const eleicao = encontrarEleicao("2022-1");
    [municipios, governador2022] = await Promise.all([
      buscarMunicipios(),
      buscarResultado(eleicao, eleicao.cargos[0], null),
    ]);
  } catch {
    // Os destaques simplesmente não aparecem
  }

  const regioes = new Set(municipios.map((m) => m.regiaoIntermediaria));

  return (
    <>
      {/* ---------------- Abertura ---------------- */}
      <section className="border-b border-linha bg-superficie">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:py-20">
          <div>
            <p className="text-sm uppercase tracking-wide text-azul">Portal de dados eleitorais</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              Resultados eleitorais da Bahia, direto da base oficial do TSE
            </h1>
            <p className="mt-5 max-w-xl text-lg text-tinta-suave">
              Consulte votos, percentuais e a situação de cada candidato, no estado inteiro
              ou em qualquer um dos municípios baianos.
            </p>

            <form action="/resultados" className="mt-8 max-w-xl">
              <input type="hidden" name="eleicao" value="2024-1" />
              <label htmlFor="municipio" className="text-sm font-medium">
                Buscar município
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="municipio"
                  name="municipio"
                  list="municipios-inicio"
                  placeholder="Ex.: Guanambi, Feira de Santana…"
                  autoComplete="off"
                  required
                  className="min-w-0 flex-1 border border-tinta bg-superficie px-4 py-3"
                />
                <button type="submit" className="bg-azul px-5 py-3 text-white hover:bg-azul-escuro">
                  Buscar
                </button>
              </div>
              <datalist id="municipios-inicio">
                {municipios.map((m) => (
                  <option key={m.codigoTse} value={m.nome} />
                ))}
              </datalist>
              <p className="mt-2 text-xs text-tinta-suave">
                Mostra o resultado de prefeito de 2024. Outros cargos e anos podem ser
                escolhidos na página de resultados.
              </p>
            </form>
          </div>

          {/* Números em destaque (dados oficiais) */}
          {governador2022 && (
            <aside aria-label="Bahia em números" className="self-end">
              <p className="border-b border-tinta pb-2 text-xs font-medium uppercase tracking-wide">
                Bahia em números · eleição de 2022
              </p>
              <dl className="divide-y divide-linha">
                <div className="flex items-baseline justify-between py-3">
                  <dt className="text-tinta-suave">Eleitorado</dt>
                  <dd className="font-serif text-2xl tabular-nums">
                    {formatarNumero(governador2022.totais.eleitorado)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between py-3">
                  <dt className="text-tinta-suave">Comparecimento</dt>
                  <dd className="font-serif text-2xl tabular-nums">
                    {governador2022.totais.percentualComparecimento}%
                  </dd>
                </div>
                <div className="flex items-baseline justify-between py-3">
                  <dt className="text-tinta-suave">Municípios</dt>
                  <dd className="font-serif text-2xl tabular-nums">{municipios.length}</dd>
                </div>
                <div className="flex items-baseline justify-between py-3">
                  <dt className="text-tinta-suave">Regiões intermediárias (IBGE)</dt>
                  <dd className="font-serif text-2xl tabular-nums">{regioes.size}</dd>
                </div>
              </dl>
              <p className="mt-2 text-xs text-tinta-suave">
                Fonte: TSE (1º turno de 2022) e IBGE.
              </p>
            </aside>
          )}
        </div>
      </section>

      {/* ---------------- Consultas rápidas ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-serif text-2xl font-semibold">Consultas rápidas</h2>
            <ul className="mt-4 border-t border-tinta">
              {CONSULTAS_RAPIDAS.map((c) => (
                <li key={c.href} className="border-b border-linha">
                  <Link
                    href={c.href}
                    className="group flex items-baseline justify-between gap-4 py-3 hover:text-azul"
                  >
                    <span className="font-medium">{c.texto}</span>
                    <span className="text-sm text-tinta-suave group-hover:text-azul">
                      {c.detalhe} →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/municipios" className="mt-5 inline-block text-azul underline underline-offset-2">
              Ver todos os municípios por região
            </Link>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold">Eleições disponíveis</h2>
            <ul className="mt-4 space-y-4 border-t border-tinta pt-4">
              {ELEICOES.map((e) => (
                <li key={e.id}>
                  <Link href={`/resultados?eleicao=${e.id}`} className="font-medium hover:text-azul">
                    {e.titulo}
                  </Link>
                  <p className="text-sm text-tinta-suave">
                    {e.cargos.map((c) => c.nome).join(", ")}
                    {e.municipal ? " (por município)" : ""}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-tinta-suave">
              A eleição de 2026 acontece em 4 de outubro. Os resultados só existirão após a
              apuração.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
