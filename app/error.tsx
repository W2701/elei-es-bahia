"use client";
// Se acontecer um erro inesperado em qualquer página, o Next.js mostra
// esta tela no lugar de uma página quebrada.

export default function Erro({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold">Algo deu errado</h1>
      <p className="mt-3 text-tinta-suave">
        Não foi possível exibir esta página. Isso pode acontecer quando o servidor do TSE
        está fora do ar ou demorando para responder.
      </p>
      <button
        onClick={reset}
        className="mt-6 bg-azul px-5 py-2 text-white hover:bg-azul-escuro"
      >
        Tentar novamente
      </button>
    </div>
  );
}
