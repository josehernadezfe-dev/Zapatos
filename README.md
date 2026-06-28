# 🎯 StepVibe - Tienda Premium de Zapatillas

Una tienda online profesional y completamente funcional de zapatillas, con frontend moderno en HTML5/CSS3/JavaScript y backend robusto en Java/Spring Boot.

## 📋 Características Principales

### Frontend
- ✅ **Diseño Responsive** - Funciona perfecto en móvil, tablet y desktop
- ✅ **Minimalista y Profesional** - Colores blanco, negro y azul
- ✅ **Carrusel Automático** - Banner promocional con transiciones suaves
- ✅ **Búsqueda en Tiempo Real** - Filtro instantáneo de productos
- ✅ **Carrito Persistente** - LocalStorage para no perder datos al recargar
- ✅ **Panel de Administración** - Agregar, editar y eliminar productos
- ✅ **Animaciones Suaves** - Efectos visuales elegantes sin ser excesivos

### Backend
- ✅ **API REST Completa** - CRUD completo de productos
- ✅ **Gestión de Archivos** - Upload y almacenamiento de imágenes
- ✅ **Base de Datos MySQL** - Persistencia y seguridad de datos
- ✅ **Validaciones Robustas** - Validación de entrada en cliente y servidor
- ✅ **Logging Detallado** - Trazabilidad de operaciones
- ✅ **CORS Configurado** - Comunicación segura entre frontend y backend

## 📁 Estructura del Proyecto

```
stepvibe-store/
│
├── frontend/
│   ├── index.html          # Estructura HTML5
│   ├── style.css           # Estilos CSS3 responsive
│   └── script.js           # Lógica JavaScript
│
├── backend/
│   ├── src/main/java/com/stepvibe/
│   │   ├── StepVibeApplication.java     # Clase principal
│   │   ├── config/
│   │   │   └── CorsConfig.java          # Configuración CORS
│   │   ├── controller/
│   │   │   ├── ProductController.java   # API REST endpoints
│   │   │   └── HealthController.java    # Health check
│   │   ├── service/
│   │   │   ├── ProductService.java      # Lógica de negocio
│   │   │   └── FileStorageService.java  # Manejo de archivos
│   │   ├── entity/
│   │   │   └── Product.java             # Entidad JPA
│   │   ├── repository/
│   │   │   └── ProductRepository.java   # Acceso a BD
│   │   ├── dto/
│   │   │   └── ProductDTO.java          # Transfer Object
│   │   └── exception/
│   │       └── ResourceNotFoundException.java
│   │
│   ├── src/main/resources/
│   │   ├── application.properties       # Configuración
│   │   └── data.sql                     # Datos iniciales (opcional)
│   │
│   ├── uploads/images/                  # Carpeta para imágenes (se crea automáticamente)
│   └── pom.xml                          # Dependencias Maven
│
├── database/
│   └── script.sql                       # Script de creación de BD
│
└── README.md                            # Este archivo
```

## 🚀 Guía de Instalación

### Requisitos Previos

- **Java**: JDK 17 o superior
- **Maven**: 3.6+
- **MySQL**: 5.7 o superior
- **Node.js**: (opcional, solo si usas live server)
- **Git**: Para clonar el repositorio

### Paso 1: Preparar la Base de Datos

