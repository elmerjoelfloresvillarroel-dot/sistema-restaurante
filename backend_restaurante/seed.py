from api.models import Categoria, Producto, Mesa

def run():
    # Limpiar datos existentes
    Producto.objects.all().delete()
    Categoria.objects.all().delete()
    Mesa.objects.all().delete()

    # Crear Categorías
    c_carnes = Categoria.objects.create(nombre="Carnes y Parrillas")
    c_pastas = Categoria.objects.create(nombre="Pastas Italianas")
    c_bebidas = Categoria.objects.create(nombre="Bebidas y Cocteles")
    c_postres = Categoria.objects.create(nombre="Postres del Chef")

    # Crear Productos
    Producto.objects.create(
        nombre="Bife de Chorizo Premium",
        descripcion="350g de jugoso corte de res premium a la parrilla, acompañado de papas fritas y ensalada fresca de la casa.",
        precio=85.00,
        categoria=c_carnes,
        disponible=True,
        controla_stock=False
    )
    Producto.objects.create(
        nombre="Fettuccine Alfredo con Pollo",
        descripcion="Fettuccine artesanal bañado en cremosa salsa Alfredo con queso parmesano y tiras de pechuga de pollo grillada.",
        precio=65.00,
        categoria=c_pastas,
        disponible=True,
        controla_stock=False
    )
    Producto.objects.create(
        nombre="Limonada de Hierbabuena",
        descripcion="Bebida refrescante a base de limón natural, hierbabuena fresca, hielo frappé y un toque dulce de miel silvestre.",
        precio=20.00,
        categoria=c_bebidas,
        disponible=True,
        controla_stock=True
    )
    Producto.objects.create(
        nombre="Volcán de Chocolate (Coulant)",
        descripcion="Espectacular bizcocho de chocolate belga con centro líquido fundido, servido caliente con helado de vainilla.",
        precio=35.00,
        categoria=c_postres,
        disponible=False,  # Agotado para probar la lógica de disponibilidad
        controla_stock=False
    )
    Producto.objects.create(
        nombre="Cerveza Artesanal Amber Ale",
        descripcion="Cerveza de malta caramelizada de producción local con notas frutales y amargor moderado.",
        precio=28.00,
        categoria=c_bebidas,
        disponible=True,
        controla_stock=True
    )

    # Crear Mesas
    Mesa.objects.create(numero=1, capacidad=2, estado="Libre")
    Mesa.objects.create(numero=2, capacidad=4, estado="Libre")
    Mesa.objects.create(numero=3, capacidad=4, estado="Ocupada")
    Mesa.objects.create(numero=4, capacidad=6, estado="Reservada")

    print("¡Base de datos del restaurante poblada con éxito!")
