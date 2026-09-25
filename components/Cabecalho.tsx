import Link from "next/link";

const LINKS = [
  { href: "/", texto: "Início" },
  { href: "/resultados", texto: "Resultados" },
  { href: "/municipios", texto: "Municípios" },
  { href: "/sobre", texto: "Sobre os dados" },
];

export default function Cabecalho() {
  return (
    <header className="border-b border-linha bg-superficie">
      {/* Faixa fina com as cores da bandeira da Bahia */}
      <div className="flex h-1" aria-hidden="true">
        <div className="flex-[3] bg-azul" />
        <div className="flex-1 bg-superficie" />
        <div className="flex-1 bg-vermelho" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-4 sm:px-6">
        <Link href="/" className="leading-tight">
          <span className="block font-serif text-xl font-semibold">Eleições Bahia</span>
          <span className="block text-xs text-tinta-suave">
            Resultados oficiais do TSE
          </span>
        </Link>

        {/* No celular o menu quebra em linha; se não couber, rola para o lado */}
        <nav aria-label="Menu principal" className="-ml-3 max-w-full overflow-x-auto">
          <ul className="flex gap-1 text-sm">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block whitespace-nowrap px-3 py-2 text-tinta-suave hover:text-azul"
                >
                  {link.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