#### Opción A: phpMyAdmin
1. Abre phpMyAdmin (http://localhost/phpmyadmin)
2. Crea una nueva base de datos llamada `stepvibe_db`
3. Selecciona la BD y haz clic en "Importar"
4. Selecciona el archivo `script.sql` y ejecuta

#### Opción B: Línea de Comandos
```bash
mysql -u root -p < script.sql
```

#### Opción C: Cliente MySQL
```sql
CREATE DATABASE stepvibe_db;
USE stepvibe_db;
-- Luego copiar el contenido de script.sql y ejecutar
```

### Paso 2: Configurar el Backend

1. **Actualizar credenciales de BD** en `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/stepvibe_db
spring.datasource.username=root
spring.datasource.password=tu_contraseña
```

2. **Instalar dependencias**:
```bash
cd backend
mvn clean install
```

3. **Ejecutar la aplicación**:
```bash
mvn spring-boot:run
```

O desde el IDE (IntelliJ, Eclipse, VS Code):
- Click derecho en `StepVibeApplication.java`
- Selecciona "Run"

**La API estará disponible en**: `http://localhost:8080/api`

### Paso 3: Ejecutar el Frontend

#### Opción A: Live Server (VS Code)
1. Abre la carpeta `frontend` en VS Code
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"
4. Se abrirá automáticamente en el navegador

#### Opción B: HTTP Server Local
```bash
cd frontend
python -m http.server 8000
# Accede a http://localhost:8000
```

#### Opción C: Navegador Directo
- Abre directamente el archivo `index.html` en el navegador
- Nota: Algunos navegadores pueden tener restricciones CORS

## 🛠️ Uso de la Aplicación

### Panel de Administración

1. **Acceder al Panel**:
   - Haz clic en el ícono de engranaje (⚙️) en la esquina superior derecha
   - Ingresa la contraseña: `12345`

2. **Agregar Producto**:
   - Pestaña "Agregar Producto"
   - Completa todos los campos
   - **Nombre**: Nombre del producto
   - **Descripción**: Detalles del producto
   - **Precio**: En pesos colombianos
   - **Tallas**: Separadas por coma (ej: 36,37,38,39,40)
   - **Imagen**: Sube una foto desde tu computador
   - **Destacado**: Marca si quieres que aparezca en sección destacados
   - Haz clic en "Agregar Producto"

3. **Gestionar Productos**:
   - Pestaña "Gestionar Productos"
   - Aquí ves todos los productos
   - **Editar**: Modifica producto (en desarrollo)
   - **Eliminar**: Borra el producto y su imagen

### Cliente (Comprador)

1. **Buscar Productos**:
   - Usa la barra de búsqueda superior
   - Busca por nombre o descripción

2. **Filtrar**:
   - **Por Precio**: Selecciona rango de precios
   - **Ordenar**: Menor a mayor, mayor a menor, alfabético

3. **Ver Detalles**:
   - Haz clic en "Ver" en el producto
   - Abre modal con detalles, imagen grande
   - Selecciona talla y cantidad
   - Agrega al carrito

4. **Carrito**:
   - Haz clic en el ícono de carrito 🛒
   - Ver todos los items
   - Cambiar cantidad o eliminar
   - Ver subtotal y total
   - "Proceder al Pago" (función en desarrollo)

## 📚 API REST Endpoints

### Obtener Productos
```
GET /api/products
Retorna: Array de todos los productos
```

### Obtener Producto por ID
```
GET /api/products/{id}
Retorna: Datos del producto específico
```

### Buscar Productos
```
GET /api/products/search?q=zapatilla
Retorna: Productos que coinciden con la búsqueda
```

### Filtrar por Precio
```
GET /api/products/filter/price?minPrice=50000&maxPrice=200000
Retorna: Productos en rango de precio
```

### Productos Destacados
```
GET /api/products/featured
Retorna: Productos marcados como destacados
```

### Crear Producto
```
POST /api/products
Headers: Content-Type: multipart/form-data
Body:
  - nombre (string)
  - descripcion (string)
  - precio (double)
  - tallas (string, separadas por coma)
  - destacado (boolean, opcional)
  - imagen (file, opcional)
Retorna: Producto creado con ID
```

### Actualizar Producto
```
PUT /api/products/{id}
Body: JSON con los campos a actualizar
Retorna: Producto actualizado
```

### Eliminar Producto
```
DELETE /api/products/{id}
Retorna: Mensaje de confirmación
```

### Health Check
```
GET /api/health
Retorna: Estado de la API
```

## 🔐 Seguridad

### Contraseña de Admin
- **Contraseña Inicial**: `12345`
- **Ubicación**: En `script.js` (línea 5)
- **Para cambiar**: 
  - Abre `script.js`
  - Cambia: `const ADMIN_PASSWORD = '12345';`
  - En producción, considera usar un backend para validación

### Mejoras Futuras de Seguridad
- Implementar JWT (JSON Web Tokens)
- Hash de contraseña con BCrypt
- HTTPS obligatorio
- Rate limiting en API
- Validación de sesión

## 🎨 Personalización

### Cambiar Colores
En `style.css`, modifica las variables CSS (línea 8-15):
```css
:root {
    --primary-color: #0052cc;  /* Azul */
    --dark-color: #000000;     /* Negro */
    --light-color: #ffffff;    /* Blanco */
}
```

### Cambiar Logo
En `index.html` línea 24:
```html
<i class="fas fa-shoe-prints"></i>
<span>StepVibe</span>
```

### Cambiar Textos
Todos los textos están en:
- `index.html` para estructura
- Contenido dinámico en `script.js`

## 🐛 Solución de Problemas

### Error: "API no disponible"
- ✅ Verifica que el backend esté corriendo en `http://localhost:8080`
- ✅ Comprueba que MySQL está iniciado
- ✅ Revisa los logs de la consola (F12)

### Error: "Conexión rechazada a BD"
- ✅ Verifica credenciales en `application.properties`
- ✅ Asegúrate que MySQL está corriendo
- ✅ Verifica que la BD `stepvibe_db` existe

### Imágenes no se cargan
- ✅ Asegúrate que la carpeta `uploads/images/` existe
- ✅ Verifica permisos de escritura en la carpeta
- ✅ Revisa la ruta en `application.properties`

### CORS Error
- ✅ Backend debe tener CORS habilitado (ya está en `CorsConfig.java`)
- ✅ Ajusta `allowedOrigins` según dónde corra el frontend
- ✅ Verifica que no hay bloques de firewall

### Modal de Admin no funciona
- ✅ Abre la consola (F12) y verifica errores
- ✅ Revisa que la contraseña sea correcta (12345)
- ✅ Intenta recargar la página (Ctrl+Shift+R)

## 📈 Próximas Mejoras

- [ ] Autenticación de usuarios
- [ ] Sistema de pagos (PayPal, Stripe)
- [ ] Carrito con sesión/usuario
- [ ] Favoritos
- [ ] Calificaciones y comentarios
- [ ] Dashboard de ventas
- [ ] Emails transaccionales
- [ ] Seguimiento de pedidos
- [ ] Integración con WhatsApp
- [ ] App móvil nativa

## 📞 Soporte

Si encuentras problemas:
1. Revisa la sección "Solución de Problemas"
2. Verifica los logs en la consola (F12)
3. Comprueba que todos los servicios estén corriendo

## 📄 Licencia

Este proyecto es de código abierto. Úsalo libremente para aprender y mejorar.

## 👨‍💻 Autor

Desarrollado como un ejemplo profesional de tienda online.

---

### Checklist de Inicio Rápido

- [ ] Base de datos MySQL creada
- [ ] `script.sql` ejecutado
- [ ] Credenciales actualizadas en `application.properties`
- [ ] Backend corriendo en `http://localhost:8080`
- [ ] Frontend abierto en navegador
- [ ] Panel de admin accesible con contraseña 12345
- [ ] Capaz de agregar primer producto
- [ ] Producto aparece en tienda
- [ ] Búsqueda funciona
- [ ] Carrito agrega y persiste

**¡Listo para vender zapatillas! 🎉**
