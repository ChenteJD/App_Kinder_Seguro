const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "Token requerido" });
  try {
    req.user = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token invalido o expirado" });
  }
};

// superadmin siempre tiene acceso a todo
const requireRole = (...roles) => (req, res, next) => {
  if (req.user.rol === "superadmin") return next();
  if (!roles.includes(req.user.rol))
    return res.status(403).json({ error: "Sin permisos suficientes" });
  next();
};

module.exports = { authMiddleware, requireRole };
