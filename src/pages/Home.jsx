import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Medal, ChevronRight } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";

const LOGO_URL = "https://media.base44.com/images/public/user_6a5a5a27bba26be00ddf4962/9495250e0_WhatsAppImage2026-08-18at61659PM.jpeg";
const MEDCOF_URL = "https://media.base44.com/images/public/user_6a5a5a27bba26be00ddf4962/648490fd1_imagem_2026-08-18_184111269.png";
const HEPPI_URL = "https://media.base44.com/images/public/user_6a5a5a27bba26be00ddf4962/04d8cef23_imagem_2026-08-18_184211884.png";

const formatBRL = (cents) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const DIVISION_LABELS = { female: "Feminino", male: "Masculino", mixed: "Misto" };

const CONQUISTAS = [
  { label: "Campeã Geral", event: "V Intermed Pernambuco", color: "text-yellow-500" },
  { label: "Campeã Geral", event: "VI Intermed Pernambuco", color: "text-yellow-500" },
  { label: "2º Lugar Geral", event: "IV Intermed Nordeste Litoral Leste", color: "text-gray-400" },
  { label: "2º Lugar Geral", event: "I Intermed Pernambuco", color: "text-gray-400" },
  {label: "2º Lugar Geral", event: "I Intermed Recife", color: "text-gray-400" },
  { label: "3º Lugar Geral", event: "V Intermed Nordeste Litoral Leste", color: "text-amber-700" },
];

const getPlanDescription = (p) => {
  const map = { 
    single_training: "1 treino isolado de 1 modalidade", 
    monthly: "1 mês de acesso às modalidades", 
    bimonthly: "2 meses de acesso", 
    quarterly: "3 meses de acesso" 
  };
  return map[p.payment_type] || "";
};

// Dados locais (mock) para substituir as chamadas do banco de dados do Base44
const MOCK_MODALITIES = [
  { id: "mod_1", sport: "Futsal", division: "male" },
  { id: "mod_2", sport: "Futsal", division: "female" },
  { id: "mod_3", sport: "Vôlei", division: "mixed" },
  { id: "mod_4", sport: "Basquete", division: "male" },
  { id: "mod_5", sport: "Handebol", division: "female" }
];

const MOCK_PLANS = [
  { id: "plan_1", name: "Treino Avulso", price_cents: 1800, payment_type: "single_training" },
  { id: "plan_2", name: "Mensal", price_cents: 7000, payment_type: "monthly" },
  { id: "plan_3", name: "Bimestral", price_cents: 14000, payment_type: "bimonthly" },
  { id: "plan_4", name: "Trimestral", price_cents: 19000, payment_type: "quarterly" }
];

