import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  UserX, 
  LogOut, 
  TrendingUp, 
  Dumbbell, 
  X, 
  Calendar, 
  ShoppingBag, 
  Package, 
  Eye, 
  Tag, 
  ShoppingCart 
} from "lucide-react";

const formatBRL = (cents) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Helper para formatar datas (YYYY-MM-DD para DD/MM/YYYY)
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const [year, month, day] = dateStr.split("-");
  if (year && month && day) return `${day}/${month}/${year}`;
  return dateStr;
};

const PLAN_LABELS = { single_training: "Treino avulso", monthly: "Mensal", bimonthly: "Bimestral", quarterly: "Trimestral" };
const PAY_LABELS = { pix: "Pix", credit_card: "Cartão", cash: "Dinheiro", transfer: "Transferência", other: "Outro" };
const PAY_STATUS = { awaiting: "Aguardando", confirmed: "Pago", refused: "Recusado", cancelled: "Cancelado", expired: "Expirado", refunded: "Estornado" };

// Dados simulados de atletas (Ajustado com os usuários faltantes e IDs consistentes)
const MOCK_ATHLETES = [
  { id: 1, name: "Carlos Silva", email: "carlos@email.com", association_status: "active", expires_at: "2026-12-31" },
  { id: 2, name: "Ana Souza", email: "ana@email.com", association_status: "active", expires_at: "2026-10-15" },
  { id: 3, name: "Lucas Ferreira", email: "lucas@email.com", association_status: "pending", expires_at: "2026-08-30" },
  { id: 4, name: "Roberto Alves", email: "roberto@email.com", association_status: "inactive", inactive_at: "2026-02-10" },
  { id: 5, name: "João Pedro", email: "joao@email.com", association_status: "active", expires_at: "2026-09-15" },
  { id: 6, name: "Mariana Costa", email: "mariana@email.com", association_status: "inactive", inactive_at: "2026-08-22" }, // Treino avulso geralmente não é membro ativo contínuo
];

// Dados simulados de pagamentos (Ajustado incluindo referência athlete_id para conectar com MOCK_ATHLETES)
const MOCK_PAYMENTS = [
  { id: "1", athlete_id: 1, user_name: "Carlos Silva", payment_type: "quarterly", amount_cents: 19000, payment_method: "pix", status: "confirmed", paid_at: "2026-08-20" },
  { id: "2", athlete_id: 2, user_name: "Ana Souza", payment_type: "bimonthly", amount_cents: 14000, payment_method: "credit_card", status: "confirmed", paid_at: "2026-08-18" },
  { id: "3", athlete_id: 5, user_name: "João Pedro", payment_type: "monthly", amount_cents: 7000, payment_method: "pix", status: "confirmed", paid_at: "2026-08-15" },
  { id: "4", athlete_id: 6, user_name: "Mariana Costa", payment_type: "single_training", amount_cents: 1800, payment_method: "pix", status: "confirmed", paid_at: "2026-08-22" },
  { id: "5", athlete_id: 3, user_name: "Lucas Ferreira", payment_type: "quarterly", amount_cents: 19000, payment_method: "pix", status: "awaiting", paid_at: "2026-08-24" },
];

// Dados simulados da Lojinha (Produtos e Compradores)
const MOCK_STORE_PRODUCTS = [
  {
    id: "p1",
    name: "Camisa Oficial Manguezal 2026",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&auto=format&fit=crop&q=80",
    unit_price_cents: 8000,
    buyers: [
      { id: "b1", name: "Carlos Silva", is_member: true, size: "G", quantity: 2, total_cents: 16000, date: "2026-08-20", payment_method: "pix" },
      { id: "b2", name: "Ana Souza", is_member: true, size: "M", quantity: 1, total_cents: 8000, date: "2026-08-18", payment_method: "credit_card" },
      { id: "b3", name: "Mateus Lima", is_member: false, size: "GG", quantity: 1, total_cents: 8000, date: "2026-08-15", payment_method: "pix" },
    ],
  },
  {
    id: "p2",
    name: "Boné Aba Reta Manguezal",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=150&auto=format&fit=crop&q=80",
    unit_price_cents: 5000,
    buyers: [
      { id: "b4", name: "Lucas Ferreira", is_member: true, size: "Único", quantity: 1, total_cents: 5000, date: "2026-08-21", payment_method: "pix" },
      { id: "b5", name: "Mariana Costa", is_member: false, size: "Único", quantity: 2, total_cents: 10000, date: "2026-08-22", payment_method: "pix" },
    ],
  },
  {
    id: "p3",
    name: "Garrafa Térmica Inox 750ml",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=150&auto=format&fit=crop&q=80",
    unit_price_cents: 6500,
    buyers: [
      { id: "b6", name: "Ana Souza", is_member: true, size: "N/A", quantity: 1, total_cents: 6500, date: "2026-08-19", payment_method: "credit_card" },
    ],
  },
  {
    id: "p4",
    name: "Moletom Manguezal Heavyweight",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=150&auto=format&fit=crop&q=80",
    unit_price_cents: 16000,
    buyers: [
      { id: "b7", name: "Carlos Silva", is_member: true, size: "G", quantity: 1, total_cents: 16000, date: "2026-08-10", payment_method: "pix" },
      { id: "b8", name: "Roberto Alves", is_member: false, size: "M", quantity: 1, total_cents: 16000, date: "2026-08-12", payment_method: "transfer" },
    ],
  },
];

