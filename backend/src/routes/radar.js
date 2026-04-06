const router = require("express").Router();
const { enviarReporte, getReportesHoy } = require("../controllers/radarController");
const { authMiddleware } = require("../middleware/authMiddleware");
router.use(authMiddleware);
router.post("/reporte", enviarReporte);
router.get("/hoy", getReportesHoy);
module.exports = router;
