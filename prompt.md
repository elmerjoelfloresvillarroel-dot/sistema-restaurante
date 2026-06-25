# Instrucciones de Desarrollo Backend - Sistema de Restaurante

Actúa como un desarrollador Senior experto en Python, Django REST Framework y PostgreSQL. Vamos a construir desde cero el backend para un sistema de restaurante con arquitectura desacoplada (Frontend en React).

## Paso 1: Configuración Inicial
En una carpeta vacía, crea un entorno virtual, instala django, djangorestframework, djangorestframework-simplejwt, django-cors-headers y psycopg2. Inicia un proyecto de Django llamado backend_restaurante y crea una aplicación llamada api.
Configura settings.py para conectarse a PostgreSQL (Base de datos: 'restaurante_cenas_db', usuario: 'postgres', y pide la contraseña al usuario). Asegúrate de configurar CORS para permitir peticiones del frontend y añadir la configuración básica de JWT.

## Paso 2: Modelos de la Base de Datos (models.py)
En la app api, escribe el archivo models.py creando las siguientes tablas con sus respectivos tipos de datos y relaciones (usa las convenciones de Django). No crees un modelo físico para 'reportes':

* **Rol**: nombre (Administrador, Cajero).
* **Usuario**: Extiende de AbstractUser. Añade campos: estado (boolean, default=True) y relación ForeignKey con Rol.
* **Categoria**: nombre.
* **Producto**: nombre, descripcion, precio (DecimalField), fotografia (ImageField), categoria (ForeignKey), disponible (boolean, default=True), controla_stock (boolean, default=False).
* **Mesa**: numero, capacidad, estado (choices: Libre, Ocupada, Reservada).
* **Pedido**: tipo_pedido (choices: Consumo local, Para llevar, Delivery), estado (choices: Pendiente de pago, Pagado, Cancelado), mesa (ForeignKey, nulo/blank para delivery o llevar), total (DecimalField), observaciones (TextField).
* **DetallePedido**: pedido (ForeignKey), producto (ForeignKey), cantidad, subtotal.
* **Pago**: pedido (OneToOneField), metodo (choices: Efectivo, QR, Mixto), monto_efectivo, monto_qr.
* **Reserva**: nombre, telefono, fecha, hora, cantidad_personas, observaciones, estado (choices: Pendiente, Confirmada, Cancelada).
* **ClienteDelivery**: nombre, telefono, direccion.
* **PedidoDelivery**: pedido (OneToOneField), cliente (ForeignKey a ClienteDelivery), estado (choices: Pendiente, Aceptado, Rechazado, Preparando, En camino, Entregado).
* **Inventario**: producto (OneToOneField), cantidad_actual, stock_minimo. (Nota: Recuerda que solo se controlarán bebidas por unidad, no ingredientes).
* **MovimientoInventario**: inventario (ForeignKey), tipo (choices: Entrada, Ajuste, Salida), cantidad, fecha (DateTimeField auto_now_add).
* **Promocion**: titulo, descripcion, imagen (ImageField), fecha_inicio, fecha_fin.

## Paso 3: Ejecución
Entrégame el código limpio de models.py. Luego, indícame exactamente los comandos de terminal (makemigrations y migrate) para empujar estos modelos a la base de datos PostgreSQL.

---

# Fase 2: Capa de API y Serializadores

Los modelos ya están creados y migrados a la base de datos correctamente. Ahora, actúa como un experto en Django REST Framework y vamos a construir la capa de la API para que el frontend en React pueda consumirla.

## Paso 1: Serializadores (serializers.py)
En la app api, crea el archivo serializers.py. Importa todos los modelos y crea un ModelSerializer para cada uno de ellos (Usuario, Rol, Categoria, Producto, Mesa, Pedido, DetallePedido, Pago, Reserva, ClienteDelivery, PedidoDelivery, Inventario, MovimientoInventario, Promocion). Asegúrate de incluir `__all__` en los campos.

## Paso 2: Vistas (views.py)
En el archivo views.py de la app api, importa todos los modelos y los serializadores que acabas de crear. Genera un ModelViewSet para cada una de las entidades.

## Paso 3: Rutas (urls.py)
Crea un archivo urls.py dentro de la app api. Importa DefaultRouter de rest_framework y registra todos los ViewSets que creaste en el paso 2. Exporta el urlpatterns del router.

## Paso 4: Rutas Principales
Indícame el código exacto que debo poner en el archivo urls.py principal del proyecto (backend_restaurante/urls.py) para incluir las rutas de la app api bajo el prefijo api/ y para configurar las rutas de autenticación con JWT (TokenObtainPairView y TokenRefreshView).

Entrégame el código limpio de estos 4 archivos.

---

# Fase 3: Inicialización del Frontend en React (Vite + Tailwind CSS)

El backend en Django ya está listo y seguro. Ahora actúa como un desarrollador Senior Front-End experto en React, Vite y Tailwind CSS. Vamos a inicializar el proyecto visual.

## Paso 1: Instalación
Crea una nueva carpeta llamada frontend. Dentro de ella, inicializa un nuevo proyecto de React usando Vite (por ejemplo: npm create vite@latest . -- --template react). Luego, instala las dependencias base con npm install.

## Paso 2: Tailwind CSS
Instala y configura Tailwind CSS, PostCSS y Autoprefixer. Genera los archivos tailwind.config.js y postcss.config.js, y configura las rutas (src/**/*.{js,jsx,ts,tsx}) en el content de Tailwind. Agrega las directivas de Tailwind (@tailwind base; @tailwind components; @tailwind utilities;) al archivo src/index.css.

## Paso 3: Librerías esenciales
Instala las siguientes librerías para el proyecto: react-router-dom (para la navegación del menú y la caja), axios (para conectarnos a nuestra API de Django de forma sencilla), y lucide-react (para tener íconos modernos en los botones).

## Paso 4: Estructura de carpetas
Dentro de la carpeta src de React, crea la siguiente estructura de subcarpetas para mantener el orden del proyecto: components, pages, services, context, y assets.

Realiza estas configuraciones y dime cuando el entorno de React esté listo para levantar el servidor de desarrollo.

