import { useState } from "react";
import { Plus } from "lucide-react";

export const PRODUCTS = [
  {
    id: 1,
    name: "Leque",
    priceSocio: 35.00,
    priceNormal: 45.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_214316947.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_214316947.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Leque oficial da Atlética Manguezal. Ideal para se refrescar nos treinos e jogos da maior Atlética de Pernambuco.",
    sizes: ["Único"]
  },
  {
    id: 2,
    name: "Jersey Baseball",
    priceSocio: 150.00,
    priceNormal: 165.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_214233725.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_214233725.png",
      // "COLE_AQUI_A_FOTO_DAS_COSTAS_DA_JERSEY",
      // "COLE_AQUI_O_GUIA_DE_MEDIDAS_DA_JERSEY"
    ],
    description: "Jersey de baseball oficial da Manguezal e a mais bonita do Brasil ",
    sizes: ["XP", "PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 3,
    name: "Jersey Retrô",
    priceSocio: 130.00,
    priceNormal: 145.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_214127066.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_214127066.png",
      // "COLE_AQUI_O_GUIA_DE_MEDIDAS_DA_JERSEY_RETRO"
    ],
    description: "Jersey retrô oficial da Manguezal, com gola polo, Ideal para usar em qualquer ocasião.",
    sizes: ["XP", "PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 4,
    name: "Caneca Bicampeão + Tirante Bicampeão",
    priceSocio: 35.00,
    priceNormal: 45.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_213804604.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_213804604.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Caneca Bicampeão + Tirante Bicampeão Laranja ou LGBT.",
    sizes: ["Tirante Laranja", "Tirante LGBT"]
  },
  {
    id: 5,
    name: "Tirante Bicampeão Laranja",
    priceSocio: 6.00,
    priceNormal: 12.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_214419867.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_214419867.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Tirante Bicampeão Laranja e Preto, ideal para pendurar sua caneca oficial da Atlética Manguezal.",
    sizes: ["Único"]
  },
  {
    id: 6,
    name: "Tirante Bicampeão LGBT",
    priceSocio: 6.00,
    priceNormal: 12.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_214623061.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_214623061.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Tirante Bicampeão LGBT, ideal para pendurar sua caneca oficial da Atlética Manguezal.",
    sizes: ["Único"]
  },
  {
    id: 7,
    name: "Caneca 360 + Tirante Comum",
    priceSocio: 35.00,
    priceNormal: 45.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_214921660.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_214921660.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Caneca 360 + Tirante Comum, ideal para pendurar sua caneca oficial da Atlética Manguezal.",
    sizes: ["Comum Laranja", "ComumLGBT"]
  },
  {
    id: 8,
    name: "Caneca 360",
    priceSocio: 30.00,
    priceNormal: 35.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_215656848.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_215656848.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Caneca 360, ideal para tomar a pororoca.",
    sizes: ["Único"]
  },
  {
    id: 9,
    name: "Tirante Comum Laranja",
    priceSocio: 6.00,
    priceNormal: 12.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_215523572.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_215523572.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Tirante Comum Laranja, ideal para pendurar sua caneca oficial da Atlética Manguezal.",
    sizes: ["Único"]
  },
  {
    id: 10,
    name: "Tirante Comum LGBT",
    priceSocio: 6.00,
    priceNormal: 12.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_215807414.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_215807414.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Tirante Comum LGBT, ideal para pendurar sua caneca oficial da Atlética Manguezal.",
    sizes: ["Único"]
  },
  {
    id: 11,
    name: "Camisa Oversized Bicampeão",
    priceSocio: 55.00,
    priceNormal: 65.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_220419016.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_220419016.png",
      // "COLE_AQUI_O_GUIA_DE_MEDIDAS_DA_OVERSIZED"
    ],
    description: "Camisa Oversized Bicampeão, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 12,
    name: "Camisa Passeio Preta",
    priceSocio: 50.00,
    priceNormal: 65.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_220608883.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_220608883.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Camisa Passeio Preta, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 13,
    name: "Camisa Passeio Branca",
    priceSocio: 50.00,
    priceNormal: 65.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_220727589.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_220727589.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Camisa Passeio Branca, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 14,
    name: "Cropped Preto",
    priceSocio: 40.00,
    priceNormal: 55.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_221148491.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_221148491.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Cropped Preto, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 15,
    name: "Cropped Branca",
    priceSocio: 40.00,
    priceNormal: 55.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_221504554.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_221504554.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Cropped Branca, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 16,
    name: "Bandana Retrô",
    priceSocio: 35.00,
    priceNormal: 45.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_221940802.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_221940802.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Bandana Retrô, ideal para usar no dia a dia e nas festas",
    sizes: ["Único"]
  },
  {
    id: 17,
    name: "Bandana Comum",
    priceSocio: 35.00,
    priceNormal: 45.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_222713448.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_222713448.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Bandana Comum, ideal para usar no dia a dia e nas festas",
    sizes: ["Único"]
  },
  {
    id: 18,
    name: "Tube Top Laranja",
    priceSocio: 60.00,
    priceNormal: 70.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_223658514.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_223658514.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Tube Top Laranja, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 19,
    name: "Tube Top Preto",
    priceSocio: 60.00,
    priceNormal: 70.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_223229703.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_223229703.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Tube Top Preto, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 20,
    name: "Top Regatinha Preto",
    priceSocio: 70.00,
    priceNormal: 80.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_224520724.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_224520724.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Top Regatinha Preto, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG", "XG", "XXG"]
  },
  {
    id: 21,
    name: "Top Amarração Preto",
    priceSocio: 65.00,
    priceNormal: 80.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_232516068.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_232516068.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Top Amarração Preto, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG", "XG", "XXG"]
  },
  {
    id: 22,
    name: "Calça Dry Fit",
    priceSocio: 80.00,
    priceNormal: 90.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_234210187.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_234210187.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Calça Dry Fit, ideal para usar no dia a dia e nas festas",
    sizes: ["PP", "P", "M", "G", "GG"]
  },
  {
    id: 23,
    name: "Short Saia",
    priceSocio: 67.00,
    priceNormal: 77.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_234401935.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_234401935.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Short Saia , ideal para usar no dia a dia e nas festas",
    sizes: ["P", "M", "G", "GG", "XG"]
  },
  {
    id: 24,
    name: "Short Doll",
    priceSocio: 45.00,
    priceNormal: 55.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_235006981.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_235006981.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Short Doll, ideal para usar no dia a dia e nas festas",
    sizes: ["P", "M", "G", "GG", "XG"]
  },
  {
    id: 25,
    name: "Calção Esportivo",
    priceSocio: 47.00,
    priceNormal: 57.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_235159098.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-25_235159098.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Calção Esportivo, ideal para usar no dia a dia e nos treinos",
    sizes: ["P", "M", "G", "GG"]
  },
  {
    id: 26,
    name: "Colete",
    priceSocio: 43.00,
    priceNormal: 53.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-26_005554459.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-26_005554459.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Colete de jogo, ideal para usar nos treinos e dia a dia",
    sizes: ["Único"]
  },
  {
    id: 27,
    name: "Bucket",
    priceSocio: 35.00,
    priceNormal: 45.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-26_005904951.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-26_005904951.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Bucket, ideal para usar no dia a dia e nas festas",
    sizes: ["Único"]
  },
  {
    id: 28,
    name: "Meias",
    priceSocio: 25.00,
    priceNormal: 35.00,
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-26_010805647.png",
    gallery: [
      "https://6a8c573297833836f657fbdc.imgix.net/sandbox/imagem_2026-08-26_010805647.png",
      // "COLE_AQUI_A_PROXIMA_FOTO"
    ],
    description: "Meias, ideal para usar nos treinos e jogos",
    sizes: ["Único"]
  }
];

export default function Produtos({ onOpenProduct }) {
  const [productTypes, setProductTypes] = useState({});

  const getProductType = (productId) => productTypes[productId] || "socio";

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 flex-1 w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {PRODUCTS.map((product) => {
          const currentType = getProductType(product.id);
          const currentPrice = currentType === "socio" ? product.priceSocio : product.priceNormal;

          return (
            <div
              key={product.id}
              onClick={() => onOpenProduct(product, currentType)}
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

                <div className="w-8 h-8 rounded-lg bg-neutral-800 group-hover:bg-[#ea580c] text-neutral-300 group-hover:text-[#white] flex items-center justify-center transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}