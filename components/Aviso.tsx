// Caixa de mensagem usada para erros, resultados vazios e avisos.

type Props = {
  titulo: string;
  children?: React.ReactNode;
  tipo?: "info" | "erro";
};

export default function Aviso({ titulo, children, tipo = "info" }: Props) {
  const cor = tipo === "erro" ? "border-vermelho" : "border-azul";
  return (
    <div role={tipo === "erro" ? "alert" : "status"} className={`border-l-4 ${cor} bg-superficie px-5 py-4`}>
      <p className="font-semibold">{titulo}</p>
      {children && <div className="mt-1 text-sm text-tinta-suave">{children}</div>}
    </div>
  );
}
