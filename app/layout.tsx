import type { Metadata } from "next";
import { Geist, Source_Serif_4 } from "next/font/google";
import Cabecalho from "@/components/Cabecalho";
import Rodape from "@/components/Rodape";
import "./globals.css";

// Fonte do texto (sem serifa, fácil de ler em tela)
const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Fonte dos títulos (com serifa, estilo jornal)
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

// Título e descrição que aparecem na aba do navegador e no Google
export const metadata: Metadata = {
  title: {
    default: "Eleições Bahia",
    template: "%s · Eleições Bahia",
  },
  description:
    "Resultados eleitorais da Bahia a partir da base oficial do Tribunal Superior Eleitoral (TSE).",
};

// O layout envolve TODAS as páginas: cabeçalho em cima, rodapé embaixo.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${sourceSerif.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Cabecalho />
        <main className="flex-1">{children}</main>
        <Rodape />
      </body>
    </html>
  );
}
