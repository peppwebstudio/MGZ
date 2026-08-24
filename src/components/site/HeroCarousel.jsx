import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Aqui você vai colocar os links reais dos banners (propaganda da lojinha, campeonatos, etc)
const BANNER_IMAGES = [
  "https://6a8c573297833836f657fbdc.imgix.net/sandbox/img12.jpg", // Banner 1
  "https://6a8c573297833836f657fbdc.imgix.net/sandbox/img24.jpg", // Banner 2
  "https://6a8c573297833836f657fbdc.imgix.net/sandbox/img16.jpg"  // Banner 3
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Muda a imagem a cada 5 segundos
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? BANNER_IMAGES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % BANNER_IMAGES.length);
  };

  return (
    <section className="w-full bg-black py-6 px-4">
      {/* Moldura centralizada na proporção exata 16:9 (slides do Canva) */}
      <div className="relative max-w-5xl mx-auto aspect-[16/9] overflow-hidden rounded-2xl shadow-2xl bg-gray-900 border border-white/10 group">
        {BANNER_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={img}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Seta Esquerda (Anterior) */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white/60 hover:text-[#ea580c] hover:bg-black/60 hover:border-[#ea580c]/50 backdrop-blur-sm border border-white/10 transition-all duration-300"
          aria-label="Banner anterior"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Seta Direita (Próximo) */}
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white/60 hover:text-[#ea580c] hover:bg-black/60 hover:border-[#ea580c]/50 backdrop-blur-sm border border-white/10 transition-all duration-300"
          aria-label="Próximo banner"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Círculos de navegação com fundo semi-transparente */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
          {BANNER_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "bg-[#ea580c] w-6 h-2" 
                  : "bg-white/60 hover:bg-white w-2 h-2" 
              }`}
              aria-label={`Ir para o banner ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}