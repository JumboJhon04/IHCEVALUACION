const db = require('../config/db');
const validators = require('../validators');

const createPrueba = (req, res, next) => {
	const validation = validators.validatePrueba(req.body);
	if (!validation.valid) {
		const error = new Error('Validación fallida');
		error.statusCode = 400;
		error.detalles = validation.errors;
		throw error;
	}

	const { producto, modulo_evaluado, objetivo } = req.body;
	const sql = 'INSERT INTO pruebas_usabilidad (producto, modulo_evaluado, objetivo) VALUES (?, ?, ?)';

	db.query(sql, [producto, modulo_evaluado, objetivo], (err, result) => {
		if (err) return next(err);
		res.status(201).json({ id: result.insertId, mensaje: 'Prueba guardada exitosamente' });
	});
};

const getPruebas = (req, res, next) => {
	db.query('SELECT * FROM pruebas_usabilidad', (err, results) => {
		if (err) return next(err);
		res.json(results);
	});
};

const getPruebaById = (req, res, next) => {
	const { id } = req.params;
	db.query('SELECT * FROM pruebas_usabilidad WHERE id = ?', [id], (err, results) => {
		if (err) return next(err);
		if (results.length === 0) {
			const error = new Error('Prueba no encontrada');
			error.statusCode = 404;
			return next(error);
		}
		res.json(results[0]);
	});
};

const updatePrueba = (req, res, next) => {
	const validation = validators.validatePrueba(req.body);
	if (!validation.valid) {
		const error = new Error('Validación fallida');
		error.statusCode = 400;
		error.detalles = validation.errors;
		throw error;
	}

	const { id } = req.params;
	const { producto, modulo_evaluado, objetivo } = req.body;
	const sql = 'UPDATE pruebas_usabilidad SET producto = ?, modulo_evaluado = ?, objetivo = ? WHERE id = ?';

	db.query(sql, [producto, modulo_evaluado, objetivo, id], (err, result) => {
		if (err) return next(err);
		if (result.affectedRows === 0) {
			const error = new Error('Prueba no encontrada');
			error.statusCode = 404;
			return next(error);
		}
		res.json({ mensaje: 'Prueba actualizada exitosamente' });
	});
};

const deletePrueba = (req, res, next) => {
	const { id } = req.params;
	db.query('DELETE FROM pruebas_usabilidad WHERE id = ?', [id], (err, result) => {
		if (err) return next(err);
		if (result.affectedRows === 0) {
			const error = new Error('Prueba no encontrada');
			error.statusCode = 404;
			return next(error);
		}
		res.json({ mensaje: 'Prueba eliminada exitosamente' });
	});
};

module.exports = {
	createPrueba,
	getPruebas,
	getPruebaById,
	updatePrueba,
	deletePrueba
};
