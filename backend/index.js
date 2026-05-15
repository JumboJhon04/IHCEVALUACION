const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const initializeDatabase = require('./initDb');

const app = express();
app.use(cors());
app.use(express.json());

// Inicializar base de datos
initializeDatabase();

// Importar rutas
const pruebasRoutes = require('./routes/pruebas');
const tareasRoutes = require('./routes/tareas');
const participantesRoutes = require('./routes/participantes');
const observacionesRoutes = require('./routes/observaciones');
const hallazgosRoutes = require('./routes/hallazgos');

// Usar rutas
app.use('/api/pruebas', pruebasRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/participantes', participantesRoutes);
app.use('/api/observaciones', observacionesRoutes);
app.use('/api/hallazgos', hallazgosRoutes);

// Manejo de rutas no encontradas (debe ir ANTES del errorHandler)
app.use(notFoundHandler);

// Middleware de manejo de errores (debe ser el ÚLTIMO)
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Servidor iniciado en http://localhost:${PORT}`);
});