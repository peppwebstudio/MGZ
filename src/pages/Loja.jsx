import { useState } from "react";
import SiteHeader from "../components/site/SiteHeader";
import { ShoppingCart, Plus, Minus, Trash2, X, Check, Copy, Loader2 } from "lucide-react";

// ⚠️ COLE AQUI A SUA URL GERADA NO RENDER:
const BACKEND_URL = "https://manguezal-backend.onrender.com";

const PRODUCTS = [
  {
    id: 1,
    name: "Leque",
    priceSocio: 35.00,
    priceNormal: 45.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_214316947.png",
    description: "Leque oficial da Atlética Manguezal. Ideal para se refrescar nos treinos e jogos da maior Atlética de Pernambuco.",
    sizes: ["Único"]
  },
  {
    id: 2,
    name: "Jersey Baseball",
    priceSocio: 150.00,
    priceNormal: 165.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_214233725.png",
    description: "Jersey de baseball oficial da Manguezal e a mais bonita do Brasil ",
    sizes: ["XP", "PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 3,
    name: "Jersey Retrô",
    priceSocio: 130.00,
    priceNormal: 145.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_214127066.png",
    description: "Jersey retrô oficial da Manguezal, com gola polo, Ideal para usar em qualquer ocasião.",
    sizes: ["XP", "PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 4,
    name: "Caneca Bicampeão + Tirante Bicampeão",
    priceSocio: 35.00,
    priceNormal: 45.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_213804604.png",
    description: "Caneca Bicampeão + Tirante Bicampeão Laranja ou LGBT.",
    sizes: ["Tirante Laranja", "Tirante LGBT"]
  },
  {
    id: 5,
    name: "Tirante Bicampeão Laranja",
    priceSocio: 6.00,
    priceNormal: 12.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_214419867.png",
    description: "Tirante Bicampeão Laranja e Preto, ideal para pendurar sua caneca oficial da Atlética Manguezal.",
    sizes: ["Único"]
  },
  {
    id: 6,
    name: "Tirante Bicampeão LGBT",
    priceSocio: 6.00,
    priceNormal: 12.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_214623061.png",
    description: "Tirante Bicampeão LGBT, ideal para pendurar sua caneca oficial da Atlética Manguezal.",
    sizes: ["Único"]
  },
  {
    id: 7,
    name: "Caneca 360 + Tirante Comum",
    priceSocio: 35.00,
    priceNormal: 45.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_214921660.png",
    description: "Caneca 360 + Tirante Comum, ideal para pendurar sua caneca oficial da Atlética Manguezal.",
    sizes: ["Comum Laranja", "ComumLGBT"]
  },
  {
    id: 8,
    name: "Caneca 360",
    priceSocio: 30.00,
    priceNormal: 35.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_215656848.png",
    description: "Caneca 360, ideal para tomar a pororoca.",
    sizes: ["Único"]
  },
  {
    id: 9,
    name: "Tirante Comum Laranja",
    priceSocio: 6.00,
    priceNormal: 12.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_215523572.png",
    description: "Tirante Comum Laranja, ideal para pendurar sua caneca oficial da Atlética Manguezal.",
    sizes: ["Único"]
  },
  {
    id: 10,
    name: "Tirante Comum LGBT",
    priceSocio: 6.00,
    priceNormal: 12.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_215807414.png",
    description: "Tirante Comum LGBT, ideal para pendurar sua caneca oficial da Atlética Manguezal.",
    sizes: ["Único"]
  },
  {
    id: 11,
    name: "Camisa Oversized Bicampeão",
    priceSocio: 55.00,
    priceNormal: 65.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_220419016.png",
    description: "Camisa Oversized Bicampeão, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 12,
    name: "Camisa Passeio Preta",
    priceSocio: 50.00,
    priceNormal: 65.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_220608883.png",
    description: "Camisa Passeio Preta, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 13,
    name: "Camisa Passeio Branca",
    priceSocio: 50.00,
    priceNormal: 65.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_220727589.png",
    description: "Camisa Passeio Branca, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 14,
    name: "Cropped Preto",
    priceSocio: 40.00,
    priceNormal: 55.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_221148491.png",
    description: "Cropped Preto, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 15,
    name: "Cropped Branca",
    priceSocio: 40.00,
    priceNormal: 55.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_221504554.png",
    description: "Cropped Branca, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 16,
    name: "Bandana Retrô",
    priceSocio: 35.00,
    priceNormal: 45.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_221940802.png",
    description: "Bandana Retrô, ideal para usar no dia a dia e nas festas",
    sizes: ["Único"]
  },
  {
    id: 17,
    name: "Bandana Comum",
    priceSocio: 35.00,
    priceNormal: 45.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_222713448.png",
    description: "Bandana Comum, ideal para usar no dia a dia e nas festas",
    sizes: ["Único"]
  },
  {
    id: 18,
    name: "Tube Top Laranja",
    priceSocio: 60.00,
    priceNormal: 70.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_223658514.png",
    description: "Tube Top Laranja, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 19,
    name: "Tube Top Preto",
    priceSocio: 60.00,
    priceNormal: 70.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_223229703.png",
    description: "Tube Top Preto, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 20,
    name: "Top Regatinha Preto",
    priceSocio: 70.00,
    priceNormal: 80.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_224520724.png",
    description: "Top Regatinha Preto, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG", "XG", "XXG"]
  },
  {
    id: 21,
    name: "Top Amarração Preto",
    priceSocio: 65.00,
    priceNormal: 80.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_232516068.png",
    description: "Top Amarração Preto, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG", "XG", "XXG"]
  },
  {
    id: 22,
    name: "Calça Dry Fit",
    priceSocio: 80.00,
    priceNormal: 90.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_234210187.png",
    description: "Calça Dry Fit, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG"]
  },
  {
    id: 23,
    name: "Short Saia ",
    priceSocio: 67.00,
    priceNormal: 77.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_234401935.png",
    description: "Short Saia , ideal para usar no dia a dia e nas festas",
    sizes: ["P", "M", "G", "GG", "XG"]
  },
  {
    id: 24,
    name: "Short Doll",
    priceSocio: 45.00,
    priceNormal: 55.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_235006981.png",
    description: "Short Doll, ideal para usar no dia a dia e nas festas",
    sizes: ["P", "M", "G", "GG", "XG"]
  },
  {
    id: 25,
    name: "Calção Esportivo",
    priceSocio: 47.00,
    priceNormal: 57.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_235159098.png",
    description: "Calção Esportivo, ideal para usar no dia a dia e nos treinos",
    sizes: ["P", "M", "G", "GG"]
  },
  {
    id: 26,
    name: "Colete",
    priceSocio: 43.00,
    priceNormal: 53.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-26_005554459.png",
    description: "Colete de jogo, ideal para usar nos treinos e dia a dia",
    sizes: ["Único"]
  },
  {
    id: 27,
    name: "Bucket",
    priceSocio: 35.00,
    priceNormal: 45.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-26_005904951.png",
    description: "Bucket, ideal para usar no dia a dia e nas festas",
    sizes: ["Único"]
  },
  {
    id: 28,
    name: "Meias",
    priceSocio: 25.00,
    priceNormal: 35.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-26_010805647.png",
    description: "Meias, ideal para usar nos treinos e jogos",
    sizes: ["Único"]
  }
];

