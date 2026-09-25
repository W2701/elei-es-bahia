"use client";
// "use client" = este componente roda no navegador.
// É necessário porque ele reage a um evento (a foto falhar ao carregar).

import Image from "next/image";
import { useState } from "react";

type Props = {
  url: string;
  nome: string;
  tamanho?: number;
};

export default function FotoCandidato({ url, nome, tamanho = 56 }: Props) {
  const [falhou, setFalhou] = useState(false);

  // Se o TSE não tiver a foto, mostramos um espaço neutro (nunca uma foto de outra fonte)
  if (falhou) {
    return (
      <div
        className="flex shrink-0 items-center justify-center border border-linha bg-papel text-center text-[10px] leading-tight text-tinta-suave"
        style={{ width: tamanho, height: tamanho * 1.33 }}
      >
        Foto não
        <br />
        disponível
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={`Foto oficial de ${nome}`}
      width={tamanho}
      height={Math.round(tamanho * 1.33)}
      // A imagem é carregada direto do servidor do TSE, sem passar pelo Next.js
      unoptimized
      onError={() => setFalhou(true)}
      className="shrink-0 border border-linha bg-papel object-cover"
    />
  );
}
