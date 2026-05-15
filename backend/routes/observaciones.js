const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const {
  createObservacion,
  getObservaciones,
  getObservacionById,
  updateObservacion,
  deleteObservacion
} = require('../controllers/observacionesController');

// Crear una observación (POST)
router.post('/', asyncHandler(createObservacion));

// Obtener todas las observaciones (GET)
router.get('/', asyncHandler(getObservaciones));
router.get('/:id', asyncHandler(getObservacionById));
router.put('/:id', asyncHandler(updateObservacion));
router.delete('/:id', asyncHandler(deleteObservacion));

module.exports = router;