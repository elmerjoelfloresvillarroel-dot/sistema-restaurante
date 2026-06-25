from rest_framework import viewsets, permissions
from .models import (
    Rol,
    Usuario,
    Categoria,
    Producto,
    Mesa,
    Pedido,
    DetallePedido,
    Pago,
    Reserva,
    ClienteDelivery,
    PedidoDelivery,
    Inventario,
    MovimientoInventario,
    Promocion,
    Extra,
    Configuracion,
    ReporteCierre,
)
from .serializers import (
    RolSerializer,
    UsuarioSerializer,
    CategoriaSerializer,
    ProductoSerializer,
    MesaSerializer,
    PedidoSerializer,
    DetallePedidoSerializer,
    PagoSerializer,
    ReservaSerializer,
    ClienteDeliverySerializer,
    PedidoDeliverySerializer,
    InventarioSerializer,
    MovimientoInventarioSerializer,
    PromocionSerializer,
    ExtraSerializer,
    ConfiguracionSerializer,
    ReporteCierreSerializer,
)

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    permission_classes = [permissions.AllowAny]  # Habilitado AllowAny para facilitar desarrollo


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    # Podría requerir autenticación para ver los usuarios, pero permitiremos AllowAny para pruebas
    permission_classes = [permissions.AllowAny]


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.AllowAny]


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [permissions.AllowAny]


class MesaViewSet(viewsets.ModelViewSet):
    queryset = Mesa.objects.all()
    serializer_class = MesaSerializer
    permission_classes = [permissions.AllowAny]


class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [permissions.AllowAny]


class DetallePedidoViewSet(viewsets.ModelViewSet):
    queryset = DetallePedido.objects.all()
    serializer_class = DetallePedidoSerializer
    permission_classes = [permissions.AllowAny]


class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer
    permission_classes = [permissions.AllowAny]


class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    permission_classes = [permissions.AllowAny]


class ClienteDeliveryViewSet(viewsets.ModelViewSet):
    queryset = ClienteDelivery.objects.all()
    serializer_class = ClienteDeliverySerializer
    permission_classes = [permissions.AllowAny]


class PedidoDeliveryViewSet(viewsets.ModelViewSet):
    queryset = PedidoDelivery.objects.all()
    serializer_class = PedidoDeliverySerializer
    permission_classes = [permissions.AllowAny]


class InventarioViewSet(viewsets.ModelViewSet):
    queryset = Inventario.objects.all()
    serializer_class = InventarioSerializer
    permission_classes = [permissions.AllowAny]


class MovimientoInventarioViewSet(viewsets.ModelViewSet):
    queryset = MovimientoInventario.objects.all()
    serializer_class = MovimientoInventarioSerializer
    permission_classes = [permissions.AllowAny]


class PromocionViewSet(viewsets.ModelViewSet):
    queryset = Promocion.objects.all()
    serializer_class = PromocionSerializer
    permission_classes = [permissions.AllowAny]


class ExtraViewSet(viewsets.ModelViewSet):
    queryset = Extra.objects.all()
    serializer_class = ExtraSerializer
    permission_classes = [permissions.AllowAny]


class ConfiguracionViewSet(viewsets.ModelViewSet):
    queryset = Configuracion.objects.all()
    serializer_class = ConfiguracionSerializer
    permission_classes = [permissions.AllowAny]


import os
import json
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def configuracion_sitio(request):
    config_path = os.path.join(settings.MEDIA_ROOT, 'configuracion_sitio.json')
    
    # Asegurar que el directorio media existe
    os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
    
    DEFAULT_CONFIG = {
        "nombre_restaurante": "La Reconciliación",
        "titulo_hero": "Bienvenidos a La Reconciliación",
        "descripcion_hero": "Disfruta de nuestra selecta variedad de cortes de carne, pastas artesanales y bebidas preparadas al instante con los ingredientes más frescos.",
        "horario": "Lun - Dom: 18:00 - 23:30",
        "direccion": "Av. Principal #450, Zona Central",
        "color_tema": "orange",
        "telefono": "+591 77889900",
        "tiempo_entrega": "30 min",
        "rating": "4.9",
        "link_facebook": "https://facebook.com",
        "link_whatsapp": "https://wa.me/59177889900",
        "link_instagram": "https://instagram.com",
        "link_tiktok": "https://tiktok.com",
        "horario_semana": "18:00 - 23:00",
        "horario_sabado": "12:00 - 23:30",
        "horario_domingo": "12:00 - 22:00",
        "esta_abierto": True
    }

    if request.method == 'GET':
        if os.path.exists(config_path):
            try:
                with open(config_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                merged_data = {**DEFAULT_CONFIG, **data}
                return Response(merged_data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(DEFAULT_CONFIG, status=status.HTTP_200_OK)
        else:
            return Response(DEFAULT_CONFIG, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        try:
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(request.data, f, ensure_ascii=False, indent=4)
            return Response(request.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


from rest_framework.decorators import action
from django.db.models import Sum

class ReporteCierreViewSet(viewsets.ModelViewSet):
    queryset = ReporteCierre.objects.all().order_by('-fecha_cierre')
    serializer_class = ReporteCierreSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'])
    def conteo(self, request):
        count = ReporteCierre.objects.filter(archivado=False).count()
        return Response({"conteo_activo": count})

    @action(detail=False, methods=['post'])
    def consolidar(self, request):
        reportes_activos = ReporteCierre.objects.filter(archivado=False)
        if not reportes_activos.exists():
            return Response({"detail": "No hay reportes de caja activos para consolidar."}, status=status.HTTP_400_BAD_REQUEST)

        # Rango de fechas
        fechas = [r.fecha_cierre for r in reportes_activos]
        fecha_min = min(fechas)
        fecha_max = max(fechas)

        # Totales financieros
        total_qr = sum(r.total_qr for r in reportes_activos)
        total_efectivo = sum(r.total_efectivo for r in reportes_activos)
        total_ingreso_general = total_qr + total_efectivo
        total_reportes = reportes_activos.count()

        # Productos que más ingresos generaron
        top_productos = (
            DetallePedido.objects.filter(
                pedido__estado='Pagado',
                pedido__fecha_creacion__range=(fecha_min, fecha_max)
            )
            .values('producto__nombre')
            .annotate(total_ingreso=Sum('subtotal'))
            .order_by('-total_ingreso')[:10]
        )

        top_productos_list = []
        for tp in top_productos:
            top_productos_list.append({
                "producto": tp["producto__nombre"],
                "total_ingreso": float(tp["total_ingreso"])
            })

        # Marcar reportes activos como archivados
        reportes_activos.update(archivado=True)

        return Response({
            "total_qr": float(total_qr),
            "total_efectivo": float(total_efectivo),
            "total_ingreso_general": float(total_ingreso_general),
            "total_reportes_consolidados": total_reportes,
            "fecha_inicio": fecha_min.isoformat(),
            "fecha_fin": fecha_max.isoformat(),
            "top_productos": top_productos_list
        })


