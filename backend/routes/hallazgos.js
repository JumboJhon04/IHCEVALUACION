const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const {
  createHallazgo,
  getHallazgos,
  getHallazgoById,
  updateHallazgo,
  deleteHallazgo
} = require('../controllers/hallazgosController');

router.post('/', asyncHandler(createHallazgo));
router.get('/', asyncHandler(getHallazgos));
router.get('/:id', asyncHandler(getHallazgoById));
router.put('/:id', asyncHandler(updateHallazgo));
router.delete('/:id', asyncHandler(deleteHallazgo));

module.exports = router;