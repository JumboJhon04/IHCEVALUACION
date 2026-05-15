const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const {
  createPrueba,
  getPruebas,
  getPruebaById,
  updatePrueba,
  deletePrueba
} = require('../controllers/pruebasController');

router.post('/', asyncHandler(createPrueba));
router.get('/', asyncHandler(getPruebas));
router.get('/:id', asyncHandler(getPruebaById));
router.put('/:id', asyncHandler(updatePrueba));
router.delete('/:id', asyncHandler(deletePrueba));

module.exports = router;