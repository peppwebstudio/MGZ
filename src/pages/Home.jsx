import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 mb-6">
          Bem-vindo ao Projeto Manguezal
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8">
          Plataforma desenvolvida para gestão e acompanhamento eficiente de operações.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/adesao"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            Fazer Adesão
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-medium hover:bg-slate-100 transition-colors"
          >
            Área Restrita
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <Zap className="w-8 h-8 text-slate-900 mb-4" />
              <h2 className="text-lg font-semibold mb-2">Desempenho</h2>
              <p className="text-sm text-slate-600">
                Interface leve e otimizada para carregamento instantâneo.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <Shield className="w-8 h-8 text-slate-900 mb-4" />
              <h2 className="text-lg font-semibold mb-2">Segurança</h2>
              <p className="text-sm text-slate-600">
                Autenticação integrada e controle de acesso protegido.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-8 h-8 text-slate-900 mb-4" />
              <h2 className="text-lg font-semibold mb-2">Praticidade</h2>
              <p className="text-sm text-slate-600">
                Fluxo contínuo de adesão e gestão centralizada de dados.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}