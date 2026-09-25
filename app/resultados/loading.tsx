// O Next.js mostra este arquivo automaticamente enquanto a página
// de resultados espera a resposta do TSE ("skeleton loading").

export default function Carregando() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-10 sm:px-6" aria-busy="true">
      <p className="sr-only">Carregando resultados do TSE…</p>
      <div className="h-4 w-24 bg-linha" />
      <div className="mt-3 h-9 w-2/3 bg-linha" />
      <div className="mt-10 h-32 border-y border-linha" />
      <div className="mt-8 grid grid-cols-2 gap-px sm:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 bg-linha/60" />
        ))}
      </div>
      <div className="mt-8 space-y-px">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 bg-superficie p-4">
            <div className="h-[74px] w-14 bg-linha" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-1/3 bg-linha" />
              <div className="h-4 w-1/2 bg-linha/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
