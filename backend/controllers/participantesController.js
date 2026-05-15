const db = require('../config/db');
const validators = require('../validators');

const createParticipante = (req, res, next) => {
	const validation = validators.validateParticipante(req.body);
	if (!validation.valid) {
		const error = new Error('Validación fallida');
		error.statusCode = 400;
		error.detalles = validation.errors;
		throw error;
	}

	const { nombre, perfil } = req.body;
	const sql = 'INSERT INTO participantes (nombre, perfil) VALUES (?, ?)';

	db.query(sql, [nombre, perfil], (err, result) => {
		if (err) return next(err);
		res.status(201).json({ id: result.insertId, mensaje: 'Participante guardado exitosamente' });
	});
};

const getParticipantes = (req, res, next) => {
	db.query('SELECT * FROM participantes', (err, results) => {
		if (err) return next(err);
		res.json(results);
	});
};

const getParticipanteById = (req, res, next) => {
	const { id } = req.params;
	db.query('SELECT * FROM participantes WHERE id = ?', [id], (err, results) => {
		if (err) return next(err);
		if (results.length === 0) {
			const error = new Error('Participante no encontrado');
			error.statusCode = 404;
			return next(error);
		}
		res.json(results[0]);
	});
};

const updateParticipante = (req, res, next) => {
	const validation = validators.validateParticipante(req.body);
	if (!validation.valid) {
		const error = new Error('Validación fallida');
		error.statusCode = 400;
		error.detalles = validation.errors;
		throw error;
	}

	const { id } = req.params;
	const { nombre, perfil } = req.body;
	const sql = 'UPDATE participantes SET nombre = ?, perfil = ? WHERE id = ?';

	db.query(sql, [nombre, perfil, id], (err, result) => {
		if (err) return next(err);
		if (result.affectedRows === 0) {
			const error = new Error('Participante no encontrado');
			error.statusCode = 404;
			return next(error);
		}
		res.json({ mensaje: 'Participante actualizado exitosamente' });
	});
};

const deleteParticipante = (req, res, next) => {
	const { id } = req.params;
	db.query('DELETE FROM participantes WHERE id = ?', [id], (err, result) => {
		if (err) return next(err);
		if (result.affectedRows === 0) {
			const error = new Error('Participante no encontrado');
			error.statusCode = 404;
			return next(error);
		}
		res.json({ mensaje: 'Participante eliminado exitosamente' });
	});
};

module.exports = {
	createParticipante,
	getParticipantes,
	getParticipanteById,
	updateParticipante,
	deleteParticipante
};
