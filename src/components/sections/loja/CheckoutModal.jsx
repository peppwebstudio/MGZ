import { useState } from "react";
import { X, Loader2, Check, Copy, CreditCard, QrCode, MessageCircle } from "lucide-react";

export default function CheckoutModal({
  isOpen,
  onClose,
  customer,
  setCustomer,
  pixData,           // Dados do QR Code gerado
  cardSuccess,       // Booleano: true se o pagamento via cartão foi aprovado
  loadingPayment,    // Substituiu o loadingPix
  checkoutError,     // Substituiu o pixError
  isSocioError,      // Booleano: se for true, mostra o botão do WhatsApp
  copied,
  onCopyPix,
  onComplete,
  totalCartValue,
  onProcessPayment,  // Função única que vai lidar tanto com PIX quanto Cartão
}) {
  const [paymentMethod, setPaymentMethod] = useState("pix");
  
  // Estado local para os dados do cartão (para não poluir o componente pai)
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envia todos os dados para o componente pai processar junto à API
    onProcessPayment({ paymentMethod, customer, cardData });
  };

  // Numero do WhatsApp para suporte (Substitua pelo número real da atlética)
  const whatsappNumber = "5511999999999"; 
  const whatsappMessage = encodeURIComponent(
    `Oi, estou tendo problemas com a compra na lojinha relacionada ao meu plano de sócio atleta. Meu CPF é o ${customer.cpf || "..."}. Pode me ajudar?`
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SE SUCESSO NO CARTÃO */}
        {cardSuccess ? (
          <div className="text-center space-y-4 py-6">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">Pagamento Aprovado!</h3>
            <p className="text-sm text-neutral-400">
              Seu pedido foi confirmado com sucesso. Obrigado por fortalecer a Manguezal!
            </p>
            <button
              onClick={onComplete}
              className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-3 rounded-xl transition-colors mt-6"
            >
              Fechar
            </button>
          </div>
        ) : 
        
        /* SE PIX GERADO */
        pixData ? (
          <div className="text-center space-y-4">
            <div className="border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold text-white">Pagamento PIX Gerado!</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Escaneie o QR Code abaixo com o aplicativo do seu banco:
              </p>
            </div>

            <div className="bg-white p-3 rounded-2xl w-max mx-auto border-4 border-[#ea580c]/20">
              <img
                src={`data:image/png;base64,${pixData.encodedImage}`}
                alt="QR Code PIX"
                className="w-48 h-48"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs text-neutral-400 font-semibold">
                Ou copie o código abaixo:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={pixData.payload}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 truncate focus:outline-none"
                />
                <button
                  onClick={onCopyPix}
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>

            <button
              onClick={onComplete}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors mt-2"
            >
              Concluir / Já Realizei o Pagamento
            </button>
          </div>
        ) : 
        
        /* FORMULÁRIO DE CHECKOUT (PIX OU CARTÃO) */
        (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold text-white">Finalizar Compra</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Total a pagar: <strong className="text-[#ea580c]">R$ {totalCartValue.toFixed(2)}</strong>
              </p>
            </div>

            {/* SELEÇÃO DO MÉTODO DE PAGAMENTO */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("pix")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all ${
                  paymentMethod === "pix"
                    ? "bg-[#ea580c]/10 border-[#ea580c] text-[#ea580c]"
                    : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                }`}
              >
                <QrCode className="w-4 h-4" />
                PIX
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("credit_card")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all ${
                  paymentMethod === "credit_card"
                    ? "bg-[#ea580c]/10 border-[#ea580c] text-[#ea580c]"
                    : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Cartão
              </button>
            </div>

            {/* ERRO GENÉRICO E ERRO DE SÓCIO */}
            {checkoutError && (
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex flex-col gap-3">
                <p className="text-red-400 text-xs font-medium">{checkoutError}</p>
                
                {/* BOTÃO DO WHATSAPP - Só aparece se isSocioError for true */}
                {isSocioError && (
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#1ebe5d] text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Resolver pelo WhatsApp
                  </a>
                )}
              </div>
            )}

            {/* DADOS DO COMPRADOR */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white mb-2">Seus Dados</h4>
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Nome</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jamyle Silva"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">CPF (Apenas números)</label>
                  <input
                    type="text"
                    required
                    placeholder="00011122233"
                    value={customer.cpf}
                    onChange={(e) => setCustomer({ ...customer, cpf: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">E-mail</label>
                  <input
                    type="email"
                    required
                    placeholder="atleta@email.com"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>

              {/* DROPDOWN DE TURMA */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Turma</label>
                <select
                  required
                  value={customer.turma || ""}
                  onChange={(e) => setCustomer({ ...customer, turma: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                >
                  <option value="" disabled>Selecione sua turma</option>
                  {/* Array.from gera os números de 127 a 115 dinamicamente */}
                  {Array.from({ length: 13 }, (_, i) => 127 - i).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                  <option value="Ex-aluno">Ex-aluno</option>
                </select>
              </div>
            </div>

            {/* DADOS DO CARTÃO (Só aparece se selecionar cartão) */}
            {paymentMethod === "credit_card" && (
              <div className="space-y-3 pt-3 border-t border-neutral-800 animate-in fade-in slide-in-from-top-2">
                <h4 className="text-sm font-bold text-white mb-2">Dados do Cartão</h4>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Número do Cartão</label>
                  <input
                    type="text"
                    required={paymentMethod === "credit_card"}
                    placeholder="0000 0000 0000 0000"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
                
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Nome impresso no Cartão</label>
                  <input
                    type="text"
                    required={paymentMethod === "credit_card"}
                    placeholder="JAMYLE SILVA"
                    value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Validade (MM/AA)</label>
                    <input
                      type="text"
                      required={paymentMethod === "credit_card"}
                      placeholder="12/29"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Cód. Segurança (CVV)</label>
                    <input
                      type="text"
                      required={paymentMethod === "credit_card"}
                      placeholder="123"
                      maxLength="4"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* BOTÃO DE SUBMIT */}
            <button
              type="submit"
              disabled={loadingPayment}
              className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm mt-4 disabled:opacity-50"
            >
              {loadingPayment ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : paymentMethod === "pix" ? (
                "Gerar QR Code PIX"
              ) : (
                "Pagar com Cartão"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}