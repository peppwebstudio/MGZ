import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

export default function Sucesso() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="font-display text-3xl mb-3 text-[#7a1c19] font-bold">Adesão registrada!</h1>
          <p className="text-gray-500 mb-8">
            Sua adesão foi registrada e está <strong>aguardando confirmação de pagamento</strong>. Assim que o pagamento for confirmado, sua associação será ativada automaticamente.
          </p>
          <Link to="/">
            <button className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-medium py-2 px-6 rounded-md transition-colors inline-flex items-center justify-center">
              Voltar ao início
            </button>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}