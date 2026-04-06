const router = require("express").Router();
const { crearDiario, getDiario } = require("../controllers/diarioController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
router.use(authMiddleware);
router.post("/", requireRole("maestro","admin"), crearDiario);
router.get("/:alumnoId", getDiario);
module.exports = router;
