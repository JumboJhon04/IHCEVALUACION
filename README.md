# Usability Dashboard - IHC 2026

Sistema de gestión y análisis de pruebas de usabilidad desarrollado como proyecto del sexto semestre de HCI. La aplicación permite registrar participantes, crear tareas de prueba, documentar observaciones y generar hallazgos sobre la usabilidad de interfaces.

## Descripción del Proyecto

El dashboard proporciona una interfaz integral para:

- Crear y gestionar pruebas de usabilidad
- Registrar participantes en las pruebas
- Definir tareas específicas con objetivos y criterios de éxito
- Documentar observaciones durante las pruebas
- Registro de hallazgos con análisis de severidad y prioridad
- Visualización de métricas y análisis de los resultados

## Tecnología

El proyecto está dividido en dos partes:

Backend: Node.js con Express, MySQL como base de datos y CORS para comunicación con el frontend.

Frontend: Next.js 16 con TypeScript, componentes basados en Radix UI y estilos con Tailwind CSS.

## Requisitos Previos

Antes de instalar el proyecto, necesitas tener:

- Node.js versión 16 o superior
- Docker instalado y en ejecución (para MySQL)
- Git para clonar el repositorio

## Instalación y Configuración

Clona el repositorio en tu máquina:

```bash
git clone https://github.com/JaimXD/IHC-2026.git
cd IHC-2026
```

### Configurar la Base de Datos

El proyecto utiliza MySQL en Docker. Ejecuta el siguiente comando en PowerShell (con permisos de administrador) para crear el contenedor con la base de datos:

```powershell
docker run --name usability-mysql -e MYSQL_ROOT_PASSWORD="" -e MYSQL_DATABASE=usability_dashboard -p 3306:3306 -d mysql:8.0  
```

Este comando crea un contenedor llamado usability-mysql con la base de datos usability_dashboard lista para usar.

### Instalar Dependencias del Backend

Navega a la carpeta del backend e instala las dependencias:

```bash
cd backend
npm install
```

El backend está configurado para que al iniciarse automáticamente cree todas las tablas necesarias usando el archivo usability_dashboard.sql.

### Instalar Dependencias del Frontend

En otra terminal, navega a la carpeta del frontend:

```bash
cd frontend
npm install
```

### Configuración de Variables de Entorno

El backend incluye un archivo .env con la configuración necesaria:

```
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=usability_dashboard
```

Si necesitas cambiar el puerto o las credenciales de la base de datos, edita estos valores según sea necesario.

El frontend incluye .env.local con:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Esta variable apunta al servidor backend. Si ejecutas el backend en otro puerto o máquina, actualiza esta URL.

## Ejecutar el Proyecto

Asegúrate de que Docker está ejecutando el contenedor MySQL. Puedes verificar con:

```bash
docker ps
```

Inicia el backend en una terminal:

```bash
cd backend
npm start
```

El servidor se iniciará en http://localhost:3001 y automáticamente inicializará la base de datos.

En otra terminal, inicia el frontend:

```bash
cd frontend
npm run dev
```

El cliente estará disponible en http://localhost:3000. Abre tu navegador y accede a esa dirección.

## Estructura del Proyecto

```
backend/
  config/          - Configuración de base de datos
  controllers/     - Lógica de negocio para cada entidad
  middleware/      - Middleware de Express (errores)
  routes/          - Definición de rutas API
  utils/           - Utilidades (logger, manejo async)
  validators.js    - Validación de datos
  index.js         - Punto de entrada
  initDb.js        - Script de inicialización de BD
  usability_dashboard.sql  - Esquema de la BD

frontend/
  app/             - Rutas y layouts de Next.js
  components/      - Componentes React
  lib/             - Utilidades y funciones helper
  styles/          - Estilos globales
  public/          - Archivos estáticos
```

## Entidades Principales

La base de datos contiene las siguientes tablas:

Pruebas Usabilidad: Define cada prueba con producto evaluado, módulo y objetivos.

Tareas: Escenarios específicos dentro de una prueba con resultados esperados y criterios de éxito.

Participantes: Data de personas que participan en las pruebas.

Observaciones: Registro detallado de lo observado durante cada tarea ejecutada por un participante.

Hallazgos: Problemas identificados con análisis de frecuencia, severidad y prioridad.

## API Endpoints

El backend expone las siguientes rutas:

GET /api/pruebas - Obtener todas las pruebas
POST /api/pruebas - Crear una nueva prueba
GET /api/pruebas/:id - Obtener prueba por ID
PUT /api/pruebas/:id - Actualizar prueba
DELETE /api/pruebas/:id - Eliminar prueba

GET /api/tareas - Obtener todas las tareas
POST /api/tareas - Crear tarea
GET /api/tareas/:id - Obtener tarea por ID
PUT /api/tareas/:id - Actualizar tarea
DELETE /api/tareas/:id - Eliminar tarea

GET /api/participantes - Obtener todos los participantes
POST /api/participantes - Crear participante
GET /api/participantes/:id - Obtener participante por ID
PUT /api/participantes/:id - Actualizar participante
DELETE /api/participantes/:id - Eliminar participante

GET /api/observaciones - Obtener todas las observaciones
POST /api/observaciones - Crear observación
GET /api/observaciones/:id - Obtener observación por ID
PUT /api/observaciones/:id - Actualizar observación
DELETE /api/observaciones/:id - Eliminar observación

GET /api/hallazgos - Obtener todos los hallazgos
POST /api/hallazgos - Crear hallazgo
GET /api/hallazgos/:id - Obtener hallazgo por ID
PUT /api/hallazgos/:id - Actualizar hallazgo
DELETE /api/hallazgos/:id - Eliminar hallazgo

## Solución de Problemas

Si el frontend no se conecta al backend, verifica que:

1. El backend está ejecutándose en http://localhost:3001
2. La variable NEXT_PUBLIC_API_URL en .env.local apunta a la dirección correcta
3. CORS está habilitado en el backend (ya viene configurado)

Si la base de datos no se inicializa:

1. Verifica que Docker está en ejecución y el contenedor usability-mysql está activo
2. Comprueba que el puerto 3306 no está siendo usado por otra aplicación
3. Revisa los logs del backend para mensajes de error específicos

Si tienes problemas al instalar dependencias en el frontend, intenta limpiar la caché:

```bash
npm cache clean --force
rm -r node_modules package-lock.json
npm install
```

## Autor

Desarrollado como proyecto del curso HCI - Sexto Semestre