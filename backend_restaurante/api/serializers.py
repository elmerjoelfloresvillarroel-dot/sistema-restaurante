from rest_framework import serializers
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

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = "__all__"


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = "__all__"
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        # Override create to correctly hash passwords
        password = validated_data.pop("password", None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        # Override update to correctly hash passwords if updated
        password = validated_data.pop("password", None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = "__all__"


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = "__all__"


class MesaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mesa
        fields = "__all__"


class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = "__all__"


class DetallePedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetallePedido
        fields = "__all__"


class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = "__all__"


class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = "__all__"


class ClienteDeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = ClienteDelivery
        fields = "__all__"


class PedidoDeliverySerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.ReadOnlyField(source='cliente.nombre')
    cliente_telefono = serializers.ReadOnlyField(source='cliente.telefono')
    cliente_direccion = serializers.ReadOnlyField(source='cliente.direccion')
    pedido_total = serializers.ReadOnlyField(source='pedido.total')

    class Meta:
        model = PedidoDelivery
        fields = "__all__"


class InventarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventario
        fields = "__all__"


class MovimientoInventarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovimientoInventario
        fields = "__all__"


class PromocionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promocion
        fields = "__all__"


class ExtraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Extra
        fields = "__all__"


class ConfiguracionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuracion
        fields = "__all__"


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Custom claims in JWT payload
        token['username'] = user.username
        token['rol'] = user.rol.nombre if user.rol else None
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Additional fields returned in HTTP Response body
        data['username'] = self.user.username
        data['rol'] = self.user.rol.nombre if self.user.rol else None
        data['id'] = self.user.id
        return data


class ReporteCierreSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReporteCierre
        fields = "__all__"