export default function Home() {
  const [modalities, setModalities] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    // Simulando o carregamento dos dados sem usar o base44Client
    setModalities(MOCK_MODALITIES);
    setPlans(MOCK_PLANS);
  }, []);

  const sortedPlans = [...plans].sort((a, b) => {
    if (a.payment_type === "single_training") return 1;
    if (b.payment_type === "single_training") return -1;
    return b.price_cents - a.price_cents;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />
      
      <main className="flex-1">
        <section className="relative bg-gradient-to-b from-[#7a1c19] to-black text-white py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(229,61,14,0.15),transparent_70%)]" />
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <img 
              src={LOGO_URL} 
              alt="Logo Manguezal" 
              className="block w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-full object-cover" 
            />
            <h1 className="font-display text-5xl md:text-7xl tracking-wider mb-2">MANGUEZAL</h1>
            <p className="text-[#ea580c] font-semibold text-sm md:text-base uppercase tracking-widest mb-4">
              Associação Atlética Acadêmica UPE
            </p>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Mais que um time, uma família. A Atlética de Medicina da UPE que transforma o mangue em troféus.
            </p>
            <Link to="/adesao">
              <button className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-lg px-8 py-3 rounded-md transition-colors">
                Quero me associar
              </button>
            </Link>
          </div>
        </section>

        <section id="conquistas" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-display text-3xl md:text-4xl text-center mb-2 text-[#7a1c19]">CONQUISTAS</h2>
            <p className="text-center text-gray-500 mb-10">Nossos títulos nos Intermed</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {CONQUISTAS.map((c, i) => (
                <div key={i} className="border-2 border-[#ea580c]/10 hover:border-[#ea580c]/40 transition rounded-xl bg-white shadow-sm">
                  <div className="flex items-center gap-4 p-6">
                    <Medal className={`w-12 h-12 shrink-0 ${c.color}`} />
                    <div>
                      <div className="font-bold text-lg text-[#7a1c19]">{c.label}</div>
                      <div className="text-sm text-gray-500">{c.event}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="modalidades" className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-display text-3xl md:text-4xl text-center mb-2 text-[#7a1c19]">MODALIDADES</h2>
            <p className="text-center text-gray-500 mb-10">Escolha sua(s) modalidade(s) e faça parte do Manguezal</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {modalities.map((m) => (
                <div key={m.id} className="border-2 border-[#ea580c]/20 hover:border-[#ea580c] transition bg-white rounded-xl shadow-sm">
                  <div className="p-4 text-center">
                    <div className="font-display text-lg text-[#7a1c19]">{m.sport}</div>
                    <div className="text-sm text-gray-500">{DIVISION_LABELS[m.division] || m.division}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="planos" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-display text-3xl md:text-4xl text-center mb-2 text-[#7a1c19]">PLANOS</h2>
            <p className="text-center text-gray-500 mb-10">Escolha o plano ideal para você</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedPlans.map((p) => (
                <div 
                  key={p.id} 
                  className={`relative flex flex-col rounded-xl bg-white shadow-sm border ${
                    p.payment_type === "quarterly" ? "border-[#ea580c] border-2 shadow-lg" : "border-gray-200"
                  }`}
                >
                  {p.payment_type === "quarterly" && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ea580c] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      MAIS VANTAJOSO
                    </div>
                  )}
                  <div className="p-6 pb-2 text-center">
                    <h3 className="font-display text-2xl font-bold">{p.name}</h3>
                  </div>
                  <div className="p-6 pt-0 text-center flex-1 flex flex-col">
                    <div className="text-3xl font-bold text-[#7a1c19] mb-2">{formatBRL(p.price_cents)}</div>
                    <div className="text-sm text-gray-500 mb-6 flex-1">{getPlanDescription(p)}</div>
                    <Link to={`/adesao?plano=${p.id}`} className="mt-auto block w-full">
                      <button className="w-full bg-[#7a1c19] hover:bg-[#5e1312] text-white py-2 px-4 rounded-md transition-colors font-medium">
                        Escolher
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="parcerias" className="py-16 bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-2 text-[#ea580c]">PARCERIAS</h2>
            <p className="text-white/60 mb-10">Apoio que faz o Manguezal crescer</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="bg-white rounded-xl p-6 h-28 w-44 flex items-center justify-center">
                <img src={MEDCOF_URL} alt="Grupo MedCof" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="bg-[#9D2420] rounded-xl p-6 h-28 w-44 flex items-center justify-center">
                <img src={HEPPI_URL} alt="HEPPI" className="max-h-full max-w-full object-contain" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#ea580c] text-white text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-display text-3xl md:text-5xl mb-4 font-bold">FAÇA PARTE DO MANGUEZAL</h2>
            <p className="text-white/90 text-lg mb-8">Associe-se agora e comece a treinar nas suas modalidades favoritas.</p>
            <Link to="/adesao">
              <button className="bg-black hover:bg-black/80 text-white font-bold text-lg px-8 py-4 rounded-md transition-colors flex items-center justify-center mx-auto gap-2">
                Quero me associar <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer simples integrado */}
      <footer className="bg-black text-white py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} Manguezal - Associação Atlética Acadêmica UPE. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}