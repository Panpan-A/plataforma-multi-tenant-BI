# Plataforma Multi-Tenant BI

Sistema backend para gestión, análisis y visualización de datos en un entorno multiempresa (multi-tenant).
Permite a múltiples organizaciones operar dentro de una misma plataforma con aislamiento de información y control de acceso por roles.

---

## Características principales

* Arquitectura multi-tenant (aislamiento por empresa)
* Autenticación segura con JWT
* Control de acceso por roles (RBAC)
* Auditoría de acciones
* Generación y exportación de reportes (Excel)
* Dashboard con visualización de datos
* API REST estructurada
* Pruebas unitarias e integración

---

## Arquitectura del proyecto

El sistema sigue una arquitectura modular basada en capas:

* **Controllers** → Manejo de peticiones HTTP
* **Services** → Lógica de negocio
* **Models** → Acceso a datos
* **Routes** → Definición de endpoints
* **Middleware** → Seguridad, validación y multi-tenancy

---

## Tecnologías utilizadas

### Backend

* Node.js
* Express
* MySQL
* JavaScript

### Frontend

* Tailwind CSS
* Chart.js
* SweetAlert2
* Lucide Icons

---

## Dependencias principales

### Backend

* express → Framework del servidor
* mysql2 → Conexión a base de datos
* jsonwebtoken → Autenticación JWT
* bcrypt → Encriptación de contraseñas
* dotenv → Variables de entorno
* cors → Control de acceso
* exceljs → Exportación a Excel
* express-validator → Validación de datos

### Testing

* jest
* supertest

### Desarrollo

* nodemon

---

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/Panpan-A/plataforma-multi-tenant-BI.git
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

Crear archivo `.env` con:

```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=tu_base
JWT_SECRET=tu_secreto
```

4. Importar base de datos:

* Usar archivo `icono.sql`

5. Ejecutar servidor:

```bash
npm run dev
```

---

## Seguridad

* Uso de JWT para autenticación
* Hashing de contraseñas con bcrypt
* Middleware de roles y permisos
* Separación de datos por tenant

---

##  Pruebas

Ejecutar pruebas con:

```bash
npm test
```

---

## Uso del sistema

* Login de usuarios
* Gestión de empresas (tenants)
* Creación y ejecución de queries
* Visualización en dashboard
* Exportación de reportes

---

## Futuras mejoras

* Implementación de Docker
* Documentación con Swagger
* Despliegue en la nube (AWS / Vercel)
* Sistema de caché (Redis)

---

## Autor

Desarrollado por Andrea Panduro
