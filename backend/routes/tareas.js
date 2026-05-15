const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const {
  createTarea,
  getTareas,
  getTareaById,
  updateTarea,
  deleteTarea
} = require('../controllers/tareasController');

// Crear una nueva tarea (POST)
router.post('/', asyncHandler(createTarea));

// Obtener todas las tareas (GET)
router.get('/', asyncHandler(getTareas));
router.get('/:id', asyncHandler(getTareaById));
router.put('/:id', asyncHandler(updateTarea));
router.delete('/:id', asyncHandler(deleteTarea));

module.exports = router;