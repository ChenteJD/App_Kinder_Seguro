const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { updateProfile, requestPasswordReset, verifyPasswordReset } = require('../controllers/perfilController');

router.use(authMiddleware);
router.put('/', updateProfile);
router.post('/request-password', requestPasswordReset);
router.post('/verify-password', verifyPasswordReset);

module.exports = router;
