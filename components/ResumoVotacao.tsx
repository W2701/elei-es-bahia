// Números gerais da votação: eleitorado, comparecimento, brancos, nulos...

import type { Totais } from "@/types/eleicao";
import { formatarNumero } from "@/lib/formatar";

export default function ResumoVotacao({ totais }: { totais: Totais }) {
  const itens = [
    { rotulo: "Eleitorado", valor: formatarNumero(totais.eleitorado) },
    {
      rotulo: "Comparecimento",
      valor: formatarNumero(totais.comparecimento),
      detalhe: `${totais.percentualComparecimento}%`,
    },
    {
      rotulo: "Abstenção",
      valor: formatarNumero(totais.abstencao),
      detalhe: `${totais.percentualAbstencao}%`,
    },
    { rotulo: "Votos válidos", valor: formatarNumero(totais.validos) },
    { rotulo: "Brancos", valor: formatarNumero(totais.brancos) },
    { rotulo: "Nulos", valor: formatarNumero(totais.nulos) },
  ];

  return (
    <dl className="grid grid-cols-2 border-t border-l border-linha bg-superficie sm:grid-cols-3 lg:grid-cols-6">
      {itens.map((item) => (
        <div key={item.rotulo} className="border-r border-b border-linha px-4 py-3">
          <dt className="text-xs uppercase tracking-wide text-tinta-suave">{item.rotulo}</dt>
          <dd className="mt-1 font-serif text-xl tabular-nums">
            {item.valor}
            {item.detalhe && (
              <span className="ml-2 font-sans text-sm text-tinta-suave">{item.detalhe}</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
