import Link from "next/link";

export default function NaoEncontrada() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold">Página não encontrada</h1>
      <p className="mt-3 text-tinta-suave">O endereço digitado não existe neste site.</p>
      <Link href="/" className="mt-6 inline-block text-azul underline">
        Voltar ao início
      </Link>
    </div>
  );
}
