const router = require("express").Router();
const { login, registro, perfil, listarAdmins, crearAdmin, toggleAdmin } = require("../controllers/authController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

// Publico
router.post("/login", login);

// Tutor puede registrarse solo; admin/maestro solo los crea alguien con permisos
router.post("/registro", (req, res, next) => {
  const rol = req.body.rol || "tutor";
  if (["admin","maestro","superadmin"].includes(rol)) {
    return authMiddleware(req, res, next);
  }
  next(); // tutor: sin autenticacion
}, registro);

// Privado
router.get("/perfil", authMiddleware, perfil);

// Solo superadmin: gestion de directores
router.get("/admins", authMiddleware, requireRole("superadmin"), listarAdmins);
router.post("/admins", authMiddleware, requireRole("superadmin"), crearAdmin);
router.patch("/admins/:id/toggle", authMiddleware, requireRole("superadmin"), toggleAdmin);

module.exports = router;
