import React from "react";

const MEDCOF_URL = "https://media.base44.com/images/public/user_6a5a5a27bba26be00ddf4962/648490fd1_imagem_2026-08-18_184111269.png";
const HEPPI_URL = "https://media.base44.com/images/public/user_6a5a5a27bba26be00ddf4962/04d8cef23_imagem_2026-08-18_184211884.png";

export default function SiteFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-display text-2xl mb-2 text-manguezal-orange">MANGUEZAL</h3>
            <p className="text-white/60 text-sm max-w-md">
              Associação Atlética Académica UPE — Medicina/UPE. Campeã geral do V e VI Intermed Pernambuco.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Parcerias</h4>
            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-white rounded-lg p-3 h-20 w-32 flex items-center justify-center">
                <img src={MEDCOF_URL} alt="Grupo MedCof" className="h-12 w-24 object-contain" />
              </div>
              <div className="bg-[#9D2420] rounded-lg p-3 h-20 w-32 flex items-center justify-center">
                <img src={HEPPI_URL} alt="HEPPI" className="h-12 w-24 object-contain" />
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-white/40 text-xs">
          © {new Date().getFullYear()} Associação Atlética Académica UPE — Manguezal. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}