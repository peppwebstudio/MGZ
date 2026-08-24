import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Adesao from "@/pages/Adesao";
import Sucesso from "@/pages/Sucesso";
import Login from "@/pages/Login";   
import Direcao from "@/pages/Direcao"; 
import Loja from "@/pages/Loja";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adesao" element={<Adesao />} />
        <Route path="/sucesso" element={<Sucesso />} />
        <Route path="/login" element={<Login />} />
        <Route path="/direcao" element={<Direcao />} />    
        <Route path="/loja" element={<Loja />} />
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gray-50">
            <h1 className="text-6xl font-bold text-[#7a1c19] mb-4">404</h1>
            <p className="text-xl text-gray-500 mb-6">Ops! Essa página não existe.</p>
            <a href="/" className="px-6 py-3 bg-orange-600 text-white font-bold rounded-md hover:bg-orange-700 transition">
              Voltar para o início
            </a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}