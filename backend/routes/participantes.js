const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const {
  createParticipante,
  getParticipantes,
  getParticipanteById,
  updateParticipante,
  deleteParticipante
} = require('../controllers/participantesController');

// Crear un participante (POST)
router.post('/', asyncHandler(createParticipante));

// Obtener todos los participantes (GET)
router.get('/', asyncHandler(getParticipantes));
router.get('/:id', asyncHandler(getParticipanteById));
router.put('/:id', asyncHandler(updateParticipante));
router.delete('/:id', asyncHandler(deleteParticipante));

module.exports = router;