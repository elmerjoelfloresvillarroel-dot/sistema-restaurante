import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  AlertCircle, Loader2, User, Lock, Eye, EyeOff, ChefHat, Sparkles
} from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [config, setConfig] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/configuracion/');
        setConfig(res.data);
      } catch (err) {
        console.error('Error al cargar la configuración:', err);
      }
    };
    fetchConfig();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Por favor, ingresa tu usuario y contraseña.');
      return;
    }

    try {
      setError(null);
      setSubmitting(true);
      const res = await login(username, password);
      
      if (res.success) {
        // Redirigir basado en el rol del usuario
        if (res.user.rol === 'Administrador') {
          navigate('/admin');
        } else if (res.user.rol === 'Cajero') {
          navigate('/caja');
        } else if (res.user.rol === 'Cocina') {
          navigate('/cocina');
        } else {
          navigate('/');
        }
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-12 selection:bg-[#b71c1c] selection:text-white">
      {/* Container Box with soft modern drop shadow & rounded-3xl borders */}
      <div className="bg-white rounded-[28px] shadow-2xl overflow-hidden max-w-md w-full border border-stone-250/40 hover:shadow-3xl hover:translate-y-[-2px] transition-all duration-300 animate-in fade-in zoom-in-95 duration-250">
        
        {/* ════ CABECERA DEGRADADA PREMIUM ════ */}
        <div 
          style={{ background: 'linear-gradient(135deg, #7A0000, #B71C1C, #D32F2F)' }}
          className="px-8 py-10 text-center text-white relative flex flex-col items-center"
        >
          {/* Real-time restaurant open/closed status indicator */}
          {config && (
            <div className="absolute top-4 right-4 z-10">
              {config.esta_abierto ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Abierto
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/20 text-[9px] font-black uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Cerrado
                </span>
              )}
            </div>
          )}

          {/* Logo Brand Frame */}
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-lg mb-3.5 animate-bounce">
            <ChefHat className="w-6 h-6 text-[#ffc107]" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black font-serif tracking-tight uppercase text-white leading-tight">
            LA RECONCILIACIÓN
          </h1>
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#ffc107] mt-1.5">
            Sistema Integral de Gestión Restaurante
          </p>
        </div>

        {/* ════ FORMULARIO Y CAMPOS DE TEXTO ════ */}
        <div className="p-8 space-y-6 bg-white">
          
          {/* Error Message Box */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-100 text-red-800 text-xs font-semibold rounded-2xl flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input Field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-stone-450 uppercase tracking-widest pl-1">
                Usuario
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <User className="w-4.5 h-4.5 text-stone-400 group-focus-within:text-[#b71c1c] transition-colors" />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#b71c1c]/10 focus:border-[#b71c1c] focus:bg-white transition-all text-sm font-semibold text-stone-850 outline-none placeholder-stone-300"
                  placeholder="ejemplo_usuario"
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Password Input Field with Show/Hide Toggle */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-stone-450 uppercase tracking-widest pl-1">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <Lock className="w-4.5 h-4.5 text-stone-400 group-focus-within:text-[#b71c1c] transition-colors" />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#b71c1c]/10 focus:border-[#b71c1c] focus:bg-white transition-all text-sm font-semibold text-stone-850 outline-none placeholder-••••••••"
                  placeholder="••••••••"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5 animate-in fade-in" />
                  ) : (
                    <Eye className="w-4.5 h-4.5 animate-in fade-in" />
                  )}
                </button>
              </div>
            </div>

            {/* Iniciar Sesión Action Button */}
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-[#FFC107] hover:bg-[#FF9800] disabled:bg-stone-150 disabled:text-stone-400 disabled:cursor-not-allowed text-[#111111] py-3.5 rounded-2xl font-black transition-all duration-300 mt-3 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 text-xs uppercase tracking-wider hover:-translate-y-0.5"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <span>Entrar al Sistema</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#7A0000]" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;

