import { X, Calendar } from "lucide-react";
import { formatBRL, formatDate, PAY_LABELS } from "./data";

export default function DirecaoModal({ modalData, onClose }) {
  if (!modalData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
          <h3 className="text-xl font-bold text-white pr-4 truncate">{modalData.title}</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          {modalData.list.length === 0 ? (
            <p className="text-center text-neutral-500 py-6">Nenhum registro encontrado.</p>
          ) : (
            modalData.list.map((item, index) => {
              // Mapeamentos robustos para lidar com os dados recebidos do backend/Stripe
              const isMember = item.is_member === true || item.is_member === "true" || item.price_type === "member" || item.price_type === "socio";
              const buyerName = item.buyer_name || item.user_name || item.name || "Cliente não identificado";
              const buyerEmail = item.buyer_email || item.email;
              const payMethod = item.payment_method || item.payment_type;
              const purchaseDate = item.date || item.created_at || item.paid_at;
              const totalAmount = item.total_cents || item.amount_cents || 0;

              return (
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
                        : buyerName}
                    </p>

                    {/* Exibe o Email para todos os tipos (se existir) */}
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

                    {modalData.type === "store_buyers" && (
                      <div className="space-y-1 pt-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700">
                            Tam: <strong className="text-white">{item.size || "-"}</strong>
                          </span>
                          <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700">
                            Qtd: <strong className="text-white">{item.quantity || 1}x</strong>
                          </span>
                          {payMethod && (
                            <span className="text-xs text-neutral-400">
                              Pago via: {PAY_LABELS?.[payMethod] || payMethod}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                          <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Comprado em: <strong className="text-neutral-200">{formatDate(purchaseDate)}</strong></span>
                        </div>
                      </div>
                    )}

                    {payMethod && modalData.type !== "store_buyers" && (
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

                    {modalData.type === "store_buyers" && (
                      <>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${
                            isMember
                              ? "bg-orange-500/10 text-[#ea580c] border border-orange-500/20"
                              : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                          }`}
                        >
                          {isMember ? "Sócio" : "Geral"}
                        </span>
                        <span className="text-sm font-bold text-emerald-400 whitespace-nowrap mt-1">
                          {formatBRL(totalAmount)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-800 text-right text-xs text-neutral-400">
          Total: <span className="font-bold text-white">{modalData.list.length}</span> registro(s)
        </div>
      </div>
    </div>
  );
}