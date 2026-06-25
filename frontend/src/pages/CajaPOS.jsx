import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Notebook, 
  DollarSign,
  CheckCircle,
  X,
  Store,
  User,
  ShoppingBag,
  Info,
  AlertCircle,
  Clock,
  Calendar,
  Users,
  Check,
  MapPin,
  Phone,
  RefreshCw,
  FileText,
  Edit,
  Printer,
  ChevronRight
} from 'lucide-react';




const CajaPOS = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pestaña Activa ('pos', 'delivery', 'reservations', 'history', 'tables')
  const [activeTab, setActiveTab] = useState('pos');

  // Estados de control del POS (Punto de Venta)
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0); // Corrección 1: Suma dinámica
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [tipoPedido, setTipoPedido] = useState('Consumo local');
  const [mesaSeleccionada, setMesaSeleccionada] = useState('');
  const [observacionesGenerales, setObservacionesGenerales] = useState('');

  // Datos de envío a domicilio
  const [deliveryNombre, setDeliveryNombre] = useState('');
  const [deliveryDireccion, setDeliveryDireccion] = useState('');
  const [deliveryTelefono, setDeliveryTelefono] = useState('');
  const [deliveryReferencia, setDeliveryReferencia] = useState('');

  // Control del panel lateral del carrito (visible/oculto en la vista de selección)
  const [panelCarritoAbierto, setPanelCarritoAbierto] = useState(false);

  // Estado del Modal de Pago
  const [modalAbierto, setModalAbierto] = useState(false);
  const [metodoPago, setMetodoPago] = useState('Efectivo'); // 'Efectivo', 'QR', 'Mixto'
  const [montoRecibido, setMontoRecibido] = useState('');
  
  // Montos específicos para el Pago Mixto
  const [montoEfectivoMixto, setMontoEfectivoMixto] = useState('');
  const [montoQrMixto, setMontoQrMixto] = useState('');

  const [confirmandoPedido, setConfirmandoPedido] = useState(false);
  const [exito, setExito] = useState(false);
  const [ultimoPedidoCreado, setUltimoPedidoCreado] = useState(null);
  const [ultimoCarrito, setUltimoCarrito] = useState([]);
  const [ultimoMetodoPago, setUltimoMetodoPago] = useState('Efectivo');

  // Estado para la configuración global (incluyendo el QR)
  const [imagenQrUrl, setImagenQrUrl] = useState('');
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

  // Estado para Pedidos en Espera (Pausados)
  const [pedidosEnEspera, setPedidosEnEspera] = useState(() => {
    try {
      const saved = localStorage.getItem('pedidosEnEspera');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error al cargar pedidosEnEspera de localStorage:", e);
      return [];
    }
  });
  const [modalPausadosAbierto, setModalPausadosAbierto] = useState(false);

  // Estados para Extras / Adicionales
  const [modalExtrasAbierto, setModalExtrasAbierto] = useState(false);
  const [itemSeleccionadoExtras, setItemSeleccionadoExtras] = useState(null);
  const [extrasTemporales, setExtrasTemporales] = useState([]);
  const [nuevoExtraNombre, setNuevoExtraNombre] = useState('');
  const [nuevoExtraPrecio, setNuevoExtraPrecio] = useState('');
  const [extrasPredefinidos, setExtrasPredefinidos] = useState([]);

  // Estados de Delivery
  const [pedidosDelivery, setPedidosDelivery] = useState([]);

  // Estados de Reservaciones
  const [reservas, setReservas] = useState([]);

  // Estados de Historial
  const [pedidosHistorial, setPedidosHistorial] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroIdPedido, setFiltroIdPedido] = useState('');
  const [filtroTipoPedido, setFiltroTipoPedido] = useState('Todos');
  const [paginaHistorial, setPaginaHistorial] = useState(1);

  // Reiniciar página a 1 cuando cambian los filtros
  useEffect(() => {
    setPaginaHistorial(1);
  }, [filtroFecha, filtroIdPedido, filtroTipoPedido]);

  // Estados para creación y edición de Mesas
  const [modalMesaAbierto, setModalMesaAbierto] = useState(false);
  const [mesaSeleccionadaEdicion, setMesaSeleccionadaEdicion] = useState(null);
  const [numeroMesa, setNumeroMesa] = useState('');
  const [capacidadMesa, setCapacidadMesa] = useState('');
  const [errorMesa, setErrorMesa] = useState('');
  const [guardandoMesa, setGuardandoMesa] = useState(false);

  // --- Estados de Control de Caja (Flujo de Pasos) ---
  const [shiftStep, setShiftStep] = useState(() => {
    const saved = localStorage.getItem('caja_shift_step');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [cashierName, setCashierName] = useState(() => localStorage.getItem('caja_cashier_name') || '');
  const [initialCash, setInitialCash] = useState(() => {
    const saved = localStorage.getItem('caja_initial_cash');
    return saved ? parseFloat(saved) : 0;
  });
  const [shiftDesc, setShiftDesc] = useState(() => {
    const saved = localStorage.getItem('caja_shift_desc');
    if (saved) return saved;
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const anio = hoy.getFullYear();
    return `Turno mañana - ${dia}/${mes}/${anio}`;
  });
  const [movements, setMovements] = useState(() => {
    const saved = localStorage.getItem('caja_movements');
    return saved ? JSON.parse(saved) : [];
  });
  const [cashCount, setCashCount] = useState(() => {
    const saved = localStorage.getItem('caja_cash_count');
    return saved ? JSON.parse(saved) : { b200: 0, b100: 0, b50: 0, b20: 0, b10: 0, b5: 0, m2: 0, m1: 0, m050: 0, m020: 0 };
  });
  const [arqueoNotes, setArqueoNotes] = useState(() => localStorage.getItem('caja_arqueo_notes') || '');

  // Formulario manual en Paso 2
  const [manualDesc, setManualDesc] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [manualMetodo, setManualMetodo] = useState('Efectivo');

  // Sincronización a localStorage
  useEffect(() => {
    localStorage.setItem('caja_shift_step', shiftStep.toString());
  }, [shiftStep]);

  useEffect(() => {
    localStorage.setItem('caja_cashier_name', cashierName);
  }, [cashierName]);

  useEffect(() => {
    localStorage.setItem('caja_initial_cash', initialCash.toString());
  }, [initialCash]);

  useEffect(() => {
    localStorage.setItem('caja_shift_desc', shiftDesc);
  }, [shiftDesc]);

  useEffect(() => {
    localStorage.setItem('caja_movements', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem('caja_cash_count', JSON.stringify(cashCount));
  }, [cashCount]);

  useEffect(() => {
    localStorage.setItem('caja_arqueo_notes', arqueoNotes);
  }, [arqueoNotes]);

  // Cálculos de métricas del turno
  const ventasEfectivo = movements.reduce((s, m) => {
    if (m.type === 'Efectivo') return s + m.amount;
    if (m.type === 'Mixto') return s + (m.montoEfectivo || 0);
    return s;
  }, 0);

  const anulacionesEfectivo = movements.reduce((s, m) => {
    if (m.type === 'Anulacion' && m.metodo === 'Efectivo') return s + m.amount;
    return s;
  }, 0);

  const totalEfectivo = ventasEfectivo - anulacionesEfectivo;

  const ventasQr = movements.reduce((s, m) => {
    if (m.type === 'QR') return s + m.amount;
    if (m.type === 'Mixto') return s + (m.montoQr || 0);
    return s;
  }, 0);

  const anulacionesQr = movements.reduce((s, m) => {
    if (m.type === 'Anulacion' && m.metodo === 'QR') return s + m.amount;
    return s;
  }, 0);

  const totalQr = ventasQr - anulacionesQr;

  const totalVentas = totalEfectivo + totalQr;

  const totalContado = (cashCount.b200 * 200) +
                       (cashCount.b100 * 100) +
                       (cashCount.b50 * 50) +
                       (cashCount.b20 * 20) +
                       (cashCount.b10 * 10) +
                       (cashCount.b5 * 5) +
                       (cashCount.m2 * 2) +
                       (cashCount.m1 * 1) +
                       (cashCount.m050 * 0.5) +
                       (cashCount.m020 * 0.2);

  const efectivoEsperado = initialCash + totalEfectivo;
  const diferenciaArqueo = totalContado - efectivoEsperado;

  const registrarMovimientoManual = (tipo) => {
    const amount = parseFloat(manualAmount);
    if (!manualDesc.trim() || isNaN(amount) || amount <= 0) {
      alert("Por favor ingrese una descripción válida y un monto mayor a 0.");
      return;
    }

    const nuevoMov = {
      type: tipo === 'venta' ? manualMetodo : 'Anulacion',
      metodo: tipo === 'anulacion' ? manualMetodo : undefined,
      desc: manualDesc.trim(),
      amount: amount,
      timestamp: new Date().toLocaleTimeString()
    };

    setMovements(prev => [...prev, nuevoMov]);
    setManualDesc('');
    setManualAmount('');
  };

  const themeClasses = {
    orange: {
      primary: 'bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white active:scale-98 transition-all shadow-md',
      primaryText: 'text-[#B71C1C] font-black',
      primaryBorder: 'border-[#B71C1C]',
      activeTab: 'border-[#B71C1C] text-[#B71C1C] font-black shadow-xs bg-[#FFF8F0]/50 rounded-xl',
      focusRing: 'focus:ring-[#B71C1C]/15 focus:border-[#B71C1C]',
      focusRingInput: 'focus:ring-[#B71C1C]/15 focus:border-[#B71C1C]',
      bgLight: 'bg-[#FFF8F0] text-[#7A0000] border border-[#FFC107]/20',
      bgLightPill: 'bg-[#FFF3E0] text-[#FF9800] border border-[#FFC107]/25 font-black',
      hoverBorder: 'hover:border-[#FFC107]',
      textAccent: 'text-[#FF9800] font-bold',
      textAccentDark: 'text-[#7A0000] font-black',
      bgPrimary: 'bg-[#B71C1C]',
      loadingBorder: 'border-[#B71C1C]/25 border-t-[#B71C1C]',
      btnActive: 'bg-[#B71C1C] text-white border-[#B71C1C] shadow-sm font-black',
      addBtn: 'bg-[#FFF8F0] text-[#B71C1C] group-hover:bg-[#B71C1C] group-hover:text-white border border-[#FFC107]/20 transition-colors',
      hoverBg: 'hover:bg-[#FFF8F0]/50'
    },
    blue: {
      primary: 'bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white active:scale-98 transition-all shadow-md',
      primaryText: 'text-[#B71C1C] font-black',
      primaryBorder: 'border-[#B71C1C]',
      activeTab: 'border-[#B71C1C] text-[#B71C1C] font-black shadow-xs bg-[#FFF8F0]/50 rounded-xl',
      focusRing: 'focus:ring-[#B71C1C]/15 focus:border-[#B71C1C]',
      focusRingInput: 'focus:ring-[#B71C1C]/15 focus:border-[#B71C1C]',
      bgLight: 'bg-[#FFF8F0] text-[#7A0000] border border-[#FFC107]/20',
      bgLightPill: 'bg-[#FFF3E0] text-[#FF9800] border border-[#FFC107]/25 font-black',
      hoverBorder: 'hover:border-[#FFC107]',
      textAccent: 'text-[#FF9800] font-bold',
      textAccentDark: 'text-[#7A0000] font-black',
      bgPrimary: 'bg-[#B71C1C]',
      loadingBorder: 'border-[#B71C1C]/25 border-t-[#B71C1C]',
      btnActive: 'bg-[#B71C1C] text-white border-[#B71C1C] shadow-sm font-black',
      addBtn: 'bg-[#FFF8F0] text-[#B71C1C] group-hover:bg-[#B71C1C] group-hover:text-white border border-[#FFC107]/20 transition-colors',
      hoverBg: 'hover:bg-[#FFF8F0]/50'
    },
    green: {
      primary: 'bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white active:scale-98 transition-all shadow-md',
      primaryText: 'text-[#B71C1C] font-black',
      primaryBorder: 'border-[#B71C1C]',
      activeTab: 'border-[#B71C1C] text-[#B71C1C] font-black shadow-xs bg-[#FFF8F0]/50 rounded-xl',
      focusRing: 'focus:ring-[#B71C1C]/15 focus:border-[#B71C1C]',
      focusRingInput: 'focus:ring-[#B71C1C]/15 focus:border-[#B71C1C]',
      bgLight: 'bg-[#FFF8F0] text-[#7A0000] border border-[#FFC107]/20',
      bgLightPill: 'bg-[#FFF3E0] text-[#FF9800] border border-[#FFC107]/25 font-black',
      hoverBorder: 'hover:border-[#FFC107]',
      textAccent: 'text-[#FF9800] font-bold',
      textAccentDark: 'text-[#7A0000] font-black',
      bgPrimary: 'bg-[#B71C1C]',
      loadingBorder: 'border-[#B71C1C]/25 border-t-[#B71C1C]',
      btnActive: 'bg-[#B71C1C] text-white border-[#B71C1C] shadow-sm font-black',
      addBtn: 'bg-[#FFF8F0] text-[#B71C1C] group-hover:bg-[#B71C1C] group-hover:text-white border border-[#FFC107]/20 transition-colors',
      hoverBg: 'hover:bg-[#FFF8F0]/50'
    },
    purple: {
      primary: 'bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white active:scale-98 transition-all shadow-md',
      primaryText: 'text-[#B71C1C] font-black',
      primaryBorder: 'border-[#B71C1C]',
      activeTab: 'border-[#B71C1C] text-[#B71C1C] font-black shadow-xs bg-[#FFF8F0]/50 rounded-xl',
      focusRing: 'focus:ring-[#B71C1C]/15 focus:border-[#B71C1C]',
      focusRingInput: 'focus:ring-[#B71C1C]/15 focus:border-[#B71C1C]',
      bgLight: 'bg-[#FFF8F0] text-[#7A0000] border border-[#FFC107]/20',
      bgLightPill: 'bg-[#FFF3E0] text-[#FF9800] border border-[#FFC107]/25 font-black',
      hoverBorder: 'hover:border-[#FFC107]',
      textAccent: 'text-[#FF9800] font-bold',
      textAccentDark: 'text-[#7A0000] font-black',
      bgPrimary: 'bg-[#B71C1C]',
      loadingBorder: 'border-[#B71C1C]/25 border-t-[#B71C1C]',
      btnActive: 'bg-[#B71C1C] text-white border-[#B71C1C] shadow-sm font-black',
      addBtn: 'bg-[#FFF8F0] text-[#B71C1C] group-hover:bg-[#B71C1C] group-hover:text-white border border-[#FFC107]/20 transition-colors',
      hoverBg: 'hover:bg-[#FFF8F0]/50'
    },
    red: {
      primary: 'bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white active:scale-98 transition-all shadow-md',
      primaryText: 'text-[#B71C1C] font-black',
      primaryBorder: 'border-[#B71C1C]',
      activeTab: 'border-[#B71C1C] text-[#B71C1C] font-black shadow-xs bg-[#FFF8F0]/50 rounded-xl',
      focusRing: 'focus:ring-[#B71C1C]/15 focus:border-[#B71C1C]',
      focusRingInput: 'focus:ring-[#B71C1C]/15 focus:border-[#B71C1C]',
      bgLight: 'bg-[#FFF8F0] text-[#7A0000] border border-[#FFC107]/20',
      bgLightPill: 'bg-[#FFF3E0] text-[#FF9800] border border-[#FFC107]/25 font-black',
      hoverBorder: 'hover:border-[#FFC107]',
      textAccent: 'text-[#FF9800] font-bold',
      textAccentDark: 'text-[#7A0000] font-black',
      bgPrimary: 'bg-[#B71C1C]',
      loadingBorder: 'border-[#B71C1C]/25 border-t-[#B71C1C]',
      btnActive: 'bg-[#B71C1C] text-white border-[#B71C1C] shadow-sm font-black',
      addBtn: 'bg-[#FFF8F0] text-[#B71C1C] group-hover:bg-[#B71C1C] group-hover:text-white border border-[#FFC107]/20 transition-colors',
      hoverBg: 'hover:bg-[#FFF8F0]/50'
    },
    claro_elegante: {
      primary: 'bg-[#111111] hover:bg-[#333333] text-white active:scale-98 transition-all shadow-md',
      primaryText: 'text-[#111111] font-black',
      primaryBorder: 'border-[#111111]',
      activeTab: 'border-[#111111] text-[#111111] font-black shadow-xs bg-slate-100 rounded-xl',
      focusRing: 'focus:ring-[#111111]/15 focus:border-[#111111]',
      focusRingInput: 'focus:ring-[#111111]/15 focus:border-[#111111]',
      bgLight: 'bg-slate-50 text-[#333333] border border-slate-200',
      bgLightPill: 'bg-slate-100 text-[#111111] border border-slate-200 font-black',
      hoverBorder: 'hover:border-[#333333]',
      textAccent: 'text-[#333333] font-bold',
      textAccentDark: 'text-[#111111] font-black',
      bgPrimary: 'bg-[#111111]',
      loadingBorder: 'border-[#111111]/25 border-t-[#111111]',
      btnActive: 'bg-[#111111] text-white border-[#111111] shadow-sm font-black',
      addBtn: 'bg-slate-50 text-[#111111] group-hover:bg-[#111111] group-hover:text-white border border-slate-200 transition-colors',
      hoverBg: 'hover:bg-slate-50'
    }
  };

  const theme = themeClasses[config.color_tema] || themeClasses.orange;

  // Funciones de carga de datos desde API
  const fetchProductos = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/productos/');
    setProductos(res.data);
  };

  const fetchCategorias = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/categorias/');
      setCategorias(res.data);
    } catch (err) {
      console.error("Error al cargar categorias:", err);
    }
  };

  const fetchMesas = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/mesas/');
    setMesas(res.data);
  };

  const fetchPedidosDelivery = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/pedidosdelivery/');
      setPedidosDelivery(res.data);
    } catch (err) {
      console.error("Error al cargar deliveries:", err);
    }
  };

  const fetchReservas = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/reservas/');
      setReservas(res.data);
    } catch (err) {
      console.error("Error al cargar reservas:", err);
    }
  };

  const fetchPedidosHistorial = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/pedidos/');
      setPedidosHistorial(res.data);
    } catch (err) {
      console.error("Error al cargar historial:", err);
    }
  };

  const fetchExtras = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/extras/');
      const mapped = res.data.map(item => ({
        nombre: item.nombre,
        precio: parseFloat(item.precio)
      }));
      setExtrasPredefinidos(mapped);
    } catch (err) {
      console.error("Error al cargar extras de la API, usando fallbacks:", err);
      setExtrasPredefinidos([
        { nombre: 'Porción de Arroz', precio: 5 },
        { nombre: 'Huevo Frito', precio: 3 },
        { nombre: 'Papas Fritas', precio: 6 },
        { nombre: 'Queso Extra', precio: 4 },
        { nombre: 'Ensalada Extra', precio: 4 },
        { nombre: 'Tocino', precio: 5 }
      ]);
    }
  };

  const fetchConfiguracionDb = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/configuraciones/');
      if (res.data && res.data.length > 0 && res.data[0].imagen_qr) {
        setImagenQrUrl(res.data[0].imagen_qr);
      }
    } catch (err) {
      console.error("Error al cargar configuracion QR:", err);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/configuracion/');
      if (res.data) {
        setConfig(res.data);
        localStorage.setItem('sitio_configuracion', JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("Error al cargar configuracion en CajaPOS:", err);
    }
  };

  // Carga inicial al montar el componente
  useEffect(() => {
    const cargarTodo = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchProductos(),
          fetchCategorias(),
          fetchMesas(),
          fetchPedidosDelivery(),
          fetchReservas(),
          fetchPedidosHistorial(),
          fetchExtras(),
          fetchConfiguracionDb(),
          fetchConfig()
        ]);
        setError(null);
      } catch (err) {
        console.error("Error al cargar datos del POS:", err);
        setError("Error de conexión con el backend de Django.");
      } finally {
        setLoading(false);
      }
    };
    cargarTodo();

    const handleConfigUpdate = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/configuracion/');
        if (res.data) {
          setConfig(res.data);
          localStorage.setItem('sitio_configuracion', JSON.stringify(res.data));
        }
      } catch (err) {
        console.error('Error al recargar config en CajaPOS:', err);
      }
    };
    window.addEventListener('config-updated', handleConfigUpdate);
    return () => {
      window.removeEventListener('config-updated', handleConfigUpdate);
    };
  }, []);

  useEffect(() => {
    if (categorias.length > 0 && !categoriaSeleccionada) {
      setCategoriaSeleccionada(categorias[0].nombre);
    }
  }, [categorias, categoriaSeleccionada]);

  // Corrección 1: Suma dinámica del Carrito usando useEffect
  useEffect(() => {
    const nuevoTotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    setTotal(nuevoTotal);
  }, [carrito]);

  // Sincronizar pedidos en espera con localStorage
  useEffect(() => {
    localStorage.setItem('pedidosEnEspera', JSON.stringify(pedidosEnEspera));
  }, [pedidosEnEspera]);

  // Corrección 2: Sincronización en tiempo real (Polling cada 10s) de Pedidos Web
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPedidosDelivery();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Corrección 3: Recargar mesas cuando se cambia a consumo local
  useEffect(() => {
    if (tipoPedido === 'Consumo local') {
      fetchMesas().catch(err => console.error("Error al refrescar mesas al cambiar a consumo local:", err));
    }
  }, [tipoPedido]);

  // Permitir ver TODAS las mesas para poder agregar pedidos extras a mesas ocupadas
  const mesasDisponibles = mesas;

  // Lógica del Carrito
  const agregarAlCarrito = (producto) => {
    if (!producto.disponible) return;

    setCarrito(prevCarrito => {
      const itemExistente = prevCarrito.find(item => item.id === producto.id);
      if (itemExistente) {
        return prevCarrito.map(item => 
          item.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [
          ...prevCarrito, 
          { 
            id: producto.id, 
            nombre: producto.nombre, 
            precio: parseFloat(producto.precio), 
            precioBase: parseFloat(producto.precio),
            extras: [],
            cantidad: 1, 
            observaciones: '' 
          }
        ];
      }
    });
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== id));
    } else {
      setCarrito(prevCarrito => 
        prevCarrito.map(item => 
          item.id === id ? { ...item, cantidad: nuevaCantidad } : item
        )
      );
    }
  };

  const agregarObservacion = (id, texto) => {
    setCarrito(prevCarrito => 
      prevCarrito.map(item => 
        item.id === id ? { ...item, observaciones: texto } : item
      )
    );
  };

  // Mapear id de categoría a nombre
  const obtenerNombreCategoria = (id) => {
    const cat = categorias.find(c => c.id === id);
    return cat ? cat.nombre : 'General';
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = 
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideCategoria = 
      obtenerNombreCategoria(producto.categoria) === categoriaSeleccionada;

    return coincideBusqueda && coincideCategoria;
  });

  // Validaciones del Modal de Pago en Tiempo Real
  const esBotonConfirmarDeshabilitado = () => {
    if (metodoPago === 'Efectivo') {
      const recibido = parseFloat(montoRecibido) || 0;
      return recibido < total;
    }
    
    if (metodoPago === 'Mixto') {
      const efectivo = parseFloat(montoEfectivoMixto) || 0;
      const qr = parseFloat(montoQrMixto) || 0;
      // Validación estricta con tolerancia a decimales
      return Math.abs((efectivo + qr) - total) >= 0.01;
    }
    
    return false;
  };

  // Paso 2 y 3: Formato e Impresión de Tickets (Iframe Invisible)
  const imprimirTickets = (pedido, itemsCarrito, metodo) => {
    const mesaObj = mesas.find(m => m.id === pedido.mesa);
    const mesaNumero = mesaObj ? mesaObj.numero : null;
    const fechaHora = new Date(pedido.fecha_creacion || Date.now()).toLocaleString();

    let efectivo = '0.00';
    let qr = '0.00';
    let recibido = '0.00';

    if (metodo === 'Efectivo') {
      recibido = parseFloat(montoRecibido) || parseFloat(pedido.total) || 0;
    } else if (metodo === 'QR') {
      qr = parseFloat(pedido.total) || 0;
    } else if (metodo === 'Mixto') {
      efectivo = parseFloat(montoEfectivoMixto) || 0;
      qr = parseFloat(montoQrMixto) || 0;
      if (efectivo === 0 && qr === 0) {
        efectivo = (parseFloat(pedido.total) / 2).toFixed(2);
        qr = (parseFloat(pedido.total) / 2).toFixed(2);
      }
    }

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document || iframe.contentDocument;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Tickets - ${config.nombre_restaurante || 'La Reconciliación'}</title>
          <style>
            @media print {
              body { font-family: 'Courier New', Courier, monospace; color: #000; margin: 0; padding: 0; }
              .page-break { page-break-after: always; break-after: page; }
            }
            body { font-family: 'Courier New', Courier, monospace; color: #000; padding: 10px; width: 280px; margin: 0 auto; }
            .ticket { width: 100%; box-sizing: border-box; }
            .header { text-align: center; margin-bottom: 10px; }
            .header h2 { margin: 0; font-size: 16px; font-weight: bold; text-transform: uppercase; }
            .header p { margin: 2px 0 0 0; font-size: 10px; }
            .divider { border-top: 1px dashed #000; margin: 6px 0; }
            .flex-row { display: flex; justify-content: space-between; }
            .bold { font-weight: bold; }
            .text-center { text-align: center; }
            .mt-10 { margin-top: 10px; }
            
            /* Ticket Cocina: Letra más grande y sin precios */
            .cocina-ticket { font-size: 15px; }
            .cocina-ticket h2 { font-size: 20px; }
            .observacion-negrita { font-weight: bold; font-size: 1.1em; display: block; margin-top: 2px; }
          </style>
        </head>
        <body>
          
          <!-- TICKET CLIENTE -->
          <div class="ticket">
            <div class="header">
              <h2>${config.nombre_restaurante || 'La Reconciliación'}</h2>
              <p>${config.direccion || 'Av. Principal #450, Zona Central'}</p>
              <p>Telf: ${config.telefono || '77889900'}</p>
            </div>
            <div class="divider"></div>
            <div><b>Número de Pedido:</b> #${pedido.id}</div>
            <div><b>Fecha/Hora:</b> ${fechaHora}</div>
            ${mesaNumero ? `<div><b>Mesa:</b> ${mesaNumero}</div>` : ''}
            <div class="divider"></div>
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 11px;">
              <thead>
                <tr style="border-bottom: 1px solid #000;">
                  <th style="padding: 2px 0;">Cant</th>
                  <th style="padding: 2px 0;">Detalle</th>
                  <th style="text-align: right; padding: 2px 0;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsCarrito.map(item => `
                  <tr>
                    <td style="padding: 2px 0; vertical-align: top;">${item.cantidad}</td>
                    <td style="padding: 2px 0;">
                      ${item.nombre}
                      ${item.extras && item.extras.length > 0 ? `<br/><small style="color: #444; font-weight: bold;">+ Extras: ${item.extras.map(e => `${e.nombre} (+${e.precio} Bs)`).join(', ')}</small>` : ''}
                      ${item.observaciones ? `<br/><small style="font-style: italic;">* ${item.observaciones}</small>` : ''}
                    </td>
                    <td style="text-align: right; padding: 2px 0; vertical-align: top;">
                      ${(item.precio * item.cantidad).toFixed(2)} Bs
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="divider"></div>
            <div class="flex-row bold" style="font-size: 13px;">
              <span>TOTAL:</span>
              <span>${parseFloat(pedido.total).toFixed(2)} Bs</span>
            </div>
            <div class="divider"></div>
            <div><b>Método de Pago:</b> ${metodo}</div>
            ${metodo === 'Efectivo' ? `
              <div class="flex-row">
                <span>Recibido:</span>
                <span>${parseFloat(recibido).toFixed(2)} Bs</span>
              </div>
            ` : ''}
            ${metodo === 'Mixto' ? `
              <div style="font-size: 11px; padding-left: 10px; margin-top: 2px;">
                <div>- Monto Efectivo: ${parseFloat(efectivo).toFixed(2)} Bs</div>
                <div>- Monto QR: ${parseFloat(qr).toFixed(2)} Bs</div>
              </div>
            ` : ''}
            <div class="text-center mt-10" style="font-size: 10px;">
              <p>¡Gracias por su preferencia!</p>
              <p>Vuelva pronto</p>
            </div>
          </div>

          <div class="page-break"></div>

          <!-- TICKET COCINA -->
          <div class="ticket cocina-ticket">
            <div class="header">
              <h2>TICKET COCINA</h2>
              <p class="bold">COMANDA #${pedido.id}</p>
            </div>
            <div class="divider"></div>
            ${mesaNumero ? `<div><b>Mesa:</b> ${mesaNumero}</div>` : ''}
            <div><b>Hora:</b> ${new Date().toLocaleTimeString()}</div>
            <div class="divider"></div>
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr style="border-bottom: 2px solid #000;">
                  <th style="padding: 4px 0; width: 65px;">Cant</th>
                  <th style="padding: 4px 0;">Platillo</th>
                </tr>
              </thead>
              <tbody>
                ${itemsCarrito.map(item => `
                  <tr style="border-bottom: 1px dashed #ccc;">
                    <td style="padding: 6px 0; font-weight: bold; font-size: 1.3em; vertical-align: top;">${item.cantidad} x</td>
                    <td style="padding: 6px 0;">
                      <span style="font-weight: bold;">${item.nombre}</span>
                      ${item.extras && item.extras.length > 0 ? `<br/><span style="font-size: 0.8em; font-weight: bold; display: block; margin-top: 3px; color: #111; border: 1px solid #000; padding: 2px; background-color: #eee;">[ EXTRAS: ${item.extras.map(e => e.nombre.toUpperCase()).join(', ')} ]</span>` : ''}
                      ${item.observaciones ? `<br/><span class="observacion-negrita">** <b>${item.observaciones}</b> **</span>` : ''}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            ${pedido.observaciones ? `
              <div class="divider" style="margin-top: 15px;"></div>
              <div style="font-size: 13px; margin-top: 5px;">
                <b>Observaciones Generales:</b><br/>
                <span class="observacion-negrita"><b>${pedido.observaciones}</b></span>
              </div>
            ` : ''}
          </div>

        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 300);
  };

  // Confirmar y procesar venta en POS
  const confirmarPedido = async () => {
    if (carrito.length === 0) return;
    if (tipoPedido === 'Consumo local' && !mesaSeleccionada) {
      alert('Por favor selecciona una mesa para el pedido de Consumo Local.');
      return;
    }

    try {
      setConfirmandoPedido(true);

      // Definir los montos finales de la base de datos
      let finalEfectivo = '0.00';
      let finalQr = '0.00';

      if (metodoPago === 'Efectivo') {
        finalEfectivo = total.toFixed(2);
      } else if (metodoPago === 'QR') {
        finalQr = total.toFixed(2);
      } else if (metodoPago === 'Mixto') {
        finalEfectivo = parseFloat(montoEfectivoMixto).toFixed(2);
        finalQr = parseFloat(montoQrMixto).toFixed(2);
      }

      // 1. Crear el Pedido en Django (PostgreSQL)
      const pedidoResponse = await axios.post('http://127.0.0.1:8000/api/pedidos/', {
        tipo_pedido: tipoPedido,
        estado: 'Pagado',
        mesa: tipoPedido === 'Consumo local' ? parseInt(mesaSeleccionada) : null,
        total: total.toFixed(2),
        observaciones: observacionesGenerales
      });

      const newPedido = pedidoResponse.data;

      // 2. Crear los Detalles del Pedido en paralelo
      await Promise.all(
        carrito.map(item => 
          axios.post('http://127.0.0.1:8000/api/detalles-pedido/', {
            pedido: newPedido.id,
            producto: item.id,
            cantidad: item.cantidad,
            subtotal: (item.precio * item.cantidad).toFixed(2)
          })
        )
      );

      // 3. Registrar el Pago asociado
      await axios.post('http://127.0.0.1:8000/api/pagos/', {
        pedido: newPedido.id,
        metodo: metodoPago,
        monto_efectivo: finalEfectivo,
        monto_qr: finalQr
      });

      // 4. Si es Consumo local, actualizar el estado de la mesa a 'Ocupada'
      if (tipoPedido === 'Consumo local') {
        await axios.patch(`http://127.0.0.1:8000/api/mesas/${mesaSeleccionada}/`, {
          estado: 'Ocupada'
        });
      }

      // 4.5. Registrar el movimiento en el turno actual
      const nuevoMovimientoPOS = {
        type: metodoPago === 'Mixto' ? 'Mixto' : metodoPago,
        desc: `Venta POS - Pedido #${newPedido.id} (${tipoPedido}${tipoPedido === 'Consumo local' && mesaSeleccionada ? ' - Mesa ' + (mesas.find(m => m.id.toString() === mesaSeleccionada.toString())?.numero || mesaSeleccionada) : ''})`,
        amount: total,
        timestamp: new Date().toLocaleTimeString(),
        montoEfectivo: metodoPago === 'Efectivo' ? total : (metodoPago === 'Mixto' ? parseFloat(montoEfectivoMixto) : 0),
        montoQr: metodoPago === 'QR' ? total : (metodoPago === 'Mixto' ? parseFloat(montoQrMixto) : 0)
      };
      setMovements(prev => [...prev, nuevoMovimientoPOS]);

      // 5. Guardar copias para previsualización e impresión manual
      setUltimoCarrito(carrito);
      setUltimoMetodoPago(metodoPago);

      setUltimoPedidoCreado(newPedido);
      setExito(true);
      setCarrito([]);
      setMesaSeleccionada('');
      setObservacionesGenerales('');
      setMontoRecibido('');
      setMontoEfectivoMixto('');
      setMontoQrMixto('');
      // Limpiar datos de delivery
      setDeliveryNombre('');
      setDeliveryDireccion('');
      setDeliveryTelefono('');
      setDeliveryReferencia('');
      
      // Recargar datos para mantener vista sincronizada
      await fetchMesas();
      await fetchPedidosHistorial();

    } catch (err) {
      console.error('Error al registrar el pedido:', err);
      alert('Hubo un error al procesar la venta. Por favor revisa los logs del servidor.');
    } finally {
      setConfirmandoPedido(false);
    }
  };

  // Función para revertir y modificar un pedido recién confirmado
  const modificarPedido = async () => {
    if (!ultimoPedidoCreado) return;

    try {
      // 1. Cargar el último carrito de vuelta al estado activo
      setCarrito(ultimoCarrito);

      // 2. Restaurar mesa en caso de consumo local
      if (ultimoPedidoCreado.mesa) {
        setMesaSeleccionada(ultimoPedidoCreado.mesa.toString());
        // Regresar el estado de la mesa a 'Libre' en la base de datos
        await axios.patch(`http://127.0.0.1:8000/api/mesas/${ultimoPedidoCreado.mesa}/`, {
          estado: 'Libre'
        });
      }

      // 3. Restaurar otras variables del pedido
      setObservacionesGenerales(ultimoPedidoCreado.observaciones || '');
      setMetodoPago(ultimoMetodoPago);
      setTipoPedido(ultimoPedidoCreado.tipo_pedido);

      // 4. Eliminar el pedido de la base de datos (Django cascade elimina detalle y pago)
      await axios.delete(`http://127.0.0.1:8000/api/pedidos/${ultimoPedidoCreado.id}/`);

      // Revertir el movimiento de caja para este pedido
      const orderIdPattern = `Pedido #${ultimoPedidoCreado.id}`;
      setMovements(prev => prev.filter(m => !m.desc.includes(orderIdPattern)));

      // 5. Limpiar estados y cerrar modal de éxito para reabrir el POS
      setExito(false);
      setModalAbierto(false);
      setUltimoPedidoCreado(null);
      setUltimoCarrito([]);

      // 6. Recargar mesas e historial para sincronizar
      await fetchMesas();
      await fetchPedidosHistorial();

      alert('El pedido ha sido reabierto. Las modificaciones ya pueden ser realizadas en el carrito.');
    } catch (err) {
      console.error('Error al intentar modificar el pedido registrado:', err);
      alert('Ocurrió un error al intentar reabrir el pedido. Por favor revisa la consola.');
    }
  };

  // Lógica de Pedidos en Espera
  const pausarPedido = () => {
    if (carrito.length === 0) return;

    const ahora = new Date();
    const horaFormateada = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const correlativo = pedidosEnEspera.length + 1;
    const nombreTemporal = `Pedido en Espera ${correlativo} - ${horaFormateada}`;

    const nuevoPedidoPausado = {
      id: Date.now(),
      nombre: nombreTemporal,
      carrito: carrito,
      tipoPedido: tipoPedido,
      mesaSeleccionada: mesaSeleccionada,
      observacionesGenerales: observacionesGenerales,
      total: total
    };

    setPedidosEnEspera(prev => [...prev, nuevoPedidoPausado]);

    // Limpiar el carrito y la pantalla de inmediato
    setCarrito([]);
    setMesaSeleccionada('');
    setObservacionesGenerales('');
    setMontoRecibido('');
    setMontoEfectivoMixto('');
    setMontoQrMixto('');

    alert(`El pedido ha sido guardado en espera como: "${nombreTemporal}"`);
  };

  const recuperarPedido = (pedidoPausado) => {
    if (carrito.length > 0) {
      const confirmar = window.confirm("La comanda actual tiene productos. ¿Deseas reemplazarlos con el pedido pausado?");
      if (!confirmar) return;
    }

    setCarrito(pedidoPausado.carrito);
    setTipoPedido(pedidoPausado.tipoPedido);
    setMesaSeleccionada(pedidoPausado.mesaSeleccionada || '');
    setObservacionesGenerales(pedidoPausado.observacionesGenerales || '');

    // Eliminar de pedidosEnEspera
    setPedidosEnEspera(prev => prev.filter(p => p.id !== pedidoPausado.id));
    setModalPausadosAbierto(false);
  };

  const eliminarPedidoPausado = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este pedido en espera?")) {
      setPedidosEnEspera(prev => prev.filter(p => p.id !== id));
    }
  };

  // Lógica para Selección de Extras
  const abrirModalExtras = (item) => {
    setItemSeleccionadoExtras(item);
    setExtrasTemporales(item.extras || []);
    setNuevoExtraNombre('');
    setNuevoExtraPrecio('');
    setModalExtrasAbierto(true);
  };

  const toggleExtraPredefinido = (extra) => {
    setExtrasTemporales(prev => {
      const existe = prev.find(e => e.nombre === extra.nombre);
      if (existe) {
        return prev.filter(e => e.nombre !== extra.nombre);
      } else {
        return [...prev, extra];
      }
    });
  };

  const agregarExtraPersonalizado = () => {
    if (!nuevoExtraNombre.trim()) return;
    const precio = parseFloat(nuevoExtraPrecio) || 0;
    if (precio < 0) return;

    setExtrasTemporales(prev => {
      const existe = prev.some(e => e.nombre.toLowerCase() === nuevoExtraNombre.trim().toLowerCase());
      if (existe) {
        alert("Ya existe un adicional con ese nombre en la lista temporal.");
        return prev;
      }
      return [
        ...prev,
        { nombre: nuevoExtraNombre.trim(), precio: precio }
      ];
    });
    setNuevoExtraNombre('');
    setNuevoExtraPrecio('');
  };

  const eliminarExtraTemporal = (nombre) => {
    setExtrasTemporales(prev => prev.filter(e => e.nombre !== nombre));
  };

  const guardarExtras = () => {
    if (!itemSeleccionadoExtras) return;
    
    setCarrito(prev => prev.map(item => {
      if (item.id === itemSeleccionadoExtras.id) {
        const precioExtras = extrasTemporales.reduce((sum, e) => sum + e.precio, 0);
        return {
          ...item,
          extras: extrasTemporales,
          precio: item.precioBase + precioExtras
        };
      }
      return item;
    }));

    setModalExtrasAbierto(false);
    setItemSeleccionadoExtras(null);
  };

  // Función para volver a imprimir desde el Historial
  const volverAImprimirTicket = async (pedido) => {
    try {
      const resDetalles = await axios.get('http://127.0.0.1:8000/api/detalles-pedido/');
      const detallesPedido = resDetalles.data.filter(d => d.pedido === pedido.id);
      
      const itemsCarrito = detallesPedido.map(det => {
        const prod = productos.find(p => p.id === det.producto);
        return {
          id: det.producto,
          nombre: prod ? prod.nombre : `Producto #${det.producto}`,
          precio: prod ? parseFloat(prod.precio) : (parseFloat(det.subtotal) / det.cantidad),
          cantidad: det.cantidad,
          observaciones: ''
        };
      });

      let metodo = 'Efectivo';
      try {
        const resPagos = await axios.get('http://127.0.0.1:8000/api/pagos/');
        const pago = resPagos.data.find(p => p.pedido === pedido.id);
        if (pago) {
          metodo = pago.metodo;
        }
      } catch (e) {
        console.error("Error al obtener método de pago para reimpresión:", e);
      }

      imprimirTickets(pedido, itemsCarrito, metodo);
    } catch (err) {
      console.error("Error al reimprimir ticket:", err);
      alert("No se pudo regenerar el ticket.");
    }
  };

  // Cambiar estado de delivery
  const actualizarEstadoDelivery = async (id, nuevoEstado) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/pedidosdelivery/${id}/`, {
        estado: nuevoEstado
      });
      await fetchPedidosDelivery();
    } catch (err) {
      console.error("Error al actualizar delivery:", err);
      alert("No se pudo actualizar el estado de entrega.");
    }
  };

  // Obtener URL absoluta para el QR
  const obtenerUrlAbsolutaQr = () => {
    if (!imagenQrUrl) return '';
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    
    if (imagenQrUrl.startsWith('http://') || imagenQrUrl.startsWith('https://')) {
      if (VITE_API_URL) {
        const cleanApiHost = VITE_API_URL.replace(/^https?:\/\//, '');
        return imagenQrUrl
          .replace('127.0.0.1:8000', cleanApiHost)
          .replace('localhost:8000', cleanApiHost);
      }
      return imagenQrUrl.replace('127.0.0.1:8000', `${window.location.hostname}:8000`);
    }
    
    const baseUrl = VITE_API_URL || `http://${window.location.hostname}:8000`;
    return `${baseUrl}${imagenQrUrl.startsWith('/') ? '' : '/'}${imagenQrUrl}`;
  };

  // Enviar mensaje de confirmación por WhatsApp con QR
  const enviarMensajeConfirmacion = (pedido) => {
    if (!pedido.cliente_telefono) {
      alert("El cliente no registró un número de teléfono válido para WhatsApp.");
      return;
    }
    let telefono = pedido.cliente_telefono.replace(/\D/g, '');
    if (telefono.length === 8) {
      telefono = '591' + telefono;
    }

    const qrUrlAbsoluto = obtenerUrlAbsolutaQr();
    const textoMensaje = `¡Hola, ${pedido.cliente_nombre || 'Cliente'}!

Hemos recibido tu pedido #${pedido.id} en ${config.nombre_restaurante || 'La Reconciliación'}.

💰 Total a pagar: ${parseFloat(pedido.pedido_total).toFixed(2)} Bs

Para confirmar tu pedido, realiza el pago escaneando nuestro código QR en el siguiente enlace:

📲 ${qrUrlAbsoluto}

⏳ Importante: Tu pedido comenzará a prepararse únicamente después de que envíes el comprobante o la confirmación de pago mediante QR.

Una vez verificado el pago, te notificaremos que tu pedido ha entrado en preparación.

¡Muchas gracias por tu preferencia! 😊`;

    const link = `https://wa.me/${telefono}?text=${encodeURIComponent(textoMensaje)}`;
    window.open(link, '_blank');
  };

  // Aceptar pedido de delivery
  const aceptarPedidoDelivery = async (pedido) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/pedidosdelivery/${pedido.id}/`, {
        estado: 'Aceptado'
      });
      enviarMensajeConfirmacion(pedido);
      await fetchPedidosDelivery();
    } catch (err) {
      console.error("Error al aceptar delivery:", err);
      alert("No se pudo aceptar el pedido.");
    }
  };

  // Rechazar pedido de delivery
  const rechazarPedidoDelivery = async (id) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/pedidosdelivery/${id}/`, {
        estado: 'Rechazado'
      });
      await fetchPedidosDelivery();
    } catch (err) {
      console.error("Error al rechazar delivery:", err);
      alert("No se pudo rechazar el pedido.");
    }
  };

  // Cambiar estado de reserva
  const actualizarEstadoReserva = async (id, nuevoEstado) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/reservas/${id}/`, {
        estado: nuevoEstado
      });
      await fetchReservas();
    } catch (err) {
      console.error("Error al actualizar reserva:", err);
      alert("No se pudo actualizar el estado de la reserva.");
    }
  };

  // Forzar cambio manual de estado de una mesa
  const cambiarEstadoMesaManual = async (id, nuevoEstado) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/mesas/${id}/`, {
        estado: nuevoEstado
      });
      await fetchMesas();
    } catch (err) {
      console.error("Error al cambiar estado de mesa:", err);
      alert("No se pudo cambiar el estado de la mesa.");
    }
  };

  // Abrir modal para crear mesa
  const abrirModalNuevaMesa = () => {
    setMesaSeleccionadaEdicion(null);
    setNumeroMesa('');
    setCapacidadMesa('');
    setErrorMesa('');
    setModalMesaAbierto(true);
  };

  // Abrir modal para editar mesa
  const abrirModalEditarMesa = (mesa) => {
    setMesaSeleccionadaEdicion(mesa);
    setNumeroMesa(mesa.numero.toString());
    setCapacidadMesa(mesa.capacidad.toString());
    setErrorMesa('');
    setModalMesaAbierto(true);
  };

  // Guardar (Crear o Editar) Mesa en base de datos
  const handleGuardarMesa = async (e) => {
    if (e) e.preventDefault();
    setErrorMesa('');

    const num = parseInt(numeroMesa);
    const cap = parseInt(capacidadMesa);

    if (isNaN(num) || num <= 0) {
      setErrorMesa('El número de mesa debe ser un número entero positivo.');
      return;
    }
    if (isNaN(cap) || cap <= 0) {
      setErrorMesa('La capacidad debe ser un número entero positivo.');
      return;
    }

    try {
      setGuardandoMesa(true);
      if (mesaSeleccionadaEdicion) {
        // PATCH para actualizar
        await axios.patch(`http://127.0.0.1:8000/api/mesas/${mesaSeleccionadaEdicion.id}/`, {
          numero: num,
          capacidad: cap
        });
      } else {
        // POST para crear
        await axios.post('http://127.0.0.1:8000/api/mesas/', {
          numero: num,
          capacidad: cap,
          estado: 'Libre'
        });
      }
      
      await fetchMesas();
      setModalMesaAbierto(false);
      setMesaSeleccionadaEdicion(null);
      setNumeroMesa('');
      setCapacidadMesa('');
    } catch (err) {
      console.error("Error al guardar mesa:", err);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.numero) {
          setErrorMesa(`Error: El número de mesa ya está registrado o no es válido.`);
        } else if (errorData.detail) {
          setErrorMesa(errorData.detail);
        } else {
          setErrorMesa('No se pudo guardar la mesa. Verifique que el número no esté duplicado.');
        }
      } else {
        setErrorMesa('Error de red al intentar guardar la mesa.');
      }
    } finally {
      setGuardandoMesa(false);
    }
  };

  const cerrarExito = () => {
    setExito(false);
    setModalAbierto(false);
    setPanelCarritoAbierto(false);
  };

  // Filtros aplicados a la sección de historial de pedidos
  const historialFiltrado = pedidosHistorial.filter(pedido => {
    const coincideId = filtroIdPedido ? pedido.id.toString().includes(filtroIdPedido) : true;
    const coincideTipo = filtroTipoPedido === 'Todos' ? true : pedido.tipo_pedido === filtroTipoPedido;
    
    let coincideFecha = true;
    if (filtroFecha) {
      const fechaPedido = pedido.fecha_creacion.split('T')[0];
      coincideFecha = fechaPedido === filtroFecha;
    }
    
    return coincideId && coincideTipo && coincideFecha;
  }).sort((a, b) => b.id - a.id); // Orden descendente: el más reciente primero

  // Paginación para historial
  const elementosPorPagina = 15;
  const totalPaginasHistorial = Math.ceil(historialFiltrado.length / elementosPorPagina);
  const indiceUltimoElemento = paginaHistorial * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const historialPaginado = historialFiltrado.slice(indicePrimerElemento, indiceUltimoElemento);

  // Filtrar pedidos web para mostrar solo los recientes (estado 'Pendiente')
  const pedidosWebRecientes = pedidosDelivery.filter(del => del.estado === 'Pendiente').sort((a, b) => b.id - a.id);

  const tabs = [
    { id: 'shift_control', label: 'Control de Turno', icon: Notebook },
    { id: 'pos', label: 'Punto de Venta', icon: ShoppingCart },
    { id: 'delivery', label: 'Pedidos Web (Delivery)', icon: ShoppingBag },
    { id: 'reservations', label: 'Reservaciones', icon: Calendar },
    { id: 'history', label: 'Historial de Pedidos', icon: FileText },
    { id: 'tables', label: 'Control de Mesas', icon: Store }
  ];

  // --- Funciones para renderizar los Pasos del Control de Caja ---

  const renderProgressBar = () => {
    const steps = [
      { num: 1, name: 'Apertura' },
      { num: 2, name: 'Operaciones' },
      { num: 3, name: 'Conteo Físico' },
      { num: 4, name: 'Arqueo de Caja' },
      { num: 5, name: 'Reporte' }
    ];

    return (
      <div className="bg-white border-b border-[#E5E5E5] px-6 py-4 shrink-0 shadow-sm select-none">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {steps.map((s, index) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                  shiftStep === s.num
                    ? 'bg-[#B71C1C] text-white ring-4 ring-[#FFF3E0]'
                    : shiftStep > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-105 text-stone-400 border border-stone-200'
                }`}>
                  {shiftStep > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span className={`text-[11px] font-black ${
                  shiftStep === s.num
                    ? 'text-[#B71C1C]'
                    : shiftStep > s.num
                      ? 'text-emerald-700'
                      : 'text-stone-400'
                }`}>
                  {s.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2.5 transition-colors ${
                  shiftStep > s.num ? 'bg-emerald-500' : 'bg-stone-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderStep1 = () => {
    const handleIniciarTurno = (e) => {
      e.preventDefault();
      if (!cashierName.trim() || !shiftDesc.trim() || isNaN(parseFloat(initialCash)) || parseFloat(initialCash) < 0) {
        alert("Por favor complete todos los campos correctamente.");
        return;
      }
      localStorage.setItem('caja_shift_abierta_time', new Date().toISOString());
      localStorage.removeItem('cocinaDespachados');
      setShiftStep(2);
      setActiveTab('pos'); // Go directly to POS once shift is started
    };

    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#FFF8F0]/30 flex items-center justify-center font-sans">
        <div className="bg-white rounded-3xl border border-[#E5E5E5] p-8 shadow-lg max-w-md w-full space-y-6 animate-in fade-in duration-200">
          <div className="text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-[#7A0000] to-[#B71C1C] rounded-2xl flex items-center justify-center text-[#FFC107] mx-auto mb-4 shadow-sm">
              <Store className="w-7 h-7 drop-shadow-md" />
            </div>
            <h2 className="text-2xl font-black text-[#111111] uppercase tracking-wide font-serif">Apertura de Caja</h2>
            <p className="text-xs text-stone-500 mt-1 font-bold">
              Ingrese los datos de inicio para abrir el turno de caja.
            </p>
          </div>

          <form onSubmit={handleIniciarTurno} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-[#7A0000] uppercase tracking-widest mb-1.5">Nombre del Cajero o Responsable</label>
              <input
                type="text"
                placeholder="Nombre del cajero"
                value={cashierName}
                onChange={(e) => setCashierName(e.target.value)}
                required
                className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-3 text-xs font-bold text-[#111111] transition-all focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-black text-[#7A0000] uppercase tracking-widest mb-1.5">Fondo Inicial (Bs.)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={initialCash || ''}
                onChange={(e) => setInitialCash(parseFloat(e.target.value) || 0)}
                required
                className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-3 text-xs font-bold text-[#111111] transition-all focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-black text-[#7A0000] uppercase tracking-widest mb-1.5">Descripción del Turno</label>
              <input
                type="text"
                placeholder='ej. "Turno mañana - 24/06/2026"'
                value={shiftDesc}
                onChange={(e) => setShiftDesc(e.target.value)}
                required
                className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-3 text-xs font-bold text-[#111111] transition-all focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white py-4 rounded-2xl font-black transition-all shadow-md text-xs uppercase tracking-widest active:scale-95 mt-2"
            >
              Iniciar Turno
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderShiftControl = () => {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#FFF8F0]/30 font-sans">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-[#111111] font-serif uppercase tracking-wide">Control de Turno Activo</h2>
              <p className="text-xs text-stone-500 mt-1 font-semibold">
                Visualice el estado financiero actual del turno y registre movimientos manuales o anulaciones.
              </p>
            </div>
            <button
              onClick={async () => {
                // Verificar si hay pedidos pendientes en cocina antes de cerrar
                try {
                  const res = await axios.get('http://127.0.0.1:8000/api/pedidos/');
                  const pendientes = res.data.filter(p => p.estado === 'Pendiente de pago');
                  if (pendientes.length > 0) {
                    alert(`⚠️ No se puede cerrar la caja.\n\nHay ${pendientes.length} pedido(s) pendiente(s) en cocina que aún no han sido cobrados.\n\nPor favor cierre o cancele todos los pedidos activos antes de proceder al cierre de turno.`);
                    return;
                  }
                } catch (err) {
                  console.error('Error al verificar pedidos activos:', err);
                }
                if (window.confirm("¿Está seguro de que desea solicitar el cierre de turno?")) {
                  setShiftStep(3);
                }
              }}
              className="bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white font-black px-5 py-3 rounded-2xl text-xs transition-all shadow-md uppercase tracking-widest active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              Solicitar cierre de turno
            </button>
          </div>

          {/* Tarjetas de Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[#E5E5E5] rounded-3xl p-5 shadow-[0_10px_30px_rgba(17,17,17,0.04)] hover:-translate-y-0.5 transition-all duration-300">
              <span className="text-[9px] font-black text-[#7A0000] uppercase tracking-widest block">Total Ventas</span>
              <span className="text-2xl font-black text-[#111111] font-serif mt-1.5 block">{totalVentas.toFixed(2)} Bs</span>
            </div>
            <div className="bg-white border border-[#E5E5E5] rounded-3xl p-5 shadow-[0_10px_30px_rgba(17,17,17,0.04)] hover:-translate-y-0.5 transition-all duration-300">
              <span className="text-[9px] font-black text-[#7A0000] uppercase tracking-widest block">Total QR</span>
              <span className="text-2xl font-black text-blue-700 font-serif mt-1.5 block">{totalQr.toFixed(2)} Bs</span>
            </div>
            <div className="bg-white border border-[#E5E5E5] rounded-3xl p-5 shadow-[0_10px_30px_rgba(17,17,17,0.04)] hover:-translate-y-0.5 transition-all duration-300">
              <span className="text-[9px] font-black text-[#7A0000] uppercase tracking-widest block">Total Efectivo</span>
              <span className="text-2xl font-black text-green-700 font-serif mt-1.5 block">{totalEfectivo.toFixed(2)} Bs</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulario de registro de movimientos */}
            <div className="bg-white border border-[#E5E5E5] rounded-3xl p-5 shadow-[0_10px_30px_rgba(17,17,17,0.04)] space-y-4">
              <div>
                <h3 className="font-serif font-black text-[#111111] uppercase tracking-wider text-sm">Registrar Movimiento Manual</h3>
                <p className="text-[11px] text-stone-500 font-bold mt-0.5">Registre ventas manuales o anulaciones directas de caja.</p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-[#7A0000] uppercase tracking-widest mb-1.5">Descripción o Mesa</label>
                  <input
                    type="text"
                    placeholder='ej. "Mesa 4" o "Venta manual de gaseosa"'
                    value={manualDesc}
                    onChange={(e) => setManualDesc(e.target.value)}
                    className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-2.5 text-xs font-bold text-[#111111] transition-all focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-[#7A0000] uppercase tracking-widest mb-1.5">Monto en Bs.</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-2.5 text-xs font-bold text-[#111111] transition-all focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-[#7A0000] uppercase tracking-widest mb-1.5">Método de Pago</label>
                  <select
                    value={manualMetodo}
                    onChange={(e) => setManualMetodo(e.target.value)}
                    className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-2.5 text-xs font-bold text-[#111111] transition-all focus:outline-none cursor-pointer"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="QR">QR</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => registrarMovimientoManual('venta')}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-3 rounded-2xl text-xs font-black shadow-md uppercase tracking-wider active:scale-95 transition-all"
                  >
                    Registrar Venta
                  </button>
                  <button
                    onClick={() => registrarMovimientoManual('anulacion')}
                    className="bg-red-50 hover:bg-red-100 text-[#B71C1C] border border-red-200 py-3 rounded-2xl text-xs font-black uppercase tracking-wider active:scale-95 transition-all"
                  >
                    Registrar Anulación
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Movimientos */}
            <div className="bg-white border border-[#E5E5E5] rounded-3xl p-5 shadow-[0_10px_30px_rgba(17,17,17,0.04)] lg:col-span-2 flex flex-col h-[400px]">
              <div>
                <h3 className="font-serif font-black text-[#111111] uppercase tracking-wider text-sm">Lista de Movimientos del Turno</h3>
                <p className="text-[11px] text-stone-500 font-bold mt-0.5">Historial completo de entradas y salidas ordenadas por hora.</p>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-[#E5E5E5] mt-3 pr-1">
                {movements.length === 0 ? (
                  <div className="text-center py-20 text-stone-400 text-xs font-bold uppercase tracking-wider">
                    No se registran movimientos en este turno aún.
                  </div>
                ) : (
                  [...movements].reverse().map((mov, idx) => {
                    let chipColor = "";
                    let label = "";

                    if (mov.type === 'QR') {
                      chipColor = "bg-blue-50 text-blue-700 border-blue-200";
                      label = "QR";
                    } else if (mov.type === 'Efectivo') {
                      chipColor = "bg-green-50 text-green-700 border-green-200";
                      label = "Efectivo";
                    } else if (mov.type === 'Anulacion') {
                      chipColor = "bg-red-50 text-[#B71C1C] border-red-200";
                      label = `Anulación (${mov.metodo})`;
                    } else if (mov.type === 'Mixto') {
                      chipColor = "bg-stone-50 text-[#111111] border-stone-200";
                      label = `Mixto (Efectivo: ${mov.montoEfectivo} / QR: ${mov.montoQr})`;
                    }

                    return (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs hover:bg-[#FFF8F0]/30 transition-colors duration-150 rounded-xl px-2">
                        <div className="space-y-1">
                          <span className="font-extrabold text-[#111111] block">{mov.desc}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-stone-400 font-bold">{mov.timestamp}</span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border shadow-xs tracking-wider ${chipColor}`}>
                              {label}
                            </span>
                          </div>
                        </div>
                        <span className={`font-black font-serif text-sm whitespace-nowrap ${mov.type === 'Anulacion' ? 'text-[#B71C1C]' : 'text-[#111111]'}`}>
                          {mov.type === 'Anulacion' ? '-' : ''}{mov.amount.toFixed(2)} Bs
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const handleValueChange = (denomination, value) => {
      const parsedVal = parseInt(value, 10);
      setCashCount(prev => ({
        ...prev,
        [denomination]: isNaN(parsedVal) || parsedVal < 0 ? 0 : parsedVal
      }));
    };

    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#FFF8F0]/30 flex items-center justify-center font-sans">
        <div className="bg-white rounded-3xl border border-[#E5E5E5] p-8 shadow-lg max-w-2xl w-full space-y-6 animate-in fade-in duration-200">
          <div className="text-center">
            <DollarSign className="w-12 h-12 text-[#B71C1C] mx-auto mb-3" />
            <h2 className="text-2xl font-black text-[#111111] uppercase tracking-wide font-serif">Conteo Físico de Efectivo</h2>
            <p className="text-xs text-stone-500 mt-1 font-bold">
              Ingrese la cantidad de billetes y monedas que tiene físicamente en caja.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Billetes */}
            <div className="space-y-3">
              <h3 className="font-serif font-black text-[#7A0000] text-sm border-b border-[#FFC107]/30 pb-2 flex items-center gap-1">
                <span>💵 Billetes</span>
              </h3>
              
              {[
                { label: 'Bs. 200', key: 'b200' },
                { label: 'Bs. 100', key: 'b100' },
                { label: 'Bs. 50', key: 'b50' },
                { label: 'Bs. 20', key: 'b20' },
                { label: 'Bs. 10', key: 'b10' },
                { label: 'Bs. 5', key: 'b5' }
              ].map(item => (
                <div key={item.key} className="flex justify-between items-center gap-3">
                  <span className="text-xs font-bold text-stone-600">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={cashCount[item.key] || ''}
                      onChange={(e) => handleValueChange(item.key, e.target.value)}
                      placeholder="0"
                      className="w-24 bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-xl p-1.5 text-center text-xs font-bold text-[#111111] focus:outline-none transition-all"
                    />
                    <span className="text-[10px] text-stone-400 font-bold min-w-[50px] text-right">
                      {((cashCount[item.key] || 0) * parseFloat(item.label.replace('Bs. ', ''))).toFixed(2)} Bs
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Monedas */}
            <div className="space-y-3">
              <h3 className="font-serif font-black text-[#7A0000] text-sm border-b border-[#FFC107]/30 pb-2 flex items-center gap-1">
                <span>🪙 Monedas</span>
              </h3>
              
              {[
                { label: 'Bs. 2', key: 'm2' },
                { label: 'Bs. 1', key: 'm1' },
                { label: 'Bs. 0.50', key: 'm050', factor: 0.5 },
                { label: 'Bs. 0.20', key: 'm020', factor: 0.2 }
              ].map(item => {
                const factor = item.factor || parseFloat(item.label.replace('Bs. ', ''));
                return (
                  <div key={item.key} className="flex justify-between items-center gap-3">
                    <span className="text-xs font-bold text-stone-600">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={cashCount[item.key] || ''}
                        onChange={(e) => handleValueChange(item.key, e.target.value)}
                        placeholder="0"
                        className="w-24 bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-xl p-1.5 text-center text-xs font-bold text-[#111111] focus:outline-none transition-all"
                      />
                      <span className="text-[10px] text-stone-400 font-bold min-w-[50px] text-right">
                        {((cashCount[item.key] || 0) * factor).toFixed(2)} Bs
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Total en tiempo real */}
              <div className="bg-[#FFF3E0] border border-[#FFC107]/20 rounded-2xl p-4 mt-6 text-center space-y-1">
                <span className="text-[10px] font-black text-[#7A0000] uppercase tracking-wider block">Total Contado</span>
                <span className="text-2xl font-serif font-black text-[#B71C1C] block">{totalContado.toFixed(2)} Bs</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-[#E5E5E5]">
            <button
              onClick={() => setShiftStep(2)}
              className="flex-1 bg-white hover:bg-gray-50 border border-[#E5E5E5] text-[#333333] py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-95"
            >
              Volver a Operaciones
            </button>
            <button
              onClick={() => setShiftStep(4)}
              className="flex-1 bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              Calcular Arqueo
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
    const hayDiferencia = diferenciaArqueo !== 0;
    const notaVacia = !arqueoNotes.trim();
    const disabled = hayDiferencia && notaVacia;

    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#FFF8F0]/30 flex items-center justify-center font-sans">
        <div className="bg-white rounded-3xl border border-[#E5E5E5] p-8 shadow-lg max-w-md w-full space-y-6 animate-in fade-in duration-200">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-[#B71C1C] mx-auto mb-3" />
            <h2 className="text-2xl font-black text-[#111111] uppercase tracking-wide font-serif">Arqueo de Caja</h2>
            <p className="text-xs text-stone-500 mt-1 font-bold">
              El sistema realiza el cálculo automático contrastando el conteo físico.
            </p>
          </div>

          <div className="space-y-3.5 bg-[#FFF8F0]/50 border border-[#FFC107]/20 rounded-2xl p-5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#E5E5E5]">
              <span className="text-[#333333] font-bold">Fondo Inicial:</span>
              <span className="font-extrabold text-[#111111]">{initialCash.toFixed(2)} Bs</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#E5E5E5]">
              <span className="text-[#333333] font-bold">Efectivo por Ventas (+):</span>
              <span className="font-extrabold text-[#111111]">{totalEfectivo.toFixed(2)} Bs</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#E5E5E5] bg-[#FFF3E0] p-2.5 rounded-xl border border-[#FFC107]/20">
              <span className="text-[#7A0000] font-black uppercase tracking-wider text-[10px]">Efectivo Esperado:</span>
              <span className="font-black text-[#7A0000]">{efectivoEsperado.toFixed(2)} Bs</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#E5E5E5]">
              <span className="text-[#333333] font-bold">Contado Físico:</span>
              <span className="font-extrabold text-[#111111]">{totalContado.toFixed(2)} Bs</span>
            </div>
            <div className="flex justify-between items-center font-bold text-sm bg-[#FFF8F0] p-2.5 rounded-xl border border-[#E5E5E5]/50">
              <span className="text-[#111111] font-black uppercase tracking-wider text-[10px]">Diferencia:</span>
              <span className={`font-black ${diferenciaArqueo === 0 ? "text-emerald-600" : diferenciaArqueo > 0 ? "text-[#FF9800]" : "text-[#D32F2F]"}`}>
                {diferenciaArqueo > 0 ? '+' : ''}{diferenciaArqueo.toFixed(2)} Bs
              </span>
            </div>
          </div>

          {/* Alertas semánticas */}
          {diferenciaArqueo === 0 ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-2.5 text-xs text-emerald-800 font-bold">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <span className="block font-black text-sm">✅ Cuadre exacto</span>
                <span className="block font-normal text-[11px] mt-0.5 text-emerald-700">El efectivo contado coincide exactamente con el efectivo esperado.</span>
              </div>
            </div>
          ) : diferenciaArqueo < 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-2.5 text-xs text-[#B71C1C] font-bold">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <span className="block font-black text-sm">❌ Faltante registrado</span>
                <span className="block font-normal text-[11px] mt-0.5 text-red-700">Falta efectivo en caja. Debe ingresar una nota explicativa obligatoria antes de continuar.</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#FFF3E0] border border-[#FFC107]/30 rounded-2xl p-4 flex items-start gap-2.5 text-xs text-[#FF9800] font-bold">
              <Info className="w-5 h-5 text-[#FF9800] shrink-0 mt-0.5" />
              <div>
                <span className="block font-black text-sm">⚠️ Sobrante registrado</span>
                <span className="block font-normal text-[11px] mt-0.5 text-[#FF9800]/90">Hay más efectivo que el esperado. Debe ingresar una nota explicativa obligatoria antes de continuar.</span>
              </div>
            </div>
          )}

          {/* Nota obligatoria si hay diferencia */}
          {hayDiferencia && (
            <div className="space-y-1.5 animate-in slide-in-from-top-1 duration-150">
              <label className="block text-[10px] font-black text-[#7A0000] uppercase tracking-widest mb-1.5">Nota Explicativa (Obligatoria)</label>
              <textarea
                placeholder="Explique el motivo del faltante o sobrante de efectivo en caja..."
                value={arqueoNotes}
                onChange={(e) => setArqueoNotes(e.target.value)}
                required
                className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-3 text-xs font-bold text-[#111111] transition-all focus:outline-none min-h-[80px]"
              />
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-[#E5E5E5]">
            <button
              onClick={() => setShiftStep(3)}
              className="flex-1 bg-white hover:bg-gray-50 border border-[#E5E5E5] text-[#333333] py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-95"
            >
              Volver al Conteo
            </button>
            <button
              onClick={() => setShiftStep(5)}
              disabled={disabled}
              className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 border border-transparent shadow ${
                disabled
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed border-stone-200/50'
                  : 'bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white shadow-md'
              }`}
            >
              Generar Reporte
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [guardandoCierre, setGuardandoCierre] = useState(false);

  const aprobarYCerrarTurno = async () => {
    try {
      setGuardandoCierre(true);
      const data = {
        cajero: cashierName,
        turno_descripcion: shiftDesc,
        fondo_inicial: initialCash,
        total_efectivo: totalEfectivo,
        total_qr: totalQr,
        total_ventas: totalVentas,
        efectivo_esperado: efectivoEsperado,
        efectivo_contado: totalContado,
        diferencia: diferenciaArqueo,
        notas: arqueoNotes,
        detalle_movimientos: movements,
        detalle_efectivo: cashCount,
        archivado: false
      };
      await axios.post('http://127.0.0.1:8000/api/reportes-cierre/', data);
      setShiftStep(6);
    } catch (err) {
      console.error("Error al guardar el cierre de caja:", err);
      alert("No se pudo guardar el reporte de cierre en el servidor. Verifique su conexión.");
    } finally {
      setGuardandoCierre(false);
    }
  };

  const imprimirReporteCierre = () => {
    const fechaHora = new Date().toLocaleString();
    const ventas = movements.filter(m => m.type !== 'Anulacion');
    const anulaciones = movements.filter(m => m.type === 'Anulacion');

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document || iframe.contentDocument;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Reporte de Cierre de Caja</title>
          <style>
            body { font-family: Arial, sans-serif; color: #000; padding: 20px; line-height: 1.4; font-size: 12px; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { margin: 0; font-size: 18px; text-transform: uppercase; }
            .header p { margin: 4px 0; font-size: 11px; color: #555; }
            .section { margin-bottom: 18px; }
            .section-title { font-size: 13px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 8px; text-transform: uppercase; }
            .info-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 6px; margin-bottom: 12px; }
            .info-item { display: flex; justify-content: space-between; padding: 3px 0; }
            .info-item.bold { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 5px; }
            th, td { text-align: left; padding: 6px; border-bottom: 1px solid #ddd; font-size: 11px; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .total-row { font-weight: bold; background-color: #fafafa; }
            .signature-area { margin-top: 50px; display: flex; justify-content: space-around; text-align: center; }
            .signature-line { width: 200px; border-top: 1px solid #000; margin-top: 40px; font-size: 11px; font-weight: bold; }
            @media print {
              body { padding: 0; }
              iframe { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Reporte de Cierre de Caja</h1>
            <p>Generado el: ${fechaHora}</p>
          </div>

          <div class="section">
            <div class="section-title">Datos del Turno</div>
            <div class="info-grid">
              <div class="info-item"><span>Cajero:</span> <strong>${cashierName}</strong></div>
              <div class="info-item"><span>Turno:</span> <strong>${shiftDesc}</strong></div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Resumen Financiero</div>
            <div style="max-width: 400px;">
              <div class="info-item"><span>Fondo Inicial:</span> <span>${initialCash.toFixed(2)} Bs</span></div>
              <div class="info-item"><span>Total Ventas QR:</span> <span>${totalQr.toFixed(2)} Bs</span></div>
              <div class="info-item"><span>Total Ventas Efectivo:</span> <span>${totalEfectivo.toFixed(2)} Bs</span></div>
              <div class="info-item"><span>Total Ventas (General):</span> <span>${totalVentas.toFixed(2)} Bs</span></div>
              <div class="info-item"><span>Total Anulaciones:</span> <span>${(anulaciones.reduce((s, m) => s + m.amount, 0)).toFixed(2)} Bs</span></div>
              <div class="info-item" style="border-top: 1px dashed #000; padding-top: 4px;"><span>Efectivo Esperado:</span> <span>${efectivoEsperado.toFixed(2)} Bs</span></div>
              <div class="info-item"><span>Efectivo Contado:</span> <span>${totalContado.toFixed(2)} Bs</span></div>
              <div class="info-item bold" style="border-top: 1px solid #000; padding-top: 4px;">
                <span>Diferencia:</span> 
                <span>${diferenciaArqueo > 0 ? '+' : ''}${diferenciaArqueo.toFixed(2)} Bs</span>
              </div>
            </div>
            ${diferenciaArqueo !== 0 ? `
              <div style="margin-top: 8px; padding: 6px; border: 1px solid #ddd; background-color: #fafafa; font-size: 11px;">
                <strong>Nota Explicativa por Diferencia:</strong><br/>
                ${arqueoNotes}
              </div>
            ` : ''}
          </div>

          <div class="section">
            <div class="section-title">Detalle de Ventas</div>
            <table>
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Descripción</th>
                  <th>Método</th>
                  <th style="text-align: right;">Monto</th>
                </tr>
              </thead>
              <tbody>
                ${ventas.map(v => {
                  let m = v.type;
                  if (v.type === 'Mixto') m = 'Mixto';
                  return `
                    <tr>
                      <td>${v.timestamp || '-'}</td>
                      <td>${v.desc}</td>
                      <td>${m}</td>
                      <td style="text-align: right;">${v.amount.toFixed(2)} Bs</td>
                    </tr>
                  `;
                }).join('')}
                ${ventas.length === 0 ? '<tr><td colspan="4" style="text-align: center;">No hubo ventas registradas</td></tr>' : ''}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Detalle de Anulaciones</div>
            <table>
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Descripción</th>
                  <th style="text-align: right;">Monto</th>
                </tr>
              </thead>
              <tbody>
                ${anulaciones.map(a => `
                  <tr>
                    <td>${a.timestamp || '-'}</td>
                    <td>${a.desc}</td>
                    <td style="text-align: right;">${a.amount.toFixed(2)} Bs</td>
                  </tr>
                `).join('')}
                ${anulaciones.length === 0 ? '<tr><td colspan="3" style="text-align: center;">No hubo anulaciones registradas</td></tr>' : ''}
              </tbody>
            </table>
          </div>

          <div class="signature-area">
            <div class="signature-line">
              Firma Cajero/Responsable<br/>
              C.I. ____________________
            </div>
            <div class="signature-line">
              Firma Supervisor/Administrador<br/>
              Nombre: _________________
            </div>
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 300);
  };

  const renderStep5 = () => {
    const ventas = movements.filter(m => m.type !== 'Anulacion');
    const anulaciones = movements.filter(m => m.type === 'Anulacion');
    const totalAnulaciones = anulaciones.reduce((s, m) => s + m.amount, 0);

    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#FFF8F0]/30 flex justify-center font-sans">
        <div className="bg-white rounded-3xl border border-[#E5E5E5] p-8 shadow-lg max-w-4xl w-full space-y-6 animate-in fade-in duration-200">
          <div className="text-center">
            <FileText className="w-12 h-12 text-[#B71C1C] mx-auto mb-3" />
            <h2 className="text-2xl font-black text-[#111111] uppercase tracking-wide font-serif">Reporte de Cierre de Caja</h2>
            <p className="text-xs text-stone-500 mt-1 font-bold">
              Verifique el informe consolidado del turno antes de aprobar el cierre.
            </p>
          </div>

          {/* Encabezado */}
          <div className="bg-[#FFF8F0]/65 rounded-2xl p-4 border border-[#FFC107]/20 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#7A0000] block uppercase font-bold text-[9px] tracking-wider">Cajero Responsable</span>
              <span className="font-extrabold text-[#111111] text-sm">{cashierName}</span>
            </div>
            <div>
              <span className="text-[#7A0000] block uppercase font-bold text-[9px] tracking-wider">Turno / Fecha</span>
              <span className="font-extrabold text-[#111111] text-sm">{shiftDesc}</span>
            </div>
          </div>

          {/* Resumen Financiero */}
          <div className="space-y-3">
            <h3 className="font-serif font-black text-[#7A0000] text-sm border-b border-[#FFC107]/30 pb-2">Resumen Financiero</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#FFF8F0]/35 border border-[#E5E5E5] p-4 rounded-2xl hover:-translate-y-0.5 transition-all">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Fondo Inicial</span>
                <span className="text-base font-black text-[#111111] mt-0.5 block">{initialCash.toFixed(2)} Bs</span>
              </div>
              <div className="bg-[#FFF8F0]/35 border border-[#E5E5E5] p-4 rounded-2xl hover:-translate-y-0.5 transition-all">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Ventas QR</span>
                <span className="text-base font-black text-blue-700 mt-0.5 block">{totalQr.toFixed(2)} Bs</span>
              </div>
              <div className="bg-[#FFF8F0]/35 border border-[#E5E5E5] p-4 rounded-2xl hover:-translate-y-0.5 transition-all">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Ventas Efectivo</span>
                <span className="text-base font-black text-green-700 mt-0.5 block">{totalEfectivo.toFixed(2)} Bs</span>
              </div>
              <div className="bg-[#FFF8F0]/35 border border-[#E5E5E5] p-4 rounded-2xl hover:-translate-y-0.5 transition-all">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Total Ventas</span>
                <span className="text-base font-black text-[#111111] mt-0.5 block">{totalVentas.toFixed(2)} Bs</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <div className="bg-[#FFF3E0] border border-[#FFC107]/20 p-4 rounded-2xl">
                <span className="text-[10px] font-black text-[#7A0000] uppercase tracking-wider block">Efectivo Esperado</span>
                <span className="text-base font-black text-[#7A0000] mt-0.5 block">{efectivoEsperado.toFixed(2)} Bs</span>
              </div>
              <div className="bg-[#FFF3E0] border border-[#FFC107]/20 p-4 rounded-2xl">
                <span className="text-[10px] font-black text-[#7A0000] uppercase tracking-wider block">Efectivo Contado</span>
                <span className="text-base font-black text-[#7A0000] mt-0.5 block">{totalContado.toFixed(2)} Bs</span>
              </div>
              <div className={`p-4 border rounded-2xl border-transparent ${diferenciaArqueo === 0 ? 'bg-emerald-50 border-emerald-250 text-emerald-800' : diferenciaArqueo > 0 ? 'bg-[#FFF3E0] border-[#FFC107]/30 text-[#FF9800]' : 'bg-red-50 border-red-200 text-[#B71C1C]'}`}>
                <span className="text-[10px] font-black uppercase tracking-wider block">Diferencia Arqueo</span>
                <span className="text-base font-black mt-0.5 block">
                  {diferenciaArqueo > 0 ? '+' : ''}{diferenciaArqueo.toFixed(2)} Bs
                </span>
              </div>
            </div>

            {diferenciaArqueo !== 0 && (
              <div className="bg-[#FFF8F0] p-4 rounded-2xl border border-[#E5E5E5] text-xs">
                <span className="font-extrabold text-[#7A0000] block uppercase tracking-wider text-[10px]">Nota Explicativa (Diferencia de Caja):</span>
                <p className="text-[#333333] mt-1 font-semibold">{arqueoNotes}</p>
              </div>
            )}
          </div>

          {/* Detalles de Movimientos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tabla de ventas */}
            <div className="space-y-2">
              <h4 className="font-serif font-black text-[#111111] text-xs uppercase tracking-wider border-b border-[#FFC107]/20 pb-2 flex justify-between">
                <span>Detalle de Ventas</span>
                <span className="text-stone-450 font-bold">{ventas.length} items</span>
              </h4>
              <div className="max-h-56 overflow-y-auto border border-[#E5E5E5] rounded-2xl bg-[#FFF8F0]/20 select-none">
                <table className="w-full text-xs">
                  <thead className="bg-[#111111] text-[#FFC107] border-b border-[#333333] sticky top-0">
                    <tr>
                      <th className="p-2.5 text-left font-black uppercase text-[9px] tracking-wider text-[#FFC107]">Detalle</th>
                      <th className="p-2.5 text-left font-black uppercase text-[9px] tracking-wider text-[#FFC107]">Método</th>
                      <th className="p-2.5 text-right font-black uppercase text-[9px] tracking-wider text-[#FFC107]">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {ventas.map((v, i) => (
                      <tr key={i} className="hover:bg-[#FFF8F0]/40 transition-colors">
                        <td className="p-2.5 font-bold text-[#333333]">{v.desc}</td>
                        <td className="p-2.5 text-stone-505 font-semibold">{v.type}</td>
                        <td className="p-2.5 text-right font-black text-[#111111]">{v.amount.toFixed(2)} Bs</td>
                      </tr>
                    ))}
                    {ventas.length === 0 && (
                      <tr>
                        <td colSpan="3" className="p-4 text-center text-stone-400 italic font-bold">No se registraron ventas.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabla de anulaciones */}
            <div className="space-y-2">
              <h4 className="font-serif font-black text-[#111111] text-xs uppercase tracking-wider border-b border-[#FFC107]/20 pb-2 flex justify-between">
                <span>Detalle de Anulaciones</span>
                <span className="text-[#D32F2F] font-black">Total: -{totalAnulaciones.toFixed(2)} Bs</span>
              </h4>
              <div className="max-h-56 overflow-y-auto border border-[#E5E5E5] rounded-2xl bg-[#FFF8F0]/20 select-none">
                <table className="w-full text-xs">
                  <thead className="bg-[#111111] text-[#FFC107] border-b border-[#333333] sticky top-0">
                    <tr>
                      <th className="p-2.5 text-left font-black uppercase text-[9px] tracking-wider text-[#FFC107]">Detalle</th>
                      <th className="p-2.5 text-right font-black uppercase text-[9px] tracking-wider text-[#FFC107]">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {anulaciones.map((a, i) => (
                      <tr key={i} className="hover:bg-[#FFF8F0]/40 transition-colors">
                        <td className="p-2.5 font-bold text-[#333333]">{a.desc}</td>
                        <td className="p-2.5 text-right font-black text-[#D32F2F]">-{a.amount.toFixed(2)} Bs</td>
                      </tr>
                    ))}
                    {anulaciones.length === 0 && (
                      <tr>
                        <td colSpan="2" className="p-4 text-center text-stone-400 italic font-bold">No se registraron anulaciones.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#E5E5E5]">
            <button
              onClick={() => setShiftStep(4)}
              className="flex-1 bg-white hover:bg-gray-50 border border-[#E5E5E5] text-[#333333] py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-95"
            >
              Volver al Arqueo
            </button>
            <button
              onClick={imprimirReporteCierre}
              className="flex-1 bg-white hover:bg-[#FFF8F0]/20 border border-[#E5E5E5] text-[#333333] py-3 rounded-2xl font-black transition-all text-xs flex items-center justify-center gap-1.5 uppercase tracking-wider active:scale-95"
            >
              <Printer className="w-4 h-4 text-[#B71C1C]" />
              <span>Imprimir Reporte (Opcional)</span>
            </button>
            <button
              onClick={aprobarYCerrarTurno}
              disabled={guardandoCierre}
              className={`flex-1 py-3 rounded-2xl font-black transition-all shadow text-xs text-white uppercase tracking-wider active:scale-95 ${
                guardandoCierre ? 'bg-emerald-400 cursor-wait' : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400'
              }`}
            >
              {guardandoCierre ? 'Guardando Cierre...' : 'Aprobar y Cerrar Turno'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStep6 = () => {
    const handleNuevoTurno = () => {
      setShiftStep(1);
      setCashierName('');
      setInitialCash(0);
      
      const hoy = new Date();
      const dia = String(hoy.getDate()).padStart(2, '0');
      const mes = String(hoy.getMonth() + 1).padStart(2, '0');
      const anio = hoy.getFullYear();
      setShiftDesc(`Turno mañana - ${dia}/${mes}/${anio}`);
      
      setMovements([]);
      setCashCount({ b200: 0, b100: 0, b50: 0, b20: 0, b10: 0, b5: 0, m2: 0, m1: 0, m050: 0, m020: 0 });
      setArqueoNotes('');
      setManualDesc('');
      setManualAmount('');
      setManualMetodo('Efectivo');

      localStorage.removeItem('caja_shift_step');
      localStorage.removeItem('caja_cashier_name');
      localStorage.removeItem('caja_initial_cash');
      localStorage.removeItem('caja_shift_desc');
      localStorage.removeItem('caja_movements');
      localStorage.removeItem('caja_cash_count');
      localStorage.removeItem('caja_arqueo_notes');
      localStorage.removeItem('caja_shift_abierta_time');
    };

    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#FFF8F0]/30 flex items-center justify-center font-sans">
        <div className="bg-white rounded-3xl border border-[#E5E5E5] p-8 shadow-lg max-w-md w-full space-y-6 text-center animate-in fade-in duration-200">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#111111] uppercase tracking-wide font-serif">¡Turno Cerrado Exitosamente!</h2>
            <p className="text-xs text-stone-500 font-bold">
              El turno de caja del cajero <strong>{cashierName}</strong> ({shiftDesc}) ha sido aprobado y archivado correctamente.
            </p>
          </div>

          <div className="bg-[#FFF8F0]/65 border border-[#E5E5E5] rounded-2xl p-4 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-550 font-bold uppercase tracking-wider text-[9px]">Efectivo final entregado:</span>
              <span className="font-extrabold text-[#111111]">{totalContado.toFixed(2)} Bs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-550 font-bold uppercase tracking-wider text-[9px]">Ventas en QR registradas:</span>
              <span className="font-extrabold text-blue-700">{totalQr.toFixed(2)} Bs</span>
            </div>
            {diferenciaArqueo !== 0 && (
              <div className="pt-1.5 border-t border-[#E5E5E5]">
                <span className="text-stone-550 font-bold uppercase tracking-wider text-[9px] block">Diferencia explicada:</span>
                <span className={`font-extrabold block ${diferenciaArqueo > 0 ? 'text-[#FF9800]' : 'text-[#D32F2F]'}`}>
                  {diferenciaArqueo > 0 ? 'Sobrante' : 'Faltante'} de {Math.abs(diferenciaArqueo).toFixed(2)} Bs
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleNuevoTurno}
            className="w-full bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            Iniciar Nuevo Turno
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-7rem)] items-center justify-center bg-[#FFF8F0]/30 flex-col gap-3">
        <div className={`w-10 h-10 border-4 ${theme.loadingBorder} rounded-full animate-spin`}></div>
        <span className="text-[#7A0000] text-sm font-black uppercase tracking-wider">Iniciando Caja Registradora...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-red-50 border border-red-200 rounded-3xl p-6 text-center shadow-lg font-sans">
        <AlertCircle className="w-12 h-12 text-[#B71C1C] mx-auto mb-3" />
        <h3 className="text-[#7A0000] font-black uppercase tracking-wider text-sm mb-1">Error de Conexión</h3>
        <p className="text-[#D32F2F] text-xs font-bold mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-[#B71C1C] hover:bg-[#7A0000] text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
        >
          Reintentar Conexión
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col bg-[#FFF8F0]/10 overflow-hidden font-sans">
      
      {/* Barra de progreso de 5 pasos en cada pantalla */}
      {shiftStep >= 1 && shiftStep <= 5 && renderProgressBar()}

      {/* Flujo de Pasos */}
      {shiftStep === 1 && renderStep1()}

      {shiftStep === 2 && (
        <>
          {/* TABS DE NAVEGACIÓN SUPERIOR */}
          <div className="bg-white border-b border-gray-200 shrink-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 sm:gap-4 overflow-x-auto scrollbar-none">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 py-4 px-2 sm:px-3 border-b-2 font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                  active 
                    ? theme.activeTab 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENEDOR DE PESTAÑAS */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'shift_control' && renderShiftControl()}
        

        {/* PESTAÑA 1: PUNTO DE VENTA — Productos a pantalla completa */}
        {activeTab === 'pos' && (
          <div className="flex-1 flex overflow-hidden relative">
            {/* Zona de Productos: ahora ocupa el 100% del ancho */}
            <section className="flex-1 flex flex-col h-full bg-[#FFF8F0]/30">

              {/* Controles superiores */}
              <div className="bg-white p-4 border-b border-[#E5E5E5] space-y-3 shrink-0 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                      type="text" 
                      placeholder="Buscar platillo por nombre o descripción..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FFF8F0]/30 border border-[#E5E5E5] rounded-2xl text-sm font-bold text-[#111111] focus:outline-none focus:ring-4 focus:ring-[#B71C1C]/5 focus:border-[#B71C1C] transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span>Caja Activa</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {categorias.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoriaSeleccionada(cat.nombre)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 active:scale-95 ${
                        categoriaSeleccionada === cat.nombre ? 'bg-[#B71C1C] text-white shadow-md' : 'bg-[#FFF8F0] text-[#7A0000] border border-[#FFC107]/20 hover:bg-[#FFF3E0]'
                      }`}
                    >
                      {cat.nombre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid de Productos */}
              <div className="flex-1 overflow-y-auto p-4 pb-28">
                {productosFiltrados.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)]">
                    <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-2" />
                    <p className="text-stone-500 text-xs font-black uppercase tracking-wider">No se encontraron productos disponibles</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {productosFiltrados.map(producto => (
                      <button
                        key={producto.id}
                        onClick={() => agregarAlCarrito(producto)}
                        disabled={!producto.disponible}
                        className={`bg-white rounded-3xl border text-left overflow-hidden shadow-[0_4px_20px_rgba(17,17,17,0.04)] flex flex-col justify-between h-[230px] hover:shadow-lg hover:-translate-y-1 hover:border-[#FFC107]/40 transition-all duration-300 relative group ${
                          producto.disponible 
                            ? 'border-[#E5E5E5]' 
                            : 'opacity-60 cursor-not-allowed border-stone-200 bg-stone-50'
                        }`}
                      >
                        {/* Imagen */}
                        <div className="relative h-28 w-full bg-[#FFF8F0]/50 overflow-hidden shrink-0">
                          {producto.fotografia ? (
                            <img 
                              src={producto.fotografia} 
                              alt={producto.nombre} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-[#FFF8F0]/60">
                              <Store className="w-8 h-8 text-[#FF9800] opacity-40 mb-0.5" />
                              <span className="text-[10px] text-stone-400 font-bold">Sin foto</span>
                            </div>
                          )}
                          {!producto.disponible && (
                            <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center">
                              <span className="bg-[#B71C1C] text-white font-black text-[10px] px-3 py-1 rounded shadow tracking-wider animate-pulse">
                                AGOTADO
                              </span>
                            </div>
                          )}
                          <span className="absolute top-2 left-2 bg-white/95 text-[#7A0000] text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm">
                            {obtenerNombreCategoria(producto.categoria)}
                          </span>
                          {/* Badge de cantidad si ya está en el carrito */}
                          {carrito.find(c => c.id === producto.id) && (
                            <span className="absolute top-2 right-2 bg-[#B71C1C] text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                              {carrito.find(c => c.id === producto.id)?.cantidad}
                            </span>
                          )}
                        </div>

                        {/* Contenido */}
                        <div className="p-2.5 flex-1 flex flex-col justify-between overflow-hidden">
                          <h3 className="font-black text-[#111111] text-xs line-clamp-2 leading-tight">
                            {producto.nombre}
                          </h3>
                          <div className="flex items-center justify-between pt-1.5 border-t border-[#E5E5E5]/60 mt-1.5 shrink-0">
                            <span className="font-black text-[#B71C1C] text-sm whitespace-nowrap font-serif">
                              {parseFloat(producto.precio).toFixed(2)} <span className="text-[9px] font-black">Bs</span>
                            </span>
                            {producto.disponible && (
                              <span className="bg-[#FFF8F0] text-[#B71C1C] p-1.5 rounded-lg border border-[#FFC107]/20 group-hover:bg-[#B71C1C] group-hover:text-white transition-colors">
                                <Plus className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* ─── BOTÓN FLOTANTE DEL CARRITO ─── */}
            {activeTab === 'pos' && (
              <button
                onClick={() => setPanelCarritoAbierto(true)}
                className={`fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl font-black text-white text-sm transition-all duration-300 active:scale-95 bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] ${carrito.length > 0 ? 'scale-100' : 'scale-90 opacity-80'}`}
                style={{ backdropFilter: 'blur(8px)' }}
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {carrito.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#FFC107] text-[#111111] text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-[18px] px-0.5 shadow">
                      {carrito.reduce((s, i) => s + i.cantidad, 0)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] opacity-80 font-black uppercase tracking-wider">{tipoPedido === 'Para llevar' ? 'Pedido para Llevar' : 'Pedido en Curso'}</span>
                  <span translate="no" className="text-base font-black font-serif">{total.toFixed(2)} Bs</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            )}

            {/* ─── MODAL FLOTANTE DEL PEDIDO (CENTRADITO) ─── */}
            {panelCarritoAbierto && (
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-[3px] z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                onClick={() => setPanelCarritoAbierto(false)}
              >
                <div
                  className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] md:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 border border-[#FFC107]/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Cabecera del modal */}
                  <div className="p-4 border-b border-[#E5E5E5] bg-[#FFF8F0]/50 shrink-0 space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="font-black text-[#111111] text-lg font-serif uppercase tracking-wide flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-[#B71C1C]" />
                        <span>{tipoPedido === 'Para llevar' ? 'Pedido para Llevar' : 'Pedido en Curso'}</span>
                      </h2>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setModalPausadosAbierto(true)}
                          className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1.5 rounded-lg border transition-all ${
                            pedidosEnEspera.length > 0
                              ? 'bg-[#FFF3E0] hover:bg-[#FFC107]/30 text-[#7A0000] border-[#FFC107]/30'
                              : 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                          }`}
                          disabled={pedidosEnEspera.length === 0}
                          type="button"
                        >
                          <Clock className={`w-3.5 h-3.5 ${pedidosEnEspera.length > 0 ? 'text-[#FF9800]' : 'text-stone-400'}`} />
                          <span>En Espera ({pedidosEnEspera.length})</span>
                        </button>
                        <button
                          onClick={() => setPanelCarritoAbierto(false)}
                          className="p-1.5 rounded-lg text-stone-400 hover:bg-[#FFF8F0] hover:text-[#B71C1C] transition-all"
                          aria-label="Cerrar pedido"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Tipo de pedido */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'Consumo local', label: 'En Mesa', icon: Store },
                        { id: 'Delivery', label: 'Envío a Domicilio', icon: ShoppingBag },
                        { id: 'Para llevar', label: 'Para Llevar', icon: ShoppingBag },
                      ].map(tipo => {
                        const Icon = tipo.icon;
                        return (
                          <button
                            key={tipo.id}
                            onClick={() => {
                              setTipoPedido(tipo.id);
                              if (tipo.id !== 'Consumo local') setMesaSeleccionada('');
                            }}
                            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all active:scale-95 ${
                              tipoPedido === tipo.id
                                ? 'bg-[#B71C1C] text-white border-[#B71C1C] shadow-sm'
                                : 'bg-white text-[#333333] border-[#E5E5E5] hover:bg-[#FFF8F0]'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{tipo.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Selector de Mesa */}
                    {tipoPedido === 'Consumo local' && (
                      <div className="space-y-1">
                        <label className="block text-[10px] font-black text-[#7A0000] uppercase tracking-widest mb-1">Seleccionar Mesa</label>
                        <select
                          value={mesaSeleccionada}
                          onChange={(e) => setMesaSeleccionada(e.target.value)}
                          className="w-full bg-white border border-[#E5E5E5] rounded-xl p-2.5 text-sm font-bold text-[#111111] focus:outline-none focus:ring-4 focus:ring-[#B71C1C]/5 focus:border-[#B71C1C] transition-all cursor-pointer"
                        >
                          <option value="">— Seleccione una Mesa —</option>
                          {mesasDisponibles.map(mesa => (
                            <option key={mesa.id} value={mesa.id}>
                              Mesa {mesa.numero} · Cap. {mesa.capacidad} · {mesa.estado}
                            </option>
                          ))}
                        </select>
                        {mesasDisponibles.length === 0 && (
                          <p className="text-[10px] text-[#D32F2F] font-bold">¡No hay mesas registradas en el sistema!</p>
                        )}
                      </div>
                    )}

                    {/* Formulario Envío */}
                    {tipoPedido === 'Delivery' && (
                      <div className="space-y-2 bg-[#FFF8F0]/50 border border-[#FFC107]/20 rounded-2xl p-3">
                        <p className="text-[10px] font-black text-[#7A0000] uppercase tracking-widest flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3" /> Datos del Envío a Domicilio
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-black text-[#7A0000] uppercase mb-1">Nombre cliente *</label>
                            <input type="text" placeholder="Ej. Juan Pérez" value={deliveryNombre}
                              onChange={(e) => setDeliveryNombre(e.target.value)}
                              className="w-full bg-white border border-[#E5E5E5] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#111111] focus:outline-none focus:ring-4 focus:ring-[#B71C1C]/5 focus:border-[#B71C1C] transition-all" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-[#7A0000] uppercase mb-1">Teléfono *</label>
                            <input type="tel" placeholder="Ej. 77712345" value={deliveryTelefono}
                              onChange={(e) => setDeliveryTelefono(e.target.value)}
                              className="w-full bg-white border border-[#E5E5E5] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#111111] focus:outline-none focus:ring-4 focus:ring-[#B71C1C]/5 focus:border-[#B71C1C] transition-all" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] font-black text-[#7A0000] uppercase mb-1">Dirección completa *</label>
                          <input type="text" placeholder="Calle, número, barrio..." value={deliveryDireccion}
                            onChange={(e) => setDeliveryDireccion(e.target.value)}
                            className="w-full bg-white border border-[#E5E5E5] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#111111] focus:outline-none focus:ring-4 focus:ring-[#B71C1C]/5 focus:border-[#B71C1C] transition-all" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black text-[#7A0000] uppercase mb-1">Referencia (punto de entrega)</label>
                          <input type="text" placeholder="Ej. Frente al parque central" value={deliveryReferencia}
                            onChange={(e) => setDeliveryReferencia(e.target.value)}
                            className="w-full bg-white border border-[#E5E5E5] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#111111] focus:outline-none focus:ring-4 focus:ring-[#B71C1C]/5 focus:border-[#B71C1C] transition-all" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lista de ítems del pedido */}
                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                    {carrito.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center py-16">
                        <ShoppingCart className="w-16 h-16 text-stone-200 mb-4" />
                        <p className="text-stone-400 text-xs font-black uppercase tracking-wider">El pedido está vacío</p>
                        <p className="text-stone-300 text-xs mt-1 font-bold">Agregá productos desde la pantalla principal</p>
                      </div>
                    ) : (
                      carrito.map(item => (
                        <div key={item.id} className="bg-[#FFF8F0]/40 rounded-2xl p-3 space-y-2 border border-[#E5E5E5]">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 pr-2">
                              <h4 className="font-black text-[#111111] text-sm leading-snug">
                                {item.cantidad > 1 && <span className="text-[#B71C1C] font-black">{item.cantidad}× </span>}
                                {item.nombre}
                              </h4>
                              {item.extras && item.extras.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.extras.map((ex, idx) => (
                                    <span key={idx} className="bg-[#FFF3E0] text-[#FF9800] text-[9px] font-black px-1.5 py-0.5 rounded border border-[#FFC107]/25">
                                      +{ex.nombre} (+{ex.precio} Bs)
                                    </span>
                                  ))}
                                </div>
                              )}
                              <span className="text-[11px] text-stone-400 font-bold mt-0.5 block">
                                {item.precio.toFixed(2)} Bs c/u
                              </span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-black text-[#111111] text-sm font-serif">{(item.precio * item.cantidad).toFixed(2)} Bs</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Cantidad */}
                            <div className="flex items-center border border-[#E5E5E5] rounded-xl bg-white overflow-hidden shrink-0">
                              <button onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                                className="px-2.5 py-1.5 hover:bg-[#FFF8F0] transition-colors text-[#B71C1C] font-black text-sm">−</button>
                              <span className="px-3 text-sm font-black text-[#111111] min-w-8 text-center">{item.cantidad}</span>
                              <button onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                                className="px-2.5 py-1.5 hover:bg-[#FFF8F0] transition-colors text-[#B71C1C] font-black text-sm">+</button>
                            </div>
                            {/* Nota */}
                            <div className="relative flex-1">
                              <Notebook className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-400" />
                              <input type="text" placeholder="Nota del platillo..."
                                value={item.observaciones}
                                onChange={(e) => agregarObservacion(item.id, e.target.value)}
                                className="w-full pl-6 pr-2 py-1.5 bg-white border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:ring-4 focus:ring-[#B71C1C]/5 focus:border-[#B71C1C] transition-all" />
                            </div>
                            {/* Extras */}
                            <button type="button" onClick={() => abrirModalExtras(item)}
                              className={`px-2 py-1.5 rounded-lg border text-[10px] font-black transition-all shrink-0 flex items-center gap-0.5 ${
                                item.extras && item.extras.length > 0
                                  ? 'bg-[#FFF3E0] text-[#FF9800] border-[#FFC107]/30 hover:bg-[#FFC107]/20'
                                  : 'bg-[#FFF8F0] text-[#7A0000] border-[#FFC107]/20 hover:bg-[#FFF3E0]'
                              }`}>
                              <Plus className="w-3 h-3" />
                              <span>Extra</span>
                            </button>
                            {/* Eliminar */}
                            <button onClick={() => actualizarCantidad(item.id, 0)}
                              className="p-1.5 text-[#D32F2F] hover:text-[#B71C1C] hover:bg-red-50 rounded-lg transition-colors shrink-0">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Pie del modal: notas, total, acciones */}
                  <div className="p-4 border-t border-[#E5E5E5] bg-white shrink-0 space-y-3">
                    <div>
                      <label className="block text-[10px] font-black text-[#7A0000] uppercase tracking-widest mb-1">Notas generales del pedido</label>
                      <input type="text" placeholder="Observaciones para cocina o conductor..."
                        value={observacionesGenerales}
                        onChange={(e) => setObservacionesGenerales(e.target.value)}
                        className="w-full bg-[#FFF8F0]/30 border border-[#E5E5E5] rounded-2xl px-3 py-2.5 text-sm font-bold text-[#111111] focus:outline-none focus:ring-4 focus:ring-[#B71C1C]/5 focus:border-[#B71C1C] transition-all" />
                    </div>

                    <div className="flex justify-between items-center px-4 py-3 rounded-2xl bg-[#FFF8F0] border border-[#FFC107]/25">
                      <span className="text-[10px] font-black text-[#7A0000] uppercase tracking-widest">Total a Cobrar</span>
                      <span translate="no" className="text-2xl font-black text-[#B71C1C] font-serif">{total.toFixed(2)} <span className="text-sm">Bs</span></span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={pausarPedido}
                        disabled={carrito.length === 0}
                        type="button"
                        className={`w-full py-3 rounded-2xl font-black flex items-center justify-center gap-1.5 transition-all border text-xs uppercase tracking-wider active:scale-95 ${
                          carrito.length > 0
                            ? 'bg-[#FFF3E0] hover:bg-[#FFC107]/30 text-[#7A0000] border-[#FFC107]/30'
                            : 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                        }`}
                      >
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>Guardar y Pausar</span>
                      </button>
                      <button
                        onClick={() => setModalAbierto(true)}
                        disabled={carrito.length === 0}
                        className={`w-full py-3 rounded-2xl font-black flex items-center justify-center gap-1.5 transition-all shadow-sm text-xs uppercase tracking-wider active:scale-95 ${
                          carrito.length > 0
                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-md'
                            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        <DollarSign className="w-4 h-4 shrink-0" />
                        <span>Cobrar e Imprimir</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}



        {/* PESTAÑA 2: PEDIDOS WEB (DELIVERY) */}
        {activeTab === 'delivery' && (
          <div className="flex-1 overflow-y-auto p-6 bg-[#FFF8F0]/30 font-sans">
            <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-xl font-black text-[#111111] font-serif uppercase tracking-wide">Pedidos Web para Delivery</h2>
                <p className="text-xs text-stone-500 mt-1 font-bold">Supervise y despache las solicitudes de delivery hechas por clientes en tiempo real.</p>
              </div>
              <button 
                onClick={fetchPedidosDelivery}
                className={`flex items-center gap-1.5 ${theme.bgLightPill} hover:opacity-90 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-xs`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Actualizar</span>
              </button>
            </div>

            {pedidosWebRecientes.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E5E5] shadow-lg max-w-xl mx-auto">
                <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 font-bold uppercase tracking-wider text-xs">No se registran pedidos de delivery nuevos en este momento</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {pedidosWebRecientes.map(del => {
                  const colors = {
                    'Pendiente': 'bg-[#FFF3E0] text-[#FF9800] border-[#FFC107]/30',
                  };

                  return (
                    <div key={del.id} className="bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)] overflow-hidden flex flex-col justify-between hover:shadow-lg transition-shadow duration-250">
                      <div className="p-5 space-y-4">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-black text-stone-400">PEDIDO #{del.id}</span>
                          <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${colors[del.estado] || 'bg-stone-100 text-stone-700 border-stone-250'}`}>
                            {del.estado}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-serif font-black text-[#111111] text-base flex items-center gap-1.5">
                            <User className={`w-4 h-4 text-[#B71C1C]`} />
                            <span>{del.cliente_nombre || 'Cliente sin nombre'}</span>
                          </h3>
                          <p className="text-xs text-stone-600 font-semibold flex items-start gap-1.5">
                            <MapPin className="w-4 h-4 text-[#FF9800] shrink-0 mt-0.5" />
                            <span>{del.cliente_direccion || 'Sin dirección ingresada'}</span>
                          </p>
                          {del.cliente_telefono && (
                            <p className="text-xs text-stone-600 font-semibold flex items-center gap-1.5">
                               <Phone className="w-4 h-4 text-[#FF9800]" />
                              <span>{del.cliente_telefono}</span>
                            </p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-[#E5E5E5] flex justify-between items-center">
                          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total a Pagar:</span>
                          <span className={`font-serif font-black text-[#B71C1C] text-lg`}>
                            {parseFloat(del.pedido_total || 0).toFixed(2)} Bs
                          </span>
                        </div>
                      </div>

                      <div className="bg-[#FFF8F0]/50 px-5 py-4 border-t border-[#E5E5E5] rounded-b-3xl">
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => aceptarPedidoDelivery(del)}
                            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all shadow-sm active:scale-95"
                          >
                            <Check className="w-4 h-4" />
                            <span>Aceptar</span>
                          </button>
                          <button
                            onClick={() => rechazarPedidoDelivery(del.id)}
                            className="bg-red-50 hover:bg-red-100 text-[#B71C1C] border border-red-250 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all active:scale-95"
                          >
                            <X className="w-4 h-4" />
                            <span>Rechazar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 3: RESERVACIONES */}
        {activeTab === 'reservations' && (
          <div className="flex-1 overflow-y-auto p-6 bg-[#FFF8F0]/30 font-sans">
            <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-xl font-black text-[#111111] font-serif uppercase tracking-wide">Control de Reservaciones</h2>
                <p className="text-xs text-stone-500 mt-1 font-bold">Administre las reservaciones pendientes, confírmelas o cancélelas según disponibilidad.</p>
              </div>
              <button 
                onClick={fetchReservas}
                className={`flex items-center gap-1.5 ${theme.bgLightPill} hover:opacity-90 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-xs`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Actualizar</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)] overflow-hidden max-w-6xl mx-auto">
              {reservas.length === 0 ? (
                <div className="text-center py-20">
                  <Calendar className="w-16 h-16 text-stone-300 mx-auto mb-3" />
                  <p className="text-stone-500 font-bold uppercase tracking-wider text-xs">No hay reservaciones agendadas</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#111111] text-[#FFC107] border-b border-[#333333] text-[10px] font-black uppercase tracking-wider">
                        <th className="py-4 px-6 text-[#FFC107]">Cliente</th>
                        <th className="py-4 px-6 text-[#FFC107]">Teléfono</th>
                        <th className="py-4 px-6 text-[#FFC107]">Fecha</th>
                        <th className="py-4 px-6 text-[#FFC107]">Hora</th>
                        <th className="py-4 px-6 text-[#FFC107] text-center">Personas</th>
                        <th className="py-4 px-6 text-[#FFC107]">Observaciones</th>
                        <th className="py-4 px-6 text-[#FFC107] text-center">Estado</th>
                        <th className="py-4 px-6 text-[#FFC107] text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservas.map(res => (
                        <tr key={res.id} className="border-b border-[#E5E5E5] hover:bg-[#FFF8F0]/40 transition-colors">
                          <td className="py-4 px-6 font-bold text-[#111111]">{res.nombre}</td>
                          <td className="py-4 px-6 text-stone-600 text-sm font-semibold">{res.telefono}</td>
                          <td className="py-4 px-6 text-stone-600 font-semibold">{res.fecha}</td>
                          <td className="py-4 px-6 text-stone-600 font-semibold">{res.hora}</td>
                          <td className="py-4 px-6 text-center font-black text-[#111111]">{res.cantidad_personas}</td>
                          <td className="py-4 px-6 text-stone-500 text-xs max-w-[200px] truncate font-semibold">{res.observaciones || '-'}</td>
                          <td className="py-4 px-6 text-center">
                            <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${
                              res.estado === 'Pendiente' ? 'bg-[#FFF3E0] text-[#FF9800] border-[#FFC107]/20' :
                              res.estado === 'Confirmada' ? 'bg-emerald-50 text-emerald-800 border-emerald-250' :
                              'bg-red-50 text-[#B71C1C] border-red-250'
                            }`}>
                              {res.estado}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            {res.estado === 'Pendiente' ? (
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => actualizarEstadoReserva(res.id, 'Confirmada')}
                                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg transition-colors shadow-xs active:scale-90"
                                  title="Confirmar Reserva"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => actualizarEstadoReserva(res.id, 'Cancelada')}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-250 text-[#B71C1C] rounded-lg transition-colors active:scale-90"
                                  title="Cancelar Reserva"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="text-center text-xs font-bold text-stone-400">-</div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      {/* PESTAÑA 4: HISTORIAL DE PEDIDOS */}
        {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto p-6 bg-[#FFF8F0]/30 font-sans">
            <section className="bg-white rounded-3xl border border-[#E5E5E5] p-6 shadow-[0_10px_30px_rgba(17,17,17,0.04)] space-y-6 max-w-6xl mx-auto">
              <div>
                <h3 className="text-lg font-black text-[#111111] font-serif uppercase tracking-wide flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#B71C1C]" />
                  <span>Historial de Pedidos Cobrados</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1 font-bold">Consulte el registro completo de ventas y reimprima tickets según corresponda.</p>
              </div>

              {/* Filtros */}
              <div className="flex flex-col md:flex-row gap-4 bg-[#FFF8F0]/65 p-4 rounded-2xl border border-[#FFC107]/20 items-end">
                <div className="flex-1 space-y-1 w-full">
                  <label className="block text-[10px] font-black text-[#7A0000] uppercase tracking-widest mb-1">Filtrar por Fecha</label>
                  <input 
                    type="date"
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-xl p-2.5 text-xs font-bold text-[#111111] focus:outline-none transition-all"
                  />
                </div>
                <div className="flex-1 space-y-1 w-full">
                  <label className="block text-[10px] font-black text-[#7A0000] uppercase tracking-widest mb-1">Buscar por Nº Pedido (ID)</label>
                  <input 
                    type="text"
                    placeholder="Ej. 12..."
                    value={filtroIdPedido}
                    onChange={(e) => setFiltroIdPedido(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-xl p-2.5 text-xs font-bold text-[#111111] focus:outline-none transition-all"
                  />
                </div>
                <div className="flex-1 space-y-1 w-full">
                  <label className="block text-[10px] font-black text-[#7A0000] uppercase tracking-widest mb-1">Tipo de Pedido</label>
                  <select
                    value={filtroTipoPedido}
                    onChange={(e) => setFiltroTipoPedido(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-xl p-2.5 text-xs font-bold text-[#111111] focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="Todos">Todos los tipos</option>
                    <option value="Consumo local">Consumo local</option>
                    <option value="Para llevar">Para llevar</option>
                    <option value="Delivery">Delivery</option>
                  </select>
                </div>
                {(filtroFecha || filtroIdPedido || filtroTipoPedido !== 'Todos') && (
                  <button
                    onClick={() => {
                      setFiltroFecha('');
                      setFiltroIdPedido('');
                      setFiltroTipoPedido('Todos');
                      setPaginaHistorial(1);
                    }}
                    className="h-[38px] px-4 bg-white hover:bg-gray-50 border border-[#E5E5E5] text-[#333333] rounded-xl text-xs font-black transition-all shadow-sm shrink-0 flex items-center justify-center gap-1.5 active:scale-95 uppercase tracking-wider"
                  >
                    <X className="w-3.5 h-3.5 text-[#B71C1C]" />
                    <span>Limpiar</span>
                  </button>
                )}
              </div>

              {/* Tabla de Historial */}
              <div className="overflow-x-auto rounded-2xl border border-[#E5E5E5] shadow-xs">
                {historialFiltrado.length === 0 ? (
                  <div className="text-center py-10 bg-[#FFF8F0]/10">
                    <p className="text-stone-400 text-xs font-black uppercase tracking-wider">No se encontraron registros de pedidos</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#111111] text-[#FFC107] border-b border-[#333333] text-[10px] font-black uppercase tracking-wider">
                        <th className="py-3 px-4 text-[#FFC107]">Pedido ID</th>
                        <th className="py-3 px-4 text-[#FFC107]">Fecha y Hora</th>
                        <th className="py-3 px-4 text-[#FFC107]">Tipo</th>
                        <th className="py-3 px-4 text-[#FFC107] text-center">Estado</th>
                        <th className="py-3 px-4 text-[#FFC107] text-right">Total</th>
                        <th className="py-3 px-4 text-[#FFC107]">Notas</th>
                        <th className="py-3 px-4 text-[#FFC107] text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {historialPaginado.map(pedido => (
                        <tr key={pedido.id} className="hover:bg-[#FFF8F0]/30 transition-colors">
                          <td className="py-3 px-4 font-black text-[#111111]">#{pedido.id}</td>
                          <td className="py-3 px-4 text-stone-600 font-semibold">
                            {new Date(pedido.fecha_creacion).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-stone-705 font-bold">{pedido.tipo_pedido}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded shadow-sm border tracking-wider ${
                              pedido.estado === 'Pagado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              pedido.estado === 'Cancelado' ? 'bg-red-50 text-red-750 border-red-200' :
                              'bg-[#FFF3E0] text-[#FF9800] border-[#FFC107]/20'
                            }`}>
                              {pedido.estado}
                            </span>
                          </td>
                          <td className={`py-3 px-4 text-right font-serif font-black text-[#B71C1C] text-sm`}>{parseFloat(pedido.total).toFixed(2)} Bs</td>
                          <td className="py-3 px-4 text-stone-500 font-semibold truncate max-w-[150px]">{pedido.observaciones || '-'}</td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => volverAImprimirTicket(pedido)}
                              className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all shadow-xs bg-[#FFF8F0] border border-[#FFC107]/30 text-[#7A0000] hover:bg-[#FFF3E0] active:scale-95"
                            >
                              Reimprimir Ticket
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

                {/* Controles de Paginación */}
                {totalPaginasHistorial > 1 && (
                  <div className="flex justify-between items-center p-4 bg-white border-t border-[#E5E5E5]">
                    <span className="text-[11px] text-[#7A0000] font-black uppercase tracking-wider">
                      Mostrando {indicePrimerElemento + 1} a {Math.min(indiceUltimoElemento, historialFiltrado.length)} de {historialFiltrado.length} pedidos
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setPaginaHistorial(p => Math.max(1, p - 1))}
                        disabled={paginaHistorial === 1}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-[#E5E5E5] text-[10px] font-black text-[#333333] disabled:opacity-40 disabled:cursor-not-allowed transition-all uppercase tracking-wider active:scale-95"
                      >
                        Anterior
                      </button>
                      <span className="px-4 py-2 text-[10px] font-black text-[#111111] bg-[#FFF8F0] rounded-xl border border-[#FFC107]/20">
                        {paginaHistorial} / {totalPaginasHistorial}
                      </span>
                      <button 
                        onClick={() => setPaginaHistorial(p => Math.min(totalPaginasHistorial, p + 1))}
                        disabled={paginaHistorial === totalPaginasHistorial}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-[#E5E5E5] text-[10px] font-black text-[#333333] disabled:opacity-40 disabled:cursor-not-allowed transition-all uppercase tracking-wider active:scale-95"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}

        {/* PESTAÑA 5: CONTROL DE MESAS */}
        {activeTab === 'tables' && (
          <div className="flex-1 overflow-y-auto p-6 bg-[#FFF8F0]/30 font-sans">
            <section className="bg-white rounded-3xl border border-[#E5E5E5] p-6 shadow-[0_10px_30px_rgba(17,17,17,0.04)] space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E5E5E5] pb-4">
                <div>
                  <h3 className="text-lg font-black text-[#111111] font-serif uppercase tracking-wide flex items-center gap-2">
                    <Store className="w-5 h-5 text-[#B71C1C]" />
                    <span>Control de Estado de Mesas</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 font-bold">Monitoree la ocupación física y force el cambio de estado (Libre, Ocupada, Reservada) manualmente.</p>
                </div>
                <button
                  onClick={abrirModalNuevaMesa}
                  id="btn-nueva-mesa"
                  className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 hover:shadow-md active:scale-95 shrink-0 ${theme.primary}`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva Mesa</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {mesas.map(mesa => {
                  const stateStyles = {
                    'Libre': 'bg-emerald-50/70 border-emerald-200 text-emerald-800',
                    'Ocupada': 'bg-[#FFF3E0] border-[#FFC107]/25 text-[#7A0000]',
                    'Reservada': 'bg-blue-50 border-blue-200 text-blue-800'
                  };

                  return (
                    <div key={mesa.id} className={`rounded-2xl border p-4 flex flex-col justify-between h-40 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 duration-250 ${stateStyles[mesa.estado] || 'bg-stone-50 border-stone-200 text-stone-500'}`}>
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-serif font-black text-sm text-[#111111] block">Mesa {mesa.numero}</span>
                            <span className="text-[10px] block mt-0.5 font-bold text-stone-500">Capacidad: {mesa.capacidad} pers.</span>
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="text-[9px] font-black uppercase border border-stone-200/50 px-1.5 py-0.5 rounded bg-white shadow-xs text-stone-700">
                              {mesa.estado}
                            </span>
                            <button
                              onClick={() => abrirModalEditarMesa(mesa)}
                              id={`btn-edit-mesa-${mesa.numero}`}
                              title="Editar Mesa"
                              className="text-stone-400 hover:text-[#B71C1C] p-1 rounded-lg hover:bg-white/80 transition-all active:scale-90"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Botones de Control de Estado de Mesas */}
                      <div className="space-y-1.5 pt-2 border-t border-stone-200/50">
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            onClick={() => cambiarEstadoMesaManual(mesa.id, 'Libre')}
                            disabled={mesa.estado === 'Libre'}
                            className={`text-[9px] font-black uppercase tracking-wider py-1.5 rounded-lg transition-colors ${
                              mesa.estado === 'Libre' 
                                ? 'bg-stone-100/70 text-stone-400 cursor-not-allowed border border-transparent' 
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                            }`}
                          >
                            Libre
                          </button>
                          <button
                            onClick={() => cambiarEstadoMesaManual(mesa.id, 'Ocupada')}
                            disabled={mesa.estado === 'Ocupada'}
                            className={`text-[9px] font-black uppercase tracking-wider py-1.5 rounded-lg transition-colors ${
                              mesa.estado === 'Ocupada' 
                                ? 'bg-stone-100/70 text-stone-400 cursor-not-allowed border border-transparent' 
                                : theme.primary
                            }`}
                          >
                            Ocupar
                          </button>
                          <button
                            onClick={() => cambiarEstadoMesaManual(mesa.id, 'Reservada')}
                            disabled={mesa.estado === 'Reservada'}
                            className={`text-[9px] font-black uppercase tracking-wider py-1.5 rounded-lg transition-colors ${
                              mesa.estado === 'Reservada' 
                                ? 'bg-stone-100/70 text-stone-400 cursor-not-allowed border border-transparent' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                            }`}
                          >
                            Reservar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

      </div>
      </>
      )}

      {shiftStep === 3 && renderStep3()}
      {shiftStep === 4 && renderStep4()}
      {shiftStep === 5 && renderStep5()}
      {shiftStep === 6 && renderStep6()}

      {/* 5. MODAL DE PAGO */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#FFC107]/20 relative animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => {
                setModalAbierto(false);
                setExito(false);
              }} 
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:bg-[#FFF8F0] hover:text-[#B71C1C] transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {!exito ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-[#111111] font-serif uppercase tracking-wide">Procesar Venta</h3>
                  <p className="text-xs text-stone-500 font-bold mt-0.5">Seleccione el método de pago para registrar la venta.</p>
                </div>
                <div className="bg-[#FFF8F0] rounded-2xl p-4 border border-[#FFC107]/25 flex justify-between items-center shadow-xs">
                  <span className="text-[10px] font-black text-[#7A0000] uppercase tracking-widest">Total Pedido</span>
                  <span className="text-2xl font-serif font-black text-[#B71C1C]">{total.toFixed(2)} Bs</span>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-[#7A0000] uppercase tracking-widest mb-1.5">Método de Pago</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Efectivo', label: 'Efectivo' },
                      { id: 'QR', label: 'Código QR' },
                      { id: 'Mixto', label: 'Pago Mixto' }
                    ].map(metodo => (
                      <button
                        key={metodo.id}
                        onClick={() => {
                          setMetodoPago(metodo.id);
                          setMontoRecibido('');
                          setMontoEfectivoMixto('');
                          setMontoQrMixto('');
                        }}
                        className={`py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-xs ${
                          metodoPago === metodo.id
                            ? 'bg-[#B71C1C] text-white border-[#B71C1C]'
                            : 'bg-white text-stone-700 border-[#E5E5E5] hover:bg-gray-50'
                        }`}
                      >
                        {metodo.label}
                      </button>
                    ))}
                  </div>
                </div>

                {metodoPago === 'Efectivo' && (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-[#7A0000] uppercase tracking-widest mb-1.5">Efectivo Recibido</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">Bs</span>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={montoRecibido}
                        onChange={(e) => setMontoRecibido(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-xl text-sm text-[#111111] font-black focus:outline-none transition-all"
                      />
                    </div>
                    {parseFloat(montoRecibido) >= total && (
                      <div className="flex justify-between items-center text-xs pt-1.5 px-1 bg-emerald-50/50 rounded-lg p-2 border border-emerald-100 mt-2">
                        <span className="text-stone-500 font-bold">Cambio a entregar:</span>
                        <span className="font-extrabold text-emerald-600 text-sm">
                          {(parseFloat(montoRecibido) - total).toFixed(2)} Bs
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {metodoPago === 'QR' && (
                  <div className="bg-[#FFF8F0]/30 border border-[#E5E5E5] rounded-2xl p-4 text-center space-y-2">
                    {imagenQrUrl ? (
                      <div className="mx-auto rounded flex items-center justify-center p-2 bg-white border border-[#FFC107]/20 shadow-sm max-w-xs">
                        <img src={imagenQrUrl} alt="Código QR de Pago" className="w-full h-auto max-h-48 object-contain rounded" />
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-stone-100 mx-auto rounded flex items-center justify-center text-xs font-black text-stone-400 border border-dashed border-stone-300">
                        [ CÓDIGO QR ]
                      </div>
                    )}
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Escanee el código para la transferencia bancaria o pago móvil.</p>
                  </div>
                )}

                {/* Pago Mixto */}
                {metodoPago === 'Mixto' && (
                  <div className="space-y-3 p-4 rounded-2xl border border-[#FFC107]/20 bg-[#FFF8F0]/40">
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-1">
                        <label className="block text-[9px] font-black text-[#7A0000] uppercase tracking-widest">Monto Efectivo</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">Bs</span>
                          <input 
                            type="number"
                            placeholder="0.00"
                            value={montoEfectivoMixto}
                            onChange={(e) => setMontoEfectivoMixto(e.target.value)}
                            className="w-full pl-8 pr-2 py-2 bg-white border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-xl text-xs font-bold text-[#111111] focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="block text-[9px] font-black text-[#7A0000] uppercase tracking-widest">Monto QR</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">Bs</span>
                          <input 
                            type="number"
                            placeholder="0.00"
                            value={montoQrMixto}
                            onChange={(e) => setMontoQrMixto(e.target.value)}
                            className="w-full pl-8 pr-2 py-2 bg-white border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-xl text-xs font-bold text-[#111111] focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold pt-1.5 border-t border-stone-200/50">
                      <span className="text-stone-500 uppercase tracking-wider">Suma ingresada:</span>
                      <span className={`font-black ${esBotonConfirmarDeshabilitado() ? 'text-[#D32F2F]' : 'text-emerald-600'}`}>
                        {((parseFloat(montoEfectivoMixto) || 0) + (parseFloat(montoQrMixto) || 0)).toFixed(2)} / {total.toFixed(2)} Bs
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={confirmarPedido}
                  disabled={confirmandoPedido || esBotonConfirmarDeshabilitado()}
                  className={`w-full py-3.5 rounded-2xl font-black uppercase tracking-wider text-xs transition-all active:scale-95 ${
                    confirmandoPedido || esBotonConfirmarDeshabilitado()
                      ? 'bg-stone-100 text-stone-400 border border-transparent cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-md shadow-emerald-950/10'
                  }`}
                >
                  {confirmandoPedido ? 'Registrando venta...' : 'Confirmar e Imprimir Comanda'}
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-w-md mx-auto text-left py-2">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2 animate-bounce" />
                  <h3 className="text-lg font-black text-[#111111] font-serif uppercase tracking-wide">¡Venta Registrada!</h3>
                  <p className="text-xs text-stone-450 font-bold">Orden #{ultimoPedidoCreado?.id} procesada de forma correcta.</p>
                </div>

                {/* Resumen del Pedido */}
                <div className="bg-[#FFF8F0]/65 border border-[#E5E5E5] rounded-2xl p-4 text-xs space-y-3 shadow-xs">
                  <div className="grid grid-cols-2 gap-2 pb-2 border-b border-stone-200/60">
                    <div>
                      <span className="text-[#7A0000] block uppercase font-black text-[9px] tracking-wider">Tipo Pedido</span>
                      <span className="font-extrabold text-[#111111]">{ultimoPedidoCreado?.tipo_pedido}</span>
                    </div>
                    {ultimoPedidoCreado?.mesa && (
                      <div>
                        <span className="text-[#7A0000] block uppercase font-black text-[9px] tracking-wider">Mesa</span>
                        <span className="font-extrabold text-[#111111]">
                          Mesa #{mesas.find(m => m.id === ultimoPedidoCreado.mesa)?.numero || ultimoPedidoCreado.mesa}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tabla resumida de ítems */}
                  <div className="space-y-1">
                    <span className="text-[#7A0000] block uppercase font-black text-[9px] tracking-wider mb-1">Detalle de Productos</span>
                    <div className="max-h-24 overflow-y-auto divide-y divide-stone-200 pr-1 select-none">
                      {ultimoCarrito.map((item, idx) => (
                        <div key={idx} className="py-1.5 font-bold text-stone-700 border-b border-stone-100 last:border-0">
                          <div className="flex justify-between">
                            <span>{item.cantidad} x {item.nombre}</span>
                            <span>{(item.precio * item.cantidad).toFixed(2)} Bs</span>
                          </div>
                          {item.extras && item.extras.length > 0 && (
                            <div className="text-[10px] text-[#FF9800] font-black pl-4 mt-0.5">
                              + Extras: {item.extras.map(e => e.nombre).join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pago y Totales */}
                  <div className="pt-2 border-t border-[#E5E5E5] flex justify-between items-center text-sm font-extrabold text-[#111111]">
                    <span className="text-stone-500 font-bold uppercase tracking-wider text-[9px]">Total Cobrado</span>
                    <span className="text-[#B71C1C] font-serif font-black text-base">{(parseFloat(ultimoPedidoCreado?.total) || 0).toFixed(2)} Bs</span>
                  </div>
                  
                  <div className="flex justify-between text-stone-600 text-[10px] font-bold uppercase tracking-wider">
                    <span>Método de Pago:</span>
                    <span className="text-[#111111] font-black">{ultimoMetodoPago}</span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={() => imprimirTickets(ultimoPedidoCreado, ultimoCarrito, ultimoMetodoPago)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-3.5 rounded-2xl font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98 text-xs"
                  >
                    <Printer className="w-4.5 h-4.5" />
                    <span>Imprimir Comanda y Ticket</span>
                  </button>

                  {/* Botón Compartir Ticket: solo para pedidos de Delivery */}
                  {ultimoPedidoCreado?.tipo_pedido === 'Delivery' && (
                    <button
                      onClick={() => {
                        const lineas = ultimoCarrito.map(i => `  - ${i.cantidad}x ${i.nombre}: ${(i.precio * i.cantidad).toFixed(2)} Bs`).join('\n');
                        const texto = `🛵 *TICKET DE ENVÍO - Pedido #${ultimoPedidoCreado?.id}*\n\n` +
                          `📋 *Productos:*\n${lineas}\n\n` +
                          `💰 *Total:* ${(parseFloat(ultimoPedidoCreado?.total) || 0).toFixed(2)} Bs\n` +
                          `💳 *Pago:* ${ultimoMetodoPago}\n\n` +
                          `📍 *Datos del Cliente:*\n` +
                          `  Nombre: ${ultimoPedidoCreado?.cliente_nombre || deliveryNombre || 'Sin nombre'}\n` +
                          `  Teléfono: ${ultimoPedidoCreado?.cliente_telefono || deliveryTelefono || 'Sin teléfono'}\n` +
                          `  Dirección: ${ultimoPedidoCreado?.cliente_direccion || deliveryDireccion || 'Sin dirección'}\n` +
                          (deliveryReferencia ? `  Referencia: ${deliveryReferencia}\n` : '') +
                          `\n✅ Por favor confirmar entrega al receptor.`;
                        if (navigator.share) {
                          navigator.share({ title: `Ticket Pedido #${ultimoPedidoCreado?.id}`, text: texto });
                        } else {
                          navigator.clipboard.writeText(texto).then(() => alert('✅ Ticket copiado al portapapeles. Pégalo en WhatsApp u otro medio para enviarlo al conductor.'));
                        }
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm text-xs"
                    >
                      <span>📲 Compartir Ticket al Conductor</span>
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={modificarPedido}
                      className="bg-white hover:bg-gray-50 border border-[#E5E5E5] text-[#333333] py-2.5 rounded-2xl font-black transition-all text-xs flex items-center justify-center gap-1.5 active:scale-95 uppercase tracking-wider"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#B71C1C]" />
                      <span>Modificar Pedido</span>
                    </button>
                    <button
                      onClick={cerrarExito}
                      className="bg-[#FFC107] hover:bg-[#FF9800] text-[#111111] py-2.5 rounded-2xl font-black transition-all text-xs flex items-center justify-center gap-1.5 active:scale-95 uppercase tracking-wider shadow-sm"
                    >
                      <span>✚ Nueva Orden</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* MODAL DE PEDIDOS PAUSADOS */}
      {modalPausadosAbierto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#FFC107]/20 relative animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setModalPausadosAbierto(false)} 
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:bg-[#FFF8F0] hover:text-[#B71C1C] transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-[#111111] font-serif uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FF9800]" />
                  <span>Pedidos en Espera</span>
                </h3>
                <p className="text-[11px] text-stone-500 mt-1 font-bold">
                  Lista de pedidos pausados temporalmente. Al recuperar un pedido, se cargará en la comanda actual.
                </p>
              </div>

              <div className="max-h-96 overflow-y-auto divide-y divide-[#E5E5E5] pr-1">
                {pedidosEnEspera.length === 0 ? (
                  <div className="text-center py-10 text-stone-400 text-xs font-black uppercase tracking-wider">
                    No hay pedidos en espera en este momento.
                  </div>
                ) : (
                  pedidosEnEspera.map((ped) => (
                    <div key={ped.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E5E5] last:border-0">
                      <div className="space-y-1">
                        <span className="font-black text-xs sm:text-sm text-[#111111] block">{ped.nombre}</span>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-stone-500 font-bold">
                          <span>Tipo: <strong className="text-[#333333]">{ped.tipoPedido}</strong></span>
                          {ped.mesaSeleccionada && (
                            <span>Mesa: <strong className="text-[#333333]">#{mesas.find(m => m.id.toString() === ped.mesaSeleccionada.toString())?.numero || ped.mesaSeleccionada}</strong></span>
                          )}
                          <span>Ítems: <strong className="text-[#333333]">{ped.carrito.reduce((sum, item) => sum + item.cantidad, 0)}</strong></span>
                          <span>Total: <strong className="text-[#B71C1C] font-black">{ped.total.toFixed(2)} Bs</strong></span>
                        </div>
                        {ped.observacionesGenerales && (
                          <p className="text-[10px] text-stone-400 italic">Notas: {ped.observacionesGenerales}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2 self-end sm:self-center">
                        <button
                          onClick={() => recuperarPedido(ped)}
                          className="bg-[#FFC107] hover:bg-[#FF9800] text-[#111111] px-3 py-1.5 rounded-xl text-xs font-black transition-all shadow-sm flex items-center gap-1 active:scale-95"
                        >
                          Recuperar
                        </button>
                        <button
                          onClick={() => eliminarPedidoPausado(ped.id)}
                          className="bg-red-50 hover:bg-red-100 text-[#D32F2F] p-1.5 rounded-xl border border-red-200 transition-colors"
                          title="Descartar Pedido"
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end pt-2 border-t border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => setModalPausadosAbierto(false)}
                  className="bg-[#FFF8F0] hover:bg-[#FFF3E0] text-[#7A0000] border border-[#FFC107]/20 px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95"
                >
                  Cerrar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE SELECCIÓN DE EXTRAS */}
      {modalExtrasAbierto && itemSeleccionadoExtras && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#FFC107]/20 relative animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => {
                setModalExtrasAbierto(false);
                setItemSeleccionadoExtras(null);
              }} 
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:bg-[#FFF8F0] hover:text-[#B71C1C] transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black text-[#111111] font-serif uppercase tracking-wide flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#FF9800]" />
                  <span>Extras para: {itemSeleccionadoExtras.nombre}</span>
                </h3>
                <p className="text-[11px] text-stone-500 mt-1 font-bold">
                  Selecciona los adicionales predefinidos o agrega uno personalizado. El precio del platillo aumentará según corresponda.
                </p>
              </div>

              {/* Lista de Extras Predefinidos */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-[#7A0000] uppercase tracking-widest">Adicionales Predefinidos</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 select-none">
                  {extrasPredefinidos.map((extra, idx) => {
                    const estaSeleccionado = extrasTemporales.some(e => e.nombre === extra.nombre);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleExtraPredefinido(extra)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all text-left active:scale-95 ${
                          estaSeleccionado
                            ? 'bg-[#FFF3E0] border-[#FFC107] text-[#7A0000] shadow-sm'
                            : 'bg-white border-[#E5E5E5] text-[#333333] hover:bg-[#FFF8F0]'
                        }`}
                      >
                        <span className="truncate">{extra.nombre}</span>
                        <span className="text-[#B71C1C] shrink-0 font-black ml-1">+{extra.precio} Bs</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Agregar Adicional Personalizado */}
              <div className="space-y-2 border-t border-[#E5E5E5] pt-3">
                <label className="block text-[10px] font-black text-[#7A0000] uppercase tracking-widest">Otro Adicional Personalizado</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej. Plátano Frito"
                    value={nuevoExtraNombre}
                    onChange={(e) => setNuevoExtraNombre(e.target.value)}
                    className="flex-1 bg-white border border-[#E5E5E5] rounded-xl px-2.5 py-2 text-xs font-bold text-[#111111] focus:outline-none focus:ring-4 focus:ring-[#B71C1C]/5 focus:border-[#B71C1C] transition-all"
                  />
                  <div className="relative w-24">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-stone-400">Bs</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      min="0"
                      value={nuevoExtraPrecio}
                      onChange={(e) => setNuevoExtraPrecio(e.target.value)}
                      className="w-full bg-white border border-[#E5E5E5] rounded-xl pl-7 pr-2.5 py-2 text-xs font-bold text-[#111111] focus:outline-none focus:ring-4 focus:ring-[#B71C1C]/5 focus:border-[#B71C1C] transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={agregarExtraPersonalizado}
                    className="bg-[#B71C1C] hover:bg-[#D32F2F] text-white px-3 py-2 rounded-xl text-xs font-black transition-all active:scale-95"
                  >
                    Añadir
                  </button>
                </div>
              </div>

              {/* Lista de Extras Seleccionados */}
              <div className="space-y-2 border-t border-[#E5E5E5] pt-3">
                <label className="block text-[10px] font-black text-[#7A0000] uppercase tracking-widest">Extras Activos</label>
                {extrasTemporales.length === 0 ? (
                  <p className="text-[10px] text-stone-400 italic font-bold">No hay adicionales seleccionados para este platillo.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {extrasTemporales.map((extra, idx) => (
                      <span
                        key={idx}
                        className="bg-[#FFF3E0] text-[#FF9800] border border-[#FFC107]/25 rounded-lg px-2 py-0.5 text-[10px] font-black flex items-center gap-1 shadow-sm animate-in fade-in duration-150"
                      >
                        <span>{extra.nombre} (+{extra.precio} Bs)</span>
                        <button
                          type="button"
                          onClick={() => eliminarExtraTemporal(extra.nombre)}
                          className="text-[#D32F2F] hover:text-[#B71C1C] font-black focus:outline-none ml-0.5"
                          title="Eliminar"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Acciones del Modal */}
              <div className="flex gap-2 pt-3 border-t border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => {
                    setModalExtrasAbierto(false);
                    setItemSeleccionadoExtras(null);
                  }}
                  className="flex-1 bg-[#FFF8F0] hover:bg-[#FFF3E0] text-[#7A0000] border border-[#FFC107]/20 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={guardarExtras}
                  className="flex-1 bg-[#B71C1C] hover:bg-[#D32F2F] text-white py-2.5 rounded-xl text-xs font-black transition-all shadow-sm active:scale-95"
                >
                  Guardar Cambios
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 6. MODAL CREAR/EDITAR MESA */}
      {modalMesaAbierto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#FFC107]/20 relative animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setModalMesaAbierto(false)} 
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:bg-[#FFF8F0] hover:text-[#B71C1C] transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleGuardarMesa} className="space-y-5">
              <div>
                <h3 className="text-base font-black text-[#111111] font-serif uppercase tracking-wide flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#FF9800]" />
                  <span>{mesaSeleccionadaEdicion ? `Editar Mesa ${mesaSeleccionadaEdicion.numero}` : 'Nueva Mesa'}</span>
                </h3>
                <p className="text-[11px] text-stone-500 mt-1 font-bold">
                  {mesaSeleccionadaEdicion ? 'Actualice el número identificador y la capacidad de la mesa.' : 'Ingrese el número identificador y la capacidad máxima de la mesa.'}
                </p>
              </div>

              {errorMesa && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 flex items-start gap-2 text-[11px] text-[#D32F2F] font-bold animate-shake">
                  <AlertCircle className="w-4 h-4 text-[#D32F2F] shrink-0 mt-0.5" />
                  <span>{errorMesa}</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="input-numero-mesa" className="block text-[10px] font-black text-[#7A0000] uppercase tracking-widest">Número de Mesa</label>
                  <input 
                    id="input-numero-mesa"
                    type="number"
                    min="1"
                    placeholder="Ej. 5"
                    value={numeroMesa}
                    onChange={(e) => setNumeroMesa(e.target.value)}
                    required
                    className="w-full bg-white border border-[#E5E5E5] rounded-xl p-2.5 text-xs font-bold text-[#111111] focus:outline-none focus:ring-4 focus:ring-[#B71C1C]/5 focus:border-[#B71C1C] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="input-capacidad-mesa" className="block text-[10px] font-black text-[#7A0000] uppercase tracking-widest">Capacidad (Personas)</label>
                  <input 
                    id="input-capacidad-mesa"
                    type="number"
                    min="1"
                    placeholder="Ej. 4"
                    value={capacidadMesa}
                    onChange={(e) => setCapacidadMesa(e.target.value)}
                    required
                    className="w-full bg-white border border-[#E5E5E5] rounded-xl p-2.5 text-xs font-bold text-[#111111] focus:outline-none focus:ring-4 focus:ring-[#B71C1C]/5 focus:border-[#B71C1C] transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalMesaAbierto(false)}
                  className="flex-1 bg-[#FFF8F0] hover:bg-[#FFF3E0] text-[#7A0000] border border-[#FFC107]/20 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-guardar-mesa"
                  disabled={guardandoMesa}
                  className={`flex-1 text-white py-2.5 rounded-xl text-xs font-black transition-all shadow-sm active:scale-95 ${
                    guardandoMesa ? 'bg-[#D32F2F]/70 cursor-not-allowed' : 'bg-[#B71C1C] hover:bg-[#D32F2F] shadow-sm'
                  }`}
                >
                  {guardandoMesa ? 'Guardando...' : 'Guardar Mesa'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default CajaPOS;
