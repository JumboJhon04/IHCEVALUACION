const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const requestInfo = {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  };

  // Log del error
  logger.error(`${err.message}`, {
    ...requestInfo,
    stack: err.stack,
    code: err.code
  });

  // Errores de validación (400)
  if (err.statusCode === 400 || err.message.includes('Validación')) {
    return res.status(400).json({
      success: false,
      timestamp,
      statusCode: 400,
      error: 'Validación fallida',
      message: err.message,
      ...(err.detalles && { detalles: err.detalles })
    });
  }

  // Errores de no encontrado (404)
  if (err.statusCode === 404 || err.message.includes('no encontrado')) {
    return res.status(404).json({
      success: false,
      timestamp,
      statusCode: 404,
      error: 'Recurso no encontrado',
      message: err.message
    });
  }

  // Errores de base de datos (500)
  if (err.code && (err.code.includes('ER_') || err.code.includes('FOREIGN_KEY'))) {
    let message = 'Error en la base de datos';
    if (err.code === 'ER_NO_REFERENCED_ROW') {
      message = 'Referencia inválida: El ID proporcionado no existe en la tabla relacionada';
    } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      message = 'Violación de clave foránea: Se intentó eliminar un registro referenciado';
    }
    
    return res.status(500).json({
      success: false,
      timestamp,
      statusCode: 500,
      error: 'Error de base de datos',
      message
    });
  }

  // Error genérico (500)
  res.status(err.statusCode || 500).json({
    success: false,
    timestamp,
    statusCode: err.statusCode || 500,
    error: err.statusCode === 500 ? 'Error interno del servidor' : 'Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Algo salió mal. Por favor, intente más tarde.'
      : err.message
  });
};

// Middleware para capturar rutas no encontradas
const notFoundHandler = (req, res) => {
  logger.warn('Ruta no encontrada', {
    method: req.method,
    path: req.path
  });

  res.status(404).json({
    success: false,
    timestamp: new Date().toISOString(),
    statusCode: 404,
    error: 'Ruta no encontrada',
    message: `No se encontró el endpoint: ${req.method} ${req.path}`
  });
};

module.exports = { errorHandler, notFoundHandler };
