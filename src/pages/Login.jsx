import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn, User, Lock, Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getReturnTo = () => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const target = searchParams.get("returnTo") || searchParams.get("redirect");
      if (target && target.startsWith("/")) return target;
    } catch {
      // ignore
    }
    return "/direcao";
  };

  const returnTo = getReturnTo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Validação restrita de Login e Senha
      if (login.trim() === "maiordepernambuco" && password === "dalamaaocaos") {
        localStorage.setItem(
          "manguezal_user",
          JSON.stringify({
            login: login.trim(),
            role: "admin",
            access_level: "admin",
          })
        );
        navigate(returnTo);
      } else {
        throw new Error("Login ou senha incorretos.");
      }
    } catch (err) {
      setError(err.message || "Login ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-neutral-900 border border-[#ea580c]/30 rounded-xl shadow-xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#ea580c]/20 text-[#ea580c] rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Bem-vindo de volta</h1>
          <p className="text-sm text-neutral-400 mt-1">Acesse sua conta para continuar</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="login" className="block text-sm font-medium text-neutral-300">
              Login
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                id="login"
                type="text"
                autoComplete="username"
                autoFocus
                placeholder="Digite seu login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full pl-10 pr-3 h-12 rounded-md bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
                Senha
              </label>
              <Link to="/forgot-password" className="text-xs text-[#ea580c] hover:underline">
                {/*Esqueceu a senha? */}
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 h-12 rounded-md bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-md transition-colors flex items-center justify-center font-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-400">
          {/*Ainda não tem uma conta?*/}{" "}
          <Link
            to={"/register" + (returnTo !== "/" ? "?returnTo=" + encodeURIComponent(returnTo) : "")}
            className="text-[#ea580c] font-medium hover:underline"
          >
            {/*Criar conta*/}
          </Link>
        </div>
      </div>
    </div>
  );
}