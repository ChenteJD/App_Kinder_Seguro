const router = require("express").Router();
const { crearIncidente, getIncidentes } = require("../controllers/incidenteController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
router.use(authMiddleware);
router.post("/", requireRole("maestro","admin"), crearIncidente);
router.get("/:alumnoId", getIncidentes);
module.exports = router;
