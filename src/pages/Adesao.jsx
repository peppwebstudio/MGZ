import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2, CreditCard, QrCode, Copy, X, Zap, ShieldCheck } from "lucide-react";
import SiteHeader from "../components/site/SiteHeader";

const BACKEND_URL = "https://manguezal-backend.onrender.com";
const USE_MOCK = false;

const PLANS = [
  {
    id: "token_18",
    name: "1 Token de Treino",
    value: 18.0,
    months: 1,
    cycle: "SINGLE",
    allowSubscription: false,
    label: "Apenas Pagamento Único",
    benefits: ["Acesso a 1 treino avulso", "Sem fidelidade ou recorrência"],
  },
  {
    id: "mensal_70",
    name: "Plano Mensal (1 Mês)",
    value: 70.0,
    months: 1,
    cycle: "MONTHLY",
    allowSubscription: true,
    label: "1 Mês",
    benefits: ["Carteirinha Digital", "Acesso aos treinos do mês", "Desconto em produtos"],
  },
  {
    id: "bimensal_140",
    name: "Plano Bimestral (2 Meses)",
    value: 140.0,
    months: 2,
    cycle: "BIMONTHLY",
    allowSubscription: true,
    label: "Renova a cada 2 meses",
    benefits: ["Economia garantida", "Acesso aos treinos por 2 meses", "Lote prioritário"],
  },
  {
    id: "trimensal_190",
    name: "Plano Trimestral (3 Meses)",
    value: 190.0,
    months: 3,
    cycle: "QUARTERLY",
    allowSubscription: true,
    label: "Renova a cada 3 meses",
    benefits: ["Melhor Custo-Benefício", "Acesso aos treinos da temporada", "Kit exclusivo"],
  },
];

const calculateValidUntil = (monthsCount) => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + monthsCount, 0);
  const year = lastDay.getFullYear();
  const month = String(lastDay.getMonth() + 1).padStart(2, "0");
  const day = String(lastDay.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

async function safeFetch(url, options) {
  const res = await fetch(url, options);
  const contentType = res.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(
      `O servidor backend respondeu com erro (${res.status}). Verifique se o Render concluiu o deploy.`
    );
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Erro desconhecido ao processar requisição.");
  }
  return data;
}

