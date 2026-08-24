import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";

const LOGO_URL = "https://media.base44.com/images/public/user_6a5a5a27bba26be00ddf4962/9f19188ab_profilepicinstagrammanguezal.jpg";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Conquistas", href: "/#conquistas" },
    { name: "Modalidades", href: "/#modalidades" },
    { name: "Planos", href: "/#planos" },
    { name: "Parcerias", href: "/#parcerias" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black text-white border-b border-[#ea580c]/30">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={LOGO_URL} alt="Manguezal" className="h-10 w-10 rounded-full object-cover shrink-0" />
          <span className="font-display text-xl tracking-wider text-white">MANGUEZAL</span>
        </Link>

        {/* Navegação Principal com efeito de linha deslizante no Hover */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative group py-1 text-white hover:text-[#ea580c] transition-colors"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#ea580c] transition-all duration-300 ease-out group-hover:w-full" />
            </a>
          ))}
          
          {/* Botão de Lojinha */}
          <Link 
            to="/loja" 
            className="flex items-center gap-1.5 font-semibold text-[#ea580c] hover:text-[#c2410c] transition-colors bg-[#ea580c]/10 px-3 py-1 rounded-full border border-[#ea580c]/30"
          >
            <ShoppingBag className="w-4 h-4" />
            Lojinha
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Botão Gestão Laranja */}
          <Link 
            to="/login" 
            className="hidden sm:inline-flex items-center justify-center bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold px-4 py-2 rounded-md text-sm transition-all shadow-lg shadow-[#ea580c]/20 border border-[#ea580c]"
          >
            Gestão
          </Link>

          {/* Botão Quero me Associar Laranja */}
          <Link 
            to="/adesao" 
            className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold px-4 py-2 rounded-md text-sm transition-all shadow-lg shadow-[#ea580c]/20 border border-[#ea580c] inline-block text-center"
          >
            Quero me associar
          </Link>

          <button className="md:hidden text-white p-1" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden bg-black border-t border-[#ea580c]/20 px-4 py-3 flex flex-col gap-3 text-sm">
          <a href="/#conquistas" onClick={() => setOpen(false)} className="hover:text-[#ea580c]">Conquistas</a>
          <a href="/#modalidades" onClick={() => setOpen(false)} className="hover:text-[#ea580c]">Modalidades</a>
          <a href="/#planos" onClick={() => setOpen(false)} className="hover:text-[#ea580c]">Planos</a>
          <a href="/#parcerias" onClick={() => setOpen(false)} className="hover:text-[#ea580c]">Parcerias</a>
          <Link to="/loja" onClick={() => setOpen(false)} className="text-[#ea580c] font-semibold flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" /> Lojinha Manguezal
          </Link>
          <Link 
            to="/login" 
            onClick={() => setOpen(false)} 
            className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold px-4 py-2 rounded-md text-center transition-colors mt-1"
          >
            Gestão
          </Link>
        </nav>
      )}
    </header>
  );
}