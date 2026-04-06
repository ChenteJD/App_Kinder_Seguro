const router = require("express").Router();
const { getFicha, crearOActualizarFicha, autorizarMedicamento, confirmarMedicamento } = require("../controllers/saludController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
router.use(authMiddleware);
router.get("/ficha/:alumnoId", getFicha);
router.put("/ficha/:alumnoId", crearOActualizarFicha);
router.post("/medicamento", requireRole("tutor"), autorizarMedicamento);
router.patch("/medicamento/:id/confirmar", requireRole("maestro","admin"), confirmarMedicamento);
module.exports = router;
