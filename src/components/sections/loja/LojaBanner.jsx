import { useState, useEffect } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    badge: "",
    title: "",
    description: "",
    tag: "",
    image: "https://6a8c573297833836f657fbdc.imgix.net/sandbox/Gemini_Generated_Image_ttyh7nttyh7nttyh.png",
  },
  {
    badge: "Desconto Exclusivo",
    title: "VANTAGEM DE SÓCIO",
    description:
      "Atletas associados garantem valores especiais em todos os produtos da loja. Selecione a modalidade 'Sócio' no produto!",
    tag: "Sócio Atleta",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
  },
  {
    badge: "Retirada Grátis",
    title: "ENTREGA PELA ATLETICA",
    description:
      "A entrega dos produtos será feita pelos presidentes e diretores da Atlética, em locais e datas previamente combinadas. Fique atento aos avisos!",
    tag: "Frete Grátis",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
  },
];

export default function LojaBanner({ totalCartItems, totalCartValue, onOpenCart }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Troca automática de slides: agora usa setTimeout atrelado ao slide atual.
  // Isso garante que SEMPRE conte 12 segundos do zero quando o slide entra na tela.
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 12000);
    
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const slide = SLIDES[currentSlide];

  // Função auxiliar para não repetir o código dos botões de navegação
  const renderControls = (customMargin = "mt-8") => (
    <div className={`flex items-center gap-4 ${customMargin}`}>
      <button
        onClick={prevSlide}
        aria-label="Slide anterior"
        className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-800/80 backdrop-blur-sm hover:bg-[#ea580c] text-white transition-colors border border-neutral-700 shadow-md"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Indicadores (Dots) */}
      <div className="flex items-center gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Ir para o slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
              index === currentSlide
                ? "w-8 bg-[#ea580c]"
                : "w-2 bg-neutral-700 hover:bg-neutral-500"
            }`}
          />
        ))}
      </div>

      <button
        onClick={nextSlide}
        aria-label="Próximo slide"
        className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-800/80 backdrop-blur-sm hover:bg-[#ea580c] text-white transition-colors border border-neutral-700 shadow-md"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <>
      <section className="relative bg-neutral-900 border-b border-neutral-800 py-10 px-4 overflow-hidden min-h-[320px] flex items-center">
        {/* Luzes / Efeitos Glow ao Fundo */}
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-[#ea580c]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-80 h-80 bg-[#ea580c]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          {currentSlide === 0 ? (
            /* =========================================
               LAYOUT 1: DESTAQUE PRINCIPAL (TELA CHEIA) 
               ========================================= */
            <div className="relative w-full min-h-[360px] md:min-h-[420px] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
              <img
                key={`img-${currentSlide}`}
                src={slide.image}
                alt="Destaque Principal Loja"
                className="absolute inset-0 w-full h-full object-cover object-center animate-in fade-in zoom-in-95 duration-1000"
              />
              
              {/* Renderiza os textos APENAS se eles existirem. Como estão vazios, a imagem fica limpa. */}
              {slide.title && (
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 md:p-12 h-full pointer-events-none">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs uppercase font-bold tracking-widest text-[#ea580c] bg-[#ea580c]/20 px-3 py-1 rounded-full border border-[#ea580c]/30 backdrop-blur-md">
                      {slide.badge}
                    </span>
                    <span className="text-[11px] font-semibold text-neutral-300 bg-black/60 px-2 py-0.5 rounded-full border border-neutral-600 backdrop-blur-md">
                      {slide.tag}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-1 tracking-tight drop-shadow-xl">
                    {slide.title}
                  </h1>
                  <p className="text-neutral-200 text-sm md:text-lg mt-4 max-w-2xl leading-relaxed drop-shadow-md">
                    {slide.description}
                  </p>
                </div>
              )}

              {/* Controles de Navegação Fixados e Centralizados na Base da Imagem */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
                {renderControls("mt-0")}
              </div>
            </div>
          ) : (
            /* =========================================
               LAYOUT 2: DUAS COLUNAS (DEMAIS SLIDES) 
               ========================================= */
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-8 md:gap-12 items-center">
              {/* COLUNA ESQUERDA: Texto */}
              <div className="flex flex-col justify-center min-h-[220px]">
                <div key={`text-${currentSlide}`} className="animate-in slide-in-from-left-8 fade-in duration-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-widest text-[#ea580c] bg-[#ea580c]/10 px-3 py-1 rounded-full border border-[#ea580c]/20">
                      {slide.badge}
                    </span>
                    <span className="text-[11px] font-semibold text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded-full border border-neutral-700">
                      {slide.tag}
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-3 tracking-tight">
                    {slide.title}
                  </h1>

                  <p className="text-neutral-300 text-sm md:text-base mt-2 max-w-xl leading-relaxed">
                    {slide.description}
                  </p>
                </div>

                {/* Controles de Navegação na Esquerda */}
                {renderControls("mt-8")}
              </div>

              {/* COLUNA DIREITA: Imagem */}
              <div className="relative w-full h-[220px] md:h-[320px] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950/60 shadow-2xl">
                <img
                  key={`img-${currentSlide}`}
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center animate-in fade-in duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Botão do Carrinho Flutuante (Intocado) */}
      <button
        onClick={onOpenCart}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#ea580c]/90 backdrop-blur-md hover:bg-[#c2410c] text-white px-5 py-4 rounded-full font-bold shadow-[0_0_15px_rgba(234,88,12,0.4)] transition-all hover:scale-105"
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          {totalCartItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-black text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#ea580c]">
              {totalCartItems}
            </span>
          )}
        </div>

        {totalCartValue > 0 && (
          <span className="text-sm font-bold border-l border-white/30 pl-3 ml-1">
            R$ {totalCartValue.toFixed(2)}
          </span>
        )}
      </button>
    </>
  );
}