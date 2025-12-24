import React, { useState } from 'react';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { loginWithEmail } from '../services/authService';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      setIsLoading(true);
      const user = await loginWithEmail(email, password);
      onLoginSuccess(user);
    } catch (err) {
      console.error('Erro no login:', err);
      
      // Mensagens de erro amigáveis
      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setError('Email ou senha incorretos');
          break;
        case 'auth/invalid-email':
          setError('Email inválido');
          break;
        case 'auth/too-many-requests':
          setError('Muitas tentativas. Tente novamente mais tarde');
          break;
        default:
          setError('Erro ao fazer login. Tente novamente');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/LOGO SYSTEMS ROXO.png" 
            alt="Logo" 
            className="h-16 w-auto"
          />
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#E8E0F5] p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-[#6B7280] text-sm">
              Acesse sua conta para continuar
            </p>
          </div>

          {/* Erro */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 text-[#6117F4]" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6117F4]/30 focus:border-[#6117F4] transition-all text-gray-800 placeholder:text-gray-400"
                disabled={isLoading}
              />
            </div>

            {/* Senha */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 text-[#6117F4]" />
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6117F4]/30 focus:border-[#6117F4] transition-all text-gray-800 placeholder:text-gray-400"
                disabled={isLoading}
              />
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#6117F4] text-white font-medium rounded-xl hover:bg-[#4903B4] transition-colors shadow-lg shadow-[#6117F4]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>

        {/* Rodapé */}
        <p className="text-center text-[#6B7280] text-sm mt-6">
          © {new Date().getFullYear()} Nexus Systems. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}

export default Login;
