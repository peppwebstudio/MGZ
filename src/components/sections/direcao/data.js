import { PRODUCTS } from "../loja/Produtos";

export const formatBRL = (cents) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const [year, month, day] = dateStr.split("-");
  if (year && month && day) return `${day}/${month}/${year}`;
  return dateStr;
};

// Função auxiliar que busca a imagem do produto oficial pelo ID
export const getProductImage = (productId) => {
  const product = PRODUCTS.find((p) => String(p.id) === String(productId));
  return product?.image || "https://placehold.co/150x150/1a1a1a/666666?text=Sem+Imagem";
};

// Mapeamentos de rótulos da interface
export const PLAN_LABELS = { 
  single_training: "Treino avulso", 
  monthly: "Mensal", 
  bimonthly: "Bimestral", 
  quarterly: "Trimestral",
  semiannual: "Semestral",
  annual: "Anual" 
};

export const PAY_LABELS = { 
  pix: "Pix", 
  credit_card: "Cartão", 
  cash: "Dinheiro", 
  transfer: "Transferência", 
  boleto: "Boleto",
  other: "Outro" 
};

export const PAY_STATUS = { 
  awaiting: "Aguardando", 
  confirmed: "Pago", 
  refused: "Recusado", 
  cancelled: "Cancelado", 
  expired: "Expirado", 
  refunded: "Estornado" 
};

// Mapeamento dos status retornados pelos Webhooks/API do Asaas para o padrão interno
export const parseAsaasStatus = (asaasStatus) => {
  switch (asaasStatus?.toUpperCase()) {
    case "RECEIVED":
    case "CONFIRMED":
    case "RECEIVED_IN_CASH":
      return "confirmed";
    case "PENDING":
    case "AWAITING_RISK_ANALYSIS":
      return "awaiting";
    case "OVERDUE":
      return "expired";
    case "REFUNDED":
    case "REFUND_REQUESTED":
    case "CHARGEBACK_REQUESTED":
      return "refunded";
    default:
      return "cancelled";
  }
};

export const parseAsaasPaymentMethod = (method) => {
  switch (method?.toUpperCase()) {
    case "PIX":
      return "pix";
    case "CREDIT_CARD":
      return "credit_card";
    case "BOLETO":
      return "boleto";
    default:
      return "other";
  }
};

// Array de vendas mockado para o dashboard, puxando a imagem real do produto pelo ID
export const MOCK_STORE_PRODUCTS = [
  {
    id: 1, // Leque
    name: "Leque",
    image: getProductImage(1),
    unit_price_cents: 4500,
    buyers: [
      { id: "b1", name: "Carlos Silva", is_member: true, size: "Único", quantity: 1, total_cents: 3500, date: "2026-08-20", payment_method: "pix" }
    ],
  },
  {
    id: 11, // Camisa Oversized Bicampeão
    name: "Camisa Oversized Bicampeão",
    image: getProductImage(11),
    unit_price_cents: 6500,
    buyers: [
      { id: "b2", name: "Ana Souza", is_member: false, size: "M", quantity: 1, total_cents: 6500, date: "2026-08-18", payment_method: "credit_card" }
    ],
  },
  {
    id: 4, // Caneca
    name: "Caneca Bicampeão + Tirante",
    image: getProductImage(4),
    unit_price_cents: 4500,
    buyers: [],
  }
];