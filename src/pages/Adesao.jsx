import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2, CreditCard, QrCode } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";

export default function Adesao() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simula o processamento e manda para a página de sucesso
    setTimeout(() => {
      navigate("/sucesso");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* O seu Header novo entra aqui! */}
      <SiteHeader />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-display font-bold text-[#7a1c19] mb-8 text-center uppercase tracking-wider">
          Adesão Manguezal
        </h1>
        
        <form onSubmit={handleSubscribe} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input 
                type="text" 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
                placeholder="Digite seu nome" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input 
                type="email" 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
                placeholder="seu@email.com" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
              <input 
                type="text" 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
                placeholder="(00) 00000-0000" 
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
              {isLoading ? "Processando..." : "Confirmar Adesão"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}