export default function Loja() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedType, setSelectedType] = useState("socio"); // 'socio' ou 'normal'
  const [productTypes, setProductTypes] = useState({}); // Seleção de cada card
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // Estados do Checkout e Pagamento PIX
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customer, setCustomer] = useState({ name: "", cpf: "", email: "" });
  const [pixData, setPixData] = useState(null);
  const [loadingPix, setLoadingPix] = useState(false);
  const [pixError, setPixError] = useState("");
  const [copied, setCopied] = useState(false);

  // Retorna se o card está selecionado como "socio" ou "normal" (Padrão: "socio")
  const getProductType = (productId) => productTypes[productId] || "socio";

  // Abrir modal do produto
  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0]);
    setSelectedType(getProductType(product.id));
    setQuantity(1);
  };

  // Adicionar item ao carrinho
  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const currentPrice = selectedType === "socio" ? selectedProduct.priceSocio : selectedProduct.priceNormal;
    const userTypeLabel = selectedType === "socio" ? "Sócio Atleta" : "Geral";

    const cartItem = {
      cartId: `${selectedProduct.id}-${selectedSize}-${selectedType}`,
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: currentPrice,
      userType: userTypeLabel,
      image: selectedProduct.image,
      size: selectedSize,
      quantity: quantity
    };

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartId === cartItem.cartId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prevCart, cartItem];
    });

    setSelectedProduct(null);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  // Alterar quantidade no carrinho
  const updateCartQuantity = (cartId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Remover item
  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const totalCartValue = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Abrir Modal de Checkout
  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    setPixData(null);
    setPixError("");
  };

  // Gerar o PIX via API do Render/Asaas
  const handleGerarPix = async (e) => {
    e.preventDefault();
    if (!customer.name || !customer.cpf || !customer.email) {
      setPixError("Por favor, preencha todos os campos.");
      return;
    }

    setLoadingPix(true);
    setPixError("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/criar-pix`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customer.name,
          cpfCnpj: customer.cpf.replace(/\D/g, ""),
          email: customer.email,
          value: totalCartValue,
          description: `Compra Lojinha Manguezal (${totalCartItems} itens)`
        })
      });

      const data = await response.json();

      if (response.ok && data.encodedImage) {
        setPixData(data);
      } else {
        setPixError(data.error || "Ocorreu um erro ao gerar o PIX. Verifique os dados.");
      }
    } catch (err) {
      console.error("Erro ao conectar ao backend:", err);
      setPixError("Não foi possível conectar ao servidor de pagamentos.");
    } finally {
      setLoadingPix(false);
    }
  };

  // Copiar código PIX para a área de transferência
  const handleCopyPix = () => {
    if (pixData?.payload) {
      navigator.clipboard.writeText(pixData.payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans">
      <SiteHeader />

      {/* Banner Principal da Lojinha */}
      <section className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-black border-b border-neutral-800 py-10 px-4 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#ea580c]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#ea580c] bg-[#ea580c]/10 px-3 py-1 rounded-full border border-[#ea580c]/20">
              Produtos Oficiais
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-3">
              MANGUESTORE
            </h1>
            <p className="text-neutral-400 text-sm md:text-base mt-2 max-w-lg">
              Vista a armadura da Manguezal. Roupas e acessórios exclusivos para treinos, jogos, festas e pro dia a dia.
            </p>
          </div>

          {/* Botão do Carrinho Flutuante no Banner */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 py-3 rounded-xl font-bold shadow-lg transition-all hover:scale-105"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {totalCartItems}
                </span>
              )}
            </div>
            <span>Meu Carrinho</span>
            {totalCartValue > 0 && (
              <span className="bg-black/30 px-2 py-0.5 rounded text-xs font-semibold">
                R$ {totalCartValue.toFixed(2)}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Grid de Produtos */}
      <main className="max-w-7xl mx-auto px-4 py-10 flex-1 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {PRODUCTS.map((product) => {
            const currentType = getProductType(product.id);
            const currentPrice = currentType === "socio" ? product.priceSocio : product.priceNormal;

            return (
              <div
                key={product.id}
                onClick={() => handleOpenProduct(product)}
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
                        onClick={() => setProductTypes((prev) => ({ ...prev, [product.id]: "socio" }))}
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
                        onClick={() => setProductTypes((prev) => ({ ...prev, [product.id]: "normal" }))}
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
          })}
        </div>
      </main>

      {/* MODAL POP-UP DE DETALHES E TAMANHO DO PRODUTO */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
            {/* Botão de Fechar */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 z-10 bg-black/60 text-neutral-400 hover:text-white p-2 rounded-full backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Imagem do Produto */}
            <div className="md:w-1/2 bg-neutral-950 relative min-h-[250px]">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Formulário de Seleção */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-xs text-[#ea580c] font-bold uppercase tracking-wider">
                  Coleção Manguezal
                </span>
                <h2 className="text-xl font-bold text-white">{selectedProduct.name}</h2>

                {/* Preço dinâmico conforme categoria selecionada na modal */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-[#ea580c]">
                    R$ {(selectedType === "socio" ? selectedProduct.priceSocio : selectedProduct.priceNormal).toFixed(2)}
                  </span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {selectedProduct.description}
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
                      Sócio Atleta (R$ {selectedProduct.priceSocio.toFixed(2)})
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
                      Geral (R$ {selectedProduct.priceNormal.toFixed(2)})
                    </button>
                  </div>
                </div>

                {/* Seleção de Tamanho */}
                <div className="pt-2">
                  <label className="text-xs font-semibold text-neutral-300 block mb-2">
                    Tamanho:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((size) => (
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
                    <span className="text-sm font-bold text-white px-2">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Botão de Adicionar */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <ShoppingCart className="w-4 h-4" />
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAVETA / MODAL DO CARRINHO */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="bg-neutral-900 border-l border-neutral-800 w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-right duration-200">
            {/* Header do Carrinho */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#ea580c]" />
                  <h3 className="text-lg font-bold text-white">Seu Carrinho</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lista de Itens */}
              <div className="mt-4 space-y-3 overflow-y-auto max-h-[55vh] pr-1">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500 space-y-2">
                    <ShoppingCart className="w-12 h-12 mx-auto opacity-30" />
                    <p className="text-sm">Seu carrinho está vazio.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.cartId}
                      className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between gap-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg bg-neutral-900 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                        <p className="text-[11px] text-neutral-400">
                          Tam: <span className="text-neutral-200 font-bold">{item.size}</span> •{" "}
                          <span className="text-[#ea580c] font-semibold">{item.userType}</span>
                        </p>
                        <p className="text-xs font-bold text-[#ea580c] mt-0.5">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Controles de Quantidade */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateCartQuantity(item.cartId, -1)}
                          className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.cartId, 1)}
                          className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="w-6 h-6 rounded text-red-400 hover:text-red-300 ml-1 flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Total e Checkout */}
            {cart.length > 0 && (
              <div className="border-t border-neutral-800 pt-4 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span>R$ {totalCartValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Retirada no Treino</span>
                    <span className="text-green-400 font-semibold">Grátis</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                    <span>Total</span>
                    <span className="text-[#ea580c] text-lg">R$ {totalCartValue.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleOpenCheckout}
                  className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-[#ea580c]/20"
                >
                  Ir para o Pagamento
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE CHECKOUT & PIX ASAAS */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {!pixData ? (
              <form onSubmit={handleGerarPix} className="space-y-4">
                <div className="border-b border-neutral-800 pb-3">
                  <h3 className="text-lg font-bold text-white">Finalizar Compra via PIX</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Total a pagar: <strong className="text-[#ea580c]">R$ {totalCartValue.toFixed(2)}</strong>
                  </p>
                </div>

                {pixError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl">
                    {pixError}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Jamyle Silva"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      CPF
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      value={customer.cpf}
                      onChange={(e) => setCustomer({ ...customer, cpf: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      E-mail
                    </label>
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

                <button
                  type="submit"
                  disabled={loadingPix}
                  className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm mt-2 disabled:opacity-50"
                >
                  {loadingPix ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Gerando PIX...
                    </>
                  ) : (
                    "Gerar QR Code PIX"
                  )}
                </button>
              </form>
            ) : (
              /* EXIBIÇÃO DO PIX GERADO */
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
                  <p className="text-xs text-neutral-400 font-semibold">Ou copie o código abaixo:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={pixData.payload}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 truncate focus:outline-none"
                    />
                    <button
                      onClick={handleCopyPix}
                      className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copiado!" : "Copiar"}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setCart([]);
                  }}
                  className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors mt-2"
                >
                  Concluir / Já Realizei o Pagamento
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION (Adicionado ao carrinho) */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#ea580c] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-bold animate-in fade-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 bg-white text-[#ea580c] rounded-full p-0.5" />
          Produto adicionado ao carrinho!
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-black border-t border-neutral-800 py-8 px-4 text-center text-xs text-neutral-500 mt-auto">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-bold text-neutral-400">ATLETICA MANGUEZAL © 2026</p>
          <p>Todos os direitos reservados. Entregas e retiradas nos locais oficiais de treino.</p>
        </div>
      </footer>
    </div>
  );
}