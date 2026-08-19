import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function Sucesso() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-emerald-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Solicitação Enviada!
        </h1>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          Sua mensagem foi recebida com sucesso. Em breve nossa equipe entrará em contato com você.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}