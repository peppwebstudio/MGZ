import { X, Calendar, ShoppingBag, CreditCard } from "lucide-react";
import { formatBRL, formatDate, PAY_LABELS } from "./data";

export default function DirecaoModal({ modalData, onClose }) {
  if (!modalData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative flex flex-col max-h-[85vh]">
        
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
          <h3 className="text-xl font-bold text-white pr-4 truncate">{modalData.title}</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Itens */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          {modalData.list.length === 0 ? (
            <p className="text-center text-neutral-500 py-6">Nenhum registro encontrado.</p>
          ) : (
            modalData.list.map((item, index) => {
              
              // ==========================================
              // BUSCA PROFUNDA DOS DADOS (Evita erros do BD)
              // ==========================================
              
              // 1. Verificando se é sócio (procura na raiz e no metadata)
              const checkMember = (val) => val === true || val === "true" || val === "member" || val === "socio";
              const isMember = 
                checkMember(item.is_member) || 
                checkMember(item.metadata?.is_member) || 
                checkMember(item.price_type) || 
                checkMember(item.metadata?.price_type) ||
                checkMember(item.metadata?.tipo_ingresso);

              // 2. Nome do comprador
              const buyerName = 
                item.buyer_name || 
                item.customer_name || 
                item.user_name || 
                item.name || 
                item.metadata?.buyer_name || 
                item.metadata?.nome || 
                "Cliente não identificado";

              // 3. Email do comprador
              const buyerEmail = 
                item.buyer_email || 
                item.customer_email || 
                item.email || 
                item.metadata?.buyer_email || 
                item.metadata?.email || 
                "";

              // 4. Detalhes do Produto (Tamanho, Quantidade, Valor)
              const size = item.size || item.tamanho || item.metadata?.size || item.metadata?.tamanho || "-";
              const quantity = item.quantity || item.quantidade || item.metadata?.quantity || 1;
              const totalAmount = item.total_cents || item.amount_cents || item.amount_total || item.amount || 0;
              
              // 5. Pagamento e Data
              const payMethod = item.payment_method || item.payment_type || item.metadata?.payment_method;
              const purchaseDate = item.date || item.created_at || item.paid_at || item.created;

              return (
                <div
                  key={item.id || index}
                  className="p-4 bg-neutral-950 border border-neutral-800/80 rounded-xl shadow-sm"
                >
                  {/* LAYOUT EXCLUSIVO PARA COMPRADORES DA LOJINHA */}
                  {modalData.type === "store_buyers" ? (
                    <div className="flex flex-col gap-3">
                      {/* Linha 1: Dados do Cliente e Valores */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <p className="font-semibold text-white text-base leading-none">
                            {buyerName}
                          </p>
                          {buyerEmail && (
                            <p className="text-sm text-neutral-400">
                              {buyerEmail}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                              isMember
                                ? "bg-orange-500/10 text-[#ea580c] border border-orange-500/30"
                                : "bg-neutral-800 text-neutral-300 border border-neutral-700"
                            }`}
                          >
                            {isMember ? "Sócio Manguezal" : "Público Geral"}
                          </span>
                          <span className="text-base font-bold text-emerald-400">
                            {formatBRL(totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Linha 2: Detalhes do Pedido (Rodapé do Card) */}
                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-neutral-800/60 mt-1">
                        <div className="flex items-center gap-1.5 text-xs bg-neutral-900 text-neutral-300 px-2.5 py-1.5 rounded-md border border-neutral-800">
                          <ShoppingBag className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Tam: <strong className="text-white">{size}</strong></span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xs bg-neutral-900 text-neutral-300 px-2.5 py-1.5 rounded-md border border-neutral-800">
                          <span>Qtd: <strong className="text-white">{quantity}x</strong></span>
                        </div>

                        {payMethod && (
                          <div className="flex items-center gap-1.5 text-xs bg-neutral-900 text-neutral-300 px-2.5 py-1.5 rounded-md border border-neutral-800">
                            <CreditCard className="w-3.5 h-3.5 text-neutral-500" />
                            <span>{PAY_LABELS?.[payMethod] || payMethod}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 text-xs text-neutral-400 ml-auto bg-neutral-900/50 px-2.5 py-1.5 rounded-md">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(purchaseDate)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    
                    /* LAYOUT PARA ATLETAS E PAGAMENTOS (Mantido o formato atual) */
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-semibold text-white text-sm">
                          {modalData.type === "athlete" ? item.name : item.user_name}
                        </p>
                        
                        {buyerEmail && <p className="text-xs text-neutral-400">{buyerEmail}</p>}

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
                        
                        {payMethod && (
                          <p className="text-xs text-neutral-400">
                            Método: {PAY_LABELS?.[payMethod] || payMethod}
                          </p>
                        )}
                      </div>

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
                            {formatBRL(totalAmount)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-between items-center text-sm">
          <span className="text-neutral-500">Dados processados em tempo real</span>
          <div className="text-neutral-400">
            Total de <span className="font-bold text-white">{modalData.list.length}</span> registro(s)
          </div>
        </div>
      </div>
    </div>
  );
}