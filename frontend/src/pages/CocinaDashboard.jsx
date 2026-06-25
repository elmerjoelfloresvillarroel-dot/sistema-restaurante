import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Clock, 
  Check, 
  Volume2, 
  VolumeX, 
  Utensils, 
  RefreshCw, 
  Play, 
  CheckCircle,
  Archive,
  History,
  AlertCircle,
  Lock
} from 'lucide-react';

const CocinaDashboard = () => {
  const [pedidos, setPedidos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Control de sonido de notificación
  const [soundMuted, setSoundMuted] = useState(false);
  
  // Guardar ids de pedidos despachados localmente
  const [despachados, setDespachados] = useState(() => {
    try {
      const saved = localStorage.getItem('cocinaDespachados');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Filtro de vista ('activas', 'completadas')
  const [viewMode, setViewMode] = useState('activas');

  // Ref para rastrear pedidos conocidos y alertar por nuevos
  const prevPedidosIdsRef = useRef(new Set());

  // Actualizar localStorage cuando cambia la lista de despachados
  useEffect(() => {
    localStorage.setItem('cocinaDespachados', JSON.stringify(despachados));
  }, [despachados]);

  // Estado para controlar la sincronización con el turno de caja
  const [cajaShiftStep, setCajaShiftStep] = useState(() => localStorage.getItem('caja_shift_step'));
  const [lastShiftStartTime, setLastShiftStartTime] = useState(() => localStorage.getItem('caja_shift_abierta_time'));

  // Escuchar cambios en localStorage para mantener sincronizado el turno en tiempo real
  useEffect(() => {
    const checkStorage = () => {
      const currentStep = localStorage.getItem('caja_shift_step');
      const currentStartTime = localStorage.getItem('caja_shift_abierta_time');
      
      if (currentStep !== cajaShiftStep) {
        setCajaShiftStep(currentStep);
      }
      
      if (currentStartTime !== lastShiftStartTime) {
        setLastShiftStartTime(currentStartTime);
        // Si el tiempo de inicio de turno cambia o se borra (apertura de un nuevo turno o cierre de caja),
        // limpiamos las comandas despachadas en el estado local de cocina.
        setDespachados([]);
        localStorage.removeItem('cocinaDespachados');
      }
    };

    window.addEventListener('storage', checkStorage);
    const interval = setInterval(checkStorage, 1000);

    return () => {
      window.removeEventListener('storage', checkStorage);
      clearInterval(interval);
    };
  }, [cajaShiftStep, lastShiftStartTime]);

  // Generador de sonido Web Audio API (Chime agradable de restaurante premium)
  const playAlertSound = () => {
    if (soundMuted) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;
      
      // Primera nota (D5) - Suave y pura
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);
      
      // Segunda nota (A5)
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.00, now + 0.15);
      gain2.gain.setValueAtTime(0.12, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.error("Audio API error:", e);
    }
  };

  // Carga de datos
  const loadData = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      
      const [resPedidos, resDetalles, resProductos, resMesas, resCategorias] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/pedidos/'),
        axios.get('http://127.0.0.1:8000/api/detalles-pedido/'),
        axios.get('http://127.0.0.1:8000/api/productos/'),
        axios.get('http://127.0.0.1:8000/api/mesas/'),
        axios.get('http://127.0.0.1:8000/api/categorias/')
      ]);

      const activePedidos = resPedidos.data.filter(p => p.estado !== 'Cancelado');
      setPedidos(activePedidos);
      setDetalles(resDetalles.data);
      setProductos(resProductos.data);
      setMesas(resMesas.data);
      setCategorias(resCategorias.data);
      setError(null);

      // Lógica para detectar nuevos pedidos
      if (prevPedidosIdsRef.current.size > 0 && !loading) {
        let hasNew = false;
        activePedidos.forEach(p => {
          if (!prevPedidosIdsRef.current.has(p.id) && !despachados.includes(p.id)) {
            hasNew = true;
          }
        });
        if (hasNew) {
          playAlertSound();
        }
      }

      // Actualizar ref
      const currentIds = new Set(activePedidos.map(p => p.id));
      prevPedidosIdsRef.current = currentIds;

    } catch (err) {
      console.error("Error al cargar datos en cocina:", err);
      setError("Error de comunicación con el servidor. Reintentando...");
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    loadData();
  }, []);

  // Polling automático cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [despachados, soundMuted, loading]);

  // Actualizador de minutero cada 30 segundos
  const [, setMinuteTicker] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setMinuteTicker(tick => tick + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Marcar pedido como despachado
  const despacharPedido = (id) => {
    despacharPedidoAnimate(id);
  };

  // Efecto de salida suave al despachar
  const despacharPedidoAnimate = (id) => {
    const element = document.getElementById(`kds-card-${id}`);
    if (element) {
      element.classList.add('scale-95', 'opacity-0', 'translate-y-4');
      element.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => {
        setDespachados(prev => [...prev, id]);
      }, 350);
    } else {
      setDespachados(prev => [...prev, id]);
    }
  };

  // Recuperar un pedido despachado
  const recuperarPedido = (id) => {
    setDespachados(prev => prev.filter(pId => pId !== id));
  };

  // Limpiar historial de despachados
  const limpiarHistorialCocina = () => {
    if (window.confirm("¿Estás seguro de que deseas limpiar el historial de cocina de esta sesión?")) {
      setDespachados([]);
    }
  };

  // Obtener nombre de categoría a partir de su ID
  const obtenerNombreCategoria = (categoriaId) => {
    const cat = categorias.find(c => c.id === categoriaId);
    return cat ? cat.nombre : '';
  };

  // Detectar si la categoría es de bebidas o gaseosas
  const esCategoriaDeBebida = (catNombre) => {
    if (!catNombre) return false;
    const nombreLower = catNombre.toLowerCase();
    return (
      nombreLower.includes('bebida') ||
      nombreLower.includes('refresco') ||
      nombreLower.includes('gaseosa') ||
      nombreLower.includes('jugo') ||
      nombreLower.includes('coctel') ||
      nombreLower.includes('trago')
    );
  };

  // Obtener platillos de comida de un pedido (excluyendo bebidas)
  const obtenerItemsPedidoFiltrados = (pedidoId) => {
    return detalles
      .filter(d => d.pedido === pedidoId)
      .map(d => {
        const prod = productos.find(p => p.id === d.producto);
        return {
          id: d.id,
          cantidad: d.cantidad,
          nombre: prod ? prod.nombre : `Platillo #${d.producto}`,
          categoria: prod ? prod.categoria : null
        };
      })
      .filter(item => {
        const catNombre = obtenerNombreCategoria(item.categoria);
        return !esCategoriaDeBebida(catNombre);
      });
  };

  // Obtener número de mesa
  const obtenerNumeroMesa = (mesaId) => {
    const mesa = mesas.find(m => m.id === mesaId);
    return mesa ? mesa.numero : '-';
  };

  // Calcular tiempo transcurrido en minutos
  const obtenerMinutosEspera = (fechaStr) => {
    const fechaPedido = new Date(fechaStr);
    const ahora = new Date();
    const diffMs = ahora - fechaPedido;
    return Math.max(0, Math.floor(diffMs / 60000));
  };

  const shiftStartTime = lastShiftStartTime ? new Date(new Date(lastShiftStartTime).getTime() - 10000) : null;

  // Filtrar pedidos creados únicamente durante este turno
  const pedidosDeEsteTurno = pedidos.filter(p => {
    if (!shiftStartTime) return false;
    return new Date(p.fecha_creacion) >= shiftStartTime;
  });

  // ID del primer pedido del turno actual para numeración relativa
  const firstId = pedidosDeEsteTurno.length > 0
    ? Math.min(...pedidosDeEsteTurno.map(p => p.id))
    : null;

  // Filtrar pedidos según pestaña activa y si contienen platillos de cocina (comida)
  const pedidosFiltrados = pedidosDeEsteTurno.filter(p => {
    const isDespachado = despachados.includes(p.id);
    const tieneItemsCocina = obtenerItemsPedidoFiltrados(p.id).length > 0;
    
    if (viewMode === 'activas') {
      return !isDespachado && tieneItemsCocina;
    } else {
      return isDespachado && tieneItemsCocina;
    }
  }).sort((a, b) => {
    if (viewMode === 'activas') {
      // FIFO: el más antiguo primero
      return new Date(a.fecha_creacion) - new Date(b.fecha_creacion);
    } else {
      // LIFO para completados: el más reciente primero
      return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
    }
  });

  // Bloqueo KDS si la caja no está iniciada (turno cerrado)
  if (cajaShiftStep !== '2') {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-4" style={{ background: 'linear-gradient(180deg, #FFF8F0, #FFF3E0)', fontFamily: 'Outfit, sans-serif' }}>
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E5E5E5] p-8 shadow-xl text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-20 h-20 bg-gradient-to-br from-[#7A0000] to-[#B71C1C] rounded-3xl flex items-center justify-center text-[#FFC107] mx-auto shadow-md animate-pulse">
            <Lock className="w-10 h-10 drop-shadow-md" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#111111] uppercase tracking-wide">
              PANTALLA DE COCINA BLOQUEADA
            </h2>
            <p className="text-sm text-stone-500 font-bold leading-relaxed">
              El monitor de cocina (KDS) se encuentra inactivo. El cajero debe iniciar el turno de caja en el panel de Caja POS para habilitar el servicio.
            </p>
          </div>

          <div className="pt-4 border-t border-[#E5E5E5] flex flex-col gap-2 items-center justify-center">
            <span className="text-[10px] font-black text-[#B71C1C] uppercase tracking-widest bg-[#B71C1C]/10 px-3 py-1.5 rounded-full">
              Estado: Esperando apertura de caja
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center flex-col gap-4" style={{ background: 'linear-gradient(180deg, #FFF8F0, #FFF3E0)' }}>
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#B71C1C]/10 border-t-[#B71C1C] rounded-full animate-spin"></div>
          <Utensils className="w-6 h-6 text-[#FFC107] absolute animate-pulse" />
        </div>
        <span className="text-[#7A0000] text-xs font-black tracking-widest uppercase animate-pulse" style={{ fontFamily: 'Outfit, sans-serif' }}>CARGANDO PANTALLA KDS...</span>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col text-slate-800 overflow-hidden font-sans select-none antialiased relative kds-body kds-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap');
        
        .kds-container {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        .kds-body {
          background: linear-gradient(180deg, #FFF8F0, #FFF3E0) !important;
        }
        
        .kds-header {
          background: linear-gradient(135deg, #7A0000, #B71C1C, #D32F2F) !important;
          box-shadow: 0 4px 15px rgba(122, 0, 0, 0.25) !important;
          border-bottom: 4px solid #FFC107 !important;
        }

        .kds-card {
          background-color: #FFFFFF !important;
          border-radius: 1.5rem !important;
          box-shadow: 0 8px 24px rgba(17, 17, 17, 0.05) !important;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
          border: 2px solid #E5E5E5 !important;
          overflow: hidden;
        }

        .kds-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: 0 16px 32px rgba(17, 17, 17, 0.12) !important;
          border-color: #FFC107 !important;
        }

        /* Status borders */
        .kds-card-nuevo {
          border-color: #FFC107 !important;
        }
        .kds-card-demorado {
          border-color: #FF9800 !important;
        }
        .kds-card-urgente {
          border-color: #B71C1C !important;
          animation: kds-urgente-glow 2s infinite ease-in-out !important;
        }

        /* Attention glow animation */
        @keyframes kds-urgente-glow {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(183, 28, 28, 0.15), 0 0 0 0px rgba(183, 28, 28, 0.4) !important;
          }
          50% {
            box-shadow: 0 16px 36px rgba(183, 28, 28, 0.3), 0 0 0 8px rgba(183, 28, 28, 0) !important;
          }
        }

        /* Status Badges */
        .kds-status-nuevo {
          background-color: #FFC107 !important;
          border-bottom: 3px solid #FF9800 !important;
        }
        .kds-status-demorado {
          background-color: #FF9800 !important;
          border-bottom: 3px solid #7A0000 !important;
        }
        .kds-status-urgente {
          background-color: #B71C1C !important;
          border-bottom: 3px solid #7A0000 !important;
          animation: kds-badge-flash 1.5s infinite alternate !important;
        }

        @keyframes kds-badge-flash {
          0% { background-color: #B71C1C; }
          100% { background-color: #D32F2F; }
        }

        /* Wait Time Badge */
        .kds-time-badge {
          background-color: #111111 !important;
          color: #FFC107 !important;
          font-family: monospace, sans-serif !important;
          font-size: 0.95rem !important;
          font-weight: 950 !important;
          padding: 0.35rem 0.75rem !important;
          border-radius: 0.5rem !important;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.6) !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.35rem !important;
        }

        /* Product items */
        .kds-qty-circle {
          background-color: #B71C1C !important;
          color: #FFFFFF !important;
          width: 2.75rem !important;
          height: 2.75rem !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 1.5rem !important;
          font-weight: 900 !important;
          box-shadow: 0 3px 6px rgba(183, 28, 28, 0.3) !important;
          flex-shrink: 0;
        }

        .kds-item-name {
          font-size: 1.25rem !important;
          font-weight: 850 !important;
          color: #111111 !important;
          letter-spacing: -0.01em !important;
          line-height: 1.2 !important;
        }

        .kds-item-container {
          padding: 0.75rem 1rem !important;
          background-color: #FFFFFF !important;
          border: 2px solid #E5E5E5 !important;
          border-radius: 1rem !important;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02) !important;
          transition: border-color 0.2s ease !important;
        }
        
        .kds-item-container:hover {
          border-color: #B71C1C !important;
        }

        /* Observations box */
        .kds-obs-box {
          background-color: #FFF8F0 !important;
          border-left: 5px solid #FFC107 !important;
          border-top: 1px solid #FFF3E0 !important;
          border-right: 1px solid #FFF3E0 !important;
          border-bottom: 1px solid #FFF3E0 !important;
          border-radius: 0.75rem !important;
          box-shadow: 0 2px 8px rgba(255, 193, 7, 0.05) !important;
          padding: 0.75rem 1rem !important;
        }

        /* Dispatch button */
        .kds-btn-dispatch {
          background-color: #B71C1C !important;
          color: #FFFFFF !important;
          font-weight: 900 !important;
          transition: all 0.2s ease !important;
          border: none !important;
        }
        .kds-btn-dispatch:hover {
          background-color: #7A0000 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(183, 28, 28, 0.3) !important;
        }

        /* Recover button */
        .kds-btn-recover {
          background-color: #333333 !important;
          color: #FFFFFF !important;
          font-weight: 900 !important;
          transition: all 0.2s ease !important;
          border: none !important;
        }
        .kds-btn-recover:hover {
          background-color: #111111 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(51, 51, 51, 0.3) !important;
        }

        /* Custom Tabs styling */
        .kds-tab-btn {
          font-weight: 900 !important;
          transition: all 0.25s ease !important;
        }
        .kds-tab-btn-active {
          background-color: #FFC107 !important;
          color: #111111 !important;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15) !important;
        }
        .kds-tab-btn-inactive {
          color: #FFFFFF !important;
          opacity: 0.75 !important;
        }
        .kds-tab-btn-inactive:hover {
          opacity: 1 !important;
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>

      {/* BARRA DE HERRAMIENTAS INDUSTRIAL COMPACTA */}
      <div className="kds-header px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-3 shrink-0 relative z-10">
        
        {/* Info y Estado de Cocina con LED animado */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-black/20 px-3.5 py-1.5 rounded-full border border-white/10 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-widest text-[#FFC107] uppercase">KDS PANTALLA ACTIVA</span>
          </div>
          <div className="hidden md:block h-5 w-px bg-white/20"></div>
          <div className="flex items-center gap-2 text-xs text-white font-bold">
            Comandas en Espera: 
            <span className="bg-[#111111] text-[#FFC107] font-black px-3 py-1 rounded border border-[#FF9800]/50 text-sm shadow-md">
              {pedidos.filter(p => !despachados.includes(p.id) && obtenerItemsPedidoFiltrados(p.id).length > 0).length}
            </span>
          </div>
        </div>

        {/* Controles de Vista y Herramientas */}
        <div className="flex items-center gap-3">
          
          {/* Tabs KDS */}
          <div className="bg-black/35 p-1 rounded-xl flex gap-1 shrink-0 shadow-inner border border-white/5">
            <button
              onClick={() => setViewMode('activas')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs kds-tab-btn transition-all ${
                viewMode === 'activas'
                  ? 'kds-tab-btn-active'
                  : 'kds-tab-btn-inactive'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Pendientes</span>
            </button>
            <button
              onClick={() => setViewMode('completadas')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs kds-tab-btn transition-all ${
                viewMode === 'completadas'
                  ? 'kds-tab-btn-active'
                  : 'kds-tab-btn-inactive'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Completados</span>
            </button>
          </div>

          <div className="h-5 w-px bg-white/20 shrink-0"></div>

          {/* Silenciador de Sonido */}
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className={`p-2 rounded-xl border transition-all shrink-0 ${
              soundMuted 
                ? 'bg-[#B71C1C] border-[#B71C1C] text-white hover:bg-[#7A0000]' 
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
            }`}
            title={soundMuted ? "Activar Sonido" : "Silenciar Notificaciones"}
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Actualizar Manual */}
          <button
            onClick={() => loadData(true)}
            className="p-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-xl transition-all shrink-0"
            title="Actualizar listado"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Limpiar Historial */}
          {viewMode === 'completadas' && despachados.length > 0 && (
            <button
              onClick={limpiarHistorialCocina}
              className="bg-[#B71C1C] hover:bg-[#7A0000] text-white px-3.5 py-1.5 rounded-xl text-xs font-black border border-[#D32F2F] transition-all shrink-0 shadow-md"
            >
              Limpiar Historial
            </button>
          )}
        </div>
      </div>

      {/* MONITOR DE ERROR */}
      {error && (
        <div className="bg-[#B71C1C] text-white px-6 py-2.5 text-xs font-bold flex items-center justify-center gap-2 relative z-10 border-b border-[#7A0000]">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#FFC107] animate-pulse" />
          <span style={{ fontFamily: 'Outfit, sans-serif' }}>{error}</span>
        </div>
      )}

      {/* CONTENEDOR PRINCIPAL DE COMANDAS */}
      <main className="flex-1 overflow-y-auto p-6 relative z-10">
        {pedidosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-24 animate-in fade-in duration-300">
            <CheckCircle className="w-16 h-16 text-[#B71C1C]/30 mb-4" />
            <h3 className="text-[#7A0000] font-black text-lg uppercase tracking-widest" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {viewMode === 'activas' ? '¡COCINA AL DÍA!' : 'HISTORIAL VACÍO'}
            </h3>
            <p className="text-[#333333]/60 text-xs mt-1.5 max-w-[280px]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {viewMode === 'activas' 
                ? 'No quedan comandas pendientes de preparación.' 
                : 'No se registran platos despachados recientemente.'}
            </p>
          </div>
        ) : viewMode === 'completadas' ? (
          <div className="space-y-4 max-w-7xl mx-auto">
            {pedidosFiltrados.map(pedido => {
              const minutosEspera = obtenerMinutosEspera(pedido.fecha_creacion);
              const items = obtenerItemsPedidoFiltrados(pedido.id);
              const numeroMostrado = firstId ? (pedido.id - firstId + 1) : 1;
              
              return (
                <div 
                  key={pedido.id}
                  className="bg-white border border-[#E5E5E5] rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* Comanda e Info Básica */}
                  <div className="flex items-center gap-4 min-w-[200px] shrink-0">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase text-[#333333]/60 tracking-wider block">COMANDA</span>
                      <h4 className="text-2xl font-black text-[#111111] leading-none">#{numeroMostrado}</h4>
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      {pedido.tipo_pedido === 'Consumo local' ? (
                        <span className="bg-[#B71C1C]/10 text-[#B71C1C] text-[10px] font-black uppercase px-2.5 py-0.5 rounded border border-[#B71C1C]/20 shadow-xs">
                          MESA {obtenerNumeroMesa(pedido.mesa)}
                        </span>
                      ) : (
                        <span className="bg-blue-500/10 text-blue-700 text-[10px] font-black uppercase px-2.5 py-0.5 rounded border border-blue-500/20 shadow-xs">
                          LLEVAR
                        </span>
                      )}
                      <span className="text-[10px] font-black text-[#333333]/80 uppercase">
                        {pedido.tipo_pedido}
                      </span>
                    </div>
                  </div>

                  {/* Listado de Platillos Despachados */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2.5">
                      {items.map(item => (
                        <div 
                          key={item.id} 
                          className="bg-white border border-[#E5E5E5] px-3.5 py-2 rounded-xl flex items-center gap-2.5 hover:bg-[#FFF8F0]/30 transition-colors"
                        >
                          <span className="text-white font-black text-xs bg-[#B71C1C] px-2 py-0.5 rounded-full">
                            {item.cantidad}
                          </span>
                          <span className="font-extrabold text-[#111111] text-xs sm:text-[13px] uppercase tracking-wide">
                            {item.nombre}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {pedido.observaciones && (
                      <div className="mt-3 kds-obs-box inline-flex items-center gap-2.5">
                        <span className="text-[10px] font-black text-[#FF9800] uppercase tracking-widest shrink-0">NOTAS:</span>
                        <p className="text-xs text-[#111111] font-black uppercase tracking-wide">
                          {pedido.observaciones}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Tiempo y Acción de Recuperar */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                    <div className="flex flex-col lg:items-end">
                      <span className="text-[10px] font-black uppercase text-[#333333]/60 tracking-wider">TIEMPO ESPERA</span>
                      <span className="kds-time-badge">
                        {minutosEspera} MIN
                      </span>
                    </div>
                    
                    <button
                      onClick={() => recuperarPedido(pedido.id)}
                      className="kds-btn-recover px-5 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                    >
                      <History className="w-4 h-4 text-white" />
                      <span>Recuperar Comanda</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pedidosFiltrados.map(pedido => {
              const minutosEspera = obtenerMinutosEspera(pedido.fecha_creacion);
              const items = obtenerItemsPedidoFiltrados(pedido.id);
              const numeroMostrado = firstId ? (pedido.id - firstId + 1) : 1;
              
              // Semáforo de criticidad KDS
              let statusCardClass = 'kds-card-nuevo';
              let statusHeaderBg = 'kds-status-nuevo';
              let ledClass = 'bg-[#111111]';
              let timeColor = 'text-[#FFC107]';
              let statusLabel = 'NUEVO';
              let statusTextClass = 'text-[#111111]';

              if (viewMode === 'activas') {
                if (minutosEspera >= 20) {
                  // URGENTE (Rojo principal y animación)
                  statusCardClass = 'kds-card-urgente';
                  statusHeaderBg = 'kds-status-urgente';
                  ledClass = 'bg-white animate-ping';
                  timeColor = 'text-[#FFC107]';
                  statusLabel = '¡URGENTE!';
                  statusTextClass = 'text-white';
                } else if (minutosEspera >= 10) {
                  // DEMORADO (Naranja)
                  statusCardClass = 'kds-card-demorado';
                  statusHeaderBg = 'kds-status-demorado';
                  ledClass = 'bg-white animate-pulse';
                  timeColor = 'text-[#FFC107]';
                  statusLabel = 'DEMORADO';
                  statusTextClass = 'text-white';
                } else {
                  // NUEVO (Dorado)
                  statusCardClass = 'kds-card-nuevo';
                  statusHeaderBg = 'kds-status-nuevo';
                  ledClass = 'bg-[#111111]';
                  timeColor = 'text-[#FFC107]';
                  statusLabel = 'NUEVO';
                  statusTextClass = 'text-[#111111]';
                }
              }

              return (
                <div 
                  id={`kds-card-${pedido.id}`}
                  key={pedido.id} 
                  className={`kds-card flex flex-col justify-between ${statusCardClass}`}
                >
                  
                  {/* CABECERA DE LA TARJETA */}
                  <div className={`px-5 py-3.5 flex justify-between items-center shrink-0 ${statusHeaderBg}`}>
                    <div className="space-y-0.5">
                      <span className={`text-[10px] font-black uppercase tracking-widest block opacity-80 ${statusTextClass}`}>COMANDA</span>
                      <h4 className={`text-2xl font-black tracking-tight leading-none ${statusTextClass}`}>#{numeroMostrado}</h4>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1">
                      {statusLabel && (
                        <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded shadow-sm ${
                          statusLabel === '¡URGENTE!' ? 'bg-white text-[#B71C1C]' :
                          statusLabel === 'DEMORADO' ? 'bg-white text-[#FF9800]' :
                          'bg-white text-[#111111]'
                        }`}>
                          {statusLabel}
                        </span>
                      )}
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black/15 ${statusTextClass}`}>
                        {pedido.tipo_pedido}
                      </span>
                    </div>
                  </div>

                  {/* INDICADOR DE TIEMPO Y MESA */}
                  <div className="px-5 py-3 bg-[#FFF8F0]/40 border-b border-[#E5E5E5] flex justify-between items-center text-xs shrink-0 font-bold">
                    
                    {/* Mesa */}
                    <span>
                      {pedido.tipo_pedido === 'Consumo local' ? (
                        <span className="bg-[#B71C1C]/10 text-[#B71C1C] text-xs font-black uppercase px-3 py-1 rounded-md border border-[#B71C1C]/25 shadow-xs">
                          MESA {obtenerNumeroMesa(pedido.mesa)}
                        </span>
                      ) : (
                        <span className="bg-blue-500/10 text-blue-705 text-xs font-black uppercase px-3 py-1 rounded-md border border-blue-500/25 shadow-xs">
                          LLEVAR
                        </span>
                      )}
                    </span>

                    {/* Espera LED */}
                    <div className="kds-time-badge">
                      {viewMode === 'activas' && (
                        <span className="relative flex h-2 w-2">
                          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${ledClass}`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${ledClass.split(' ')[0]}`}></span>
                        </span>
                      )}
                      <span>
                        {minutosEspera} MIN
                      </span>
                    </div>
                  </div>

                  {/* LISTADO DE ITEMS */}
                  <div className="flex-1 p-5 space-y-3.5 overflow-y-auto min-h-[160px] max-h-[280px]">
                    <div className="space-y-3">
                      {items.map(item => (
                        <div 
                          key={item.id} 
                          className="kds-item-container flex items-center gap-4"
                        >
                          {/* Cantidad Gigante en Círculo Rojo */}
                          <div className="kds-qty-circle">
                            {item.cantidad}
                          </div>
                          
                          {/* Nombre de Platillo */}
                          <div className="kds-item-name uppercase flex-1">
                            {item.nombre}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* OBSERVACIONES GENERALES DE CAJA */}
                  {pedido.observaciones && (
                    <div className="mx-5 mb-4 kds-obs-box shrink-0">
                      <span className="text-[10px] font-black text-[#FF9800] uppercase tracking-widest block mb-1">NOTAS ESPECIALES:</span>
                      <p className="text-sm text-[#111111] font-black leading-snug uppercase tracking-wide">
                        {pedido.observaciones}
                      </p>
                    </div>
                  )}

                  {/* BOTÓN DE ACCIÓN (Despachar / Recuperar) */}
                  <div className="p-5 border-t border-slate-100 bg-[#FFF8F0]/30 shrink-0">
                    {viewMode === 'activas' ? (
                      <button
                        onClick={() => despacharPedido(pedido.id)}
                        className="w-full kds-btn-dispatch py-4 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-[0.98]"
                      >
                        <Check className="w-4 h-4 stroke-[3px]" />
                        <span>Despachar Comanda</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => recuperarPedido(pedido.id)}
                        className="w-full kds-btn-recover py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow border cursor-pointer active:scale-[0.98]"
                      >
                        <History className="w-4 h-4" />
                        <span>Recuperar Comanda</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

    </div>
  );
};

export default CocinaDashboard;
