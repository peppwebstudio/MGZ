import { Check } from "lucide-react";

export default function CartToast({ show }) {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#ea580c] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-bold animate-in fade-in slide-in-from-bottom-5">
      <Check className="w-4 h-4 bg-white text-[#ea580c] rounded-full p-0.5" />
      Produto adicionado ao carrinho!
    </div>
  );
}