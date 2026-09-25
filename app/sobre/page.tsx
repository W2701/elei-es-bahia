import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sobre os dados" };

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-2 border-t border-linha py-8 md:grid-cols-[14rem_1fr] md:gap-10">
      <h2 className="font-serif text-xl font-semibold">{titulo}</h2>
      <div className="space-y-3 leading-relaxed text-tinta-suave [&_a]:text-azul [&_a]:underline [&_strong]:text-tinta">
        {children}
      </div>
    </section>
  );
}

export default function PaginaSobre() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-sm uppercase tracking-wide text-tinta-suave">Sobre os dados</p>
      <h1 className="mt-1 font-serif text-3xl font-semibold sm:text-4xl">
        De onde vêm as informações
      </h1>
      <p className="mt-4 text-lg text-tinta-suave">
        Todas as informações eleitorais deste site são buscadas diretamente de fontes
        oficiais, no momento da consulta. Nenhum dado é digitado à mão.
      </p>

      <div className="mt-10">
        <Secao titulo="Fonte principal">
          <p>
            <strong>Tribunal Superior Eleitoral (TSE)</strong>, servidor oficial de
            resultados: <a href="https://resultados.tse.jus.br">resultados.tse.jus.br</a>.
            É o mesmo servidor usado pelo aplicativo Resultados do TSE.
          </p>
          <p>
            Dele vêm: nomes, números, partidos, coligações, vices e suplentes, votos,
            percentuais, situação de cada candidato, totais de comparecimento, abstenção,
            brancos e nulos, e as fotos oficiais.
          </p>
        </Secao>

        <Secao titulo="Fonte complementar">
          <p>
            <strong>Instituto Brasileiro de Geografia e Estatística (IBGE)</strong>,{" "}
            <a href="https://servicodados.ibge.gov.br/api/docs">API de Localidades</a>: nome
            dos municípios com acentuação e divisão em regiões geográficas intermediárias e
            imediatas. Não é dado eleitoral.
          </p>
        </Secao>

        <Secao titulo="Como os dados são processados">
          <p>
            1. O site chama a URL do TSE correspondente à eleição, ao cargo e ao município
            escolhidos. 2. A resposta, em formato JSON, é convertida para um formato mais
            simples. 3. Os candidatos são ordenados pelo número de votos. 4. A página exibe
            o resultado.
          </p>
          <p>
            As respostas ficam guardadas em cache por até 1 hora para não sobrecarregar o
            servidor do TSE. A data de totalização informada pelo TSE aparece em cada
            resultado.
          </p>
        </Secao>

        <Secao titulo="Oficial ou calculado">
          <p>
            <strong>Dado oficial:</strong> tudo o que aparece nos resultados, inclusive os
            percentuais, que já vêm calculados pelo TSE sobre os votos válidos.
          </p>
          <p>
            <strong>Organização do site:</strong> a ordenação por votos e o agrupamento de
            municípios por região. A barra ao lado de cada candidato representa o percentual
            oficial numa escala de 0% a 100%.
          </p>
        </Secao>

        <Secao titulo="Limitações">
          <p>
            O TSE não publica documentação para programadores deste servidor. A estrutura
            dos endereços foi identificada a partir do índice que o próprio servidor
            disponibiliza e pode mudar sem aviso.
          </p>
          <p>
            Estão disponíveis as eleições de 2022 (1º turno) e 2024 (1º e 2º turnos). O 2º
            turno de 2022 para governador existe no servidor apenas em formato resumido, sem
            nomes, e ainda não é exibido. Eleições anteriores a 2022 não estão nesse servidor;
            elas estão no{" "}
            <a href="https://dadosabertos.tse.jus.br/">Portal de Dados Abertos do TSE</a>.
          </p>
          <p>
            A eleição de 2026 acontece em 4 de outubro de 2026. Seus resultados só existirão
            após a apuração.
          </p>
        </Secao>

        <Secao titulo="Neutralidade">
          <p>
            Projeto acadêmico e apartidário. O site apresenta dados oficiais sem recomendar,
            avaliar ou classificar candidatos, partidos ou posições políticas.
          </p>
        </Secao>
      </div>
    </div>
  );
}
