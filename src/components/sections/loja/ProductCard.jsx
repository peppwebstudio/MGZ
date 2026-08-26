import { Plus } from "lucide-react";

export default function ProductCard({
  product,
  currentType,
  currentPrice,
  onOpenProduct,
  onTypeChange,
}) {
  return (
    <div
      onClick={() => onOpenProduct(product)}
      className="bg-neutral-900 border border-neutral-800 hover:border-[#ea580c]/50 rounded-2xl overflow-hidden cursor-pointer group transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#ea580c]/5 flex flex-col justify-between"
    >
      <div>
        {/* Imagem do Produto */}
        <div className="relative aspect-square overflow-hidden bg-neutral-950">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Info do Produto */}
        <div className="p-3.5 space-y-3">
          <h3 className="text-sm font-semibold text-neutral-200 line-clamp-2 group-hover:text-[#ea580c] transition-colors">
            {product.name}
          </h3>

          {/* Dupla Seleção de Categoria (Sócio x Geral) */}
          <div
            className="grid grid-cols-2 gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-[11px] font-semibold"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => onTypeChange(product.id, "socio")}
              className={`py-1 px-1 rounded-lg text-center transition-all ${
                currentType === "socio"
                  ? "bg-[#ea580c] text-white font-bold shadow"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Sócio
            </button>
            <button
              type="button"
              onClick={() => onTypeChange(product.id, "normal")}
              className={`py-1 px-1 rounded-lg text-center transition-all ${
                currentType === "normal"
                  ? "bg-neutral-800 text-white font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Geral
            </button>
          </div>
        </div>
      </div>

      {/* Preço e Ação */}
      <div className="p-3.5 pt-2 flex items-end justify-between">
        <div>
          <span className="text-lg font-extrabold text-[#ea580c]">
            R$ {currentPrice.toFixed(2)}
          </span>
        </div>

        <div className="w-8 h-8 rounded-lg bg-neutral-800 group-hover:bg-[#ea580c] text-neutral-300 group-hover:text-white flex items-center justify-center transition-colors">
          <Plus className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}