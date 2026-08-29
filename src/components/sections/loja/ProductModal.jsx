import React, { useState } from "react";
import { X, Plus, Minus, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  // ==========================================
  // 📸 GALERIA DE IMAGENS
  // ==========================================
  // O primeiro item é a foto principal do produto. 
  // Para adicionar o guia de medidas ou outras fotos, basta descomentar 
  // as linhas abaixo e colar os seus links entre as aspas.
  const galleryImages = [
    product.image, 
    // "COLE_AQUI_O_LINK_DO_GUIA_DE_MEDIDAS", 
    // "COLE_OUTRO_LINK_AQUI_SE_QUISER",
  ].filter(Boolean); // O filter evita renderizar links vazios

  const currentPrice =
    selectedType === "socio" ? product.priceSocio : product.priceNormal;

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-black/60 text-neutral-400 hover:text-white p-2 rounded-full backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lado Esquerdo - Galeria de Imagens (Proporção 1:1) */}
        <div className="w-full md:w-1/2 bg-neutral-950 flex flex-col">
          {/* Imagem Principal */}
          <div className="w-full aspect-square relative flex items-center justify-center">
            <img
              src={galleryImages[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-contain p-2" // object-contain garante que a foto não seja cortada
            />
            
            {/* Setas (Só aparecem se tiver mais de 1 imagem no array) */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-[#ea580c] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-[#ea580c] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Miniaturas (Thumbnails) */}
          {galleryImages.length > 1 && (
            <div className="flex gap-3 p-4 overflow-x-auto bg-neutral-900/50 justify-center">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    currentImageIndex === idx 
                      ? "border-[#ea580c] opacity-100" 
                      : "border-transparent opacity-40 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lado Direito - Formulário de Seleção */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-xs text-[#ea580c] font-bold uppercase tracking-wider">
              Coleção Manguezal
            </span>
            <h2 className="text-2xl font-bold text-white">{product.name}</h2>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-[#ea580c]">
                R$ {currentPrice.toFixed(2)}
              </span>
            </div>

            <p className="text-sm text-neutral-400 leading-relaxed">
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
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
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
              <div className="flex items-center gap-3 bg-neutral-950 w-max p-1.5 rounded-xl border border-neutral-800">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-base font-bold text-white px-3">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onAddToCart}
            className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[#ea580c]/20"
          >
            <ShoppingCart className="w-5 h-5" />
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
}