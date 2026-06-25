import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Tags, 
  ClipboardList, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Image, 
  AlertTriangle, 
  TrendingUp, 
  Box, 
  Loader2,
  Sparkles,
  Eye,
  Palette,
  Users,
  UserPlus,
  Calculator,
  FileText,
  Printer,
  Calendar
} from 'lucide-react';

const AdminDashboard = () => {
  const [vistaActual, setVistaActual] = useState('dashboard');
  
  // Datos principales
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [inventarios, setInventarios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [extras, setExtras] = useState([]);
  
  // Estados para Cierres de Caja
  const [conteoCierresActivos, setConteoCierresActivos] = useState(0);
  const [reportesCierre, setReportesCierre] = useState([]);
  const [filtroCierreFechaInicio, setFiltroCierreFechaInicio] = useState('');
  const [filtroCierreFechaFin, setFiltroCierreFechaFin] = useState('');
  const [busquedaCierre, setBusquedaCierre] = useState('');
  const [modalCierreDetalleAbierto, setModalCierreDetalleAbierto] = useState(false);
  const [cierreSeleccionado, setCierreSeleccionado] = useState(null);
  const [modalConsolidacionAbierto, setModalConsolidacionAbierto] = useState(false);
  const [consolidadoData, setConsolidadoData] = useState(null);
  const [cargandoConsolidacion, setCargandoConsolidacion] = useState(false);
  
  // Estados de carga y error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Búsqueda y filtrado
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [busquedaUsuario, setBusquedaUsuario] = useState('');
  
  // Modales
  const [modalProductoAbierto, setModalProductoAbierto] = useState(false);
  const [modalEntradaAbierto, setModalEntradaAbierto] = useState(false);
  const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState(false);
  const [modalExtraAbierto, setModalExtraAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [extraSeleccionado, setExtraSeleccionado] = useState(null);

  // Formulario Extra
  const [nombreExtra, setNombreExtra] = useState('');
  const [precioExtra, setPrecioExtra] = useState('');
  const [guardandoExtra, setGuardandoExtra] = useState(false);
  
  // Formulario Producto
  const [nombreProd, setNombreProd] = useState('');
  const [descProd, setDescProd] = useState('');
  const [precioProd, setPrecioProd] = useState('');
  const [categoriaProd, setCategoriaProd] = useState('');
  const [disponibleProd, setDisponibleProd] = useState(true);
  const [controlaStockProd, setControlaStockProd] = useState(false);
  const [fotoFile, setFotoFile] = useState(null);
  const [subiendoProd, setSubiendoProd] = useState(false);

  // Formulario Categoría
  const [nuevaCatNombre, setNuevaCatNombre] = useState('');
  const [creandoCat, setCreandoCat] = useState(false);

  // Formulario Entrada Inventario
  const [cantidadEntrada, setCantidadEntrada] = useState('');
  const [stockMinimoEntrada, setStockMinimoEntrada] = useState('5');
  const [registrandoEntrada, setRegistrandoEntrada] = useState(false);

  // Formulario Usuario
  const [nombreUser, setNombreUser] = useState('');
  const [passwordUser, setPasswordUser] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const [rolUser, setRolUser] = useState('');
  const [estadoUser, setEstadoUser] = useState(true);
  const [guardandoUsuario, setGuardandoUsuario] = useState(false);

  // Formulario Personalización Página Principal
  const [nombreRest, setNombreRest] = useState('La Reconciliación');
  const [tituloHero, setTituloHero] = useState('Bienvenidos a La Reconciliación');
  const [descHero, setDescHero] = useState('');
  const [horarioRest, setHorarioRest] = useState('Lun - Dom: 18:00 - 23:30');
  const [direccionRest, setDireccionRest] = useState('Av. Principal #450, Zona Central');
  const [telefonoRest, setTelefonoRest] = useState('+591 77889900');
  const [tiempoEntrega, setTiempoEntrega] = useState('30 min');
  const [ratingRest, setRatingRest] = useState('4.9');
  const [linkFacebook, setLinkFacebook] = useState('https://facebook.com');
  const [linkWhatsapp, setLinkWhatsapp] = useState('https://wa.me/59177889900');
  const [linkInstagram, setLinkInstagram] = useState('https://instagram.com');
  const [linkTiktok, setLinkTiktok] = useState('https://tiktok.com');
  const [horarioSemana, setHorarioSemana] = useState('18:00 - 23:00');
  const [horarioSabado, setHorarioSabado] = useState('12:00 - 23:30');
  const [horarioDomingo, setHorarioDomingo] = useState('12:00 - 22:00');
  const [estaAbierto, setEstaAbierto] = useState(true);
  const [colorTema, setColorTema] = useState('orange');
  const [prodDestacado1, setProdDestacado1] = useState('');
  const [prodDestacado2, setProdDestacado2] = useState('');
  const [guardandoConfig, setGuardandoConfig] = useState(false);

  // Configuración QR
  const [configuracionQrId, setConfiguracionQrId] = useState(null);
  const [imagenQrUrl, setImagenQrUrl] = useState('');
  const [imagenQrFile, setImagenQrFile] = useState(null);
  const [guardandoQr, setGuardandoQr] = useState(false);

  const themeClasses = {
    orange: {
      primary: 'bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white active:scale-98 transition-all shadow-md',
      primaryText: 'text-[#B71C1C]',
      primaryTextDark: 'text-[#7A0000]',
      primaryBgLight: 'bg-[#FFF8F0] hover:bg-[#FFF3E0] text-[#7A0000] border border-[#FFC107]/30 transition-colors',
      activeSidebar: 'bg-gradient-to-r from-[#7A0000] to-[#B71C1C] text-white shadow-md font-bold',
      focusBorder: 'focus:border-[#B71C1C] focus:ring-[#B71C1C]/10',
      loadingText: 'text-[#B71C1C]',
      kpiIconBg: 'bg-[#FFF3E0] p-4 rounded-xl text-[#FF9800]',
      borderAccent: 'border-[#FFC107]/20',
      hoverText: 'hover:text-[#B71C1C]',
      activeToggle: 'text-[#B71C1C] focus:ring-[#B71c1c]/10',
      fileButton: 'file:bg-[#FFF3E0] file:text-[#B71C1C] hover:file:bg-[#FFF8F0]'
    },
    blue: {
      primary: 'bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white active:scale-98 transition-all shadow-md',
      primaryText: 'text-[#B71C1C]',
      primaryTextDark: 'text-[#7A0000]',
      primaryBgLight: 'bg-[#FFF8F0] hover:bg-[#FFF3E0] text-[#7A0000] border border-[#FFC107]/30 transition-colors',
      activeSidebar: 'bg-gradient-to-r from-[#7A0000] to-[#B71C1C] text-white shadow-md font-bold',
      focusBorder: 'focus:border-[#B71C1C] focus:ring-[#B71C1C]/10',
      loadingText: 'text-[#B71C1C]',
      kpiIconBg: 'bg-[#FFF3E0] p-4 rounded-xl text-[#FF9800]',
      borderAccent: 'border-[#FFC107]/20',
      hoverText: 'hover:text-[#B71C1C]',
      activeToggle: 'text-[#B71C1C] focus:ring-[#B71c1c]/10',
      fileButton: 'file:bg-[#FFF3E0] file:text-[#B71C1C] hover:file:bg-[#FFF8F0]'
    },
    green: {
      primary: 'bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white active:scale-98 transition-all shadow-md',
      primaryText: 'text-[#B71C1C]',
      primaryTextDark: 'text-[#7A0000]',
      primaryBgLight: 'bg-[#FFF8F0] hover:bg-[#FFF3E0] text-[#7A0000] border border-[#FFC107]/30 transition-colors',
      activeSidebar: 'bg-gradient-to-r from-[#7A0000] to-[#B71C1C] text-white shadow-md font-bold',
      focusBorder: 'focus:border-[#B71C1C] focus:ring-[#B71C1C]/10',
      loadingText: 'text-[#B71C1C]',
      kpiIconBg: 'bg-[#FFF3E0] p-4 rounded-xl text-[#FF9800]',
      borderAccent: 'border-[#FFC107]/20',
      hoverText: 'hover:text-[#B71C1C]',
      activeToggle: 'text-[#B71C1C] focus:ring-[#B71c1c]/10',
      fileButton: 'file:bg-[#FFF3E0] file:text-[#B71C1C] hover:file:bg-[#FFF8F0]'
    },
    purple: {
      primary: 'bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white active:scale-98 transition-all shadow-md',
      primaryText: 'text-[#B71C1C]',
      primaryTextDark: 'text-[#7A0000]',
      primaryBgLight: 'bg-[#FFF8F0] hover:bg-[#FFF3E0] text-[#7A0000] border border-[#FFC107]/30 transition-colors',
      activeSidebar: 'bg-gradient-to-r from-[#7A0000] to-[#B71C1C] text-white shadow-md font-bold',
      focusBorder: 'focus:border-[#B71C1C] focus:ring-[#B71C1C]/10',
      loadingText: 'text-[#B71C1C]',
      kpiIconBg: 'bg-[#FFF3E0] p-4 rounded-xl text-[#FF9800]',
      borderAccent: 'border-[#FFC107]/20',
      hoverText: 'hover:text-[#B71C1C]',
      activeToggle: 'text-[#B71C1C] focus:ring-[#B71c1c]/10',
      fileButton: 'file:bg-[#FFF3E0] file:text-[#B71C1C] hover:file:bg-[#FFF8F0]'
    },
    red: {
      primary: 'bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white active:scale-98 transition-all shadow-md',
      primaryText: 'text-[#B71C1C]',
      primaryTextDark: 'text-[#7A0000]',
      primaryBgLight: 'bg-[#FFF8F0] hover:bg-[#FFF3E0] text-[#7A0000] border border-[#FFC107]/30 transition-colors',
      activeSidebar: 'bg-gradient-to-r from-[#7A0000] to-[#B71C1C] text-white shadow-md font-bold',
      focusBorder: 'focus:border-[#B71C1C] focus:ring-[#B71C1C]/10',
      loadingText: 'text-[#B71C1C]',
      kpiIconBg: 'bg-[#FFF3E0] p-4 rounded-xl text-[#FF9800]',
      borderAccent: 'border-[#FFC107]/20',
      hoverText: 'hover:text-[#B71C1C]',
      activeToggle: 'text-[#B71C1C] focus:ring-[#B71c1c]/10',
      fileButton: 'file:bg-[#FFF3E0] file:text-[#B71C1C] hover:file:bg-[#FFF8F0]'
    },
    claro_elegante: {
      primary: 'bg-[#333333] hover:bg-[#111111] text-white active:scale-98 transition-all shadow-md',
      primaryText: 'text-[#333333]',
      primaryTextDark: 'text-[#111111]',
      primaryBgLight: 'bg-[#E5E5E5] hover:bg-stone-200 text-[#111111] border border-stone-300 transition-colors',
      activeSidebar: 'bg-[#333333] text-white shadow-md font-bold',
      focusBorder: 'focus:border-[#333333] focus:ring-[#333333]/10',
      loadingText: 'text-[#333333]',
      kpiIconBg: 'bg-[#E5E5E5] p-4 rounded-xl text-[#333333]',
      borderAccent: 'border-stone-300',
      hoverText: 'hover:text-[#111111]',
      activeToggle: 'text-[#111111] focus:ring-[#111111]/10',
      fileButton: 'file:bg-[#E5E5E5] file:text-[#111111] hover:file:bg-[#FFF]'
    }
  };

  const theme = themeClasses[colorTema] || themeClasses.orange;

  // Cargar datos al montar y al cambiar vistas si es necesario
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resProd, resCat, resInv, resConf, resUser, resRol, resExtra, resConfDb, resCierreConteo, resCierresList] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/productos/'),
        axios.get('http://127.0.0.1:8000/api/categorias/'),
        axios.get('http://127.0.0.1:8000/api/inventarios/'),
        axios.get('http://127.0.0.1:8000/api/configuracion/'),
        axios.get('http://127.0.0.1:8000/api/usuarios/'),
        axios.get('http://127.0.0.1:8000/api/roles/'),
        axios.get('http://127.0.0.1:8000/api/extras/'),
        axios.get('http://127.0.0.1:8000/api/configuraciones/'),
        axios.get('http://127.0.0.1:8000/api/reportes-cierre/conteo/'),
        axios.get('http://127.0.0.1:8000/api/reportes-cierre/')
      ]);
      setProductos(resProd.data);
      setCategorias(resCat.data);
      setInventarios(resInv.data);
      setUsuarios(resUser.data);
      setRoles(resRol.data);
      setExtras(resExtra.data);
      setConteoCierresActivos(resCierreConteo.data.conteo_activo || 0);
      setReportesCierre(resCierresList.data || []);

      if (resConfDb.data && resConfDb.data.length > 0) {
        setConfiguracionQrId(resConfDb.data[0].id);
        setImagenQrUrl(resConfDb.data[0].imagen_qr);
      }
      
      // Cargar configuraciones del sitio
      setNombreRest(resConf.data.nombre_restaurante);
      setTituloHero(resConf.data.titulo_hero);
      setDescHero(resConf.data.descripcion_hero);
      setHorarioRest(resConf.data.horario);
      setDireccionRest(resConf.data.direccion);
      setTelefonoRest(resConf.data.telefono || '+591 77889900');
      setTiempoEntrega(resConf.data.tiempo_entrega || '30 min');
      setRatingRest(resConf.data.rating || '4.9');
      setLinkFacebook(resConf.data.link_facebook || 'https://facebook.com');
      setLinkWhatsapp(resConf.data.link_whatsapp || 'https://wa.me/59177889900');
      setLinkInstagram(resConf.data.link_instagram || 'https://instagram.com');
      setLinkTiktok(resConf.data.link_tiktok || 'https://tiktok.com');
      setHorarioSemana(resConf.data.horario_semana || '18:00 - 23:00');
      setHorarioSabado(resConf.data.horario_sabado || '12:00 - 23:30');
      setHorarioDomingo(resConf.data.horario_domingo || '12:00 - 22:00');
      setEstaAbierto(resConf.data.esta_abierto !== undefined ? resConf.data.esta_abierto : true);
      setColorTema(resConf.data.color_tema);
      setProdDestacado1(resConf.data.producto_destacado_1 || '');
      setProdDestacado2(resConf.data.producto_destacado_2 || '');
      
      setError(null);
    } catch (err) {
      console.error('Error al cargar datos del panel de administración:', err);
      setError('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarConfiguracion = async (e) => {
    e.preventDefault();
    try {
      setGuardandoConfig(true);
      await axios.post('http://127.0.0.1:8000/api/configuracion/', {
        nombre_restaurante: nombreRest,
        titulo_hero: tituloHero,
        descripcion_hero: descHero,
        horario: horarioRest,
        direccion: direccionRest,
        color_tema: colorTema,
        telefono: telefonoRest,
        tiempo_entrega: tiempoEntrega,
        rating: ratingRest,
        link_facebook: linkFacebook,
        link_whatsapp: linkWhatsapp,
        link_instagram: linkInstagram,
        link_tiktok: linkTiktok,
        horario_semana: horarioSemana,
        horario_sabado: horarioSabado,
        horario_domingo: horarioDomingo,
        esta_abierto: estaAbierto,
        producto_destacado_1: prodDestacado1,
        producto_destacado_2: prodDestacado2
      });
      window.dispatchEvent(new Event('config-updated'));
      alert('Configuración de la página principal guardada exitosamente.');
    } catch (err) {
      console.error('Error al guardar configuración:', err);
      alert('Hubo un error al guardar la configuración del sitio.');
    } finally {
      setGuardandoConfig(false);
    }
  };

  const handleGuardarQr = async (e) => {
    e.preventDefault();
    if (!imagenQrFile) {
      alert('Por favor selecciona una imagen de código QR.');
      return;
    }
    try {
      setGuardandoQr(true);
      const formData = new FormData();
      formData.append('imagen_qr', imagenQrFile);
      
      let res;
      if (configuracionQrId) {
        res = await axios.patch(`http://127.0.0.1:8000/api/configuraciones/${configuracionQrId}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await axios.post('http://127.0.0.1:8000/api/configuraciones/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setConfiguracionQrId(res.data.id);
      }
      setImagenQrUrl(res.data.imagen_qr);
      setImagenQrFile(null);
      alert('Imagen QR guardada exitosamente.');
    } catch (err) {
      console.error('Error al guardar QR:', err);
      alert('Hubo un error al guardar el código QR.');
    } finally {
      setGuardandoQr(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const prepararConsolidacion = () => {
    if (conteoCierresActivos === 0) {
      alert("No hay reportes de caja activos para consolidar.");
      return;
    }
    if (window.confirm(`¿Está seguro de que desea consolidar los ${conteoCierresActivos} reportes activos? Esto los archivará de la vista de conteo.`)) {
      ejecutarConsolidacion();
    }
  };

  const ejecutarConsolidacion = async () => {
    try {
      setCargandoConsolidacion(true);
      const res = await axios.post('http://127.0.0.1:8000/api/reportes-cierre/consolidar/');
      setConsolidadoData(res.data);
      setModalConsolidacionAbierto(true);
      // Recargar datos para actualizar el conteo
      const resConteo = await axios.get('http://127.0.0.1:8000/api/reportes-cierre/conteo/');
      setConteoCierresActivos(resConteo.data.conteo_activo || 0);
      const resCierresList = await axios.get('http://127.0.0.1:8000/api/reportes-cierre/');
      setReportesCierre(resCierresList.data || []);
    } catch (err) {
      console.error("Error al consolidar gestión:", err);
      alert("Hubo un error al realizar la consolidación de caja.");
    } finally {
      setCargandoConsolidacion(false);
    }
  };

  const imprimirConsolidado = () => {
    if (!consolidadoData) return;
    const fechaHora = new Date().toLocaleString();
    const rangeInicio = new Date(consolidadoData.fecha_inicio).toLocaleDateString();
    const rangeFin = new Date(consolidadoData.fecha_fin).toLocaleDateString();

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
          <title>Reporte de Consolidación de Gestión</title>
          <style>
            body { font-family: Arial, sans-serif; color: #000; padding: 20px; line-height: 1.4; font-size: 12px; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { margin: 0; font-size: 18px; text-transform: uppercase; }
            .header p { margin: 4px 0; font-size: 11px; color: #555; }
            .section { margin-bottom: 18px; }
            .section-title { font-size: 13px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 8px; text-transform: uppercase; }
            .info-item { display: flex; justify-content: space-between; padding: 3px 0; }
            .info-item.bold { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 5px; }
            th, td { text-align: left; padding: 6px; border-bottom: 1px solid #ddd; font-size: 11px; }
            th { background-color: #f2f2f2; font-weight: bold; }
            @media print {
              body { padding: 0; }
              iframe { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Reporte de Consolidación de Gestión</h1>
            <p>Periodo: ${rangeInicio} - ${rangeFin}</p>
            <p>Generado el: ${fechaHora}</p>
          </div>

          <div class="section">
            <div class="section-title">Resumen de Consolidación</div>
            <div style="max-width: 400px;">
              <div class="info-item"><span>Reportes Consolidados:</span> <strong>${consolidadoData.total_reportes_consolidados}</strong></div>
              <div class="info-item"><span>Total Generado QR:</span> <span>${consolidadoData.total_qr.toFixed(2)} Bs</span></div>
              <div class="info-item"><span>Total Generado Efectivo:</span> <span>${consolidadoData.total_efectivo.toFixed(2)} Bs</span></div>
              <div class="info-item bold" style="border-top: 1px solid #000; padding-top: 4px;">
                <span>Total de Ingresos:</span>
                <span>${consolidadoData.total_ingreso_general.toFixed(2)} Bs</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Top Productos por Ingresos</div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Platillo / Producto</th>
                  <th style="text-align: right;">Ingreso Total</th>
                </tr>
              </thead>
              <tbody>
                ${consolidadoData.top_productos.map((p, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${p.producto}</td>
                    <td style="text-align: right;">${p.total_ingreso.toFixed(2)} Bs</td>
                  </tr>
                `).join('')}
                ${consolidadoData.top_productos.length === 0 ? '<tr><td colspan="3" style="text-align: center;">No hay información disponible</td></tr>' : ''}
              </tbody>
            </table>
          </div>

          <div style="margin-top: 60px; text-align: center;">
            <p style="font-size: 11px;">Consolidado y Archivado Exitosamente.</p>
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

  const imprimirReporteCierreIndividual = (rep) => {
    const fechaHora = new Date(rep.fecha_cierre).toLocaleString();
    const movementsList = rep.detalle_movimientos || [];
    const cashList = rep.detalle_efectivo || {};
    const ventas = movementsList.filter(m => m.type !== 'Anulacion');
    const anulaciones = movementsList.filter(m => m.type === 'Anulacion');

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
              <div class="info-item"><span>Cajero:</span> <strong>${rep.cajero}</strong></div>
              <div class="info-item"><span>Turno:</span> <strong>${rep.turno_descripcion}</strong></div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Resumen Financiero</div>
            <div style="max-width: 400px;">
              <div class="info-item"><span>Fondo Inicial:</span> <span>${parseFloat(rep.fondo_inicial).toFixed(2)} Bs</span></div>
              <div class="info-item"><span>Total Ventas QR:</span> <span>${parseFloat(rep.total_qr).toFixed(2)} Bs</span></div>
              <div class="info-item"><span>Total Ventas Efectivo:</span> <span>${parseFloat(rep.total_efectivo).toFixed(2)} Bs</span></div>
              <div class="info-item"><span>Total Ventas (General):</span> <span>${parseFloat(rep.total_ventas).toFixed(2)} Bs</span></div>
              <div class="info-item" style="border-top: 1px dashed #000; padding-top: 4px;"><span>Efectivo Esperado:</span> <span>${parseFloat(rep.efectivo_esperado).toFixed(2)} Bs</span></div>
              <div class="info-item"><span>Efectivo Contado:</span> <span>${parseFloat(rep.efectivo_contado).toFixed(2)} Bs</span></div>
              <div class="info-item bold" style="border-top: 1px solid #000; padding-top: 4px;">
                <span>Diferencia:</span> 
                <span>${parseFloat(rep.diferencia) > 0 ? '+' : ''}${parseFloat(rep.diferencia).toFixed(2)} Bs</span>
              </div>
            </div>
            ${rep.notas ? `
              <div style="margin-top: 8px; padding: 6px; border: 1px solid #ddd; background-color: #fafafa; font-size: 11px;">
                <strong>Nota Explicativa por Diferencia:</strong><br/>
                ${rep.notas}
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

  // Mapear id de categoría a nombre
  const obtenerNombreCategoria = (categoriaId) => {
    const cat = categorias.find(c => c.id === categoriaId);
    return cat ? cat.nombre : 'General';
  };

  // Obtener inventario de un producto
  const obtenerInventarioProducto = (productoId) => {
    return inventarios.find(inv => inv.producto === productoId);
  };

  // ==========================================
  // LOGICA CATEGORIAS
  // ==========================================
  const handleCrearCategoria = async (e) => {
    e.preventDefault();
    if (!nuevaCatNombre.trim()) return;

    try {
      setCreandoCat(true);
      const response = await axios.post('http://127.0.0.1:8000/api/categorias/', {
        nombre: nuevaCatNombre
      });
      setCategorias(prev => [...prev, response.data]);
      setNuevaCatNombre('');
      alert('Categoría creada exitosamente.');
    } catch (err) {
      console.error('Error al crear categoría:', err);
      alert('Error al crear categoría. Asegúrate de que no exista una con el mismo nombre.');
    } finally {
      setCreandoCat(false);
    }
  };

  const handleEliminarCategoria = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría? Los productos asociados podrían dar error.')) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/categorias/${id}/`);
      setCategorias(prev => prev.filter(c => c.id !== id));
      alert('Categoría eliminada.');
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
      alert('No se pudo eliminar la categoría. Probablemente tiene productos vinculados que la protegen.');
    }
  };

  // ==========================================
  // LOGICA PRODUCTOS
  // ==========================================
  const abrirModalCrearProducto = () => {
    setProductoSeleccionado(null);
    setNombreProd('');
    setDescProd('');
    setPrecioProd('');
    setCategoriaProd(categorias[0]?.id || '');
    setDisponibleProd(true);
    setControlaStockProd(false);
    setFotoFile(null);
    setModalProductoAbierto(true);
  };

  const abrirModalEditarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setNombreProd(producto.nombre);
    setDescProd(producto.descripcion || '');
    setPrecioProd(producto.precio);
    setCategoriaProd(producto.categoria);
    setDisponibleProd(producto.disponible);
    setControlaStockProd(producto.controla_stock);
    setFotoFile(null); // No cambiar la foto a menos que seleccione una nueva
    setModalProductoAbierto(true);
  };

  const handleGuardarProducto = async (e) => {
    e.preventDefault();
    if (!nombreProd.trim() || !precioProd || !categoriaProd) {
      alert('Por favor, completa los campos requeridos (Nombre, Precio, Categoría).');
      return;
    }

    try {
      setSubiendoProd(true);
      const formData = new FormData();
      formData.append('nombre', nombreProd);
      formData.append('descripcion', descProd);
      formData.append('precio', parseFloat(precioProd).toFixed(2));
      formData.append('categoria', categoriaProd);
      formData.append('disponible', disponibleProd);
      formData.append('controla_stock', controlaStockProd);
      
      if (fotoFile) {
        formData.append('fotografia', fotoFile);
      }

      let response;
      if (productoSeleccionado) {
        // PATCH para actualizar
        response = await axios.patch(`http://127.0.0.1:8000/api/productos/${productoSeleccionado.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setProductos(prev => prev.map(p => p.id === productoSeleccionado.id ? response.data : p));
        alert('Producto actualizado exitosamente.');
      } else {
        // POST para crear
        response = await axios.post('http://127.0.0.1:8000/api/productos/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setProductos(prev => [...prev, response.data]);
        alert('Producto registrado exitosamente.');
      }

      setModalProductoAbierto(false);
      // Recargar datos para asegurar consistencia
      cargarDatos();
    } catch (err) {
      console.error('Error al guardar producto:', err);
      alert('Ocurrió un error al guardar el producto. Verifica los datos.');
    } finally {
      setSubiendoProd(false);
    }
  };

  const handleEliminarProducto = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/productos/${id}/`);
      setProductos(prev => prev.filter(p => p.id !== id));
      alert('Producto eliminado.');
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      alert('No se pudo eliminar el producto.');
    }
  };

  const handleToggleDisponible = async (producto) => {
    try {
      const nuevoEstado = !producto.disponible;
      const response = await axios.patch(`http://127.0.0.1:8000/api/productos/${producto.id}/`, {
        disponible: nuevoEstado
      });
      setProductos(prev => prev.map(p => p.id === producto.id ? { ...p, disponible: response.data.disponible } : p));
    } catch (err) {
      console.error('Error al cambiar disponibilidad:', err);
      alert('No se pudo cambiar el estado de disponibilidad.');
    }
  };

  // ==========================================
  // LOGICA USUARIOS
  // ==========================================
  const obtenerNombreRol = (rolId) => {
    const rol = roles.find(r => r.id === rolId);
    return rol ? rol.nombre : 'Sin Rol';
  };

  const abrirModalCrearUsuario = () => {
    setUsuarioSeleccionado(null);
    setNombreUser('');
    setPasswordUser('');
    setEmailUser('');
    setRolUser(roles[0]?.id || '');
    setEstadoUser(true);
    setModalUsuarioAbierto(true);
  };

  const abrirModalEditarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setNombreUser(usuario.username);
    setPasswordUser(''); // Contraseña oculta por defecto al editar
    setEmailUser(usuario.email || '');
    setRolUser(usuario.rol || '');
    setEstadoUser(usuario.estado);
    setModalUsuarioAbierto(true);
  };

  const handleGuardarUsuario = async (e) => {
    if (e) e.preventDefault();
    if (!nombreUser.trim() || (!usuarioSeleccionado && !passwordUser)) {
      alert('Por favor, completa los campos requeridos (Nombre de Usuario y Contraseña).');
      return;
    }

    try {
      setGuardandoUsuario(true);
      const payload = {
        username: nombreUser,
        email: emailUser,
        rol: rolUser ? parseInt(rolUser) : null,
        estado: estadoUser,
        is_active: estadoUser // sincronizar con el estado de Django AbstractUser
      };

      if (passwordUser) {
        payload.password = passwordUser;
      }

      if (usuarioSeleccionado) {
        // PATCH para actualizar usuario
        const res = await axios.patch(`http://127.0.0.1:8000/api/usuarios/${usuarioSeleccionado.id}/`, payload);
        setUsuarios(prev => prev.map(u => u.id === usuarioSeleccionado.id ? res.data : u));
        alert('Usuario actualizado exitosamente.');
      } else {
        // POST para registrar usuario
        const res = await axios.post('http://127.0.0.1:8000/api/usuarios/', payload);
        setUsuarios(prev => [...prev, res.data]);
        alert('Usuario registrado exitosamente.');
      }
      setModalUsuarioAbierto(false);
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.username) {
          alert('Error: El nombre de usuario ya está registrado o contiene caracteres inválidos.');
        } else if (errorData.detail) {
          alert(errorData.detail);
        } else {
          alert('Error al procesar la solicitud. Verifica los campos ingresados.');
        }
      } else {
        alert('Error de red al intentar guardar el usuario.');
      }
    } finally {
      setGuardandoUsuario(false);
    }
  };

  const handleEliminarUsuario = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta cuenta de usuario? Esta acción es irreversible.')) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/usuarios/${id}/`);
      setUsuarios(prev => prev.filter(u => u.id !== id));
      alert('Usuario eliminado correctamente.');
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      alert('No se pudo eliminar el usuario.');
    }
  };

  const handleToggleEstadoUsuario = async (usuario) => {
    const savedUser = localStorage.getItem('authUser');
    const currentUser = savedUser ? JSON.parse(savedUser) : null;
    if (currentUser && currentUser.id === usuario.id) {
      alert('No puedes deshabilitar tu propia cuenta mientras tienes la sesión iniciada.');
      return;
    }

    try {
      const nuevoEstado = !usuario.estado;
      const res = await axios.patch(`http://127.0.0.1:8000/api/usuarios/${usuario.id}/`, {
        estado: nuevoEstado,
        is_active: nuevoEstado
      });
      setUsuarios(prev => prev.map(u => u.id === usuario.id ? { ...u, estado: res.data.estado, is_active: res.data.is_active } : u));
    } catch (err) {
      console.error('Error al alternar estado de usuario:', err);
      alert('No se pudo modificar el estado de habilitación de la cuenta.');
    }
  };


  // ==========================================
  // LOGICA EXTRAS (ADICIONALES)
  // ==========================================
  const abrirModalCrearExtra = () => {
    setExtraSeleccionado(null);
    setNombreExtra('');
    setPrecioExtra('');
    setModalExtraAbierto(true);
  };

  const abrirModalEditarExtra = (extra) => {
    setExtraSeleccionado(extra);
    setNombreExtra(extra.nombre);
    setPrecioExtra(extra.precio);
    setModalExtraAbierto(true);
  };

  const handleGuardarExtra = async (e) => {
    e.preventDefault();
    if (!nombreExtra.trim() || !precioExtra) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      setGuardandoExtra(true);
      const payload = {
        nombre: nombreExtra.trim(),
        precio: parseFloat(precioExtra).toFixed(2)
      };

      if (extraSeleccionado) {
        // PATCH
        const res = await axios.patch(`http://127.0.0.1:8000/api/extras/${extraSeleccionado.id}/`, payload);
        setExtras(prev => prev.map(e => e.id === extraSeleccionado.id ? res.data : e));
        alert('Adicional actualizado exitosamente.');
      } else {
        // POST
        const res = await axios.post('http://127.0.0.1:8000/api/extras/', payload);
        setExtras(prev => [...prev, res.data]);
        alert('Adicional creado exitosamente.');
      }
      setModalExtraAbierto(false);
      setExtraSeleccionado(null);
      setNombreExtra('');
      setPrecioExtra('');
    } catch (err) {
      console.error('Error al guardar adicional:', err);
      alert('Hubo un error al guardar el adicional. Verifica que el nombre no esté duplicado.');
    } finally {
      setGuardandoExtra(false);
    }
  };

  const handleEliminarExtra = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este adicional?')) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/extras/${id}/`);
      setExtras(prev => prev.filter(e => e.id !== id));
      alert('Adicional eliminado correctamente.');
    } catch (err) {
      console.error('Error al eliminar adicional:', err);
      alert('No se pudo eliminar el adicional.');
    }
  };


  // ==========================================
  // LOGICA INVENTARIO
  // ==========================================
  const abrirModalEntrada = (producto) => {
    setProductoSeleccionado(producto);
    const inv = obtenerInventarioProducto(producto.id);
    setCantidadEntrada('');
    setStockMinimoEntrada(inv ? inv.stock_minimo.toString() : '5');
    setModalEntradaAbierto(true);
  };

  const handleRegistrarEntrada = async (e) => {
    e.preventDefault();
    if (!cantidadEntrada || parseInt(cantidadEntrada) <= 0) {
      alert('Por favor ingresa una cantidad válida mayor a cero.');
      return;
    }

    try {
      setRegistrandoEntrada(true);
      const invExistente = obtenerInventarioProducto(productoSeleccionado.id);
      const cantidadSumar = parseInt(cantidadEntrada);
      const minStock = parseInt(stockMinimoEntrada) || 0;
      
      let invId;
      let nuevaCantidad = cantidadSumar;

      if (invExistente) {
        invId = invExistente.id;
        nuevaCantidad = invExistente.cantidad_actual + cantidadSumar;
        
        // 1. PATCH a /api/inventarios/{id}/
        await axios.patch(`http://127.0.0.1:8000/api/inventarios/${invId}/`, {
          cantidad_actual: nuevaCantidad,
          stock_minimo: minStock
        });
      } else {
        // 1. POST a /api/inventarios/
        const resNuevoInv = await axios.post('http://127.0.0.1:8000/api/inventarios/', {
          producto: productoSeleccionado.id,
          cantidad_actual: nuevaCantidad,
          stock_minimo: minStock
        });
        invId = resNuevoInv.data.id;
      }

      // 2. POST a /api/movimientos-inventario/ para registrar la entrada
      await axios.post('http://127.0.0.1:8000/api/movimientos-inventario/', {
        inventario: invId,
        tipo: 'Entrada',
        cantidad: cantidadSumar
      });

      alert(`Se registraron +${cantidadSumar} unidades en el stock de ${productoSeleccionado.nombre}.`);
      setModalEntradaAbierto(false);
      cargarDatos(); // Recargar inventarios y productos
    } catch (err) {
      console.error('Error al registrar movimiento de inventario:', err);
      alert('Hubo un error al procesar el inventario.');
    } finally {
      setRegistrandoEntrada(false);
    }
  };

  // Filtrado de productos en la vista CRUD de productos
  const productosFiltrados = productos.filter(p => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                             p.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCat = filtroCategoria === 'Todas' || obtenerNombreCategoria(p.categoria) === filtroCategoria;
    return coincideBusqueda && coincideCat;
  });

  // Filtrado de productos para la vista de Inventario (solo controla_stock === true)
  const productosInventario = productos.filter(p => p.controla_stock);

  // Alertas de stock bajo
  const inventariosBajoStock = inventarios.filter(inv => {
    const prod = productos.find(p => p.id === inv.producto);
    return prod && inv.cantidad_actual <= inv.stock_minimo;
  });

  return (
    <div className="h-[calc(100vh-5rem)] flex bg-[#FFF8F0]/30 overflow-hidden font-sans">
      
      {/* SIDEBAR (250px) */}
      <aside className="w-64 bg-[#111111] text-stone-300 flex flex-col justify-between shrink-0 shadow-2xl z-10 border-r border-[#FFC107]/10">
        <div className="flex flex-col">
          {/* Menú de navegación */}
          <nav className="p-4 pt-6 space-y-2 flex-1">
            <button
              onClick={() => setVistaActual('dashboard')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                vistaActual === 'dashboard'
                  ? theme.activeSidebar
                  : 'hover:bg-stone-850 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setVistaActual('productos')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                vistaActual === 'productos'
                  ? theme.activeSidebar
                  : 'hover:bg-stone-850 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Productos</span>
            </button>
            <button
              onClick={() => setVistaActual('categorias')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                vistaActual === 'categorias'
                  ? theme.activeSidebar
                  : 'hover:bg-stone-850 hover:text-white'
              }`}
            >
              <Tags className="w-5 h-5" />
              <span>Categorías</span>
            </button>
            <button
              onClick={() => setVistaActual('inventario')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                vistaActual === 'inventario'
                  ? theme.activeSidebar
                  : 'hover:bg-stone-850 hover:text-white'
              }`}
            >
              <ClipboardList className="w-5 h-5" />
              <span>Inventario</span>
            </button>
            <button
              onClick={() => setVistaActual('personalizar')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                vistaActual === 'personalizar'
                  ? theme.activeSidebar
                  : 'hover:bg-stone-850 hover:text-white'
              }`}
            >
              <Palette className="w-5 h-5" />
              <span>Personalizar</span>
            </button>
            <button
              onClick={() => setVistaActual('usuarios')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                vistaActual === 'usuarios'
                  ? theme.activeSidebar
                  : 'hover:bg-stone-850 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Usuarios</span>
            </button>
            <button
              onClick={() => setVistaActual('extras')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                vistaActual === 'extras'
                  ? theme.activeSidebar
                  : 'hover:bg-stone-850 hover:text-white'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>Adicionales (Extras)</span>
            </button>
            <button
              onClick={() => setVistaActual('cierres')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                vistaActual === 'cierres'
                  ? theme.activeSidebar
                  : 'hover:bg-stone-850 hover:text-white'
              }`}
            >
              <Calculator className="w-5 h-5" />
              <span>Cierres de Caja</span>
            </button>
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-5 border-t border-[#FFC107]/10 bg-black/40 text-center text-xs text-stone-500 font-bold uppercase tracking-wider">
          La Reconciliación
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-[#FFF8F0]/80 backdrop-blur-xs flex flex-col items-center justify-center z-50">
            <Loader2 className={`w-12 h-12 ${theme.primaryText} animate-spin`} />
            <span className="text-stone-700 text-sm font-extrabold mt-4 uppercase tracking-widest">Sincronizando información...</span>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200 text-[#B71C1C] flex items-center gap-3 shrink-0 shadow-xs">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-bold">{error}</span>
            <button onClick={cargarDatos} className="ml-auto bg-[#B71C1C]/10 hover:bg-[#B71C1C]/25 text-[#B71C1C] px-4 py-2 rounded-xl text-xs font-black transition-all shadow-xs">Reintentar</button>
          </div>
        )}

        {/* CONTENIDO DINÁMICO */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {/* ==========================================
              VISTA: DASHBOARD
              ========================================== */}
          {vistaActual === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight flex items-center gap-2 font-serif uppercase">
                    Panel General <Sparkles className={`w-5 h-5 ${theme.primaryText}`} />
                  </h1>
                  <p className="text-stone-500 text-sm mt-1">Indicadores globales y estado del restaurante.</p>
                </div>
                <button onClick={cargarDatos} className="bg-white hover:bg-[#FFF8F0] border border-[#E5E5E5] hover:border-[#FFC107]/40 text-[#111111] font-black px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95">
                  Refrescar Datos
                </button>
              </div>

              {/* Alerta de Cierres de Caja Acumulados */}
              {conteoCierresActivos >= 500 && (
                <div className="bg-red-50 border border-red-150 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md animate-pulse-slow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-100/60 rounded-2xl text-[#B71C1C] shrink-0 border border-red-205">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#7A0000] text-sm uppercase tracking-wide">Alerta de Almacenamiento: Cierres de Caja</h3>
                      <p className="text-[#B71C1C] text-xs mt-1 font-semibold leading-relaxed">
                        Se han registrado <strong className="text-[#7A0000]">{conteoCierresActivos} reportes activos</strong>. 
                        Es recomendable realizar un Cierre de Gestión para consolidar el balance de ingresos y optimizar el almacenamiento.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={prepararConsolidacion}
                    className="bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white font-black px-5 py-3 rounded-2xl text-xs transition-all shadow-md shrink-0 uppercase tracking-widest active:scale-95"
                  >
                    Realizar Cierre de Gestión
                  </button>
                </div>
              )}

              {/* Grid de Kpis */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* KPI 1 */}
                <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(17,17,17,0.04)] border border-[#E5E5E5] p-6 flex items-center gap-5 hover:shadow-[0_15px_35px_rgba(17,17,17,0.08)] hover:-translate-y-0.5 transition-all duration-300">
                  <div className="bg-[#FFF3E0] p-4.5 rounded-2xl text-[#FF9800]">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="block text-stone-400 text-xs font-bold uppercase tracking-wider">Productos</span>
                    <span className="text-3xl font-black text-[#111111] font-serif">{productos.length}</span>
                  </div>
                </div>

                {/* KPI 2 */}
                <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(17,17,17,0.04)] border border-[#E5E5E5] p-6 flex items-center gap-5 hover:shadow-[0_15px_35px_rgba(17,17,17,0.08)] hover:-translate-y-0.5 transition-all duration-300">
                  <div className="bg-[#FFF8F0] p-4.5 rounded-2xl text-[#B71C1C] border border-[#B71C1C]/10">
                    <Tags className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="block text-stone-400 text-xs font-bold uppercase tracking-wider">Categorías</span>
                    <span className="text-3xl font-black text-[#111111] font-serif">{categorias.length}</span>
                  </div>
                </div>

                {/* KPI 3 */}
                <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(17,17,17,0.04)] border border-[#E5E5E5] p-6 flex items-center gap-5 hover:shadow-[0_15px_35px_rgba(17,17,17,0.08)] hover:-translate-y-0.5 transition-all duration-300">
                  <div className="bg-[#FFF3E0] p-4.5 rounded-2xl text-[#FFC107]">
                    <Box className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="block text-stone-400 text-xs font-bold uppercase tracking-wider">Control Stock</span>
                    <span className="text-3xl font-black text-[#111111] font-serif">{productosInventario.length}</span>
                  </div>
                </div>

                {/* KPI 4 */}
                <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(17,17,17,0.04)] border border-[#E5E5E5] p-6 flex items-center gap-5 hover:shadow-[0_15px_35px_rgba(17,17,17,0.08)] hover:-translate-y-0.5 transition-all duration-300">
                  <div className={`p-4.5 rounded-2xl border ${inventariosBajoStock.length > 0 ? 'bg-red-50 text-[#B71C1C] border-red-100' : 'bg-stone-50 text-stone-400 border-stone-200'}`}>
                    <AlertTriangle className={`w-8 h-8 ${inventariosBajoStock.length > 0 ? 'animate-pulse' : ''}`} />
                  </div>
                  <div>
                    <span className="block text-stone-400 text-xs font-bold uppercase tracking-wider">Stock Crítico</span>
                    <span className={`text-3xl font-black font-serif ${inventariosBajoStock.length > 0 ? 'text-[#B71C1C]' : 'text-[#111111]'}`}>{inventariosBajoStock.length}</span>
                  </div>
                </div>

              </div>

              {/* Contenido secundario del Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Alertas de Stock */}
                <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)] p-6 lg:col-span-2 space-y-5">
                  <h3 className="text-xl font-black text-[#111111] flex items-center gap-2.5 font-serif uppercase">
                    <AlertTriangle className="w-5 h-5 text-[#B71C1C]" /> Bebidas con Alerta de Stock
                  </h3>
                  {inventariosBajoStock.length === 0 ? (
                    <div className="py-16 text-center text-stone-450 text-sm font-semibold">
                      Excelente, todos tus productos controlados tienen stock suficiente.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#E5E5E5]">
                      {inventariosBajoStock.map(inv => {
                        const prod = productos.find(p => p.id === inv.producto);
                        if (!prod) return null;
                        return (
                          <div key={inv.id} className="py-4.5 flex justify-between items-center transition-all hover:bg-[#FFF8F0]/30 px-2.5 rounded-2xl">
                            <div>
                              <span className="font-bold text-[#111111] text-sm">{prod.nombre}</span>
                              <span className="block text-[11px] font-bold text-stone-400 mt-1 uppercase tracking-wider">Categoría: {obtenerNombreCategoria(prod.categoria)}</span>
                            </div>
                            <div className="text-right">
                              <span className="bg-red-50 text-[#B71C1C] border border-red-150 text-[11px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                                {inv.cantidad_actual} unidades (Mín: {inv.stock_minimo})
                              </span>
                              <button 
                                onClick={() => {
                                  setVistaActual('inventario');
                                  abrirModalEntrada(prod);
                                }}
                                className="block text-xs font-bold text-[#B71C1C] hover:text-[#7A0000] mt-2 underline tracking-wide uppercase text-[10px]"
                              >
                                Registrar Entrada
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Acciones Rápidas */}
                <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)] p-6 space-y-5">
                  <h3 className="text-xl font-black text-[#111111] font-serif uppercase">Acciones Directas</h3>
                  <div className="space-y-4">
                    <button 
                      onClick={() => {
                        setVistaActual('productos');
                        abrirModalCrearProducto();
                      }}
                      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white rounded-2xl font-black transition-all text-sm shadow-md active:scale-[0.99] uppercase tracking-wider"
                    >
                      <span>Registrar Nuevo Producto</span>
                      <Plus className="w-5 h-5 text-[#FFC107]" />
                    </button>
                    <button 
                      onClick={() => {
                        setVistaActual('categorias');
                      }}
                      className="w-full flex items-center justify-between p-4 bg-[#FFF8F0] hover:bg-[#FFF3E0] text-[#7A0000] border border-[#FFC107]/40 rounded-2xl font-black transition-all text-sm active:scale-[0.99] uppercase tracking-wider"
                    >
                      <span>Gestionar Categorías</span>
                      <Tags className="w-5 h-5 text-[#FF9800]" />
                    </button>
                    <button 
                      onClick={() => {
                        setVistaActual('inventario');
                      }}
                      className="w-full flex items-center justify-between p-4 bg-[#FFF8F0] hover:bg-[#FFF3E0] text-[#7A0000] border border-[#FFC107]/40 rounded-2xl font-black transition-all text-sm active:scale-[0.99] uppercase tracking-wider"
                    >
                      <span>Controlar Inventario</span>
                      <ClipboardList className="w-5 h-5 text-[#FF9800]" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==========================================
              VISTA: CATEGORIAS
              ========================================== */}
          {vistaActual === 'categorias' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight font-serif uppercase">Categorías de Menú</h1>
                <p className="text-stone-500 text-sm mt-1">Administración y clasificación de los platillos.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Formulario Nueva Categoría */}
                <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)] p-6 h-fit space-y-5">
                  <h3 className="text-xl font-black text-[#111111] font-serif uppercase">Nueva Categoría</h3>
                  <form onSubmit={handleCrearCategoria} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Nombre de la Categoría</label>
                      <input
                        type="text"
                        placeholder="Ej: Hamburguesas, Entradas, Pastas..."
                        value={nuevaCatNombre}
                        onChange={(e) => setNuevaCatNombre(e.target.value)}
                        required
                        className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={creandoCat || !nuevaCatNombre.trim()}
                      className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-md uppercase tracking-wider text-xs ${
                        creandoCat || !nuevaCatNombre.trim()
                          ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                          : 'bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white active:scale-98'
                      }`}
                    >
                      {creandoCat ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 text-[#FFC107]" />
                          <span>Agregar Categoría</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Tabla de Categorías */}
                <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)] overflow-hidden lg:col-span-2 flex flex-col">
                  <div className="px-6 py-5 border-b border-[#E5E5E5] bg-[#FFF8F0]/30">
                    <h3 className="font-black text-[#111111] text-base font-serif uppercase">Listado Existente</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-[#111111] text-[#FFC107] border-b border-[#FFC107]/20 font-black uppercase text-[10px] tracking-wider">
                          <th className="px-6 py-4.5">ID</th>
                          <th className="px-6 py-4.5">Nombre de Categoría</th>
                          <th className="px-6 py-4.5">Productos vinculados</th>
                          <th className="px-6 py-4.5 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E5E5]">
                        {categorias.map(cat => {
                          const cantidadAsociados = productos.filter(p => p.categoria === cat.id).length;
                          return (
                            <tr key={cat.id} className="hover:bg-[#FFF8F0]/30 transition-colors">
                              <td className="px-6 py-4.5 font-black text-stone-500">{cat.id}</td>
                              <td className="px-6 py-4.5 font-extrabold text-[#111111]">{cat.nombre}</td>
                              <td className="px-6 py-4.5">
                                <span className="inline-flex items-center bg-[#FFF3E0] text-[#FF9800] border border-[#FFC107]/20 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">
                                  {cantidadAsociados} productos
                                </span>
                              </td>
                              <td className="px-6 py-4.5 text-right">
                                <button
                                  onClick={() => handleEliminarCategoria(cat.id)}
                                  className="text-[#B71C1C] hover:text-[#7A0000] p-2.5 rounded-xl hover:bg-red-50 transition-colors"
                                  title="Eliminar Categoría"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {categorias.length === 0 && (
                          <tr>
                            <td colSpan="4" className="text-center py-12 text-stone-400 font-semibold uppercase tracking-wider text-xs">No se han registrado categorías aún.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              VISTA: PRODUCTOS
              ========================================== */}
          {vistaActual === 'productos' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight font-serif uppercase">Catálogo de Productos</h1>
                  <p className="text-stone-500 text-sm mt-1">Registra, modifica y visualiza la carta del restaurante.</p>
                </div>
                <button
                  onClick={abrirModalCrearProducto}
                  className="bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white font-black px-6 py-3.5 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md uppercase tracking-wider active:scale-95"
                >
                  <Plus className="w-5 h-5 text-[#FFC107]" />
                  <span>Nuevo Producto</span>
                </button>
              </div>

              {/* Barra de Filtros */}
              <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)] p-4.5 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Buscar producto por nombre..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl text-sm text-[#111111] transition-all focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3.5 w-full md:w-auto">
                  <span className="text-xs font-black text-[#111111]/70 uppercase tracking-widest whitespace-nowrap">Filtrar Categoría:</span>
                  <select
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="bg-white border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-3 text-xs font-bold text-[#111111] transition-all focus:outline-none cursor-pointer"
                  >
                    <option value="Todas">Todas</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tabla de Productos */}
              <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)] overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#111111] text-[#FFC107] border-b border-[#FFC107]/20 font-black uppercase text-[10px] tracking-wider">
                        <th className="px-6 py-4.5">Foto</th>
                        <th className="px-6 py-4.5">Nombre</th>
                        <th className="px-6 py-4.5">Categoría</th>
                        <th className="px-6 py-4.5">Precio</th>
                        <th className="px-6 py-4.5">Disponible</th>
                        <th className="px-6 py-4.5">Control Stock</th>
                        <th className="px-6 py-4.5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {productosFiltrados.map(prod => (
                        <tr key={prod.id} className="hover:bg-[#FFF8F0]/30 transition-colors">
                          
                          {/* Fotografía */}
                          <td className="px-6 py-3.5">
                            <div className="w-14 h-14 rounded-2xl bg-stone-100 overflow-hidden border border-[#E5E5E5] flex items-center justify-center shrink-0 shadow-xs">
                              {prod.fotografia ? (
                                <img src={prod.fotografia} alt={prod.nombre} className="w-full h-full object-cover" />
                              ) : (
                                <Image className="w-5 h-5 text-stone-400" />
                              )}
                            </div>
                          </td>

                          {/* Nombre */}
                          <td className="px-6 py-3.5 font-extrabold text-[#111111]">
                            <div>
                              <span>{prod.nombre}</span>
                              <span className="block text-[11px] font-medium text-stone-400 mt-1 line-clamp-1 max-w-sm normal-case">
                                {prod.descripcion || 'Sin descripción'}
                              </span>
                            </div>
                          </td>

                          {/* Categoría */}
                          <td className="px-6 py-3.5">
                            <span className="inline-flex items-center bg-[#FFF8F0] text-[#7A0000] border border-[#FFC107]/30 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider">
                              {obtenerNombreCategoria(prod.categoria)}
                            </span>
                          </td>

                          {/* Precio */}
                          <td className="px-6 py-3.5 font-black text-[#111111] text-base font-serif">
                            {parseFloat(prod.precio).toFixed(2)} Bs
                          </td>

                          {/* Disponible (Badge Toggle) */}
                          <td className="px-6 py-3.5">
                            <button
                              onClick={() => handleToggleDisponible(prod)}
                              className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all select-none border shadow-xs ${
                                prod.disponible
                                  ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                  : 'bg-red-50 text-[#B71C1C] border-red-150 hover:bg-red-100'
                              }`}
                            >
                              {prod.disponible ? 'Disponible' : 'Agotado'}
                            </button>
                          </td>

                          {/* Control Stock */}
                          <td className="px-6 py-3.5">
                            {prod.controla_stock ? (
                              <span className="inline-flex items-center gap-1.5 text-[#B71C1C] bg-[#FFF8F0] border border-[#B71C1C]/20 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider">
                                Sí
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-stone-500 bg-[#E5E5E5] px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                                No
                              </span>
                            )}
                          </td>

                          {/* Acciones */}
                          <td className="px-6 py-3.5 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => abrirModalEditarProducto(prod)}
                              className="text-stone-500 hover:text-[#FF9800] p-2.5 rounded-xl hover:bg-[#FFF3E0] transition-colors"
                              title="Editar Producto"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEliminarProducto(prod.id)}
                              className="text-[#B71C1C] hover:text-[#7A0000] p-2.5 rounded-xl hover:bg-red-55 transition-colors"
                              title="Eliminar Producto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {productosFiltrados.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center py-16 text-stone-400 font-semibold uppercase tracking-wider text-xs">No se encontraron productos en esta categoría o búsqueda.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              VISTA: INVENTARIO
              ========================================== */}
          {vistaActual === 'inventario' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight flex items-center gap-2.5 font-serif uppercase">
                  Inventario de Bebidas <Box className="w-6 h-6 text-[#B71C1C]" />
                </h1>
                <p className="text-stone-500 text-sm mt-1">Control de existencias y registro de entradas para productos controlados.</p>
              </div>

              {/* Listado de Inventarios */}
              <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)] overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#111111] text-[#FFC107] border-b border-[#FFC107]/20 font-black uppercase text-[10px] tracking-wider">
                        <th className="px-6 py-4.5">Foto</th>
                        <th className="px-6 py-4.5">Nombre del Producto</th>
                        <th className="px-6 py-4.5">Categoría</th>
                        <th className="px-6 py-4.5">Stock Mínimo</th>
                        <th className="px-6 py-4.5">Stock Actual</th>
                        <th className="px-6 py-4.5">Estado Alerta</th>
                        <th className="px-6 py-4.5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {productosInventario.map(prod => {
                        const inv = obtenerInventarioProducto(prod.id);
                        const cantidad = inv ? inv.cantidad_actual : 0;
                        const stockMinimo = inv ? inv.stock_minimo : 5;
                        const bajoStock = cantidad <= stockMinimo;
                        
                        return (
                          <tr key={prod.id} className="hover:bg-[#FFF8F0]/30 transition-colors">
                            
                            {/* Foto */}
                            <td className="px-6 py-3.5">
                              <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden border border-[#E5E5E5] flex items-center justify-center shrink-0 shadow-xs">
                                {prod.fotografia ? (
                                  <img src={prod.fotografia} alt={prod.nombre} className="w-full h-full object-cover" />
                                ) : (
                                  <Image className="w-5 h-5 text-stone-400" />
                                )}
                              </div>
                            </td>
 
                            {/* Nombre */}
                            <td className="px-6 py-3.5 font-extrabold text-[#111111]">{prod.nombre}</td>
 
                            {/* Categoría */}
                            <td className="px-6 py-3.5">
                              <span className="inline-flex items-center bg-[#FFF8F0] text-[#7A0000] border border-[#FFC107]/30 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider">
                                {obtenerNombreCategoria(prod.categoria)}
                              </span>
                            </td>
 
                            {/* Stock Mínimo */}
                            <td className="px-6 py-3.5 font-bold text-stone-750">{stockMinimo} unidades</td>
 
                            {/* Stock Actual */}
                            <td className="px-6 py-3.5">
                              <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-xs ${
                                bajoStock 
                                  ? 'bg-red-50 text-[#B71C1C] border-red-200' 
                                  : 'bg-green-50 text-green-700 border-green-200'
                              }`}>
                                {cantidad} unidades
                              </span>
                            </td>
 
                            {/* Alerta */}
                            <td className="px-6 py-3.5">
                              {bajoStock ? (
                                <span className="inline-flex items-center gap-1.5 text-[#B71C1C] font-black text-xs uppercase tracking-wider">
                                  <AlertTriangle className="w-4 h-4 text-[#B71C1C] animate-bounce" /> Bajo Stock
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-green-700 font-black text-xs uppercase tracking-wider">
                                  <Check className="w-4 h-4 text-green-600" /> Suficiente
                                </span>
                              )}
                            </td>
 
                            {/* Entrada de Stock */}
                            <td className="px-6 py-3.5 text-right">
                              <button
                                onClick={() => abrirModalEntrada(prod)}
                                className="font-black px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 ml-auto shadow-md bg-[#FFF8F0] hover:bg-[#FFF3E0] text-[#7A0000] border border-[#FFC107]/40 active:scale-95 uppercase tracking-wider"
                              >
                                <Plus className="w-3.5 h-3.5 text-[#FF9800]" />
                                <span>Registrar Entrada</span>
                              </button>
                            </td>
 
                          </tr>
                        );
                      })}
                      {productosInventario.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center py-16 text-stone-400 font-semibold uppercase tracking-wider text-xs">No se han registrado productos con control de stock de inventario.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
 
          {/* ==========================================
              VISTA: PERSONALIZAR (Fase 7: Paso 3)
              ========================================== */}
          {vistaActual === 'personalizar' && (
            <div className="space-y-8 max-w-4xl animate-in fade-in duration-200" style={{ fontFamily: 'Outfit, sans-serif' }}>
              
              {/* Cabecera del Módulo */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight flex items-center gap-3 uppercase font-serif">
                    Personalizar Inicio <Palette className="w-8 h-8 text-[#B71C1C]" />
                  </h1>
                  <p className="text-stone-500 text-sm mt-1">Configura el diseño, los textos principales, horarios y la identidad visual de la página web.</p>
                </div>
              </div>
 
              <div className="grid grid-cols-1 gap-8">
                
                {/* Formulario Principal de Configuración */}
                <form onSubmit={handleGuardarConfiguracion} className="space-y-8">
                  
                  {/* Tarjeta 1: Identidad y Estilo Visual */}
                  <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)] p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-3 border-b border-[#E5E5E5] pb-4">
                      <div className="p-2 bg-[#FFF8F0] border border-[#FFC107]/30 rounded-xl text-[#FF9800]">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h3 className="font-black text-[#111111] text-lg uppercase">Identidad y Estilo de la Marca</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Nombre del Restaurante *</label>
                        <input
                          type="text"
                          value={nombreRest}
                          onChange={(e) => setNombreRest(e.target.value)}
                          required
                          className="w-full bg-[#FFF8F0]/10 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Tema Cromático (Acento del Sitio) *</label>
                        <select
                          value={colorTema}
                          onChange={(e) => setColorTema(e.target.value)}
                          className="w-full bg-[#FFF8F0]/10 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none cursor-pointer"
                        >
                          <option value="orange">Naranja (Branding Original)</option>
                          <option value="blue">Azul (Elegante Corporativo)</option>
                          <option value="green">Esmeralda (Orgánico y Fresco)</option>
                          <option value="purple">Púrpura (Premium y Místico)</option>
                          <option value="red">Rojo (Pasión Gourmet)</option>
                          <option value="claro_elegante">Cocina (Claro Elegante)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Tarjeta 2: Banner de Bienvenida / Hero */}
                  <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)] p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-3 border-b border-[#E5E5E5] pb-4">
                      <div className="p-2 bg-[#FFF8F0] border border-[#FFC107]/30 rounded-xl text-[#B71C1C]">
                        <Image className="w-5 h-5" />
                      </div>
                      <h3 className="font-black text-[#111111] text-lg uppercase">Sección Principal (Hero Banner)</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Título Principal del Banner *</label>
                        <input
                          type="text"
                          value={tituloHero}
                          onChange={(e) => setTituloHero(e.target.value)}
                          required
                          className="w-full bg-[#FFF8F0]/10 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                        />
                      </div>
    
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Descripción / Eslogan del Hero *</label>
                        <textarea
                          value={descHero}
                          onChange={(e) => setDescHero(e.target.value)}
                          required
                          rows="3"
                          className="w-full bg-[#FFF8F0]/10 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none resize-none"
                        />
                      </div>
    
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Platillo Destacado 1 (Fondo)</label>
                          <select
                            value={prodDestacado1}
                            onChange={(e) => setProdDestacado1(e.target.value)}
                            className="w-full bg-[#FFF8F0]/10 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none cursor-pointer"
                          >
                            <option value="">-- Selección Automática / Por Defecto --</option>
                            {productos.filter(p => p.fotografia).map(p => (
                              <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Platillo Destacado 2 (Frente)</label>
                          <select
                            value={prodDestacado2}
                            onChange={(e) => setProdDestacado2(e.target.value)}
                            className="w-full bg-[#FFF8F0]/10 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none cursor-pointer"
                          >
                            <option value="">-- Selección Automática / Por Defecto --</option>
                            {productos.filter(p => p.fotografia).map(p => (
                              <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tarjeta 3: Información de Contacto y Horarios */}
                  <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)] p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-3 border-b border-[#E5E5E5] pb-4">
                      <div className="p-2 bg-[#FFF8F0] border border-[#FFC107]/30 rounded-xl text-[#7A0000]">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <h3 className="font-black text-[#111111] text-lg uppercase">Información de Contacto y Horarios</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Resumen de Horario General *</label>
                          <input
                            type="text"
                            value={horarioRest}
                            onChange={(e) => setHorarioRest(e.target.value)}
                            required
                            className="w-full bg-[#FFF8F0]/10 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Dirección Física *</label>
                          <input
                            type="text"
                            value={direccionRest}
                            onChange={(e) => setDireccionRest(e.target.value)}
                            required
                            className="w-full bg-[#FFF8F0]/10 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                          />
                        </div>
     
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Teléfono de Atención *</label>
                          <input
                            type="text"
                            value={telefonoRest}
                            onChange={(e) => setTelefonoRest(e.target.value)}
                            required
                            className="w-full bg-[#FFF8F0]/10 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                          />
                        </div>
                      </div>
    
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Horario Lunes a Viernes *</label>
                          <input
                            type="text"
                            value={horarioSemana}
                            onChange={(e) => setHorarioSemana(e.target.value)}
                            required
                            placeholder="Ej. 18:00 – 23:00"
                            className="w-full bg-[#FFF8F0]/10 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Horario Sábados *</label>
                          <input
                            type="text"
                            value={horarioSabado}
                            onChange={(e) => setHorarioSabado(e.target.value)}
                            required
                            placeholder="Ej. 12:00 – 23:30"
                            className="w-full bg-[#FFF8F0]/10 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Horario Domingos *</label>
                          <input
                            type="text"
                            value={horarioDomingo}
                            onChange={(e) => setHorarioDomingo(e.target.value)}
                            required
                            placeholder="Ej. 12:00 – 22:00"
                            className="w-full bg-[#FFF8F0]/10 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tarjeta 4: Enlaces a Redes Sociales */}
                  <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)] p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-3 border-b border-[#E5E5E5] pb-4">
                      <div className="p-2 bg-[#FFF8F0] border border-[#FFC107]/30 rounded-xl text-[#FF9800]">
                        <Palette className="w-5 h-5" />
                      </div>
                      <h3 className="font-black text-[#111111] text-lg uppercase">Enlaces de Redes Sociales</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Enlace de Facebook</label>
                        <input
                          type="url"
                          value={linkFacebook}
                          onChange={(e) => setLinkFacebook(e.target.value)}
                          placeholder="https://facebook.com/tu-pagina"
                          className="w-full bg-[#FFF8F0]/10 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Enlace de WhatsApp</label>
                        <input
                          type="url"
                          value={linkWhatsapp}
                          onChange={(e) => setLinkWhatsapp(e.target.value)}
                          placeholder="https://wa.me/59177889900"
                          className="w-full bg-[#FFF8F0]/10 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Enlace de TikTok</label>
                        <input
                          type="url"
                          value={linkTiktok}
                          onChange={(e) => setLinkTiktok(e.target.value)}
                          placeholder="https://tiktok.com/@tu-usuario"
                          className="w-full bg-[#FFF8F0]/10 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Enlace de Instagram</label>
                        <input
                          type="url"
                          value={linkInstagram}
                          onChange={(e) => setLinkInstagram(e.target.value)}
                          placeholder="https://instagram.com/tu-usuario"
                          className="w-full bg-[#FFF8F0]/10 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tarjeta 5: Estado de Atención del local */}
                  <div className="bg-[#FFF8F0] rounded-3xl p-6 border border-[#FFC107] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="space-y-1">
                      <span className="font-extrabold text-[#111111] text-base block uppercase tracking-wide">Estado de Atención del local</span>
                      <span className="text-xs text-stone-600 block leading-relaxed max-w-xl">Permite alternar entre Abierto y Cerrado para pausar o recibir pedidos automáticamente en la página web principal.</span>
                    </div>
                    <div className="shrink-0 flex items-center gap-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border shadow-sm ${
                        estaAbierto 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-red-50 text-[#B71C1C] border-red-200'
                      }`}>
                        {estaAbierto ? '🟢 Abierto' : '🔴 Cerrado'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEstaAbierto(!estaAbierto)}
                        className={`font-black text-xs px-5 py-3.5 rounded-2xl border transition-all uppercase tracking-wider active:scale-95 shadow-md ${
                          estaAbierto 
                            ? 'bg-[#B71C1C] hover:bg-[#7A0000] border-[#B71C1C] text-white'
                            : 'bg-green-600 hover:bg-green-700 border-green-600 text-white'
                        }`}
                      >
                        {estaAbierto ? 'Cerrar Restaurante' : 'Abrir Restaurante'}
                      </button>
                    </div>
                  </div>

                  {/* Botón Guardar Configuración Principal */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={guardandoConfig}
                      className="bg-[#B71C1C] hover:bg-[#7A0000] text-white font-black px-8 py-4.5 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-lg uppercase tracking-wider active:scale-95 border-none"
                    >
                      {guardandoConfig ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Guardando Configuración...</span>
                        </>
                      ) : (
                        <span>Guardar Cambios</span>
                      )}
                    </button>
                  </div>
                </form>

                {/* Tarjeta 6: Configuración del QR de Pago */}
                <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)] p-6 md:p-8 space-y-6 mt-2">
                  <div className="flex items-center gap-3 border-b border-[#E5E5E5] pb-4">
                    <div className="p-2 bg-[#FFF8F0] border border-[#FFC107]/30 rounded-xl text-[#B71C1C]">
                      <Palette className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-[#111111] text-lg uppercase">Código QR para Pagos</h3>
                  </div>

                  <form onSubmit={handleGuardarQr} className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                      <div className="flex-1 space-y-4">
                        <p className="text-sm text-stone-500 leading-relaxed font-semibold">
                          Sube la imagen del código QR de tu cuenta bancaria o billetera móvil. Esta imagen se mostrará automáticamente en la pantalla de cobro del cajero cuando se seleccione el método de pago "QR" o "Mixto".
                        </p>
                        
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Seleccionar Archivo de Imagen QR</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImagenQrFile(e.target.files[0])}
                            className={`w-full text-sm text-stone-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-black cursor-pointer ${theme.fileButton}`}
                          />
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={guardandoQr || !imagenQrFile}
                            className={`font-black px-6 py-4 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md uppercase tracking-wider active:scale-95 border-none ${
                              guardandoQr || !imagenQrFile 
                                ? 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300' 
                                : 'bg-[#B71C1C] hover:bg-[#7A0000] text-white'
                            }`}
                          >
                            {guardandoQr ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Subiendo Imagen QR...</span>
                              </>
                            ) : (
                              <span>Guardar QR</span>
                            )}
                          </button>
                        </div>
                      </div>
   
                      <div className="shrink-0 w-full md:w-56 flex flex-col items-center p-4 bg-[#FFF8F0]/30 border border-[#E5E5E5] rounded-3xl">
                        <span className="text-[10px] font-black text-[#111111]/70 uppercase tracking-widest mb-3">QR Registrado Actual</span>
                        {imagenQrUrl ? (
                          <div className="p-3 border border-[#E5E5E5] rounded-2xl bg-white shadow-md">
                            <img src={imagenQrUrl} alt="QR Actual" className="w-40 h-40 aspect-square object-contain rounded-xl" />
                          </div>
                        ) : (
                          <div className="w-40 h-40 bg-white border-2 border-dashed border-[#E5E5E5] rounded-2xl flex items-center justify-center text-stone-400">
                            <Image className="w-8 h-8 opacity-40" />
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          )}

          {/* ==========================================
              VISTA: USUARIOS
              ========================================== */}
          {vistaActual === 'usuarios' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight flex items-center gap-2 font-serif uppercase">
                    Control de Usuarios <Users className="w-6 h-6 text-[#B71C1C]" />
                  </h1>
                  <p className="text-stone-500 text-sm mt-1">Registra, edita y administra los accesos para el personal de Caja POS y Administración.</p>
                </div>
                <button
                  onClick={abrirModalCrearUsuario}
                  className="bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white font-black px-6 py-3.5 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md uppercase tracking-wider active:scale-95"
                >
                  <UserPlus className="w-5 h-5 text-[#FFC107]" />
                  <span>Nuevo Usuario</span>
                </button>
              </div>

              {/* Barra de Filtros */}
              <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)] p-4.5 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Buscar usuario por nombre o correo..."
                    value={busquedaUsuario}
                    onChange={(e) => setBusquedaUsuario(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl text-sm text-[#111111] transition-all focus:outline-none"
                  />
                </div>
              </div>

              {/* Tabla de Usuarios */}
              <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)] overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#111111] text-[#FFC107] border-b border-[#FFC107]/20 font-black uppercase text-[10px] tracking-wider">
                        <th className="px-6 py-4.5">ID</th>
                        <th className="px-6 py-4.5">Nombre de Usuario</th>
                        <th className="px-6 py-4.5">Correo Electrónico</th>
                        <th className="px-6 py-4.5">Rol asignado</th>
                        <th className="px-6 py-4.5">Estado Cuenta</th>
                        <th className="px-6 py-4.5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {usuarios
                        .filter(u => {
                          const query = busquedaUsuario.toLowerCase();
                          return u.username.toLowerCase().includes(query) || 
                                 (u.email && u.email.toLowerCase().includes(query));
                        })
                        .map(u => {
                          // Obtener datos del usuario logueado en sesión para protección
                          const savedUser = localStorage.getItem('authUser');
                          const currentUser = savedUser ? JSON.parse(savedUser) : null;
                          const esUsuarioPropio = currentUser && currentUser.id === u.id;

                          return (
                            <tr key={u.id} className="hover:bg-[#FFF8F0]/30 transition-colors">
                              <td className="px-6 py-4.5 font-black text-stone-500">{u.id}</td>
                              <td className="px-6 py-4.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-[#111111]">{u.username}</span>
                                  {esUsuarioPropio && (
                                    <span className="text-[9px] px-2 py-0.5 rounded-md font-black uppercase bg-[#FFF8F0] text-[#7A0000] border border-[#FFC107]/30 tracking-wider">Tú</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4.5 text-stone-500 font-semibold">{u.email || 'Sin correo registrado'}</td>
                              <td className="px-6 py-4.5 font-black text-stone-850">
                                {obtenerNombreRol(u.rol)}
                              </td>
                              <td className="px-6 py-4.5">
                                <button
                                  onClick={() => !esUsuarioPropio && handleToggleEstadoUsuario(u)}
                                  disabled={esUsuarioPropio}
                                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border shadow-xs ${
                                    esUsuarioPropio 
                                      ? 'bg-stone-100 text-stone-400 border-stone-250 cursor-not-allowed'
                                      : u.estado
                                        ? 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200'
                                        : 'bg-red-50 text-[#B71C1C] hover:bg-red-100 border-red-150'
                                  }`}
                                  title={esUsuarioPropio ? 'No puedes deshabilitar tu propia cuenta' : u.estado ? 'Deshabilitar cuenta' : 'Habilitar cuenta'}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${esUsuarioPropio ? 'bg-stone-300' : u.estado ? 'bg-green-500' : 'bg-[#B71C1C]'}`} />
                                  <span>{u.estado ? 'Activo' : 'Inactivo'}</span>
                                </button>
                              </td>
                              <td className="px-6 py-4.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => abrirModalEditarUsuario(u)}
                                    className="text-stone-500 hover:text-[#FF9800] p-2.5 rounded-xl hover:bg-[#FFF3E0] transition-colors"
                                    title="Editar datos de usuario"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  {!esUsuarioPropio ? (
                                    <button
                                      onClick={() => handleEliminarUsuario(u.id)}
                                      className="text-[#B71C1C] hover:text-[#7A0000] p-2.5 rounded-xl hover:bg-red-50 transition-colors"
                                      title="Eliminar usuario permanentemente"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  ) : (
                                    <span className="w-9 h-9 inline-block" /> // Placeholder para mantener alineamiento
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      {usuarios.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-12 text-stone-400 font-semibold uppercase tracking-wider text-xs">No se han registrado usuarios en el sistema.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              VISTA: EXTRAS (ADICIONALES)
              ========================================== */}
          {vistaActual === 'extras' && (
            <div className="space-y-6 animate-in fade-in duration-200 font-sans">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight flex items-center gap-2 font-serif uppercase">
                    Gestionar Adicionales <Sparkles className="w-6 h-6 text-[#B71C1C]" />
                  </h1>
                  <p className="text-stone-500 text-sm mt-1">Crea, edita y cambia el precio de los extras disponibles para acompañar los platillos en la Caja POS.</p>
                </div>
                <button
                  onClick={abrirModalCrearExtra}
                  className="bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white font-black px-6 py-3.5 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md uppercase tracking-wider active:scale-95"
                >
                  <Plus className="w-5 h-5 text-[#FFC107]" />
                  <span>Nuevo Adicional</span>
                </button>
              </div>

              {/* Tabla de Extras */}
              <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)] overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#111111] text-[#FFC107] border-b border-[#FFC107]/20 font-black uppercase text-[10px] tracking-wider">
                        <th className="px-6 py-4.5">ID</th>
                        <th className="px-6 py-4.5">Nombre del Adicional</th>
                        <th className="px-6 py-4.5">Costo Adicional (Bs)</th>
                        <th className="px-6 py-4.5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {extras.map(e => (
                        <tr key={e.id} className="hover:bg-[#FFF8F0]/30 transition-colors">
                          <td className="px-6 py-4.5 font-black text-stone-500">{e.id}</td>
                          <td className="px-6 py-4.5">
                            <span className="font-extrabold text-[#111111]">{e.nombre}</span>
                          </td>
                          <td className="px-6 py-4.5 font-black text-[#B71C1C] font-serif text-base">
                            +{parseFloat(e.precio).toFixed(2)} Bs
                          </td>
                          <td className="px-6 py-4.5 text-right">
                            <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                              <button
                                onClick={() => abrirModalEditarExtra(e)}
                                className="text-stone-500 hover:text-[#FF9800] p-2.5 rounded-xl hover:bg-[#FFF3E0] transition-colors"
                                title="Editar precio o nombre"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEliminarExtra(e.id)}
                                className="text-[#B71C1C] hover:text-[#7A0000] p-2.5 rounded-xl hover:bg-red-55 transition-colors"
                                title="Eliminar adicional permanentemente"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {extras.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center py-12 text-stone-400 font-semibold uppercase tracking-wider text-xs">No se han registrado adicionales en el sistema.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              VISTA: CIERRES DE CAJA
              ========================================== */}
          {vistaActual === 'cierres' && (
            <div className="space-y-6 animate-in fade-in duration-200 font-sans">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight flex items-center gap-2 font-serif uppercase">
                    Cierres de Caja <Calculator className={`w-6 h-6 text-[#B71C1C]`} />
                  </h1>
                  <p className="text-stone-500 text-sm mt-1">Historial y control de arqueos de caja del personal.</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={prepararConsolidacion}
                    disabled={conteoCierresActivos === 0 || cargandoConsolidacion}
                    className={`font-black px-6 py-3.5 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md uppercase tracking-wider active:scale-95 ${
                      conteoCierresActivos === 0
                        ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                        : 'bg-[#B71C1C] hover:bg-[#7A0000] text-white'
                    }`}
                  >
                    {cargandoConsolidacion ? 'Consolidando...' : `Cierre de Gestión (${conteoCierresActivos} activos)`}
                  </button>
                </div>
              </div>

              {/* Filtros */}
              <div className="bg-white p-5 rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)] flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Buscar por cajero o turno..."
                    value={busquedaCierre}
                    onChange={(e) => setBusquedaCierre(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl text-xs font-semibold text-[#111111] focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2.5 w-full md:w-auto">
                  <span className="text-xs text-stone-450 font-black uppercase tracking-wider whitespace-nowrap">Desde:</span>
                  <input
                    type="date"
                    value={filtroCierreFechaInicio}
                    onChange={(e) => setFiltroCierreFechaInicio(e.target.value)}
                    className="px-4 py-3 bg-white border border-[#E5E5E5] rounded-2xl text-xs font-bold text-stone-750 focus:outline-none cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-2.5 w-full md:w-auto">
                  <span className="text-xs text-stone-450 font-black uppercase tracking-wider whitespace-nowrap">Hasta:</span>
                  <input
                    type="date"
                    value={filtroCierreFechaFin}
                    onChange={(e) => setFiltroCierreFechaFin(e.target.value)}
                    className="px-4 py-3 bg-white border border-[#E5E5E5] rounded-2xl text-xs font-bold text-stone-750 focus:outline-none cursor-pointer"
                  />
                </div>
                {(filtroCierreFechaInicio || filtroCierreFechaFin || busquedaCierre) && (
                  <button
                    onClick={() => {
                      setFiltroCierreFechaInicio('');
                      setFiltroCierreFechaFin('');
                      setBusquedaCierre('');
                    }}
                    className="text-xs font-black text-[#B71C1C] hover:text-[#7A0000] transition-colors uppercase tracking-wider"
                  >
                    Limpiar Filtros
                  </button>
                )}
              </div>

              {/* Tabla de Cierres */}
              <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_10px_30px_rgba(17,17,17,0.04)] overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#111111] text-[#FFC107] border-b border-[#FFC107]/20 font-black uppercase text-[10px] tracking-wider">
                        <th className="px-6 py-4.5">Fecha</th>
                        <th className="px-6 py-4.5">Cajero</th>
                        <th className="px-6 py-4.5">Descripción del Turno</th>
                        <th className="px-6 py-4.5">Ingresos (QR/Efectivo)</th>
                        <th className="px-6 py-4.5">Diferencia</th>
                        <th className="px-6 py-4.5 text-center">Estado</th>
                        <th className="px-6 py-4.5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {reportesCierre
                        .filter(rep => {
                          const term = busquedaCierre.toLowerCase();
                          const matchesSearch = rep.cajero.toLowerCase().includes(term) || rep.turno_descripcion.toLowerCase().includes(term);
                          
                          let matchesStart = true;
                          let matchesEnd = true;
                          const fileDateStr = rep.fecha_cierre.split('T')[0];
                          if (filtroCierreFechaInicio) {
                            matchesStart = fileDateStr >= filtroCierreFechaInicio;
                          }
                          if (filtroCierreFechaFin) {
                            matchesEnd = fileDateStr <= filtroCierreFechaFin;
                          }

                          return matchesSearch && matchesStart && matchesEnd;
                        })
                        .map(rep => {
                          const diff = parseFloat(rep.diferencia);
                          return (
                            <tr key={rep.id} className="hover:bg-[#FFF8F0]/30 transition-colors">
                              <td className="px-6 py-4.5 font-bold text-stone-500 whitespace-nowrap">
                                {new Date(rep.fecha_cierre).toLocaleDateString()} {new Date(rep.fecha_cierre).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </td>
                              <td className="px-6 py-4.5 font-extrabold text-[#111111]">{rep.cajero}</td>
                              <td className="px-6 py-4.5 text-stone-400 font-black text-xs uppercase tracking-wider">{rep.turno_descripcion}</td>
                              <td className="px-6 py-4.5">
                                <div className="flex flex-col text-xs font-bold leading-relaxed whitespace-nowrap">
                                  <span className="text-[#D32F2F]">QR: {parseFloat(rep.total_qr).toFixed(2)} Bs</span>
                                  <span className="text-green-700">Efe: {parseFloat(rep.total_efectivo).toFixed(2)} Bs</span>
                                  <span className="text-[#111111] font-black border-t border-stone-100 pt-0.5 mt-0.5">Tot: {parseFloat(rep.total_ventas).toFixed(2)} Bs</span>
                                </div>
                              </td>
                              <td className={`px-6 py-4.5 font-black font-serif text-base ${diff === 0 ? 'text-green-600' : diff > 0 ? 'text-amber-600' : 'text-[#B71C1C]'}`}>
                                {diff > 0 ? '+' : ''}{diff.toFixed(2)} Bs
                              </td>
                              <td className="px-6 py-4.5 text-center">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-xs ${
                                  rep.archivado 
                                    ? 'bg-stone-100 text-stone-455 border-stone-200' 
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}>
                                  {rep.archivado ? 'Archivado' : 'Activo'}
                                </span>
                              </td>
                              <td className="px-6 py-4.5 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      setCierreSeleccionado(rep);
                                      setModalCierreDetalleAbierto(true);
                                    }}
                                    className="text-stone-500 hover:text-[#B71C1C] p-2.5 rounded-xl hover:bg-red-55 transition-colors"
                                    title="Ver Arqueo y Movimientos"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => imprimirReporteCierreIndividual(rep)}
                                    className="text-stone-500 hover:text-[#111111] p-2.5 rounded-xl hover:bg-stone-100 transition-colors"
                                    title="Reimprimir Reporte de Turno"
                                  >
                                    <Printer className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      {reportesCierre.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center py-12 text-stone-400 font-semibold uppercase tracking-wider text-xs">No se han registrado cierres de caja en la base de datos.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* =========================================================================
          MODAL: CREAR / EDITAR PRODUCTO (Fase 6: Paso 4)
          ========================================================================= */}
      {modalProductoAbierto && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-[#E5E5E5] overflow-hidden animate-in zoom-in-95 duration-200 my-8">
            
            {/* Cabecera Modal */}
            <div className="p-6 border-b border-[#E5E5E5] bg-[#FFF8F0]/30 flex items-center justify-between">
              <h3 className="font-black text-[#111111] text-lg font-serif uppercase">
                {productoSeleccionado ? 'Editar Producto' : 'Registrar Nuevo Producto'}
              </h3>
              <button 
                onClick={() => setModalProductoAbierto(false)}
                className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleGuardarProducto} className="p-6 space-y-5">
              
              {/* Nombre */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Nombre del Producto *</label>
                <input
                  type="text"
                  placeholder="Ej: Hamburguesa de Pollo Broaster"
                  value={nombreProd}
                  onChange={(e) => setNombreProd(e.target.value)}
                  required
                  className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                />
              </div>

              {/* Descripcion */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Descripción (Ingredientes / Detalles)</label>
                <textarea
                  placeholder="Escribe una breve descripción del platillo..."
                  value={descProd}
                  onChange={(e) => setDescProd(e.target.value)}
                  rows="3"
                  className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none resize-none"
                />
              </div>

              {/* Fila: Precio y Categoría */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Precio */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Precio (Bs) *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={precioProd}
                    onChange={(e) => setPrecioProd(e.target.value)}
                    required
                    className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                  />
                </div>

                {/* Categoria */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Categoría *</label>
                  <select
                    value={categoriaProd}
                    onChange={(e) => setCategoriaProd(e.target.value)}
                    required
                    className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled>Selecciona una opción</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Fotografia (Archivo) */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Fotografía / Imagen</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFotoFile(e.target.files[0])}
                    className={`block w-full text-xs text-stone-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black cursor-pointer ${theme.fileButton}`}
                  />
                  {productoSeleccionado && productoSeleccionado.fotografia && !fotoFile && (
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#E5E5E5] shrink-0 shadow-xs">
                      <img src={productoSeleccionado.fotografia} alt="Previsualización" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Switches booleanos */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                
                {/* Disponible */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={disponibleProd}
                    onChange={(e) => setDisponibleProd(e.target.checked)}
                    className="w-4.5 h-4.5 accent-[#B71C1C] rounded border-stone-300 text-[#B71C1C] focus:ring-[#B71C1C]/10 focus:ring-offset-0 focus:ring-3"
                  />
                  <span className="text-xs font-black text-stone-700 uppercase tracking-wider">¿Está Disponible?</span>
                </label>

                {/* Controla stock */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={controlaStockProd}
                    onChange={(e) => setControlaStockProd(e.target.checked)}
                    className="w-4.5 h-4.5 accent-[#B71C1C] rounded border-stone-300 text-[#B71C1C] focus:ring-[#B71C1C]/10 focus:ring-offset-0 focus:ring-3"
                  />
                  <span className="text-xs font-black text-stone-700 uppercase tracking-wider">¿Controlar Inventario (Stock)?</span>
                </label>

              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 pt-5 border-t border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => setModalProductoAbierto(false)}
                  className="bg-white hover:bg-[#FFF8F0] border border-[#E5E5E5] text-[#111111] hover:text-[#B71C1C] hover:border-[#FFC107] font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={subiendoProd}
                  className="bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white font-black px-6 py-3.5 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md uppercase tracking-wider active:scale-95"
                >
                  {subiendoProd ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando Producto...</span>
                    </>
                  ) : (
                    <span>Confirmar Guardar</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: REGISTRAR ENTRADA EN INVENTARIO (Fase 6: Paso 6)
          ========================================================================= */}
      {modalEntradaAbierto && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-[#E5E5E5] overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Cabecera */}
            <div className="p-6 border-b border-[#E5E5E5] bg-[#FFF8F0]/30 flex items-center justify-between">
              <h3 className="font-black text-[#111111] text-base font-serif uppercase">Registrar Entrada de Stock</h3>
              <button 
                onClick={() => setModalEntradaAbierto(false)}
                className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleRegistrarEntrada} className="p-6 space-y-5">
              
              <div className="p-4.5 rounded-2xl border border-[#FFC107]/30 bg-[#FFF8F0] text-left">
                <span className="block text-[9px] font-black uppercase tracking-widest text-[#7A0000]/80">Producto</span>
                <span className="font-black text-[#111111] text-sm leading-relaxed block mt-1">{productoSeleccionado?.nombre}</span>
              </div>

              {/* Cantidad de entrada */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Cantidad a Ingresar *</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Ej: 12, 24, 48..."
                  value={cantidadEntrada}
                  onChange={(e) => setCantidadEntrada(e.target.value)}
                  required
                  className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                />
              </div>

              {/* Stock mínimo */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Stock Mínimo de Alerta</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Por defecto: 5"
                  value={stockMinimoEntrada}
                  onChange={(e) => setStockMinimoEntrada(e.target.value)}
                  className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                />
                <span className="text-[10px] text-stone-400 font-semibold leading-relaxed block mt-1.5">Define a partir de qué cantidad se activa la alerta de stock bajo.</span>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 pt-5 border-t border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => setModalEntradaAbierto(false)}
                  className="bg-white hover:bg-[#FFF8F0] border border-[#E5E5E5] text-[#111111] hover:text-[#B71C1C] hover:border-[#FFC107] font-black px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={registrandoEntrada || !cantidadEntrada}
                  className="bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white font-black px-5 py-3 rounded-2xl text-xs flex items-center gap-1.5 transition-all shadow-md uppercase tracking-wider active:scale-95"
                >
                  {registrandoEntrada ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Registrando...</span>
                    </>
                  ) : (
                    <span>Registrar Entrada</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CREAR / EDITAR USUARIO
          ========================================================================= */}
      {modalUsuarioAbierto && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#E5E5E5] overflow-hidden animate-in zoom-in-95 duration-200 my-8">
            
            {/* Cabecera Modal */}
            <div className="p-6 border-b border-[#E5E5E5] bg-[#FFF8F0]/30 flex items-center justify-between">
              <h3 className="font-black text-[#111111] text-lg font-serif uppercase">
                {usuarioSeleccionado ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
              </h3>
              <button 
                onClick={() => setModalUsuarioAbierto(false)}
                className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleGuardarUsuario} className="p-6 space-y-5">
              
              {/* Nombre de Usuario */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Nombre de Usuario *</label>
                <input
                  type="text"
                  placeholder="Ej: juan_perez"
                  value={nombreUser}
                  onChange={(e) => setNombreUser(e.target.value)}
                  required
                  className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                />
              </div>

              {/* Correo Electrónico */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="Ej: juan@restaurante.com"
                  value={emailUser}
                  onChange={(e) => setEmailUser(e.target.value)}
                  className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                />
              </div>

              {/* Contraseña */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">
                  Contraseña {usuarioSeleccionado ? '(Dejar en blanco para no cambiar)' : '*'}
                </label>
                <input
                  type="password"
                  placeholder={usuarioSeleccionado ? "••••••••" : "Ingresa contraseña de acceso"}
                  value={passwordUser}
                  onChange={(e) => setPasswordUser(e.target.value)}
                  required={!usuarioSeleccionado}
                  className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                />
              </div>

              {/* Rol Dropdown */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Rol de Acceso *</label>
                <select
                  value={rolUser}
                  onChange={(e) => setRolUser(e.target.value)}
                  required
                  className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none cursor-pointer"
                >
                  <option value="" disabled>Selecciona un rol</option>
                  {roles.map(rol => (
                    <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Checkbox Estado Activo */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={estadoUser}
                    onChange={(e) => setEstadoUser(e.target.checked)}
                    className="w-4.5 h-4.5 accent-[#B71C1C] rounded border-stone-300 text-[#B71C1C] focus:ring-[#B71C1C]/10 focus:ring-offset-0 focus:ring-3"
                  />
                  <span className="text-xs font-black text-stone-700 uppercase tracking-wider">¿Cuenta Habilitada (Activa)?</span>
                </label>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 pt-5 border-t border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => setModalUsuarioAbierto(false)}
                  className="bg-white hover:bg-[#FFF8F0] border border-[#E5E5E5] text-[#111111] hover:text-[#B71C1C] hover:border-[#FFC107] font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoUsuario}
                  className="bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white font-black px-6 py-3.5 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md uppercase tracking-wider active:scale-95"
                >
                  {guardandoUsuario ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando Usuario...</span>
                    </>
                  ) : (
                    <span>Guardar Usuario</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CREAR / EDITAR EXTRA
          ========================================================================= */}
      {modalExtraAbierto && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-[#E5E5E5] overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Cabecera Modal */}
            <div className="p-6 border-b border-[#E5E5E5] bg-[#FFF8F0]/30 flex items-center justify-between">
              <h3 className="font-black text-[#111111] text-base font-serif uppercase">
                {extraSeleccionado ? 'Editar Adicional' : 'Nuevo Adicional'}
              </h3>
              <button 
                onClick={() => setModalExtraAbierto(false)}
                className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleGuardarExtra} className="p-6 space-y-5">
              
              {/* Nombre del Extra */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Nombre del Adicional *</label>
                <input
                  type="text"
                  placeholder="Ej: Tocino, Huevo Frito, etc."
                  value={nombreExtra}
                  onChange={(e) => setNombreExtra(e.target.value)}
                  required
                  className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                />
              </div>

              {/* Precio del Extra */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-[#111111]/70 uppercase tracking-widest">Precio Adicional (Bs) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={precioExtra}
                  onChange={(e) => setPrecioExtra(e.target.value)}
                  required
                  className="w-full bg-[#FFF8F0]/20 border border-[#E5E5E5] focus:border-[#B71C1C] focus:ring-4 focus:ring-[#B71C1C]/5 rounded-2xl p-4 text-sm font-semibold text-[#111111] transition-all focus:outline-none"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 pt-5 border-t border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => setModalExtraAbierto(false)}
                  className="bg-white hover:bg-[#FFF8F0] border border-[#E5E5E5] text-[#111111] hover:text-[#B71C1C] hover:border-[#FFC107] font-black px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoExtra}
                  className="bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white font-black px-5 py-3 rounded-2xl text-xs flex items-center gap-1.5 transition-all shadow-md uppercase tracking-wider active:scale-95"
                >
                  {guardandoExtra ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar Adicional</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: DETALLE DE CIERRE DE CAJA INDIVIDUAL
          ========================================================================= */}
      {modalCierreDetalleAbierto && cierreSeleccionado && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-[#E5E5E5] overflow-hidden animate-in zoom-in-95 duration-200 my-8">
            
            {/* Cabecera Modal */}
            <div className="p-6 border-b border-[#E5E5E5] bg-[#FFF8F0]/30 flex items-center justify-between">
              <div>
                <h3 className="font-black text-[#111111] text-lg flex items-center gap-2 font-serif uppercase">
                  Detalle de Cierre de Caja <FileText className="w-5 h-5 text-[#B71C1C]" />
                </h3>
                <p className="text-xs text-stone-500 font-bold mt-1 uppercase tracking-wider">Reporte #{cierreSeleccionado.id} • Cajero: {cierreSeleccionado.cajero}</p>
              </div>
              <button 
                onClick={() => {
                  setModalCierreDetalleAbierto(false);
                  setCierreSeleccionado(null);
                }}
                className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] font-sans text-sm">
              
              {/* Información General */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FFF8F0] p-4.5 rounded-2xl border border-[#FFC107]/20">
                <div>
                  <span className="block text-[9px] font-black text-[#7A0000] uppercase tracking-widest">Fecha y Hora de Cierre</span>
                  <span className="font-bold text-[#111111] leading-relaxed block mt-1">{new Date(cierreSeleccionado.fecha_cierre).toLocaleString()}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-black text-[#7A0000] uppercase tracking-widest">Descripción del Turno</span>
                  <span className="font-bold text-[#111111] leading-relaxed block mt-1">{cierreSeleccionado.turno_descripcion}</span>
                </div>
              </div>

              {/* Resumen Financiero */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-[#111111] uppercase tracking-widest border-b border-stone-150 pb-2 font-serif">Resumen Financiero</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#FFF8F0]/50 p-4 rounded-2xl border border-[#E5E5E5] hover:border-[#FFC107]/40 transition-colors shadow-xs">
                    <span className="block text-[9px] font-black text-stone-450 uppercase tracking-widest">Fondo Inicial</span>
                    <span className="font-black text-[#111111] font-serif text-sm block mt-1.5">{parseFloat(cierreSeleccionado.fondo_inicial).toFixed(2)} Bs</span>
                  </div>
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-150 transition-colors shadow-xs">
                    <span className="block text-[9px] font-black text-blue-500 uppercase tracking-widest">Ingresos QR</span>
                    <span className="font-black text-blue-750 font-serif text-sm block mt-1.5">{parseFloat(cierreSeleccionado.total_qr).toFixed(2)} Bs</span>
                  </div>
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-150 transition-colors shadow-xs">
                    <span className="block text-[9px] font-black text-emerald-600 uppercase tracking-widest">Ingresos Efectivo</span>
                    <span className="font-black text-emerald-700 font-serif text-sm block mt-1.5">{parseFloat(cierreSeleccionado.total_efectivo).toFixed(2)} Bs</span>
                  </div>
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 transition-colors shadow-xs">
                    <span className="block text-[9px] font-black text-stone-600 uppercase tracking-widest">Total Ventas</span>
                    <span className="font-black text-[#111111] font-serif text-sm block mt-1.5">{parseFloat(cierreSeleccionado.total_ventas).toFixed(2)} Bs</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-150">
                    <span className="block text-[9px] font-black text-stone-500 uppercase tracking-widest">Efectivo Esperado</span>
                    <span className="font-black text-stone-750 font-serif text-sm block mt-1.5">{parseFloat(cierreSeleccionado.efectivo_esperado).toFixed(2)} Bs</span>
                  </div>
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-150">
                    <span className="block text-[9px] font-black text-stone-500 uppercase tracking-widest">Efectivo Contado</span>
                    <span className="font-black text-stone-750 font-serif text-sm block mt-1.5">{parseFloat(cierreSeleccionado.efectivo_contado).toFixed(2)} Bs</span>
                  </div>
                  <div className={`p-4 rounded-2xl border shadow-xs ${
                    parseFloat(cierreSeleccionado.diferencia) === 0 
                      ? 'bg-emerald-50 border-emerald-150 text-emerald-700' 
                      : parseFloat(cierreSeleccionado.diferencia) > 0 
                        ? 'bg-amber-50 border-amber-150 text-amber-700' 
                        : 'bg-red-50 border-red-150 text-[#B71C1C]'
                  }`}>
                    <span className="block text-[9px] font-black uppercase tracking-widest opacity-85">Diferencia</span>
                    <span className="font-black text-lg font-serif block mt-1">
                      {parseFloat(cierreSeleccionado.diferencia) > 0 ? '+' : ''}
                      {parseFloat(cierreSeleccionado.diferencia).toFixed(2)} Bs
                    </span>
                  </div>
                </div>

                {cierreSeleccionado.notes && (
                  <div className="bg-[#FFF3E0] p-4.5 rounded-2xl border border-[#FFC107]/30 text-xs text-[#7A0000] leading-relaxed">
                    <strong className="block font-black mb-1 uppercase tracking-widest text-[10px]">Nota Explicativa por Diferencia:</strong>
                    <p className="font-semibold">{cierreSeleccionado.notas}</p>
                  </div>
                )}
              </div>

              {/* Arqueo de Efectivo Físico */}
              {(() => {
                const denoms = [
                  { key: 'b200', label: 'Billetes de 200 Bs', val: 200 },
                  { key: 'b100', label: 'Billetes de 100 Bs', val: 100 },
                  { key: 'b50', label: 'Billetes de 50 Bs', val: 50 },
                  { key: 'b20', label: 'Billetes de 20 Bs', val: 20 },
                  { key: 'b10', label: 'Billetes de 10 Bs', val: 10 },
                  { key: 'b5', label: 'Billetes de 5 Bs', val: 5 },
                  { key: 'm2', label: 'Monedas de 2 Bs', val: 2 },
                  { key: 'm1', label: 'Monedas de 1 Bs', val: 1 },
                  { key: 'm050', label: 'Monedas de 0.50 Bs', val: 0.5 },
                  { key: 'm020', label: 'Monedas de 0.20 Bs', val: 0.2 },
                ];
                const cashDetails = cierreSeleccionado.detalle_efectivo || {};
                const list = denoms.filter(d => (cashDetails[d.key] || 0) > 0);
                
                if (list.length === 0) return null;

                return (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-[#111111] uppercase tracking-widest border-b border-stone-150 pb-2 font-serif">Desglose de Efectivo Contado</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {list.map(d => {
                        const count = parseInt(cashDetails[d.key]) || 0;
                        const subtotal = count * d.val;
                        return (
                          <div key={d.key} className="bg-white p-3.5 rounded-2xl border border-[#E5E5E5] flex justify-between items-center text-xs shadow-xs hover:border-[#FFC107]/40 transition-colors duration-200">
                            <div>
                              <span className="block font-extrabold text-[#111111]">{d.label.split(' de ')[1]}</span>
                              <span className="text-[10px] text-stone-400 font-black uppercase tracking-wider">{count} und</span>
                            </div>
                            <span className="font-black text-[#111111] font-serif">{subtotal.toFixed(2)} Bs</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Movimientos del Turno */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-[#111111] uppercase tracking-widest border-b border-stone-150 pb-2 font-serif">Registro de Movimientos</h4>
                <div className="border border-[#E5E5E5] rounded-3xl overflow-hidden shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#111111] text-[#FFC107] border-b border-[#FFC107]/20 font-black uppercase text-[10px] tracking-wider">
                        <th className="px-4 py-3">Hora</th>
                        <th className="px-4 py-3">Tipo</th>
                        <th className="px-4 py-3">Descripción / Concepto</th>
                        <th className="px-4 py-3 text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {(cierreSeleccionado.detalle_movimientos || []).map((m, idx) => {
                        let badgeColor = "bg-stone-100 text-stone-700 border-stone-200";
                        if (m.type === 'Efectivo') badgeColor = "bg-green-50 text-green-700 border-green-200";
                        if (m.type === 'QR') badgeColor = "bg-blue-50 text-blue-700 border-blue-200";
                        if (m.type === 'Mixto') badgeColor = "bg-purple-50 text-purple-700 border-purple-200";
                        if (m.type === 'Anulacion') badgeColor = "bg-red-50 text-[#B71C1C] border-red-200";

                        return (
                          <tr key={idx} className="hover:bg-[#FFF8F0]/30 font-semibold text-stone-700 transition-colors duration-150">
                            <td className="px-4 py-3 text-stone-500 font-extrabold whitespace-nowrap">{m.timestamp || '-'}</td>
                            <td className="px-4 py-3">
                              <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border shadow-xs tracking-wider ${badgeColor}`}>
                                {m.type === 'Anulacion' ? 'Anulación' : m.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-[#111111] font-bold">{m.desc}</td>
                            <td className={`px-4 py-3 text-right font-black font-serif ${m.type === 'Anulacion' ? 'text-[#B71C1C]' : 'text-[#111111]'}`}>
                              {m.type === 'Anulacion' ? '-' : ''}{parseFloat(m.amount).toFixed(2)} Bs
                            </td>
                          </tr>
                        );
                      })}
                      {(!cierreSeleccionado.detalle_movimientos || cierreSeleccionado.detalle_movimientos.length === 0) && (
                        <tr>
                          <td colSpan="4" className="text-center py-8 text-stone-400 font-semibold uppercase tracking-wider text-xs">No se registraron movimientos en este turno.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Pie Modal */}
            <div className="p-6 border-t border-[#E5E5E5] bg-stone-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={() => imprimirReporteCierreIndividual(cierreSeleccionado)}
                className="w-full sm:w-auto bg-white hover:bg-[#FFF8F0] border border-[#E5E5E5] text-[#111111] hover:text-[#B71C1C] hover:border-[#FFC107] font-black px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 uppercase tracking-wider"
              >
                <Printer className="w-4 h-4 text-[#FF9800]" />
                Reimprimir Reporte (Ticket)
              </button>
              <button
                onClick={() => {
                  setModalCierreDetalleAbierto(false);
                  setCierreSeleccionado(null);
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white font-black px-6 py-3 rounded-2xl text-xs transition-all shadow-md uppercase tracking-widest active:scale-95"
              >
                Cerrar Detalle
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: REPORTE DE CONSOLIDACIÓN DE GESTIÓN (CIERRE ANUAL)
          ========================================================================= */}
      {modalConsolidacionAbierto && consolidadoData && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#E5E5E5] overflow-hidden animate-in zoom-in-95 duration-200 my-8">
            
            {/* Cabecera Modal */}
            <div className="p-6 border-b border-[#E5E5E5] bg-[#FFF8F0]/30 flex items-center justify-between">
              <div>
                <h3 className="font-black text-[#111111] text-lg flex items-center gap-2 font-serif uppercase">
                  Cierre de Gestión Completado <Sparkles className="w-5 h-5 text-[#FFC107] animate-pulse" />
                </h3>
                <p className="text-xs text-stone-500 font-bold mt-1 uppercase tracking-wider">Consolidación general y archivo de caja</p>
              </div>
              <button 
                onClick={() => {
                  setModalConsolidacionAbierto(false);
                  setConsolidadoData(null);
                }}
                className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] font-sans text-sm">
              
              {/* Alerta de Éxito */}
              <div className="bg-emerald-50 border border-emerald-150 p-4.5 rounded-3xl flex items-start gap-3.5 shadow-sm">
                <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-black text-emerald-800 text-xs uppercase tracking-widest">¡Reportes Consolidados y Archivados!</h4>
                  <p className="text-emerald-700 text-xs font-semibold mt-1 leading-relaxed">
                    Se han procesado y marcado como archivados los <strong>{consolidadoData.total_reportes_consolidados}</strong> reportes de caja activos. El contador de cierres activos ha sido restablecido a 0.
                  </p>
                </div>
              </div>

              {/* Rango y Totales */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-[#111111] uppercase tracking-widest border-b border-stone-150 pb-2 font-serif">Resumen del Periodo</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FFF8F0] p-4.5 rounded-2xl border border-[#FFC107]/25">
                  <div>
                    <span className="block text-[9px] font-black text-[#7A0000] uppercase tracking-widest">Fecha de Inicio</span>
                    <span className="font-bold text-[#111111] leading-relaxed block mt-1">{new Date(consolidadoData.fecha_inicio).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-black text-[#7A0000] uppercase tracking-widest">Fecha de Fin</span>
                    <span className="font-bold text-[#111111] leading-relaxed block mt-1">{new Date(consolidadoData.fecha_fin).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50/50 p-4.5 rounded-2xl border border-blue-150 transition-colors shadow-xs">
                    <span className="block text-[9px] font-black text-blue-500 uppercase tracking-widest">Ingresos Totales QR</span>
                    <span className="font-black text-blue-750 font-serif text-base block mt-1.5">{consolidadoData.total_qr.toFixed(2)} Bs</span>
                  </div>
                  <div className="bg-emerald-50/50 p-4.5 rounded-2xl border border-emerald-150 transition-colors shadow-xs">
                    <span className="block text-[9px] font-black text-emerald-600 uppercase tracking-widest">Ingresos Totales Efectivo</span>
                    <span className="font-black text-emerald-700 font-serif text-base block mt-1.5">{consolidadoData.total_efectivo.toFixed(2)} Bs</span>
                  </div>
                  <div className="bg-[#111111] p-4.5 rounded-2xl text-white shadow-md">
                    <span className="block text-[9px] font-black text-stone-400 uppercase tracking-widest">Ingresos Consolidados</span>
                    <span className="font-black text-white font-serif text-lg block mt-1.5">{consolidadoData.total_ingreso_general.toFixed(2)} Bs</span>
                  </div>
                </div>
              </div>

              {/* Platillos con Mayor Ingreso */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-stone-150 pb-2">
                  <h4 className="text-xs font-black text-[#111111] uppercase tracking-widest font-serif">Productos con Mayor Ingreso Generado</h4>
                  <span className="text-[9px] bg-[#FFF3E0] text-[#FF9800] border border-[#FFC107]/30 px-3 py-1 rounded-full font-black uppercase tracking-wider">Top Ventas</span>
                </div>
                <div className="border border-[#E5E5E5] rounded-3xl overflow-hidden shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#111111] text-[#FFC107] border-b border-[#FFC107]/20 font-black uppercase text-[10px] tracking-wider">
                        <th className="px-4 py-3 text-center w-12">#</th>
                        <th className="px-4 py-3">Platillo / Producto</th>
                        <th className="px-4 py-3 text-right">Monto Acumulado (Bs)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {consolidadoData.top_productos.map((p, idx) => (
                        <tr key={idx} className="hover:bg-[#FFF8F0]/30 font-semibold text-stone-700 transition-colors duration-150">
                          <td className="px-4 py-3 text-center text-stone-400 font-bold">{idx + 1}</td>
                          <td className="px-4 py-3 text-[#111111] font-extrabold">{p.producto}</td>
                          <td className="px-4 py-3 text-right font-black font-serif text-slate-800">{p.total_ingreso.toFixed(2)} Bs</td>
                        </tr>
                      ))}
                      {consolidadoData.top_productos.length === 0 && (
                        <tr>
                          <td colSpan="3" className="text-center py-8 text-stone-400 font-semibold uppercase tracking-wider text-xs">No hay información de ventas de productos en este periodo.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Pie Modal */}
            <div className="p-6 border-t border-[#E5E5E5] bg-stone-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={imprimirConsolidado}
                className="w-full sm:w-auto bg-white hover:bg-[#FFF8F0] border border-[#E5E5E5] text-[#111111] hover:text-[#B71C1C] hover:border-[#FFC107] font-black px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 uppercase tracking-wider"
              >
                <Printer className="w-4 h-4 text-[#FF9800]" />
                Imprimir Reporte de Gestión
              </button>
              <button
                onClick={() => {
                  setModalConsolidacionAbierto(false);
                  setConsolidadoData(null);
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-[#7A0000] via-[#B71C1C] to-[#D32F2F] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white font-black px-6 py-3 rounded-2xl text-xs transition-all shadow-md uppercase tracking-widest active:scale-95"
              >
                Aceptar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
