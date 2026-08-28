import { Users, CheckCircle, Clock, UserX, TrendingUp, Dumbbell } from "lucide-react";
import { formatBRL, formatDate, PLAN_LABELS, PAY_LABELS, PAY_STATUS } from "./data";

export default function AssociadosSection({ athletes, payments, onOpenModal }) {
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

  return (
    <section>
      <h1 className="text-3xl font-bold text-[#ea580c] mb-6">Dashboard de Associados</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => onOpenModal("total")}
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
          onClick={() => onOpenModal("active")}
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
          onClick={() => onOpenModal("pending")}
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
          onClick={() => onOpenModal("inactive")}
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
          onClick={() => onOpenModal("single_training")}
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
  );
}