const router = require("express").Router();
const { getAlumnos, getAlumnoById, crearAlumno, actualizarAlumno } = require("../controllers/alumnoController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
router.use(authMiddleware);
router.get("/", getAlumnos);
router.get("/:id", getAlumnoById);
router.post("/", requireRole("admin","maestro"), crearAlumno);
router.put("/:id", requireRole("admin","maestro"), actualizarAlumno);
module.exports = router;
