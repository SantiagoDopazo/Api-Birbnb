# 🏡 Birbnb - Plataforma de Reservas de Alojamientos

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![React](https://img.shields.io/badge/React-19.1.0-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-brightgreen.svg)

Proyecto integrador para la materia **Desarrollo de Software** en la UTN FRBA (1C 2025).

Birbnb es una plataforma de reservas de alojamientos no convencionales, como departamentos, cabañas y casas particulares, diseñada para facilitar la conexión entre anfitriones y huéspedes de manera sencilla, intuitiva y segura.

## 📸 Vista Previa

### Página Principal
<img width="1918" height="1029" alt="homepage" src="https://github.com/user-attachments/assets/fea12a71-dc6c-44d5-9473-40ff9b66e463" />

### Reservas
<img width="1912" height="945" alt="reservas" src="https://github.com/user-attachments/assets/bff4c8b2-6433-4cee-aa65-e3aba246a112" />

### Notificaiones
<img width="1911" height="938" alt="notificaciones" src="https://github.com/user-attachments/assets/ef97c025-b304-45ca-8e73-47c661388b21" />


## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Prerrequisitos](#-prerrequisitos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso](#-uso)
- [Testing](#-testing)
- [Documentación de API](#-documentación-de-api)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Convenciones de Desarrollo](#-convenciones-de-desarrollo)
- [Contribuir](#-contribuir)
- [Equipo](#-equipo)

## ✨ Características Principales

- **Gestión de Usuarios**: Registro, autenticación y perfiles de huéspedes y anfitriones
- **Catálogo de Alojamientos**: Búsqueda y filtrado de propiedades con imágenes y detalles
- **Sistema de Reservas**: Reservas en tiempo real con validación de disponibilidad
- **Notificaciones**: Sistema de eventos para comunicación entre usuarios
- **Panel de Control**: Dashboard para anfitriones y huéspedes
- **Diseño Responsivo**: Interfaz optimizada para dispositivos móviles y desktop

## 🛠 Tecnologías Utilizadas

### Frontend (Cliente)
- **React 19.1.0** - Biblioteca de JavaScript para interfaces de usuario
- **Ant Design 5.25.4** - Framework de componentes UI
- **React Router DOM 7.6.1** - Enrutamiento del lado del cliente
- **Axios 1.9.0** - Cliente HTTP para peticiones a la API
- **React Testing Library** - Testing de componentes React

### Backend (Servidor)
- **Node.js** - Entorno de ejecución JavaScript
- **Express 5.1.0** - Framework web para Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose 8.14.3** - ODM para MongoDB
- **Bcrypt 6.0.0** - Encriptación de contraseñas
- **Zod 3.24.2** - Validación de esquemas TypeScript-first
- **Jest 29.7.0** - Framework de testing
- **Swagger/OpenAPI** - Documentación de API

## 🏗 Arquitectura del Sistema

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    Mongoose    ┌─────────────────┐
│                 │    Requests     │                 │    ODM         │                 │
│   React Client  │ ◄─────────────► │  Express Server │ ◄─────────────►│   MongoDB       │
│   (Port 3000)   │                 │   (Port 3001)   │                │   Database      │
│                 │                 │                 │                │                 │
└─────────────────┘                 └─────────────────┘                └─────────────────┘
```

### Patrón de Arquitectura
- **MVC (Model-View-Controller)** en el backend
- **Arquitectura por Capas**: Controllers → Services → Repositories → Models
- **Event-Driven Architecture** para notificaciones
- **Repository Pattern** para abstracción de datos

## 📋 Prerrequisitos

- **Node.js** (versión 18 o superior)
- **npm** (versión 8 o superior)
- **MongoDB** (versión 7.0 o superior)
- **Git**

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/ddso-utn/2025-1c-lu-sa-grupo-06.git
cd 2025-1c-lu-sa-grupo-06
```

### 2. Configurar el Backend
```bash
cd server
npm install
```

### 3. Configurar variables de entorno
Crear archivo `.env` en la carpeta `server`:
```env
# Puerto del servidor
PORT=3001

# Base de datos MongoDB
MONGODB_URI=mongodb://localhost:27017/birbnb

# Configuración de autenticación
JWT_SECRET=tu_jwt_secret_muy_seguro
BCRYPT_ROUNDS=10

# Configuración CORS
CORS_ORIGIN=http://localhost:3000
```

### 4. Configurar el Frontend
```bash
cd ../client/birbnb
npm install
```

## 🏃‍♂️ Uso

### Desarrollo

#### Iniciar el Backend
```bash
cd server
npm run dev        # Modo desarrollo con nodemon
# o
npm start         # Modo producción
```
El servidor estará disponible en `http://localhost:3001`

#### Iniciar el Frontend
```bash
cd client/birbnb
npm start
```
La aplicación estará disponible en `http://localhost:3000`

### Producción
```bash
# Backend
cd server
npm run build
npm start

# Frontend
cd client/birbnb
npm run build
# Servir archivos estáticos con servidor web (nginx, Apache, etc.)
```

## 🧪 Testing

### Backend
```bash
cd server
npm test              # Ejecutar todos los tests
npm run test:watch    # Modo watch
npm run test:coverage # Con cobertura de código
```

### Frontend
```bash
cd client/birbnb
npm test              # Ejecutar tests de React
npm run test:coverage # Con cobertura de código
```

## 📚 Documentación de API

La API está documentada con **Swagger/OpenAPI**. Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva en:

- **Swagger UI**: `http://localhost:3001/api-docs` (si está configurado)
- **Documentación**: Ver archivo `server/docs/swagger.yaml`

### Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health_check` | Verificar estado del servidor |
| GET | `/usuarios` | Obtener usuarios |
| POST | `/usuarios` | Crear usuario |
| GET | `/alojamientos` | Listar alojamientos |
| POST | `/alojamientos` | Crear alojamiento |
| GET | `/reservas` | Obtener reservas |
| POST | `/reservas` | Crear reserva |
| GET | `/notificaciones` | Obtener notificaciones |

## 📁 Estructura del Proyecto

```
2025-1c-lu-sa-grupo-06/
├── client/                     # Aplicación Frontend React
│   └── birbnb/
│       ├── public/            # Archivos estáticos
│       ├── src/
│       │   ├── components/    # Componentes reutilizables
│       │   ├── features/      # Funcionalidades por módulo
│       │   ├── contexts/      # React Contexts
│       │   ├── lib/          # Utilidades y configuraciones
│       │   └── router/       # Configuración de rutas
│       └── package.json
├── server/                    # Aplicación Backend Node.js
│   ├── app/
│   │   ├── config/           # Configuraciones
│   │   ├── controllers/      # Controladores REST
│   │   ├── models/           # Modelos de datos y repositorios
│   │   ├── services/         # Lógica de negocio
│   │   ├── routes/           # Definición de rutas
│   │   ├── middlewares/      # Middlewares personalizados
│   │   ├── events/           # Sistema de eventos
│   │   └── errors/           # Manejo de errores
│   ├── docs/                 # Documentación API
│   ├── scripts/              # Scripts de utilidad
│   ├── tests/                # Tests unitarios e integración
│   └── package.json
└── README.md
```

## 📋 Convenciones de Desarrollo

### Convenciones para Ramas
- **Feature**: `TICKET-ID-feat-name-of-the-branch`
- **Fix**: `TICKET-ID-fix-name-of-the-branch`
- **Refactor**: `TICKET-ID-refactor-name-of-the-branch`

El `TICKET-ID` sigue el formato `DDSO-X` donde X es el número de incidencia de Jira.

### Convención de Commits
```bash
git commit -m "feature: descripción del cambio"
git commit -m "fix: descripción del fix"
git commit -m "refactor: descripción del refactor"
git commit -m "docs: actualización de documentación"
git commit -m "test: agregar/modificar tests"
```

### Workflow de GitHub
1. **Crear rama**: `git checkout -b TICKET-ID-feat-name-of-the-branch`
2. **Hacer cambios y commits**
3. **Push**: `git push origin nombre-de-rama`
4. **Crear Pull Request** en GitHub
5. **Asignar reviewer** del equipo
6. **Merge a `main`** una vez aprobado

### Pull Requests
- Título descriptivo del cambio
- Descripción detallada de qué se modificó
- Screenshots si aplica (cambios de UI)
- Tests pasando
- Asignar a un miembro del equipo para review
- Merge solo después de aprobación

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama para tu feature (`git checkout -b DDSO-X-feat-amazing-feature`)
3. Commit de cambios (`git commit -m 'feature: add amazing feature'`)
4. Push a la rama (`git push origin DDSO-X-feat-amazing-feature`)
5. Crear Pull Request

### Estándares de Código
- **ESLint** para JavaScript/React
- **Prettier** para formateo de código
- **Jest** para testing con cobertura mínima del 80%
- **Conventional Commits** para mensajes de commit
- **JSDoc** para documentación de funciones

## 👥 Equipo

| Nombre | Rol | GitHub |
|--------|-----|--------|
| **Nicolás López Belsué** | Full Stack Developer | [@nicolas-lopez] |
| **Axel Marco Caputo** | Full Stack Developer | [@axel-caputo] |
| **Kalil Alejandro Vásques Movia** | Full Stack Developer | [@kalil-vasques] |
| **Santiago Dopazo** | Full Stack Developer | [@santiago-dopazo] |

**Universidad Tecnológica Nacional - Facultad Regional Buenos Aires**  
**Diseño de Sistemas - 1C 2025** 
