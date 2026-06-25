from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RolViewSet,
    UsuarioViewSet,
    CategoriaViewSet,
    ProductoViewSet,
    MesaViewSet,
    PedidoViewSet,
    DetallePedidoViewSet,
    PagoViewSet,
    ReservaViewSet,
    ClienteDeliveryViewSet,
    PedidoDeliveryViewSet,
    InventarioViewSet,
    MovimientoInventarioViewSet,
    PromocionViewSet,
    ExtraViewSet,
    ConfiguracionViewSet,
    configuracion_sitio,
    ReporteCierreViewSet,
)

# Inicializar router por defecto
router = DefaultRouter()

# Registrar ViewSets en el router
router.register(r"roles", RolViewSet, basename="rol")
router.register(r"usuarios", UsuarioViewSet, basename="usuario")
router.register(r"categorias", CategoriaViewSet, basename="categoria")
router.register(r"productos", ProductoViewSet, basename="producto")
router.register(r"mesas", MesaViewSet, basename="mesa")
router.register(r"pedidos", PedidoViewSet, basename="pedido")
router.register(r"detalles-pedido", DetallePedidoViewSet, basename="detallepedido")
router.register(r"detallepedidos", DetallePedidoViewSet, basename="detallepedido_alias")
router.register(r"pagos", PagoViewSet, basename="pago")
router.register(r"reservas", ReservaViewSet, basename="reserva")
router.register(r"clientes-delivery", ClienteDeliveryViewSet, basename="clientedelivery")
router.register(r"clientesdelivery", ClienteDeliveryViewSet, basename="clientedelivery_alias")
router.register(r"pedidos-delivery", PedidoDeliveryViewSet, basename="pedidodelivery")
router.register(r"pedidosdelivery", PedidoDeliveryViewSet, basename="pedidodelivery_alias")
router.register(r"inventarios", InventarioViewSet, basename="inventario")
router.register(r"movimientos-inventario", MovimientoInventarioViewSet, basename="movimientoinventario")
router.register(r"promociones", PromocionViewSet, basename="promocion")
router.register(r"extras", ExtraViewSet, basename="extra")
router.register(r"configuraciones", ConfiguracionViewSet, basename="configuracion")
router.register(r"reportes-cierre", ReporteCierreViewSet, basename="reportecierre")

# Exportar las urls del router
urlpatterns = [
    path("configuracion/", configuracion_sitio, name="configuracion_sitio"),
    path("", include(router.urls)),
]
