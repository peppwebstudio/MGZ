import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LOGO_URL = "https://media.base44.com/images/public/user_6a5a5a27bba26be00ddf4962/9f19188ab_profilepicinstagrammanguezal.jpg";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black text-white border-b border-manguezal-orange/30">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="Manguezal"
            className="h-10 w-10 rounded-full object-cover shrink-0"
          />
          <span className="font-display text-xl tracking-wider text-white">MANGUEZAL</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="/#conquistas" className="hover:text-manguezal-orange transition-colors">Conquistas</a>
          <a href="/#modalidades" className="hover:text-manguezal-orange transition-colors">Modalidades</a>
          <a href="/#planos" className="hover:text-manguezal-orange transition-colors">Planos</a>
          <a href="/#parcerias" className="hover:text-manguezal-orange transition-colors">Parcerias</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/direcao" className="hidden sm:block text-xs text-white/60 hover:text-white transition-colors">
            Direção
          </Link>
          <Link
            to="/adesao"
            className="px-4 py-2 bg-manguezal-orange hover:bg-manguezal-orange/90 text-white text-sm font-semibold rounded-md transition-colors"
          >
            Quero me associar
          </Link>
          <button
            className="md:hidden text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden bg-black border-t border-manguezal-orange/20 px-4 py-3 flex flex-col gap-3 text-sm">
          <a href="/#conquistas" onClick={() => setOpen(false)}>Conquistas</a>
          <a href="/#modalidades" onClick={() => setOpen(false)}>Modalidades</a>
          <a href="/#planos" onClick={() => setOpen(false)}>Planos</a>
          <a href="/#parcerias" onClick={() => setOpen(false)}>Parcerias</a>
          <Link to="/direcao" onClick={() => setOpen(false)}>Direção</Link>
        </nav>
      )}
    </header>
  );
}