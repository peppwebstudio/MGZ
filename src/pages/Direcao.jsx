import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DirecaoHeader from "../components/sections/direcao/DirecaoHeader";
import AssociadosSection from "../components/sections/direcao/AssociadosSection";
import LojinhaSection from "../components/sections/direcao/LojinhaSection";
import DirecaoModal from "../components/sections/direcao/DirecaoModal";
// AQUI ESTÁ A CORREÇÃO: ../../ volta para a raiz do projeto para acessar a pasta server
import { fetchAthletesFromDB, fetchPaymentsFromDB } from "../../server/direcaoService";
import { MOCK_STORE_PRODUCTS } from "../components/sections/direcao/data";

export default function Direcao() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [athletes, setAthletes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [storeProducts, setStoreProducts] = useState(MOCK_STORE_PRODUCTS);
  const [modalData, setModalData] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [athletesData, paymentsData] = await Promise.all([
        fetchAthletesFromDB(),
        fetchPaymentsFromDB(),
      ]);

      setAthletes(athletesData);
      setPayments(paymentsData);
    } catch (err) {
      console.error("Erro ao carregar dados do Asaas/Banco:", err);
      setError("Falha ao carregar informações dos sócios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("manguezal_user");
    navigate("/login");
  };

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
        setModalData({
          title: "Pagadores de Treino Avulso",
          type: "payment",
          list: payments.filter((p) => p.payment_type === "single_training" && p.status === "confirmed"),
        });
        break;
      case "store_buyers":
        setModalData({ title: `Compradores: ${extraData.name}`, type: "store_buyers", list: extraData.buyers, productName: extraData.name });
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-4 border-[#ea580c]/30 border-t-[#ea580c] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <DirecaoHeader onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex justify-between items-center">
            <span>{error}</span>
            <button onClick={loadDashboardData} className="underline hover:text-white">
              Tentar novamente
            </button>
          </div>
        )}

        <AssociadosSection
          athletes={athletes}
          payments={payments}
          onOpenModal={handleOpenModal}
        />

        <LojinhaSection
          storeProducts={storeProducts}
          onOpenModal={handleOpenModal}
        />
      </main>

      <DirecaoModal
        modalData={modalData}
        onClose={() => setModalData(null)}
      />
    </div>
  );
}