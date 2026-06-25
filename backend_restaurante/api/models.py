from django.db import models
from django.contrib.auth.models import AbstractUser

# 1. Modelo Rol
class Rol(models.Model):
    nombre = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Rol"
        verbose_name_plural = "Roles"


# 2. Modelo Usuario (Extiende de AbstractUser)
class Usuario(AbstractUser):
    estado = models.BooleanField(default=True)
    rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True, blank=True, related_name="usuarios")

    def __str__(self):
        return f"{self.username} ({self.rol.nombre if self.rol else 'Sin Rol'})"

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"


# 3. Modelo Categoría
class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"


# 4. Modelo Producto
class Producto(models.Model):
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    fotografia = models.ImageField(upload_to="productos/", null=True, blank=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name="productos")
    disponible = models.BooleanField(default=True)
    controla_stock = models.BooleanField(default=False)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"


# 5. Modelo Mesa
class Mesa(models.Model):
    ESTADO_MESA_CHOICES = [
        ("Libre", "Libre"),
        ("Ocupada", "Ocupada"),
        ("Reservada", "Reservada"),
    ]

    numero = models.IntegerField(unique=True)
    capacidad = models.IntegerField()
    estado = models.CharField(max_length=20, choices=ESTADO_MESA_CHOICES, default="Libre")

    def __str__(self):
        return f"Mesa {self.numero} ({self.estado})"

    class Meta:
        verbose_name = "Mesa"
        verbose_name_plural = "Mesas"


# 6. Modelo Pedido
class Pedido(models.Model):
    TIPO_PEDIDO_CHOICES = [
        ("Consumo local", "Consumo local"),
        ("Para llevar", "Para llevar"),
        ("Delivery", "Delivery"),
    ]

    ESTADO_PEDIDO_CHOICES = [
        ("Pendiente de pago", "Pendiente de pago"),
        ("Pagado", "Pagado"),
        ("Cancelado", "Cancelado"),
    ]

    tipo_pedido = models.CharField(max_length=30, choices=TIPO_PEDIDO_CHOICES)
    estado = models.CharField(max_length=30, choices=ESTADO_PEDIDO_CHOICES, default="Pendiente de pago")
    mesa = models.ForeignKey(Mesa, on_delete=models.SET_NULL, null=True, blank=True, related_name="pedidos")
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    observaciones = models.TextField(blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pedido #{self.id} - {self.tipo_pedido} ({self.estado})"

    class Meta:
        verbose_name = "Pedido"
        verbose_name_plural = "Pedidos"


# 7. Modelo DetallePedido
class DetallePedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name="detalles")
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT, related_name="detalles_pedido")
    cantidad = models.IntegerField()
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Detalle Pedido #{self.pedido.id} - {self.producto.nombre} x {self.cantidad}"

    class Meta:
        verbose_name = "Detalle de Pedido"
        verbose_name_plural = "Detalles de Pedidos"


# 8. Modelo Pago
class Pago(models.Model):
    METODO_PAGO_CHOICES = [
        ("Efectivo", "Efectivo"),
        ("QR", "QR"),
        ("Mixto", "Mixto"),
    ]

    pedido = models.OneToOneField(Pedido, on_delete=models.CASCADE, related_name="pago")
    metodo = models.CharField(max_length=20, choices=METODO_PAGO_CHOICES)
    monto_efectivo = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    monto_qr = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    fecha_pago = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pago del Pedido #{self.pedido.id} - Metodo: {self.metodo}"

    class Meta:
        verbose_name = "Pago"
        verbose_name_plural = "Pagos"


# 9. Modelo Reserva
class Reserva(models.Model):
    ESTADO_RESERVA_CHOICES = [
        ("Pendiente", "Pendiente"),
        ("Confirmada", "Confirmada"),
        ("Cancelada", "Cancelada"),
    ]

    nombre = models.CharField(max_length=150)
    telefono = models.CharField(max_length=30)
    fecha = models.DateField()
    hora = models.TimeField()
    cantidad_personas = models.IntegerField()
    observaciones = models.TextField(blank=True)
    estado = models.CharField(max_length=20, choices=ESTADO_RESERVA_CHOICES, default="Pendiente")

    def __str__(self):
        return f"Reserva a nombre de {self.nombre} para el {self.fecha} a las {self.hora}"

    class Meta:
        verbose_name = "Reserva"
        verbose_name_plural = "Reservas"


