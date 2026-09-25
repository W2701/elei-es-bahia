// Funções para exibir números no padrão brasileiro.

// 4019830 -> "4.019.830"
export function formatarNumero(valor: number) {
  return valor.toLocaleString("pt-BR");
}

// 49.451 -> "49,45%"
export function formatarPercentual(valor: number) {
  return (
    valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + "%"
  );
}
