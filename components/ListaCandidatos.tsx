// Lista de candidatos com foto, votos e percentual.
// "Mais informações" usa a tag <details> do HTML: abre e fecha sem JavaScript.

import type { Candidato } from "@/types/eleicao";
import { formatarNumero, formatarPercentual } from "@/lib/formatar";
import FotoCandidato from "@/components/FotoCandidato";

// Estilo da situação. Usamos só tons neutros, para não dar peso emocional ao resultado.
function estiloSituacao(situacao: string) {
  if (situacao.startsWith("Eleito")) return "bg-tinta text-white";
  if (situacao.includes("turno")) return "border border-tinta";
  return "text-tinta-suave";
}

export default function ListaCandidatos({ candidatos }: { candidatos: Candidato[] }) {
  return (
    <ol className="divide-y divide-linha border-y border-linha bg-superficie">
      {candidatos.map((c) => (
        <li key={c.sequencial} className="px-4 py-4 sm:px-5">
          <div className="flex gap-4">
            <FotoCandidato url={c.foto} nome={c.nomeUrna} />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                {/* Identificação */}
                <div className="min-w-0">
                  <h3 className="font-serif text-lg font-semibold leading-snug">{c.nomeUrna}</h3>
                  <p className="text-sm text-tinta-suave">{c.nomeCompleto}</p>
                  <p className="mt-1 text-sm">
                    <span className="tabular-nums">Nº {c.numero}</span>
                    <span className="mx-2 text-linha">|</span>
                    <abbr title={c.partidoNome} className="no-underline">
                      {c.partidoSigla}
                    </abbr>
                  </p>
                </div>

                {/* Votos */}
                <div className="sm:text-right">
                  <p className="font-serif text-2xl tabular-nums">
                    {formatarPercentual(c.percentual)}
                  </p>
                  <p className="text-sm tabular-nums text-tinta-suave">
                    {formatarNumero(c.votos)} votos
                  </p>
                </div>
              </div>

              {/* Barra: comprimento proporcional ao % de votos válidos (0 a 100%) */}
              <div className="mt-3 h-1.5 bg-papel" aria-hidden="true">
                <div className="h-full bg-azul" style={{ width: `${c.percentual}%` }} />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className={`px-2 py-0.5 text-xs font-medium ${estiloSituacao(c.situacao)}`}>
                  {c.situacao}
                </span>
                {c.destinoVotos !== "Válido" && (
                  <span className="text-xs text-vermelho">Votos: {c.destinoVotos}</span>
                )}
              </div>

              <details className="mt-3 text-sm">
                <summary className="cursor-pointer text-azul">Mais informações</summary>
                <dl className="mt-2 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-tinta-suave">Partido</dt>
                    <dd>{c.partidoNome}</dd>
                  </div>
                  {c.coligacao && (
                    <div>
                      <dt className="text-tinta-suave">Coligação / federação</dt>
                      <dd>
                        {c.coligacao}
                        <span className="block text-tinta-suave">{c.composicao}</span>
                      </dd>
                    </div>
                  )}
                  {c.companheiros.map((v) => (
                    <div key={v.tipo + v.nome}>
                      <dt className="text-tinta-suave">{v.tipo}</dt>
                      <dd>
                        {v.nomeUrna} ({v.partido})
                        <span className="block text-tinta-suave">{v.nome}</span>
                      </dd>
                    </div>
                  ))}
                  <div>
                    <dt className="text-tinta-suave">Código do candidato no TSE</dt>
                    <dd className="tabular-nums">{c.sequencial}</dd>
                  </div>
                </dl>
              </details>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
