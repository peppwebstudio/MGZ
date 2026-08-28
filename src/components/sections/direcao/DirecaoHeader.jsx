import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function DirecaoHeader({ onLogout }) {
  return (
    <header className="bg-black border-b border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <span className="font-bold text-xl tracking-wider text-white">DIREÇÃO MANGUEZAL</span>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
            Ver site
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center gap-1 border border-neutral-700 bg-neutral-900 px-3 py-1.5 rounded-md text-sm text-white hover:bg-neutral-800 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-1" /> Sair
          </button>
        </div>
      </div>
    </header>
  );
}