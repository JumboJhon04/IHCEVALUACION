const db = require('../config/db');
const validators = require('../validators');

const createHallazgo = (req, res, next) => {
  const validation = validators.validateHallazgo(req.body);
  if (!validation.valid) {
    const error = new Error('Validación fallida');
    error.statusCode = 400;
    error.detalles = validation.errors;
    throw error;
  }

  const { prueba_id, frecuencia, severidad, prioridad, estado, recomendacion_mejora } = req.body;
  const sql = 'INSERT INTO hallazgos (prueba_id, frecuencia, severidad, prioridad, estado, recomendacion_mejora) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(sql, [prueba_id, frecuencia, severidad, prioridad, estado, recomendacion_mejora], (err, result) => {
    if (err) return next(err);
    res.status(201).json({ id: result.insertId, mensaje: 'Hallazgo guardado exitosamente' });
  });
};

const getHallazgos = (req, res, next) => {
  db.query('SELECT * FROM hallazgos', (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
};

const getHallazgoById = (req, res, next) => {
  const { id } = req.params;
  db.query('SELECT * FROM hallazgos WHERE id = ?', [id], (err, results) => {
    if (err) return next(err);
    if (results.length === 0) {
      const error = new Error('Hallazgo no encontrado');
      error.statusCode = 404;
      return next(error);
    }
    res.json(results[0]);
  });
};

const updateHallazgo = (req, res, next) => {
  const validation = validators.validateHallazgo(req.body);
  if (!validation.valid) {
    const error = new Error('Validación fallida');
    error.statusCode = 400;
    error.detalles = validation.errors;
    throw error;
  }

  const { id } = req.params;
  const { prueba_id, frecuencia, severidad, prioridad, estado, recomendacion_mejora } = req.body;
  const sql = 'UPDATE hallazgos SET prueba_id = ?, frecuencia = ?, severidad = ?, prioridad = ?, estado = ?, recomendacion_mejora = ? WHERE id = ?';

  db.query(sql, [prueba_id, frecuencia, severidad, prioridad, estado, recomendacion_mejora, id], (err, result) => {
    if (err) return next(err);
    if (result.affectedRows === 0) {
      const error = new Error('Hallazgo no encontrado');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ mensaje: 'Hallazgo actualizado exitosamente' });
  });
};

const deleteHallazgo = (req, res, next) => {
  const { id } = req.params;
  db.query('DELETE FROM hallazgos WHERE id = ?', [id], (err, result) => {
    if (err) return next(err);
    if (result.affectedRows === 0) {
      const error = new Error('Hallazgo no encontrado');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ mensaje: 'Hallazgo eliminado exitosamente' });
  });
};

module.exports = {
  createHallazgo,
  getHallazgos,
  getHallazgoById,
  updateHallazgo,
  deleteHallazgo
};