# 10. Modelo ClienteDelivery
class ClienteDelivery(models.Model):
    nombre = models.CharField(max_length=150)
    telefono = models.CharField(max_length=30)
    direccion = models.TextField()

    def __str__(self):
        return f"Cliente Delivery: {self.nombre} ({self.telefono})"

    class Meta:
        verbose_name = "Cliente Delivery"
        verbose_name_plural = "Clientes Delivery"


# 11. Modelo PedidoDelivery
class PedidoDelivery(models.Model):
    ESTADO_DELIVERY_CHOICES = [
        ("Pendiente", "Pendiente"),
        ("Aceptado", "Aceptado"),
        ("Rechazado", "Rechazado"),
        ("Preparando", "Preparando"),
        ("En camino", "En camino"),
        ("Entregado", "Entregado"),
    ]

    pedido = models.OneToOneField(Pedido, on_delete=models.CASCADE, related_name="pedido_delivery")
    cliente = models.ForeignKey(ClienteDelivery, on_delete=models.CASCADE, related_name="pedidos_delivery")
    estado = models.CharField(max_length=20, choices=ESTADO_DELIVERY_CHOICES, default="Pendiente")

    def __str__(self):
        return f"Delivery Pedido #{self.pedido.id} - Estado: {self.estado}"

    class Meta:
        verbose_name = "Pedido Delivery"
        verbose_name_plural = "Pedidos Delivery"


# 12. Modelo Inventario
class Inventario(models.Model):
    producto = models.OneToOneField(Producto, on_delete=models.CASCADE, related_name="inventario")
    cantidad_actual = models.IntegerField(default=0)
    stock_minimo = models.IntegerField(default=0)

    def __str__(self):
        return f"Inventario de {self.producto.nombre} - Stock: {self.cantidad_actual}/{self.stock_minimo}"

    class Meta:
        verbose_name = "Inventario"
        verbose_name_plural = "Inventarios"


# 13. Modelo MovimientoInventario
class MovimientoInventario(models.Model):
    TIPO_MOVIMIENTO_CHOICES = [
        ("Entrada", "Entrada"),
        ("Ajuste", "Ajuste"),
        ("Salida", "Salida"),
    ]

    inventario = models.ForeignKey(Inventario, on_delete=models.CASCADE, related_name="movimientos")
    tipo = models.CharField(max_length=20, choices=TIPO_MOVIMIENTO_CHOICES)
    cantidad = models.IntegerField()
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Movimiento {self.tipo} ({self.cantidad}) - {self.inventario.producto.nombre}"

    class Meta:
        verbose_name = "Movimiento de Inventario"
        verbose_name_plural = "Movimientos de Inventario"


# 14. Modelo Promocion
class Promocion(models.Model):
    titulo = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    imagen = models.ImageField(upload_to="promociones/", null=True, blank=True)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()

    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name = "Promoción"
        verbose_name_plural = "Promociones"


# 15. Modelo Extra
class Extra(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.nombre} (+{self.precio} Bs)"

    class Meta:
        verbose_name = "Extra"
        verbose_name_plural = "Extras"

# 16. Modelo Configuracion
class Configuracion(models.Model):
    imagen_qr = models.ImageField(upload_to="configuracion/", null=True, blank=True)

    def __str__(self):
        return "Configuración Global"

    class Meta:
        verbose_name = "Configuración"
        verbose_name_plural = "Configuraciones"


# 17. Modelo ReporteCierre
class ReporteCierre(models.Model):
    cajero = models.CharField(max_length=150)
    fecha_cierre = models.DateTimeField(auto_now_add=True)
    turno_descripcion = models.CharField(max_length=200)
    fondo_inicial = models.DecimalField(max_digits=10, decimal_places=2)
    total_efectivo = models.DecimalField(max_digits=10, decimal_places=2)
    total_qr = models.DecimalField(max_digits=10, decimal_places=2)
    total_ventas = models.DecimalField(max_digits=10, decimal_places=2)
    efectivo_esperado = models.DecimalField(max_digits=10, decimal_places=2)
    efectivo_contado = models.DecimalField(max_digits=10, decimal_places=2)
    diferencia = models.DecimalField(max_digits=10, decimal_places=2)
    notas = models.TextField(blank=True, null=True)
    detalle_movimientos = models.JSONField(default=list, blank=True)
    detalle_efectivo = models.JSONField(default=dict, blank=True)
    archivado = models.BooleanField(default=False)

    def __str__(self):
        return f"Cierre #{self.id} - {self.cajero} - {self.fecha_cierre.strftime('%Y-%m-%d')}"

    class Meta:
        verbose_name = "Reporte de Cierre de Caja"
        verbose_name_plural = "Reportes de Cierre de Caja"

