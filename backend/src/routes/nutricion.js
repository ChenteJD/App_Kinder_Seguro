const router = require("express").Router();
const { registrarNutricion, enviarFotoGrupo } = require("../controllers/nutricionController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
router.use(authMiddleware);
router.post("/", requireRole("maestro","admin"), registrarNutricion);
router.post("/foto-grupo", requireRole("maestro","admin"), enviarFotoGrupo);
module.exports = router;
