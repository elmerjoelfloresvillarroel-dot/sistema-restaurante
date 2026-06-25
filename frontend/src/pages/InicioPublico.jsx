import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, MapPin, Search, ChefHat, Coffee, AlertCircle,
  Sparkles, ShoppingBag, Plus, Minus, Trash2, X, Phone,
  Star, Truck, Heart, UtensilsCrossed, ArrowRight, Flame,
  CheckCircle2, ChevronRight
} from 'lucide-react';

const themeClasses = {
  orange: {
    nav: 'bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 border-b border-white/10 shadow-md text-white',
    logoText: 'text-white group-hover:text-amber-200',
    logoSub: 'text-amber-100',
    navLink: 'text-white/80 hover:text-amber-200',
    btnPrimary: 'bg-amber-400 hover:bg-amber-500 text-stone-900',
    accentText: 'text-orange-600',
    tagBg: 'bg-orange-500/10',
    categoryActive: 'bg-orange-600 text-white border-orange-600 shadow-orange-950/10',
    categoryHover: 'hover:border-orange-500 hover:text-orange-600',
    productHover: 'group-hover:text-orange-600',
    btnFloat: 'bg-orange-600 hover:bg-orange-700 text-white',
    iconGoldText: 'text-amber-300',
    footerLine: 'from-orange-600 via-orange-500 to-amber-500',
    radialOverlay: 'rgba(249,115,22,0.06)',
    isDarkNav: true
  },
  blue: {
    nav: 'bg-gradient-to-r from-blue-700 via-blue-650 to-indigo-500 border-b border-white/10 shadow-md text-white',
    logoText: 'text-white group-hover:text-blue-200',
    logoSub: 'text-blue-200',
    navLink: 'text-white/80 hover:text-blue-200',
    btnPrimary: 'bg-white hover:bg-blue-50 text-blue-700',
    accentText: 'text-blue-600',
    tagBg: 'bg-blue-500/10',
    categoryActive: 'bg-blue-650 text-white border-blue-650 shadow-blue-950/10',
    categoryHover: 'hover:border-blue-500 hover:text-blue-600',
    productHover: 'group-hover:text-blue-600',
    btnFloat: 'bg-blue-600 hover:bg-blue-700 text-white',
    iconGoldText: 'text-blue-250',
    footerLine: 'from-blue-700 via-blue-650 to-indigo-500',
    radialOverlay: 'rgba(37,99,235,0.06)',
    isDarkNav: true
  },
  green: {
    nav: 'bg-gradient-to-r from-emerald-700 via-emerald-650 to-teal-500 border-b border-white/10 shadow-md text-white',
    logoText: 'text-white group-hover:text-emerald-200',
    logoSub: 'text-emerald-200',
    navLink: 'text-white/80 hover:text-emerald-200',
    btnPrimary: 'bg-white hover:bg-emerald-50 text-emerald-700',
    accentText: 'text-emerald-655',
    tagBg: 'bg-emerald-500/10',
    categoryActive: 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-950/10',
    categoryHover: 'hover:border-emerald-500 hover:text-emerald-600',
    productHover: 'group-hover:text-emerald-655',
    btnFloat: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    iconGoldText: 'text-emerald-205',
    footerLine: 'from-emerald-700 via-emerald-650 to-teal-500',
    radialOverlay: 'rgba(16,185,129,0.06)',
    isDarkNav: true
  },
  purple: {
    nav: 'bg-gradient-to-r from-[#7a0000] via-[#b71c1c] to-[#d32f2f] border-b border-[#ffc107]/10 shadow-md text-white',
    logoText: 'text-white group-hover:text-[#ffc107]',
    logoSub: 'text-[#ffc107]',
    navLink: 'text-white/95 hover:text-[#ffc107]',
    btnPrimary: 'bg-[#ffc107] hover:bg-amber-400 text-[#111111]',
    accentText: 'text-[#b71c1c]',
    tagBg: 'bg-red-500/10',
    categoryActive: 'bg-[#b71c1c] text-white border-[#b71c1c] shadow-[#7a0000]/20',
    categoryHover: 'hover:border-[#b71c1c] hover:text-[#b71c1c]',
    productHover: 'group-hover:text-[#b71c1c]',
    btnFloat: 'bg-[#b71c1c] hover:bg-[#7a0000] text-white',
    iconGoldText: 'text-[#ffc107]',
    footerLine: 'from-[#7a0000] via-[#b71c1c] to-[#d32f2f]',
    radialOverlay: 'rgba(183,28,28,0.06)',
    isDarkNav: true
  },
  red: {
    nav: 'bg-gradient-to-r from-red-700 via-red-600 to-rose-500 border-b border-white/10 shadow-md text-white',
    logoText: 'text-white group-hover:text-rose-200',
    logoSub: 'text-rose-200',
    navLink: 'text-white/80 hover:text-rose-200',
    btnPrimary: 'bg-white hover:bg-rose-50 text-red-700',
    accentText: 'text-red-600',
    tagBg: 'bg-red-500/10',
    categoryActive: 'bg-red-650 text-white border-red-650 shadow-red-950/10',
    categoryHover: 'hover:border-red-500 hover:text-red-600',
    productHover: 'group-hover:text-red-650',
    btnFloat: 'bg-red-650 hover:bg-red-700 text-white',
    iconGoldText: 'text-rose-200',
    footerLine: 'from-red-700 via-red-600 to-rose-500',
    radialOverlay: 'rgba(220,38,38,0.06)',
    isDarkNav: true
  },
  claro_elegante: {
    nav: 'bg-white border-b border-slate-200 shadow-sm text-slate-800',
    logoText: 'text-slate-900 group-hover:text-slate-700',
    logoSub: 'text-slate-500',
    navLink: 'text-slate-600 hover:text-slate-950',
    btnPrimary: 'bg-slate-900 hover:bg-slate-800 text-white',
    accentText: 'text-slate-900',
    tagBg: 'bg-slate-100',
    categoryActive: 'bg-slate-900 text-white border-slate-900 shadow-slate-950/10',
    categoryHover: 'hover:border-slate-800 hover:text-slate-900',
    productHover: 'group-hover:text-slate-900',
    btnFloat: 'bg-slate-900 hover:bg-slate-800 text-white',
    iconGoldText: 'text-slate-550',
    footerLine: 'from-slate-800 via-slate-700 to-slate-900',
    radialOverlay: 'rgba(71,85,105,0.06)',
    isDarkNav: false
  }
};

