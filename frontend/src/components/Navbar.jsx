import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Menu, X, UtensilsCrossed, Home, LogIn, Calculator, LayoutDashboard, LogOut, TrendingUp, Power } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('sitio_configuracion');
      return saved ? JSON.parse(saved) : {
        nombre_restaurante: 'La Reconciliación',
        color_tema: 'orange',
        esta_abierto: true
      };
    } catch (e) {
      return {
        nombre_restaurante: 'La Reconciliación',
        color_tema: 'orange',
        esta_abierto: true
      };
    }
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/configuracion/');
        if (res.data) {
          setConfig(res.data);
          localStorage.setItem('sitio_configuracion', JSON.stringify(res.data));
        }
      } catch (err) {
        console.error('Error al obtener config en Navbar:', err);
      }
    };
    fetchConfig();
    
    // Escuchar eventos de actualización (para cambios instantáneos en la misma pestaña)
    const handleConfigUpdate = () => {
      fetchConfig();
    };
    window.addEventListener('config-updated', handleConfigUpdate);
    return () => {
      window.removeEventListener('config-updated', handleConfigUpdate);
    };
  }, []);

  const themeClasses = {
    orange: { 
      nav: 'bg-gradient-to-r from-orange-600 to-amber-500 text-white', 
      linkActive: 'bg-white/20 text-white shadow-xs border border-white/10',
      linkHover: 'text-white/90 hover:bg-white/10 hover:text-white hover:scale-102',
      mobileBg: 'bg-orange-600 border-t border-orange-500/30',
      mobileHover: 'hover:bg-orange-700 text-white font-bold'
    },
    blue: { 
      nav: 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white', 
      linkActive: 'bg-white/20 text-white shadow-xs border border-white/10',
      linkHover: 'text-white/90 hover:bg-white/10 hover:text-white hover:scale-102',
      mobileBg: 'bg-blue-600 border-t border-blue-500/30',
      mobileHover: 'hover:bg-blue-700 text-white font-bold'
    },
    green: { 
      nav: 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white', 
      linkActive: 'bg-white/20 text-white shadow-xs border border-white/10',
      linkHover: 'text-white/90 hover:bg-white/10 hover:text-white hover:scale-102',
      mobileBg: 'bg-emerald-600 border-t border-emerald-500/30',
      mobileHover: 'hover:bg-emerald-700 text-white font-bold'
    },
    purple: { 
      nav: 'bg-gradient-to-r from-red-600 via-red-500 to-rose-500 text-white', 
      linkActive: 'bg-white/20 text-white shadow-xs border border-white/10',
      linkHover: 'text-white/90 hover:bg-white/10 hover:text-white hover:scale-102',
      mobileBg: 'bg-gradient-to-r from-red-655 to-rose-555 border-t border-red-555/30',
      mobileHover: 'hover:bg-red-700 text-white font-bold'
    },
    red: { 
      nav: 'bg-gradient-to-r from-red-600 to-rose-500 text-white', 
      linkActive: 'bg-white/20 text-white shadow-xs border border-white/10',
      linkHover: 'text-white/90 hover:bg-white/10 hover:text-white hover:scale-102',
      mobileBg: 'bg-red-600 border-t border-red-500/30',
      mobileHover: 'hover:bg-red-700 text-white font-bold'
    },
    claro_elegante: { 
      nav: 'bg-white border-b border-slate-200/80 text-slate-800', 
      linkActive: 'bg-slate-100 text-slate-900 border border-slate-200/80 shadow-xs',
      linkHover: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:scale-102',
      mobileBg: 'bg-white border-t border-slate-200/80',
      mobileHover: 'hover:bg-slate-50 text-slate-800 font-bold'
    }
  };

  const isCocina = (user && user.rol === 'Cocina') || config.color_tema === 'claro_elegante';
  const theme = isCocina ? themeClasses.claro_elegante : (themeClasses[config.color_tema] || themeClasses.orange);
  const isLoginPage = location.pathname === '/login';
  const isAdminPage = location.pathname === '/admin';

  const getLinkClass = (to) => {
    const isActive = location.pathname === to;
    const base = "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-250 select-none";
    return `${base} ${isActive ? theme.linkActive : theme.linkHover}`;
  };

  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav 
      style={!isCocina ? { background: 'linear-gradient(135deg, #7A0000, #B71C1C, #D32F2F)' } : undefined}
      className={`${!isCocina ? 'text-white' : theme.nav} shadow-md select-none transition-all duration-300 relative z-40`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center ${isAdminPage ? 'h-20 md:h-28' : 'h-20'}`}>
          
          {/* Logo / Brand & Status Pill */}
          {isAdminPage ? (
            <div className="flex items-center gap-3 md:gap-6">
              <Link to="/admin" className="flex items-center gap-2 md:gap-4.5 group">
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm border border-[#FFC107]/40 bg-black/30 group-hover:bg-black/40 group-hover:scale-105">
                  <TrendingUp className="w-5 h-5 md:w-8 md:h-8 text-[#FFC107] drop-shadow-md" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-black text-white text-base md:text-2xl tracking-widest uppercase font-serif drop-shadow-sm">
                    LA RECONCILIACIÓN
                  </span>
                  <span className="text-[9px] md:text-xs text-[#FFC107] font-black uppercase tracking-wider opacity-90 mt-0.5">
                    Panel de Control
                  </span>
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-3 group">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm border ${
                  isCocina 
                    ? 'bg-slate-50 border-slate-200/80 group-hover:bg-slate-100' 
                    : 'bg-white/10 border-white/15 group-hover:bg-white/20'
                } group-hover:scale-105 group-hover:shadow-md`}>
                  <UtensilsCrossed className={`w-5.5 h-5.5 transition-transform duration-500 group-hover:rotate-12 ${
                    isCocina ? 'text-slate-700' : (config.color_tema === 'purple' || isLoginPage) ? 'text-amber-400' : 'text-white'
                  }`} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-extrabold tracking-tight text-base sm:text-lg leading-tight select-none">
                    {config.nombre_restaurante}
                  </span>
                  {!(config.nombre_restaurante && config.nombre_restaurante.toLowerCase().includes('reconcili')) && (
                    <span className="text-[10px] opacity-75 font-semibold leading-none mt-0.5">
                      La Reconciliación
                    </span>
                  )}
                </div>
              </Link>

              {config.esta_abierto !== undefined && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xs border transition-all ${
                  isCocina
                    ? (config.esta_abierto 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                        : 'bg-rose-50 text-rose-600 border-rose-200')
                    : (config.esta_abierto 
                        ? 'bg-emerald-500/15 text-emerald-100 border-emerald-400/20' 
                        : 'bg-rose-500/15 text-rose-100 border-rose-400/20')
                }`}>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      config.esta_abierto ? 'bg-emerald-400' : 'bg-rose-400'
                    }`} />
                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                      config.esta_abierto ? 'bg-emerald-500' : 'bg-rose-500'
                    }`} />
                  </span>
                  <span>{config.esta_abierto ? 'Atendiendo' : 'Cerrado'}</span>
                </span>
              )}
            </div>
          )}

          {/* Menu / Return to Home Action */}
          {isLoginPage ? (
            <div className="flex items-center gap-2 select-none">
              <Link 
                to="/" 
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black text-[#111111] bg-[#ffc107] hover:bg-amber-400 active:scale-95 shadow-md transition-all uppercase tracking-wider whitespace-nowrap"
              >
                <Home className="w-3.5 h-3.5 sm:w-4 h-4" />
                <span className="hidden sm:inline">Volver al Inicio</span>
                <span className="sm:hidden">Inicio</span>
              </Link>
            </div>
          ) : isAdminPage ? (
            <div className="flex items-center gap-2 md:gap-3 font-bold select-none animate-in fade-in duration-300">
              <div className="flex items-center gap-2 md:gap-3">
                {/* User Profile Card */}
                <div className="flex items-center gap-2 md:gap-3 px-2 py-1.5 md:px-3.5 md:py-2 rounded-xl border border-[#FFC107]/30 text-white bg-black/25">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-black text-xs md:text-sm select-none shadow-sm bg-[#FFC107] text-[#111111]">
                    {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="hidden md:flex flex-col text-left max-w-[140px]">
                    <span className="text-sm font-black tracking-wide truncate text-white">
                      {user?.username || 'Administrador'}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FFC107] mt-0.5">
                      {user?.rol || 'Administrador'}
                    </span>
                  </div>
                </div>

                {/* Salir Button */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 md:px-4.5 md:py-2.5 rounded-xl transition-all duration-300 text-xs font-black shadow-md bg-[#FFC107] hover:bg-amber-400 text-[#111111] hover:scale-102 active:scale-95 border border-[#FFC107]/50 whitespace-nowrap"
                >
                  <Power className="w-4 h-4 text-[#111111] stroke-[2.5]" />
                  <span className="hidden md:inline">Cerrar Sesión</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-2.5 font-bold">
                {!user && (
                  <Link to="/" className={getLinkClass('/')}>
                    <Home className="w-4 h-4" />
                    <span>Inicio</span>
                  </Link>
                )}
                
                {!user ? (
                  <Link to="/login" className={getLinkClass('/login')}>
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                ) : (
                  <>
                    {user.rol === 'Cajero' && (
                      <Link to="/caja" className={getLinkClass('/caja')}>
                        <Calculator className="w-4 h-4" />
                        <span>Caja POS</span>
                      </Link>
                    )}
                    {user.rol === 'Administrador' && (
                      <Link to="/admin" className={getLinkClass('/admin')}>
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Admin</span>
                      </Link>
                    )}
                    {user.rol === 'Cocina' && (
                      <Link to="/cocina" className={getLinkClass('/cocina')}>
                        <UtensilsCrossed className="w-4 h-4" />
                        <span>Cocina</span>
                      </Link>
                    )}
                    
                    {/* Profile Card & Logout */}
                    <div className={`flex items-center gap-3 pl-4 border-l ${
                      isCocina ? 'border-slate-200' : 'border-white/20'
                    }`}>
                      {/* User Profile Card */}
                      <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border shadow-xs transition-all ${
                        isCocina 
                          ? 'bg-slate-50 border-slate-200/80 text-slate-800' 
                          : 'bg-white/10 border-white/10 text-white'
                      }`}>
                        <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center font-black text-xs select-none shadow-sm ${
                          isCocina 
                            ? 'bg-slate-200 text-slate-700' 
                            : 'bg-white/20 text-white'
                        }`}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-black tracking-wide truncate max-w-[120px]">
                            {user.username}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-wider opacity-80 ${
                            isCocina ? 'text-slate-500' : 'text-white/80'
                          }`}>
                            {user.rol}
                          </span>
                        </div>
                      </div>

                      {/* Salir Button */}
                      <button 
                        onClick={handleLogout}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all duration-300 text-xs font-black shadow-sm ${
                          isCocina 
                            ? 'bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-100 hover:border-rose-600 text-rose-600' 
                            : 'bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-600 text-red-200 hover:text-white hover:scale-102'
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Salir</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={toggleMenu} 
                className={`md:hidden p-2 rounded-xl border transition-all ${
                  isCocina 
                    ? 'hover:bg-slate-100 text-slate-700 border-slate-200/80' 
                    : 'hover:bg-white/10 text-white border-white/10'
                }`}
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {isOpen && !isAdminPage && (
        <div className={`md:hidden ${theme.mobileBg} py-4 px-4 space-y-2 font-bold animate-in slide-in-from-top duration-250`}>
          {!user && (
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                isCocina 
                  ? 'hover:bg-slate-100 text-slate-800' 
                  : 'hover:bg-white/10 text-white'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Inicio</span>
            </Link>
          )}
          
          {!user ? (
            <Link 
              to="/login" 
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                isCocina 
                  ? 'hover:bg-slate-150 text-slate-800' 
                  : 'hover:bg-white/10 text-white'
              }`}
            >
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </Link>
          ) : (
            <>
              {user.rol === 'Cajero' && (
                <Link 
                  to="/caja" 
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    isCocina 
                      ? 'hover:bg-slate-100 text-slate-800' 
                      : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <Calculator className="w-5 h-5" />
                  <span>Caja POS</span>
                </Link>
              )}
              {user.rol === 'Administrador' && (
                <Link 
                  to="/admin" 
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    isCocina 
                      ? 'hover:bg-slate-100 text-slate-800' 
                      : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Admin</span>
                </Link>
              )}
              {user.rol === 'Cocina' && (
                <Link 
                  to="/cocina" 
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    isCocina 
                      ? 'hover:bg-slate-100 text-slate-800' 
                      : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  <span>Cocina</span>
                </Link>
              )}
              
              {/* Info móvil y Salir */}
              <div className={`pt-4 mt-2 border-t flex flex-col gap-2.5 ${
                isCocina ? 'border-slate-200' : 'border-white/10'
              }`}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                  isCocina 
                    ? 'bg-slate-50 border-slate-200 text-slate-800' 
                    : 'bg-white/10 border-white/10 text-white'
                }`}>
                  <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center font-black text-sm select-none shadow-sm ${
                    isCocina 
                      ? 'bg-slate-200 text-slate-700' 
                      : 'bg-white/20 text-white'
                  }`}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-black tracking-wide truncate">
                      {user.username}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-wider opacity-80 ${
                      isCocina ? 'text-slate-500' : 'text-white/80'
                    }`}>
                      {user.rol}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handleLogout}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl transition-all font-black text-xs uppercase tracking-wider shadow-sm ${
                    isCocina 
                      ? 'bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-100 hover:border-rose-600 text-rose-600' 
                      : 'bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/20 hover:border-red-600'
                  }`}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
