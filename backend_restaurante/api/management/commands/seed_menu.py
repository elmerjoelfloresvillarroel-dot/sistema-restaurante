import requests
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from api.models import Categoria, Producto

class Command(BaseCommand):
    help = "Poblar la base de datos con categorías y productos iniciales usando imágenes reales de comida desde Unsplash."

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Iniciando proceso de seeding con imágenes reales de Unsplash..."))

        # 1. Limpiar registros previos
        self.stdout.write("Eliminando productos y categorías existentes...")
        Producto.objects.all().delete()
        Categoria.objects.all().delete()

        # 2. Crear las 4 categorías indicadas
        self.stdout.write("Creando categorías base...")
        cat_pollos = Categoria.objects.create(nombre="Pollos")
        cat_hamburguesas = Categoria.objects.create(nombre="Hamburguesas")
        cat_lomitos = Categoria.objects.create(nombre="Lomitos")
        cat_bebidas = Categoria.objects.create(nombre="Bebidas")

        # 3. Definir los productos con URLs reales de imágenes de comida en Unsplash (600px de ancho)
        productos_data = [
            # Categoría: Pollos
            {
                "nombre": "Pollo a la Broaster Especial",
                "descripcion": "Crujientes piezas de pollo frito con nuestra receta secreta, acompañadas de papas fritas y ensalada fresca.",
                "precio": 35.00,
                "categoria": cat_pollos,
                "disponible": True,
                "image_url": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80&fit=crop"
            },
            {
                "nombre": "Pollo a la Lena Familiar",
                "descripcion": "Pollo entero marinado a las brasas de leña, servido con arroz chaufa, papas y salsas de la casa.",
                "precio": 80.00,
                "categoria": cat_pollos,
                "disponible": True,
                "image_url": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=80&fit=crop"
            },
            # Categoría: Hamburguesas
            {
                "nombre": "Hamburguesa Doble Queso y Tocino",
                "descripcion": "Doble carne premium (150g c/u), doble porción de queso cheddar fundido, tocino ahumado crujiente y aderezo especial.",
                "precio": 42.00,
                "categoria": cat_hamburguesas,
                "disponible": True,
                "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80&fit=crop"
            },
            {
                "nombre": "Hamburguesa Clasica Simple",
                "descripcion": "Carne premium de res a la parrilla, lechuga fresca, rodajas de tomate, cebolla morada y salsas clásicas.",
                "precio": 25.00,
                "categoria": cat_hamburguesas,
                "disponible": True,
                "image_url": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80&fit=crop"
            },
            {
                "nombre": "Hamburguesa Super Bacon Monster",
                "descripcion": "Nuestra hamburguesa más grande: triple carne, triple queso, abundante tocino y huevo frito. ¡Solo para valientes!",
                "precio": 55.00,
                "categoria": cat_hamburguesas,
                "disponible": False,  # Configurada como NO disponible (AGOTADO) para pruebas
                "image_url": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&q=80&fit=crop"
            },
            # Categoría: Lomitos
            {
                "nombre": "Lomito Especial con Queso y Huevo",
                "descripcion": "Fino filete de lomo de res salteado con cebollas y pimientos, cubierto con queso fundido y huevo frito en pan especial.",
                "precio": 48.00,
                "categoria": cat_lomitos,
                "disponible": True,
                "image_url": "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600&q=80&fit=crop"
            },
            {
                "nombre": "Lomito Montado Familiar",
                "descripcion": "Doble porción de lomito de res a la plancha, servido al plato con arroz, papas fritas, plátano frito y dos huevos.",
                "precio": 95.00,
                "categoria": cat_lomitos,
                "disponible": True,
                "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80&fit=crop"
            },
            # Categoría: Bebidas
            {
                "nombre": "Gaseosa Coca-Cola 2L",
                "descripcion": "Refrescante gaseosa familiar sabor original helada de 2 litros, ideal para compartir.",
                "precio": 15.00,
                "categoria": cat_bebidas,
                "disponible": True,
                "image_url": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80&fit=crop"
            },
            {
                "nombre": "Jugo Natural de Maracuya 1L",
                "descripcion": "Jugo natural concentrado de fruta de la pasión fresca, endulzado al gusto y servido bien frío.",
                "precio": 18.00,
                "categoria": cat_bebidas,
                "disponible": True,
                "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80&fit=crop"
            }
        ]

        # 4. Crear los productos y descargar sus imágenes desde Unsplash
        self.stdout.write("Poblando productos y descargando imágenes reales...")
        for data in productos_data:
            nombre = data["nombre"]
            self.stdout.write(f"Procesando y descargando imagen para: {nombre}...")
            
            # Instanciar el producto
            producto = Producto(
                nombre=nombre,
                descripcion=data["descripcion"],
                precio=data["precio"],
                categoria=data["categoria"],
                disponible=data["disponible"]
            )
            
            try:
                # Descargar la imagen real de comida
                response = requests.get(data["image_url"], timeout=15)
                if response.status_code == 200:
                    filename = f"{nombre.replace(' ', '_').lower()}.jpg"
                    # Guardar archivo directamente al ImageField
                    producto.fotografia.save(filename, ContentFile(response.content), save=False)
                else:
                    self.stdout.write(self.style.WARNING(f" -> No se pudo descargar la imagen para {nombre} (Status {response.status_code})."))
            except Exception as e:
                self.stdout.write(self.style.WARNING(f" -> Error de conexión al descargar la imagen de {nombre}: {e}"))

            # Guardar el producto final con la imagen asociada
            producto.save()

        self.stdout.write(self.style.SUCCESS("¡Comando de Seeding finalizado con éxito! Todos los productos y categorías se crearon con imágenes de comida reales."))