export default function Adesao() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedPlanId, setSelectedPlanId] = useState("mensal_70");
  const [planType, setPlanType] = useState("recorrente");
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [ccv, setCcv] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressNumber, setAddressNumber] = useState("");

  const [pixResult, setPixResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[1];
  const planValue = selectedPlan.value;
  const isSubscription = planType === "recorrente" && selectedPlan.allowSubscription;

  const handleSelectPlan = (plan) => {
    setSelectedPlanId(plan.id);
    if (!plan.allowSubscription) {
      setPlanType("unico");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setPixResult(null);

    const cleanCpf = cpf.replace(/\D/g, "");
    const cleanPhone = phone.replace(/\D/g, "");
    const cleanCardNumber = cardNumber.replace(/\D/g, "");
    const cleanCep = postalCode.replace(/\D/g, "");
    const validUntilDate = calculateValidUntil(selectedPlan.months);

    try {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (paymentMethod === "PIX") {
          setPixResult({
            encodedImage: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
            payload: "00020126580014br.gov.bcb.pix0136CHAVE-PIX-FALSA-MANGUEZAL-TESTE",
          });
        } else {
          navigate("/sucesso");
        }
        return;
      }

      if (isSubscription) {
        const bodyData = {
          name,
          email,
          cpfCnpj: cleanCpf,
          phone: cleanPhone,
          value: planValue,
          cycle: selectedPlan.cycle,
          billingType: paymentMethod,
          planName: selectedPlan.name,
          validUntil: validUntilDate,
          status: "ATIVO",
        };

        if (paymentMethod === "CREDIT_CARD") {
          bodyData.creditCard = { holderName: cardHolder, number: cleanCardNumber, expiryMonth, expiryYear, ccv };
          bodyData.creditCardHolderInfo = { name, email, cpfCnpj: cleanCpf, postalCode: cleanCep, addressNumber, phone: cleanPhone };
        }

        const data = await safeFetch(`${BACKEND_URL}/api/criar-assinatura`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        });

        if (paymentMethod === "PIX" && data.encodedImage) {
          setPixResult(data);
        } else {
          navigate("/sucesso");
        }
      } else {
        const bodyData = {
          name,
          email,
          cpfCnpj: cleanCpf,
          phone: cleanPhone,
          value: planValue,
          description: `Adesão Manguezal - ${selectedPlan.name}`,
          validUntil: validUntilDate,
          status: "ATIVO",
        };

        if (paymentMethod === "PIX") {
          const data = await safeFetch(`${BACKEND_URL}/api/criar-pix`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData),
          });
          setPixResult(data);
        } else {
          const cardPayload = {
            ...bodyData,
            creditCard: { holderName: cardHolder, number: cleanCardNumber, expiryMonth, expiryYear, ccv },
            creditCardHolderInfo: { name, email, cpfCnpj: cleanCpf, postalCode: cleanCep, addressNumber, phone: cleanPhone },
          };

          await safeFetch(`${BACKEND_URL}/api/criar-cartao`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cardPayload),
          });
          navigate("/sucesso");
        }
      }
    } catch (err) {
      setErrorMessage(err.message || "Ocorreu um erro ao processar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPix = () => {
    if (pixResult?.payload) {
      navigator.clipboard.writeText(pixResult.payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans">
      <SiteHeader />

      <main className="max-w-3xl mx-auto px-4 py-10 flex-1 w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#ea580c] bg-[#ea580c]/10 px-3 py-1 rounded-full border border-[#ea580c]/20">
            Seja Sócio Atleta
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">PLANO MANGUEZAL 2026</h1>
          <p className="text-neutral-400 text-sm max-w-md mx-auto">
            Escolha o plano ideal e preencha seus dados para garantir seus benefícios de sócio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => handleSelectPlan(plan)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-neutral-900 border-[#ea580c] shadow-lg shadow-[#ea580c]/10 ring-1 ring-[#ea580c]"
                    : "bg-neutral-900/50 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#ea580c] uppercase tracking-wider">
                      <Zap className="w-4 h-4" /> {plan.label}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#ea580c] flex items-center justify-center text-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-white">
                      R$ {plan.value.toFixed(2).replace(".", ",")}
                    </div>
                    <p className="text-xs font-semibold text-neutral-300 mt-0.5">{plan.name}</p>
                  </div>
                  <ul className="space-y-2 pt-2 border-t border-neutral-800/80 text-xs text-neutral-400">
                    {plan.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#ea580c] shrink-0" /> {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-6">
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl font-semibold">
              {errorMessage}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 block">Tipo de Pagamento:</label>
            <div className="relative bg-neutral-950 p-1.5 rounded-xl border border-neutral-800 grid grid-cols-2 gap-1 select-none">
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#ea580c] rounded-lg transition-all duration-300 ease-in-out shadow-md ${
                  planType === "recorrente" ? "left-1.5" : "left-[calc(50%+3px)]"
                }`}
              />
              <button
                type="button"
                disabled={!selectedPlan.allowSubscription}
                onClick={() => setPlanType("recorrente")}
                className={`relative z-10 py-2.5 text-xs font-bold transition-colors duration-200 text-center flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed ${
                  planType === "recorrente" ? "text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                <Zap className="w-3.5 h-3.5" /> Assinatura Recorrente
              </button>
              <button
                type="button"
                onClick={() => setPlanType("unico")}
                className={`relative z-10 py-2.5 text-xs font-bold transition-colors duration-200 text-center flex items-center justify-center gap-1.5 ${
                  planType === "unico" ? "text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Pagamento Único
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 block">Forma de Pagamento:</label>
            <div className="relative bg-neutral-950 p-1.5 rounded-xl border border-neutral-800 grid grid-cols-2 gap-1 select-none">
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#ea580c] rounded-lg transition-all duration-300 ease-in-out shadow-md ${
                  paymentMethod === "CREDIT_CARD" ? "left-1.5" : "left-[calc(50%+3px)]"
                }`}
              />
              <button
                type="button"
                onClick={() => setPaymentMethod("CREDIT_CARD")}
                className={`relative z-10 py-2.5 text-xs font-bold transition-colors duration-200 text-center flex items-center justify-center gap-1.5 ${
                  paymentMethod === "CREDIT_CARD" ? "text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" /> Cartão de Crédito
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("PIX")}
                className={`relative z-10 py-2.5 text-xs font-bold transition-colors duration-200 text-center flex items-center justify-center gap-1.5 ${
                  paymentMethod === "PIX" ? "text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                <QrCode className="w-3.5 h-3.5" /> PIX
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">Dados do Atleta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">CPF</label>
                <input
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="atleta@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Telefone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="(81) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                />
              </div>
            </div>
          </div>

          {paymentMethod === "CREDIT_CARD" && (
            <div className="space-y-4 pt-2 border-t border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">Dados do Cartão</h3>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Nome no Cartão</label>
                <input
                  type="text"
                  required
                  placeholder="COMO ESTÁ NO CARTÃO"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Número do Cartão</label>
                <input
                  type="text"
                  required
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Mês exp.</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    placeholder="12"
                    value={expiryMonth}
                    onChange={(e) => setExpiryMonth(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Ano exp.</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="2028"
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">CVV</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="123"
                    value={ccv}
                    onChange={(e) => setCcv(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">CEP do Titular</label>
                  <input
                    type="text"
                    required
                    placeholder="50000-000"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Número da Casa</label>
                  <input
                    type="text"
                    required
                    placeholder="100"
                    value={addressNumber}
                    onChange={(e) => setAddressNumber(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#ea580c]/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processando Adesão...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Confirmar Adesão (R$ {planValue.toFixed(2).replace(".", ",")})
              </>
            )}
          </button>
        </form>

        {pixResult && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 text-center space-y-4 relative shadow-2xl text-white">
              <button onClick={() => setPixResult(null)} className="absolute top-3 right-3 text-neutral-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold">Pagamento PIX Gerado!</h3>
              <p className="text-xs text-neutral-400">
                Escaneie o QR Code abaixo no app do seu banco para ativar sua associação:
              </p>
              <div className="bg-white p-3 rounded-2xl border w-max mx-auto">
                <img src={`data:image/png;base64,${pixResult.encodedImage}`} alt="QR Code PIX" className="w-48 h-48" />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-neutral-300">Ou copie a chave abaixo:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={pixResult.payload}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 truncate focus:outline-none"
                  />
                  <button
                    onClick={handleCopyPix}
                    className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>
              <button
                onClick={() => navigate("/sucesso")}
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 rounded-xl text-xs transition-colors mt-2 border border-neutral-700"
              >
                Concluir Adesão
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}