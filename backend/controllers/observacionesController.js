const db = require('../config/db');
const validators = require('../validators');

const createObservacion = (req, res, next) => {
  const validation = validators.validateObservacion(req.body);
  if (!validation.valid) {
    const error = new Error('Validación fallida');
    error.statusCode = 400;
    error.detalles = validation.errors;
    throw error;
  }

  const { participante_id, tarea_id, exito, tiempo_segundos, cantidad_errores, comentarios, problema_detectado, severidad, mejora_propuesta } = req.body;
  const sql = 'INSERT INTO observaciones (participante_id, tarea_id, exito, tiempo_segundos, cantidad_errores, comentarios, problema_detectado, severidad, mejora_propuesta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(sql, [participante_id, tarea_id, exito, tiempo_segundos, cantidad_errores, comentarios, problema_detectado, severidad, mejora_propuesta], (err, result) => {
    if (err) return next(err);
    res.status(201).json({ id: result.insertId, mensaje: 'Observación guardada exitosamente' });
  });
};

const getObservaciones = (req, res, next) => {
  db.query('SELECT * FROM observaciones', (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
};

const getObservacionById = (req, res, next) => {
  const { id } = req.params;
  db.query('SELECT * FROM observaciones WHERE id = ?', [id], (err, results) => {
    if (err) return next(err);
    if (results.length === 0) {
      const error = new Error('Observacion no encontrada');
      error.statusCode = 404;
      return next(error);
    }
    res.json(results[0]);
  });
};

const updateObservacion = (req, res, next) => {
  const validation = validators.validateObservacion(req.body);
  if (!validation.valid) {
    const error = new Error('Validación fallida');
    error.statusCode = 400;
    error.detalles = validation.errors;
    throw error;
  }

  const { id } = req.params;
  const { participante_id, tarea_id, exito, tiempo_segundos, cantidad_errores, comentarios, problema_detectado, severidad, mejora_propuesta } = req.body;
  const sql = 'UPDATE observaciones SET participante_id = ?, tarea_id = ?, exito = ?, tiempo_segundos = ?, cantidad_errores = ?, comentarios = ?, problema_detectado = ?, severidad = ?, mejora_propuesta = ? WHERE id = ?';

  db.query(sql, [participante_id, tarea_id, exito, tiempo_segundos, cantidad_errores, comentarios, problema_detectado, severidad, mejora_propuesta, id], (err, result) => {
    if (err) return next(err);
    if (result.affectedRows === 0) {
      const error = new Error('Observacion no encontrada');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ mensaje: 'Observacion actualizada exitosamente' });
  });
};

const deleteObservacion = (req, res, next) => {
  const { id } = req.params;
  db.query('DELETE FROM observaciones WHERE id = ?', [id], (err, result) => {
    if (err) return next(err);
    if (result.affectedRows === 0) {
      const error = new Error('Observacion no encontrada');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ mensaje: 'Observacion eliminada exitosamente' });
  });
};

module.exports = {
  createObservacion,
  getObservaciones,
  getObservacionById,
  updateObservacion,
  deleteObservacion
};