const InicioPublico = () => {
  const { user } = useAuth() || {};

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  const [carrito, setCarrito] = useState([]);
  const [cartDrawerAbierto, setCartDrawerAbierto] = useState(false);

  const [nombreCliente, setNombreCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [direccionCliente, setDireccionCliente] = useState('');
  const [enviandoPedido, setEnviandoPedido] = useState(false);
  const [pedidoExitoso, setPedidoExitoso] = useState(false);

  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('sitio_configuracion');
      return saved ? JSON.parse(saved) : {
        nombre_restaurante: 'La Reconciliación',
        titulo_hero: 'Sabor Criollo y Tradición de Nuestra Tierra',
        descripcion_hero: 'Disfruta de las mejores carnes a la parrilla y platillos tradicionales preparados con ingredientes selectos y pasión gourmet.',
        horario: 'Lun - Dom: 18:00 - 23:00',
        direccion: 'Av. Principal #450',
        telefono: '+591 77889900',
        color_tema: 'purple',
        tiempo_entrega: '30 min',
        rating: '4.9',
        esta_abierto: true
      };
    } catch (e) {
      return {
        nombre_restaurante: 'La Reconciliación',
        titulo_hero: 'Sabor Criollo y Tradición de Nuestra Tierra',
        descripcion_hero: 'Disfruta de las mejores carnes a la parrilla y platillos tradicionales preparados con ingredientes selectos y pasión gourmet.',
        horario: 'Lun - Dom: 18:00 - 23:00',
        direccion: 'Av. Principal #450',
        telefono: '+591 77889900',
        color_tema: 'purple',
        tiempo_entrega: '30 min',
        rating: '4.9',
        esta_abierto: true
      };
    }
  });

  const theme = themeClasses[config.color_tema] || themeClasses.purple;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resProductos, resCategorias, resConfig] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/productos/'),
          axios.get('http://127.0.0.1:8000/api/categorias/'),
          axios.get('http://127.0.0.1:8000/api/configuracion/')
        ]);
        setProductos(resProductos.data);
        setCategorias(resCategorias.data);
        if(resConfig.data.nombre_restaurante) {
          setConfig(resConfig.data);
          localStorage.setItem('sitio_configuracion', JSON.stringify(resConfig.data));
        }
        setError(null);
      } catch (err) {
        console.error('Error al obtener datos:', err);
        setError('No se pudo conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const handleConfigUpdate = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/configuracion/');
        if (res.data) {
          setConfig(res.data);
          localStorage.setItem('sitio_configuracion', JSON.stringify(res.data));
        }
      } catch (err) {
        console.error('Error al recargar config:', err);
      }
    };
    window.addEventListener('config-updated', handleConfigUpdate);
    return () => {
      window.removeEventListener('config-updated', handleConfigUpdate);
    };
  }, []);

  const obtenerNombreCategoria = (categoriaId) => {
    const cat = categorias.find(c => c.id === categoriaId);
    return cat ? cat.nombre : 'General';
  };

  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = 
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = 
      categoriaSeleccionada === 'Todas' || 
      obtenerNombreCategoria(producto.categoria) === categoriaSeleccionada;
    return coincideBusqueda && coincideCategoria;
  });

  const agregarAlCarrito = (producto) => {
    if (!config.esta_abierto) return;
    if (!producto.disponible) return;
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { id: producto.id, nombre: producto.nombre, precio: parseFloat(producto.precio), cantidad: 1, observaciones: '', foto: producto.fotografia }];
    });
    setPedidoExitoso(false);
  };

  const modificarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      setCarrito(prev => prev.filter(item => item.id !== id));
    } else {
      setCarrito(prev => prev.map(item => item.id === id ? { ...item, cantidad: nuevaCantidad } : item));
    }
  };

  const actualizarObservacion = (id, texto) => {
    setCarrito(prev => prev.map(item => item.id === id ? { ...item, observaciones: texto } : item));
  };

  const calcularTotal = () => carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  const enviarPedidoDelivery = async (e) => {
    e.preventDefault();
    if (!config.esta_abierto) {
      alert('El restaurante está cerrado en este momento. No se pueden recibir pedidos.');
      return;
    }
    if (carrito.length === 0) return;
    try {
      setEnviandoPedido(true);
      const total = calcularTotal();
      const obs = carrito.map(item => item.observaciones ? `${item.nombre}: ${item.observaciones}` : '').filter(Boolean).join(' | ');

      const resPedido = await axios.post('http://127.0.0.1:8000/api/pedidos/', {
        tipo_pedido: 'Delivery', estado: 'Pendiente de pago', total: total.toFixed(2), observaciones: obs
      });
      const pedidoId = resPedido.data.id;

      await Promise.all(carrito.map(item => 
        axios.post('http://127.0.0.1:8000/api/detallepedidos/', {
          pedido: pedidoId, producto: item.id, cantidad: item.cantidad, subtotal: (item.precio * item.cantidad).toFixed(2), observaciones: item.observaciones
        })
      ));

      const resCliente = await axios.post('http://127.0.0.1:8000/api/clientesdelivery/', {
        nombre: nombreCliente, telefono: telefonoCliente, direccion: direccionCliente
      });
      const clienteId = resCliente.data.id;

      await axios.post('http://127.0.0.1:8000/api/pedidosdelivery/', {
        pedido: pedidoId, cliente: clienteId, estado: 'Pendiente'
      });

      setPedidoExitoso(true);
      setTimeout(() => {
        setCarrito([]); setNombreCliente(''); setTelefonoCliente(''); setDireccionCliente('');
        setCartDrawerAbierto(false); setPedidoExitoso(false);
      }, 3000);

    } catch (err) {
      alert('Error al procesar pedido. Reintente.');
    } finally {
      setEnviandoPedido(false);
    }
  };

  const fotosConDiseno = productos.filter(p => {
    if (!p.fotografia) return false;
    const nombreCat = obtenerNombreCategoria(p.categoria).toLowerCase();
    return !nombreCat.includes('bebida') && !nombreCat.includes('trago') && !nombreCat.includes('refresco');
  });

  const heroProduct1 = config.producto_destacado_1 ? productos.find(p => p.id === parseInt(config.producto_destacado_1)) : null;
  const heroProduct2 = config.producto_destacado_2 ? productos.find(p => p.id === parseInt(config.producto_destacado_2)) : null;

  const heroImage1 = heroProduct1?.fotografia || fotosConDiseno[0]?.fotografia || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop";
  const heroImage2 = heroProduct2?.fotografia || fotosConDiseno[1]?.fotografia || "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop";

  const getCategoryIcon = (nombre) => {
    const n = nombre.toLowerCase();
    if (n.includes('carne') || n.includes('parrilla') || n.includes('asado') || n.includes('fuego') || n.includes('res') || n.includes('cerdo')) {
      return <Flame className="w-4 h-4" />;
    }
    if (n.includes('bebida') || n.includes('trago') || n.includes('vino') || n.includes('refresco') || n.includes('jugo') || n.includes('gaseosa')) {
      return <Coffee className="w-4 h-4" />;
    }
    if (n.includes('postre') || n.includes('dulce') || n.includes('torta') || n.includes('helado') || n.includes('flan')) {
      return <Heart className="w-4 h-4 text-red-500 fill-red-500" />;
    }
    if (n.includes('entrada') || n.includes('sopa') || n.includes('picada') || n.includes('ensalada') || n.includes('guarnicion')) {
      return <Sparkles className="w-4 h-4" />;
    }
    return <UtensilsCrossed className="w-4 h-4" />;
  };

  const promociones = productos.filter(p => {
    const catNombre = obtenerNombreCategoria(p.categoria).toLowerCase();
    return catNombre.includes('promo') || catNombre.includes('oferta') || catNombre.includes('combo');
  });

  return (
    <div className="min-h-screen bg-[#fff8f0] flex flex-col font-sans selection:bg-[#b71c1c] selection:text-white">
      {/* Sticky Header Wrapper (to scroll together without overlapping) */}
      <div className="sticky top-0 z-40 flex flex-col">
        {/* ════ ESTADO DEL RESTAURANTE (BANNER SUPERIOR) ════ */}
        {!config.esta_abierto && (
          <div className="bg-[#111111] text-white px-4 py-2 sm:py-3 text-center text-[10px] sm:text-xs font-black uppercase tracking-widest flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2.5 shadow-md border-b border-[#ffc107]/20">
            <div className="flex items-center gap-1.5">
              <span className="animate-pulse">🔒</span>
              <span>Restaurante cerrado temporalmente</span>
            </div>
            <span className="hidden sm:inline opacity-30">|</span>
            <span className="text-[#ffc107]">Volvemos a abrir en el horario establecido ({config.horario || "18:00 - 23:00"})</span>
          </div>
        )}

        {/* ════ TOP NAVBAR DEGRADADO PREMIUM ════ */}
        <nav className={`${theme.nav}`} >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
            {/* Logo del restaurante a la izquierda */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 shrink-0 ${theme.isDarkNav ? 'bg-white/10 border border-white/20' : 'bg-slate-100 border border-slate-200/80'}`}>
                <ChefHat className={`w-5 h-5 sm:w-5.5 sm:h-5.5 ${theme.isDarkNav ? 'text-amber-400' : 'text-slate-800'}`} />
              </div>
              <div className="flex flex-col text-left">
                <span className={`text-base sm:text-xl font-black font-serif tracking-tight transition-colors leading-tight ${theme.logoText}`}>
                  {config.nombre_restaurante}
                </span>
                <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest leading-none mt-0.5 ${theme.logoSub}`}>
                  La Reconciliación
                </span>
              </div>
            </Link>

            {/* Menú centrado */}
            <div className="hidden md:flex items-center gap-8 font-bold text-xs uppercase tracking-widest">
              <a href="#" className={`transition-colors ${theme.navLink}`}>Inicio</a>
              <a href="#menu" className={`transition-colors ${theme.navLink}`}>Carta</a>
              {promociones.length > 0 && (
                <a href="#promociones" className={`transition-colors flex items-center gap-1 ${theme.navLink}`}>
                  <span>Promociones</span>
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${theme.isDarkNav ? 'bg-[#ffc107]' : 'bg-slate-900'}`} />
                </a>
              )}
              <a href="#footer" className={`transition-colors ${theme.navLink}`}>Contacto</a>
            </div>

            {/* Botón de Acción / Login / Carrito */}
            <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
              {/* Cart shortcut */}
              {totalItems > 0 && (
                <button 
                  onClick={() => setCartDrawerAbierto(true)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black hover:scale-102 transition-all shadow-md active:scale-95 uppercase tracking-wider ${theme.btnPrimary}`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{totalItems}</span>
                </button>
              )}

              {/* Botón Iniciar Sesión Destacado (Ajustado padding y wrap para evitar desbordes) */}
              {user ? (
                <Link 
                  to={user.rol === 'Administrador' ? '/admin' : user.rol === 'Cajero' ? '/caja' : '/cocina'}
                  className={`px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all shadow-md active:scale-95 uppercase tracking-wider whitespace-nowrap ${theme.btnPrimary}`}
                >
                  Mi Panel
                </Link>
              ) : (
                <Link 
                  to="/login"
                  className={`px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all shadow-md active:scale-95 uppercase tracking-wider whitespace-nowrap ${theme.btnPrimary}`}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* ════ HERO PRINCIPAL ════ */}
      <header className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pt-20 lg:pb-32 bg-[#fff8f0] border-b border-stone-200/40">
        {/* Background visual overlay */}
        <div 
          className="absolute inset-0" 
          style={{ background: `radial-gradient(circle at 75% 120%, ${theme.radialOverlay}, transparent 50%)` }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Column: Story & Info */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-5 sm:space-y-8">
              
              {/* Badges de Estado */}
              <div>
                {config.esta_abierto ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/25 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    🟢 ABIERTO AHORA
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-red-500/10 text-red-800 border border-red-500/25 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                    🔴 CERRADO AHORA
                  </span>
                )}
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h1 className={`text-xs sm:text-base font-bold uppercase tracking-widest font-mono ${theme.accentText}`}>
                  {config.nombre_restaurante}
                </h1>
                <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-[#111111] leading-[1.1] sm:leading-[1.08] tracking-tight font-serif">
                  {config.titulo_hero}
                </h2>
                <p className="text-stone-600 text-sm sm:text-lg font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {config.descripcion_hero}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full">
                <a 
                  href="#menu" 
                  className={`w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 inline-flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider ${theme.btnFloat}`}
                >
                  <span>Explorar Menú</span>
                  <ArrowRight className={`w-4 h-4 ${theme.iconGoldText}`} />
                </a>
                <a 
                  href="#footer" 
                  className="bg-white hover:bg-stone-50 text-[#111111] border border-stone-200 w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all hover:-translate-y-0.5 active:scale-95 shadow-sm inline-flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider"
                >
                  <Clock className={`w-4 h-4 ${theme.accentText}`} />
                  <span>Horarios</span>
                </a>
              </div>

              {/* Tarjeta elegante Cerrado */}
              {!config.esta_abierto && (
                <div className={`mt-6 mx-auto lg:mx-0 max-w-sm bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md border-l-4 text-left animate-fade-in ${theme.isDarkNav ? 'border-red-600' : 'border-slate-800'}`}>
                  <div className="flex items-center gap-2 text-red-700 font-extrabold text-xs sm:text-sm uppercase tracking-wider mb-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                    🔴 CERRADO AHORA
                  </div>
                  <div className="text-stone-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Horario de Atención:</div>
                  <div className="text-stone-850 font-black text-sm sm:text-base mt-1 font-serif">{config.horario || "18:00 - 23:00"}</div>
                </div>
              )}
            </div>

            {/* Right Column: Cascading Overlapping Images */}
            <div className="lg:col-span-5 relative h-[220px] sm:h-[480px] w-full flex items-center justify-center">
              {/* Background Blur */}
              <div className={`absolute w-48 h-48 sm:w-80 sm:h-80 rounded-full blur-3xl -z-10 opacity-75 ${theme.isDarkNav ? 'bg-[#ffc107]/5' : 'bg-slate-300/10'}`} />

              {/* Photo 1 (Behind) */}
              <div className="absolute w-[130px] h-[170px] sm:w-[280px] sm:h-[350px] bg-white p-2 sm:p-3.5 rounded-2xl sm:rounded-3xl shadow-xl -rotate-6 transform -translate-x-4 sm:-translate-x-12 -translate-y-2 sm:-translate-y-8 hover:rotate-0 hover:z-30 transition-all duration-500 group border border-stone-200/40">
                <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-stone-50">
                  <img 
                    key={heroImage1}
                    src={heroImage1} 
                    alt="Fine dining presentation" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550 ease-out"
                  />
                </div>
              </div>

              {/* Photo 2 (Overlap Front) */}
              <div className="absolute w-[120px] h-[160px] sm:w-[260px] sm:h-[330px] bg-white p-2 sm:p-3.5 rounded-2xl sm:rounded-3xl shadow-2xl rotate-6 transform translate-x-4 sm:translate-x-12 translate-y-2 sm:translate-y-8 hover:rotate-0 hover:z-30 transition-all duration-500 group border border-stone-200/40">
                <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-stone-50">
                  <img 
                    key={heroImage2}
                    src={heroImage2} 
                    alt="Special house selection" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550 ease-out"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ════ SECCIÓN DE PROMOCIONES DEL DÍA ════ */}
      {promociones.length > 0 && (
        <section id="promociones" className="bg-white py-12 sm:py-16 border-b border-stone-200/40 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8 sm:mb-10">
              <div className="space-y-1 text-left">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#b71c1c] bg-[#b71c1c]/5 px-2.5 py-1 rounded-md">
                  Ofertas Especiales
                </span>
                <h2 className="text-2xl sm:text-4xl font-black font-serif text-[#111111] flex items-center gap-2 mt-1.5">
                  <span>🔥</span> Promociones del Día
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {promociones.slice(0, 3).map(producto => (
                <div 
                  key={producto.id}
                  className="bg-[#fff8f0]/40 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-[#b71c1c]/10 shadow-xs hover:shadow-lg hover:translate-y-[-5px] transition-all duration-300 flex flex-col group relative"
                >
                  <div className="absolute top-4 right-4 z-10 bg-[#ffc107] text-[#111111] font-black text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    Promo
                  </div>
                  
                  {/* Photo */}
                  <div className="relative w-full aspect-[4/3] bg-stone-50 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 border border-stone-200/40">
                    {producto.fotografia ? (
                      <img 
                        src={producto.fotografia} 
                        alt={producto.nombre} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <UtensilsCrossed className="w-10 h-10 opacity-30" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between mt-3 sm:mt-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#111111] group-hover:text-[#b71c1c] transition-colors leading-tight">
                        {producto.nombre}
                      </h3>
                      <p className="text-stone-500 text-xs sm:text-sm mt-1.5 font-light line-clamp-2 leading-relaxed">
                        {producto.descripcion}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-stone-200/50">
                      <div>
                        <span className="text-lg sm:text-xl font-black text-[#b71c1c] font-serif">
                          {parseFloat(producto.precio).toFixed(2)}
                        </span>
                        <span className="text-stone-400 font-bold text-xs ml-1">Bs</span>
                      </div>

                      {producto.disponible && config.esta_abierto ? (
                        <button 
                          onClick={() => agregarAlCarrito(producto)}
                          className="bg-[#b71c1c] hover:bg-[#7a0000] text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl font-bold transition-all shadow-md active:scale-95 text-[10px] sm:text-xs uppercase tracking-wider animate-fade-in"
                        >
                          Añadir
                        </button>
                      ) : (
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-stone-100 text-stone-400 flex items-center justify-center cursor-not-allowed border border-stone-200">
                          <X className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════ INFORMACIÓN MINIMALISTA EN CINTA ════ */}
      <section className="border-b border-stone-200/40 bg-white py-4 sm:py-6 w-full animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-8 text-xs sm:text-sm text-stone-600 font-medium">
            {config.direccion && (
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-[#b71c1c]" />
                <span>{config.direccion}</span>
              </div>
            )}
            {config.horario && (
              <div className="flex items-center gap-2.5">
                <Clock className={`w-4.5 h-4.5 ${theme.accentText}`} />
                <span>{config.horario}</span>
              </div>
            )}
            {config.telefono && (
              <div className="flex items-center gap-2.5">
                <Phone className={`w-4.5 h-4.5 ${theme.accentText}`} />
                <a href={`tel:${config.telefono}`} className="hover:underline hover:text-stone-900 transition-colors">{config.telefono}</a>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4">
            <span className="text-xs text-stone-450 font-bold uppercase tracking-wider">Sociales:</span>
            <div className="flex items-center gap-2">
              {config.link_facebook && (
                <a href={config.link_facebook} target="_blank" rel="noopener noreferrer" className={`text-stone-400 transition-colors p-1 hover:${theme.accentText}`} aria-label="Facebook">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                  </svg>
                </a>
              )}
              {config.link_whatsapp && (
                <a href={config.link_whatsapp} target="_blank" rel="noopener noreferrer" className={`text-stone-400 transition-colors p-1 hover:${theme.accentText}`} aria-label="WhatsApp">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.706 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              )}
              {config.link_instagram && (
                <a href={config.link_instagram} target="_blank" rel="noopener noreferrer" className={`text-stone-400 transition-colors p-1 hover:${theme.accentText}`} aria-label="Instagram">
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/>
                  </svg>
                </a>
              )}
              {config.link_tiktok && (
                <a href={config.link_tiktok} target="_blank" rel="noopener noreferrer" className={`text-stone-400 transition-colors p-1 hover:${theme.accentText}`} aria-label="TikTok">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.62 2.89 2.89 0 0 1 2.31-4.5c.37 0 .72.1 1.04.28V9.58a6.32 6.32 0 0 0-2.35-.46A6.34 6.34 0 0 0 2 15.46a6.34 6.34 0 0 0 10.86 4.46l.04-.04v-9.72A10.82 10.82 0 0 0 19.59 12V8.45a4.83 4.83 0 0 1 0-3.76z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════ SECCIÓN CARTA / MENU PRINCIPAL ════ */}
      <main id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full flex-1">
        
        {/* Filters Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 animate-slide-up">
          <div className="text-left">
            <h2 className="text-2xl sm:text-4xl font-black font-serif text-[#111111] mb-1 sm:mb-2">Nuestra Carta</h2>
            <p className="text-stone-500 text-xs sm:text-sm">Selecciona una categoría y explora nuestras especialidades gastronómicas.</p>
          </div>

          <div className="flex items-center bg-white p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-xs border border-stone-200 w-full md:w-96">
            <Search className="w-4 h-4 sm:w-5 h-5 text-stone-400 ml-2" />
            <input 
              type="text" 
              placeholder="Buscar platillo..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-xs sm:text-sm px-3 py-1.5 sm:py-2 text-stone-750 outline-none"
            />
          </div>
        </div>

        {/* Categories selector horizontal list */}
        <div className="flex gap-3 mb-8 sm:mb-12 overflow-x-auto pb-4 pt-1 px-4 sm:px-0 scrollbar-hide -mx-4 sm:mx-0 justify-start sm:justify-center">
          <button
            onClick={() => setCategoriaSeleccionada('Todas')}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-305 shadow-sm border ${
              categoriaSeleccionada === 'Todas' 
                ? `${theme.categoryActive} scale-102 shadow-md` 
                : `bg-white text-stone-600 border-stone-200 hover:scale-102 hover:translate-y-[-2px] ${theme.categoryHover}`
            }`}
          >
            <ChefHat className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span>Todas</span>
          </button>
          {categorias.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoriaSeleccionada(cat.nombre)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-305 shadow-sm border ${
                categoriaSeleccionada === cat.nombre 
                  ? `${theme.categoryActive} scale-102 shadow-md` 
                  : `bg-white text-stone-600 border-stone-200 hover:scale-102 hover:translate-y-[-2px] ${theme.categoryHover}`
              }`}
            >
              {getCategoryIcon(cat.nombre)}
              <span>{cat.nombre}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 sm:py-24">
              <div className="w-10 h-10 border-4 border-stone-200 border-t-[#b71c1c] rounded-full animate-spin"></div>
              <p className="mt-4 text-stone-400 font-medium text-sm">Preparando los platos...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100 max-w-md mx-auto">
              <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-80" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="text-center py-16">
              <ChefHat className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-stone-850">Carta sin platillos</h3>
              <p className="text-stone-400 text-sm mt-1">No se encontraron resultados para tu selección.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {productosFiltrados.map((producto) => (
                <div 
                  key={producto.id} 
                  className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/60 shadow-sm hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300 flex flex-col group relative"
                >
                  {/* Photo Thumbnail / Imagen Superior */}
                  <div className="relative w-full aspect-[4/3] bg-stone-50 overflow-hidden shrink-0 border-b border-stone-100">
                    {producto.fotografia ? (
                      <img 
                        src={producto.fotografia} 
                        alt={producto.nombre} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300 bg-stone-50">
                        <UtensilsCrossed className="w-12 h-12 opacity-30" />
                      </div>
                    )}
                    
                    {!producto.disponible && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                        <span className="bg-red-655 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
                          Agotado
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content & Price */}
                  <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${theme.tagBg} ${theme.accentText}`}>
                        {obtenerNombreCategoria(producto.categoria)}
                      </span>
                      <h3 className={`text-base sm:text-lg font-black text-gray-900 mt-2 sm:mt-3 transition-colors leading-tight ${theme.productHover}`}>
                        {producto.nombre}
                      </h3>
                      <p className="text-stone-500 text-xs sm:text-sm mt-1 sm:mt-2 font-light leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {producto.descripcion}
                      </p>
                    </div>
                    
                    {/* Precio Destacado & Botón Agregar */}
                    <div className="flex items-center justify-between mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-stone-100">
                      <div>
                        <span className={`text-xl sm:text-2xl font-black font-serif ${theme.accentText}`}>
                          {parseFloat(producto.precio).toFixed(2)}
                        </span>
                        <span className="text-stone-400 font-bold text-xs ml-1">Bs</span>
                      </div>

                      {producto.disponible && config.esta_abierto ? (
                        <button 
                          onClick={() => agregarAlCarrito(producto)}
                          className={`flex items-center gap-1.5 text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl font-bold transition-all duration-300 shadow-md active:scale-95 text-[10px] sm:text-xs uppercase tracking-wider ${theme.btnFloat}`}
                          aria-label="Añadir a mi pedido"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Añadir</span>
                        </button>
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-stone-100 text-stone-300 flex items-center justify-center cursor-not-allowed border border-stone-200" title={!config.esta_abierto ? "Restaurante Cerrado" : "Agotado"}>
                          <X className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ════ FOOTER PREMIUM ════ */}
      <footer className="bg-[#111111] text-white mt-auto">
        {/* Franja superior decorativa */}
        <div className={`h-1 bg-gradient-to-r ${theme.footerLine}`} />

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Columna 1: Marca & Redes */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shadow-lg border border-white/10">
                  <UtensilsCrossed className={`w-5 h-5 ${theme.iconGoldText}`} />
                </div>
                <span className="text-xl font-extrabold tracking-tight">{config.nombre_restaurante}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed font-light">
                Ven y disfruta de los mejores sabores de la ciudad. Te ofrecemos pollo a la canasta, pollo broaster, alitas crocantes, y más delicias preparadas con pasión y tradición.
              </p>
              {/* Redes sociales */}
              <div className="flex items-center gap-3 pt-1">
                {config.link_facebook && (
                  <a href={config.link_facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-[#ffc107]" aria-label="Facebook">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                    </svg>
                  </a>
                )}
                {config.link_whatsapp && (
                  <a href={config.link_whatsapp} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-[#ffc107]" aria-label="WhatsApp">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.706 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                )}
                {config.link_instagram && (
                  <a href={config.link_instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-[#ffc107]" aria-label="Instagram">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/>
                    </svg>
                  </a>
                )}
                {config.link_tiktok && (
                  <a href={config.link_tiktok} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-[#ffc107]" aria-label="TikTok">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.62 2.89 2.89 0 0 1 2.31-4.5c.37 0 .72.1 1.04.28V9.58a6.32 6.32 0 0 0-2.35-.46A6.34 6.34 0 0 0 2 15.46a6.34 6.34 0 0 0 10.86 4.46l.04-.04v-9.72A10.82 10.82 0 0 0 19.59 12V8.45a4.83 4.83 0 0 1 0-3.76z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
 
            {/* Columna 2: Información de Ubicación */}
            <div className="space-y-4 text-left">
              <h4 className={`text-sm font-black uppercase tracking-widest ${theme.iconGoldText}`}>Dirección y Contacto</h4>
              <ul className="space-y-3 text-sm text-gray-400 font-light">
                <li className="flex items-start gap-2.5">
                  <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${theme.iconGoldText}`} />
                  <span>{config.direccion || 'Av. Principal #450, Zona Central'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className={`w-4 h-4 shrink-0 ${theme.iconGoldText}`} />
                  <span>{config.horario || 'Lun - Dom: 18:00 - 23:00'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className={`w-4 h-4 shrink-0 ${theme.iconGoldText}`} />
                  <a href={`tel:${config.telefono || '+59177889900'}`} className="hover:text-white transition-colors">
                    {config.telefono || '+591 77 889 900'}
                  </a>
                </li>
              </ul>
            </div>
 
            {/* Columna 3: Horarios detallados */}
            <div className="space-y-4 text-left" id="footer">
              <h4 className={`text-sm font-black uppercase tracking-widest ${theme.iconGoldText}`}>Horarios de Atención</h4>
              <div className="space-y-2 text-sm font-light">
                {[
                  { dia: 'Lunes — Viernes', hora: config.horario_semana || '18:00 – 23:00' },
                  { dia: 'Sábado', hora: config.horario_sabado || '12:00 – 23:00' },
                  { dia: 'Domingo', hora: config.horario_domingo || '12:00 – 22:00' },
                ].map((h, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">{h.dia}</span>
                    <span className={`font-semibold ${theme.iconGoldText}`}>{h.hora}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
 
        {/* Footer copyright */}
        <div className="border-t border-[#ffc107]/10">
          <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <span>© {new Date().getFullYear()} {config.nombre_restaurante}. Todos los derechos reservados.</span>
            <div className="flex items-center gap-1">
              <span>Hecho con</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>para nuestros clientes</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ════ CARRITO BOTÓN FLOTANTE DESTACADO ════ */}
      {totalItems > 0 && (
        <button
          onClick={() => setCartDrawerAbierto(true)}
          className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 text-white rounded-full p-3.5 sm:p-4 shadow-2xl hover:scale-105 transition-all duration-300 group flex items-center gap-2 sm:gap-3 ${theme.btnFloat}`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5.5 h-5.5 sm:w-6 h-6 group-hover:animate-bounce ${theme.iconGoldText}`} />
            <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[9px] sm:text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-transparent">
              {totalItems}
            </span>
          </div>
          <span className="font-bold pr-1.5 sm:pr-2 hidden sm:block uppercase tracking-wider text-xs">Ver Pedido</span>
        </button>
      )}

      {/* ════ MODAL FLOTANTE DEL CARRITO ════ */}
      {cartDrawerAbierto && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            onClick={() => setCartDrawerAbierto(false)} 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
          />
          
          {/* Modal Container */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl z-10 w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-250 border border-stone-200/50">
            
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/80 backdrop-blur-md">
              <h2 className="text-lg sm:text-2xl font-black text-gray-900 flex items-center gap-2">
                <ShoppingBag className={`w-5 h-5 sm:w-6 h-6 ${theme.accentText}`} /> Confirmar mi Pedido
              </h2>
              <button 
                onClick={() => setCartDrawerAbierto(false)} 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors shadow-xs shrink-0"
              >
                <X className="w-4.5 h-4.5 sm:w-5 h-5 text-gray-600" />
              </button>
            </div>
   
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white space-y-6">
              {pedidoExitoso ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">¡Pedido Confirmado!</h3>
                  <p className="text-gray-500">Tu pedido ha sido enviado a cocina. Pronto estará en camino.</p>
                </div>
              ) : carrito.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p className="font-medium text-lg">Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
                  
                  {/* Left Side (Products List) */}
                  <div className="md:col-span-6 space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Resumen de Productos</h3>
                    <div className="space-y-3 max-h-[220px] sm:max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {carrito.map(item => (
                        <div key={item.id} className="flex gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-150 group">
                          {item.foto ? (
                            <img src={item.foto} alt={item.nombre} className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl object-cover shadow-xs shrink-0" />
                          ) : (
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
                              <UtensilsCrossed className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">{item.nombre}</h4>
                              <p className={`font-black text-xs ${theme.accentText}`}>{(item.precio * item.cantidad).toFixed(2)} Bs</p>
                            </div>

                            {/* Campo de observaciones por platillo */}
                            <input 
                              type="text"
                              placeholder="Notas (ej. sin cebolla)"
                              value={item.observaciones || ''}
                              onChange={(e) => actualizarObservacion(item.id, e.target.value)}
                              className="mt-1 px-2 py-0.5 border border-stone-200 rounded-md text-[10px] focus:ring-1 focus:ring-[#b71c1c] outline-none text-stone-600 bg-white"
                            />
                            
                            <div className="flex items-center justify-between mt-2 pt-1">
                              <div className="flex items-center gap-2 bg-white border border-gray-250 rounded-md p-0.5 shadow-xs scale-90 sm:scale-95 origin-left">
                                <button onClick={() => modificarCantidad(item.id, item.cantidad - 1)} className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 rounded-md text-gray-600">
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="font-bold text-xs w-4 text-center">{item.cantidad}</span>
                                <button onClick={() => modificarCantidad(item.id, item.cantidad + 1)} className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 rounded-md text-gray-600">
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                              <button onClick={() => modificarCantidad(item.id, 0)} className="text-gray-400 hover:text-red-500 transition-colors p-1 scale-90">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Totales */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-gray-500 font-bold text-sm">Total a pagar:</span>
                      <div className="flex items-baseline gap-0.5">
                        <span className={`text-xl sm:text-2xl font-black font-serif ${theme.accentText}`}>{calcularTotal().toFixed(2)}</span>
                        <span className="font-bold text-gray-500 text-xs">Bs</span>
                      </div>
                    </div>
                  </div>
   
                  {/* Right Side (Customer Info Form) */}
                  <div className="md:col-span-6 space-y-4 border-t md:border-t-0 md:border-l border-gray-100 pt-5 md:pt-0 md:pl-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Truck className="w-4 h-4 text-gray-500" /> Datos de Envío
                    </h3>
                    <form id="form-delivery" onSubmit={enviarPedidoDelivery} className="space-y-3.5">
                      <div>
                        <label className="block text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Nombre Completo</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="Ej. Juan Pérez" 
                          value={nombreCliente} 
                          onChange={e => setNombreCliente(e.target.value)} 
                          className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#b71c1c] focus:border-[#b71c1c] outline-none transition-all text-xs sm:text-sm font-semibold text-gray-805" 
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Teléfono / Celular</label>
                        <input 
                          required 
                          type="tel" 
                          placeholder="Ej. 77889900" 
                          value={telefonoCliente} 
                          onChange={e => setTelefonoCliente(e.target.value)} 
                          className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#b71c1c] focus:border-[#b71c1c] outline-none transition-all text-xs sm:text-sm font-semibold text-gray-855" 
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Dirección de Entrega</label>
                        <textarea 
                          required 
                          placeholder="Calle, número de casa, referencias..." 
                          value={direccionCliente} 
                          onChange={e => setDireccionCliente(e.target.value)} 
                          rows="3" 
                          className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#b71c1c] focus:border-[#b71c1c] outline-none transition-all text-xs sm:text-sm font-semibold text-gray-855 resize-none" 
                        />
                      </div>
                    </form>
                  </div>
                  
                </div>
              )}
            </div>
   
            {/* Footer Actions */}
            {carrito.length > 0 && !pedidoExitoso && (
              <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setCartDrawerAbierto(false)}
                  className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl sm:rounded-2xl font-bold transition-all hover:bg-gray-100 active:scale-[0.98] text-xs sm:text-sm"
                >
                  Seguir Comprando
                </button>
                
                <button
                  type="submit"
                  form="form-delivery"
                  disabled={enviandoPedido}
                  className={`w-full sm:w-auto px-6 py-3.5 sm:px-10 sm:py-3.5 text-white font-bold rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 active:scale-[0.98] text-xs sm:text-sm ${theme.btnFloat}`}
                >
                  {enviandoPedido ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      Confirmar y Enviar Pedido 
                      <ChevronRight className={`w-4 h-4 ${theme.iconGoldText}`} />
                    </>
                  )}
                </button>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
};

export default InicioPublico;