export default function Direcao() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [athletes, setAthletes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [storeProducts, setStoreProducts] = useState([]);

  // Estado para controlar o Modal
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAthletes(MOCK_ATHLETES);
      setPayments(MOCK_PAYMENTS);
      setStoreProducts(MOCK_STORE_PRODUCTS);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("manguezal_user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-4 border-[#ea580c]/30 border-t-[#ea580c] rounded-full animate-spin" />
      </div>
    );
  }

  // Cálculos de Atletas e Planos
  const stats = {
    total: athletes.length,
    active: athletes.filter((a) => a.association_status === "active").length,
    pending: athletes.filter((a) => a.association_status === "pending").length,
    inactive: athletes.filter((a) => a.association_status === "inactive").length,
  };

  const confirmedRevenue = payments
    .filter((p) => p.status === "confirmed")
    .reduce((s, p) => s + (p.amount_cents || 0), 0);

  const singleTrainingsConfirmed = payments.filter(
    (p) => p.payment_type === "single_training" && p.status === "confirmed"
  );

  // Cálculos da Lojinha
  const storeTotalRevenue = storeProducts.reduce((acc, product) => {
    const productTotal = product.buyers.reduce((bAcc, buyer) => bAcc + buyer.total_cents, 0);
    return acc + productTotal;
  }, 0);

  const storeTotalItemsSold = storeProducts.reduce((acc, product) => {
    const productQty = product.buyers.reduce((bAcc, buyer) => bAcc + buyer.quantity, 0);
    return acc + productQty;
  }, 0);

  // Função para abrir o modal de cada categoria
  const handleOpenModal = (type, extraData = null) => {
    switch (type) {
      case "total":
        setModalData({ title: "Todos os Associados", type: "athlete", list: athletes });
        break;
      case "active":
        setModalData({ title: "Associados Ativos", type: "athlete", list: athletes.filter((a) => a.association_status === "active") });
        break;
      case "pending":
        setModalData({ title: "Associados Pendentes", type: "athlete", list: athletes.filter((a) => a.association_status === "pending") });
        break;
      case "inactive":
        setModalData({ title: "Associados Desligados", type: "athlete", list: athletes.filter((a) => a.association_status === "inactive") });
        break;
      case "single_training":
        setModalData({ title: "Pagadores de Treino Avulso", type: "payment", list: singleTrainingsConfirmed });
        break;
      case "store_buyers":
        setModalData({ title: `Compradores: ${extraData.name}`, type: "store_buyers", list: extraData.buyers, productName: extraData.name });
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header da Direção */}
      <header className="bg-black border-b border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold text-xl tracking-wider text-white">DIREÇÃO MANGUEZAL</span>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Ver site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 border border-neutral-700 bg-neutral-900 px-3 py-1.5 rounded-md text-sm text-white hover:bg-neutral-800 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-1" /> Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        
        {/* SEÇÃO 1: PAINEL DE ASSOCIADOS E FINANÇAS */}
        <section>
          <h1 className="text-3xl font-bold text-[#ea580c] mb-6">Dashboard de Associados</h1>

          {/* Métrica de Associados */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => handleOpenModal("total")}
              className="bg-neutral-900 border border-neutral-800 hover:border-blue-500/50 transition-all rounded-xl p-5 text-left hover:scale-[1.02] focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-xs text-neutral-400">Total de associados</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleOpenModal("active")}
              className="bg-neutral-900 border border-neutral-800 hover:border-green-500/50 transition-all rounded-xl p-5 text-left hover:scale-[1.02] focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.active}</div>
                  <div className="text-xs text-neutral-400">Ativos</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleOpenModal("pending")}
              className="bg-neutral-900 border border-neutral-800 hover:border-yellow-500/50 transition-all rounded-xl p-5 text-left hover:scale-[1.02] focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.pending}</div>
                  <div className="text-xs text-neutral-400">Pendentes</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleOpenModal("inactive")}
              className="bg-neutral-900 border border-neutral-800 hover:border-red-500/50 transition-all rounded-xl p-5 text-left hover:scale-[1.02] focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center">
                  <UserX className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.inactive}</div>
                  <div className="text-xs text-neutral-400">Desligados</div>
                </div>
              </div>
            </button>
          </div>

          {/* Métricas Financeiras de Planos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#ea580c]/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#ea580c]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{formatBRL(confirmedRevenue)}</div>
                  <div className="text-xs text-neutral-400">Receita de Planos (Confirmada)</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleOpenModal("single_training")}
              className="bg-neutral-900 border border-neutral-800 hover:border-purple-500/50 transition-all rounded-xl p-5 text-left hover:scale-[1.02] focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{singleTrainingsConfirmed.length}</div>
                  <div className="text-xs text-neutral-400">Treinos avulsos pagos</div>
                </div>
              </div>
            </button>
          </div>

          {/* Extrato / Tabela de Pagamentos */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Extrato de Pagamentos Recentes</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-neutral-800 text-neutral-400">
                    <th className="pb-3 font-medium">Data</th>
                    <th className="pb-3 font-medium">Atleta</th>
                    <th className="pb-3 font-medium">Tipo</th>
                    <th className="pb-3 font-medium">Valor</th>
                    <th className="pb-3 font-medium">Método</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-neutral-500">
                        Nenhum pagamento registrado
                      </td>
                    </tr>
                  )}
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-neutral-800/60 last:border-0 hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3 text-neutral-400">{formatDate(p.paid_at)}</td>
                      <td className="py-3 font-medium text-white">{p.user_name || "Não informado"}</td>
                      <td className="py-3 text-neutral-300">{PLAN_LABELS[p.payment_type] || p.payment_type}</td>
                      <td className="py-3 font-semibold text-white">{formatBRL(p.amount_cents || 0)}</td>
                      <td className="py-3 text-neutral-300">{PAY_LABELS[p.payment_method] || p.payment_method}</td>
                      <td className="py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            p.status === "confirmed"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          }`}
                        >
                          {PAY_STATUS[p.status] || p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SEÇÃO 2: VENDAS DA LOJINHA */}
        <section className="pt-4 border-t border-neutral-800">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="w-7 h-7 text-[#ea580c]" />
            <h2 className="text-3xl font-bold text-[#ea580c]">Vendas da Lojinha</h2>
          </div>

          {/* Cards de Resumo da Lojinha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Tag className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{formatBRL(storeTotalRevenue)}</div>
                <div className="text-xs text-neutral-400">Faturamento Total Geral (Lojinha)</div>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{storeTotalItemsSold} unidades</div>
                <div className="text-xs text-neutral-400">Total de Itens Vendidos</div>
              </div>
            </div>
          </div>

          {/* Tabela Consolidada de Produtos */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-neutral-400" /> Desempenho por Produto
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-neutral-800 text-neutral-400">
                    <th className="pb-3 font-medium">Produto</th>
                    <th className="pb-3 font-medium text-center">Qtd. Vendida</th>
                    <th className="pb-3 font-medium">Faturamento Total</th>
                    <th className="pb-3 font-medium text-right">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {storeProducts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-neutral-500">
                        Nenhum produto registrado na lojinha
                      </td>
                    </tr>
                  )}
                  {storeProducts.map((product) => {
                    const productQty = product.buyers.reduce((acc, b) => acc + b.quantity, 0);
                    const productRevenue = product.buyers.reduce((acc, b) => acc + b.total_cents, 0);

                    return (
                      <tr 
                        key={product.id} 
                        className="border-b border-neutral-800/60 last:border-0 hover:bg-neutral-800/30 transition-colors group cursor-pointer"
                        onClick={() => handleOpenModal("store_buyers", product)}
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-11 h-11 rounded-lg object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-white group-hover:text-[#ea580c] transition-colors">
                                {product.name}
                              </p>
                              <p className="text-xs text-neutral-400">
                                Preço Un.: {formatBRL(product.unit_price_cents)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <span className="bg-neutral-800 text-neutral-200 text-xs font-semibold px-2.5 py-1 rounded-md border border-neutral-700">
                            {productQty}x
                          </span>
                        </td>
                        <td className="py-3 font-semibold text-emerald-400">
                          {formatBRL(productRevenue)}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenModal("store_buyers", product);
                            }}
                            className="inline-flex items-center gap-1.5 bg-neutral-800 hover:bg-[#ea580c] text-neutral-300 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-neutral-700 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" /> Quem Comprou
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL / POP-UP DE LISTAGEM */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative flex flex-col max-h-[85vh]">
            
            {/* Header do Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
              <h3 className="text-xl font-bold text-white pr-4 truncate">{modalData.title}</h3>
              <button
                onClick={() => setModalData(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corpo / Lista de Pessoas */}
            <div className="overflow-y-auto space-y-3 pr-1 flex-1">
              {modalData.list.length === 0 ? (
                <p className="text-center text-neutral-500 py-6">Nenhum registro encontrado.</p>
              ) : (
                modalData.list.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="p-3.5 bg-neutral-950 border border-neutral-800/80 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-white text-sm">
                        {modalData.type === "athlete"
                          ? item.name
                          : modalData.type === "payment"
                          ? item.user_name
                          : item.name}
                      </p>

                      {item.email && <p className="text-xs text-neutral-400">{item.email}</p>}

                      {/* Exibição condicional de datas / tamanho */}
                      {modalData.type === "athlete" && (
                        item.association_status === "inactive" ? (
                          <div className="flex items-center gap-1.5 text-xs text-red-400/90 pt-0.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Desligado em: <strong>{formatDate(item.inactive_at)}</strong></span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-neutral-400 pt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                            <span>Expira em: <strong className="text-neutral-200">{formatDate(item.expires_at)}</strong></span>
                          </div>
                        )
                      )}

                      {modalData.type === "payment" && (
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400 pt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Pago em: <strong className="text-neutral-200">{formatDate(item.paid_at)}</strong></span>
                        </div>
                      )}

                      {/* Informações detalhadas do comprador da lojinha */}
                      {modalData.type === "store_buyers" && (
                        <div className="space-y-1 pt-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700">
                              Tam: <strong className="text-white">{item.size}</strong>
                            </span>
                            <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700">
                              Qtd: <strong className="text-white">{item.quantity}x</strong>
                            </span>
                            <span className="text-xs text-neutral-400">
                              {PAY_LABELS[item.payment_method] || item.payment_method}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                            <span>Comprado em: <strong className="text-neutral-200">{formatDate(item.date)}</strong></span>
                          </div>
                        </div>
                      )}

                      {item.payment_method && modalData.type !== "store_buyers" && (
                        <p className="text-xs text-neutral-400">
                          Método: {PAY_LABELS[item.payment_method] || item.payment_method}
                        </p>
                      )}
                    </div>

                    {/* Badges de Status ou Valoração */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {modalData.type === "athlete" && (
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${
                            item.association_status === "active"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : item.association_status === "pending"
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {item.association_status === "active"
                            ? "Ativo"
                            : item.association_status === "pending"
                            ? "Pendente"
                            : "Desligado"}
                        </span>
                      )}

                      {modalData.type === "payment" && (
                        <span className="text-sm font-bold text-green-400 whitespace-nowrap">
                          {formatBRL(item.amount_cents)}
                        </span>
                      )}

                      {modalData.type === "store_buyers" && (
                        <>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${
                              item.is_member
                                ? "bg-orange-500/10 text-[#ea580c] border border-orange-500/20"
                                : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                            }`}
                          >
                            {item.is_member ? "Sócio" : "Geral"}
                          </span>
                          <span className="text-sm font-bold text-emerald-400 whitespace-nowrap mt-1">
                            {formatBRL(item.total_cents)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer com contador */}
            <div className="mt-4 pt-3 border-t border-neutral-800 text-right text-xs text-neutral-400">
              Total: <span className="font-bold text-white">{modalData.list.length}</span> registro(s)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}