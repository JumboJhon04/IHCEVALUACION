const db = require('../config/db');
const validators = require('../validators');

const createTarea = (req, res, next) => {
  const validation = validators.validateTarea(req.body);
  if (!validation.valid) {
    const error = new Error('Validación fallida');
    error.statusCode = 400;
    error.detalles = validation.errors;
    throw error;
  }

  const { prueba_id, escenario, resultado_esperado, metrica_principal, criterio_exito } = req.body;
  const sql = 'INSERT INTO tareas (prueba_id, escenario, resultado_esperado, metrica_principal, criterio_exito) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [prueba_id, escenario, resultado_esperado, metrica_principal, criterio_exito], (err, result) => {
    if (err) return next(err);
    res.status(201).json({ id: result.insertId, mensaje: 'Tarea guardada exitosamente' });
  });
};

const getTareas = (req, res, next) => {
  db.query('SELECT * FROM tareas', (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
};

const getTareaById = (req, res, next) => {
  const { id } = req.params;
  db.query('SELECT * FROM tareas WHERE id = ?', [id], (err, results) => {
    if (err) return next(err);
    if (results.length === 0) {
      const error = new Error('Tarea no encontrada');
      error.statusCode = 404;
      return next(error);
    }
    res.json(results[0]);
  });
};

const updateTarea = (req, res, next) => {
  const validation = validators.validateTarea(req.body);
  if (!validation.valid) {
    const error = new Error('Validación fallida');
    error.statusCode = 400;
    error.detalles = validation.errors;
    throw error;
  }

  const { id } = req.params;
  const { prueba_id, escenario, resultado_esperado, metrica_principal, criterio_exito } = req.body;
  const sql = 'UPDATE tareas SET prueba_id = ?, escenario = ?, resultado_esperado = ?, metrica_principal = ?, criterio_exito = ? WHERE id = ?';

  db.query(sql, [prueba_id, escenario, resultado_esperado, metrica_principal, criterio_exito, id], (err, result) => {
    if (err) return next(err);
    if (result.affectedRows === 0) {
      const error = new Error('Tarea no encontrada');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ mensaje: 'Tarea actualizada exitosamente' });
  });
};

const deleteTarea = (req, res, next) => {
  const { id } = req.params;
  db.query('DELETE FROM tareas WHERE id = ?', [id], (err, result) => {
    if (err) return next(err);
    if (result.affectedRows === 0) {
      const error = new Error('Tarea no encontrada');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ mensaje: 'Tarea eliminada exitosamente' });
  });
};

module.exports = {
  createTarea,
  getTareas,
  getTareaById,
  updateTarea,
  deleteTarea
};
