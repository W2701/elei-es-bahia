import Link from "next/link";

export default function Rodape() {
  return (
    <footer className="mt-16 border-t border-linha bg-superficie">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-tinta-suave sm:px-6">
        <p>
          Fonte: Tribunal Superior Eleitoral (TSE), servidor oficial de resultados.
          Regiões geográficas: IBGE.
        </p>
        <p className="mt-2">
          Projeto acadêmico e apartidário. Não recomenda nem avalia candidatos.{" "}
          <Link href="/sobre" className="text-azul underline underline-offset-2">
            Como os dados são obtidos
          </Link>
        </p>
      </div>
    </footer>
  );
}
