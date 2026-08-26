import { X, Plus, Minus, ShoppingCart } from "lucide-react";

export default function ProductModal({
  product,
  selectedSize,
  setSelectedSize,
  selectedType,
  setSelectedType,
  quantity,
  setQuantity,
  onClose,
  onAddToCart,
}) {
  if (!product) return null;

  const currentPrice =
    selectedType === "socio" ? product.priceSocio : product.priceNormal;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-black/60 text-neutral-400 hover:text-white p-2 rounded-full backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Imagem do Produto */}
        <div className="md:w-1/2 bg-neutral-950 relative min-h-[250px]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Formulário de Seleção */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-xs text-[#ea580c] font-bold uppercase tracking-wider">
              Coleção Manguezal
            </span>
            <h2 className="text-xl font-bold text-white">{product.name}</h2>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-[#ea580c]">
                R$ {currentPrice.toFixed(2)}
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              {product.description}
            </p>

            {/* Seleção de Categoria (Sócio x Geral) */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                Categoria:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedType("socio")}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                    selectedType === "socio"
                      ? "bg-[#ea580c] text-white border border-[#ea580c]"
                      : "bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700"
                  }`}
                >
                  Sócio Atleta (R$ {product.priceSocio.toFixed(2)})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType("normal")}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                    selectedType === "normal"
                      ? "bg-neutral-800 text-white border border-neutral-500"
                      : "bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700"
                  }`}
                >
                  Geral (R$ {product.priceNormal.toFixed(2)})
                </button>
              </div>
            </div>

            {/* Seleção de Tamanho */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                Tamanho:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedSize === size
                        ? "bg-[#ea580c] text-white border border-[#ea580c]"
                        : "bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Controle de Quantidade */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                Quantidade:
              </label>
              <div className="flex items-center gap-3 bg-neutral-950 w-max p-1 rounded-lg border border-neutral-800">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold text-white px-2">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onAddToCart}
            className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4"
          >
            <ShoppingCart className="w-4 h-4" />
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
}