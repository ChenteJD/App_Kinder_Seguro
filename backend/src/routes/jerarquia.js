const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { getUsuariosJerarquia } = require('../controllers/jerarquiaController');

router.use(authMiddleware);
router.get('/usuarios', getUsuariosJerarquia);

module.exports = router;
