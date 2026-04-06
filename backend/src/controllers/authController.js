const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { query, run, get } = require("../config/database");

const generarToken = (u) =>
  jwt.sign(
    { userId: u.id, rol: u.rol, nombre: u.nombre },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
  );

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = get("SELECT * FROM usuarios WHERE email = ? AND activo = 1", [email]);
    if (!usuario || !(await bcrypt.compare(password, usuario.password_hash)))
      return res.status(401).json({ error: "Credenciales incorrectas" });
    const token = generarToken(usuario);
    const { password_hash, ...safe } = usuario;
    res.json({ token, usuario: safe });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Registro publico: solo tutores pueden auto-registrarse
// Admin/maestro los crea el director(admin) o superadmin
const registro = async (req, res) => {
  try {
    const { nombre, email, password, rol, telefono } = req.body;
    const rolSolicitado = rol || "tutor";

    // Solo superadmin puede crear otro superadmin o admin
    // Solo superadmin o admin puede crear maestros
    const rolRequerido = req.user ? req.user.rol : null;

    if (rolSolicitado === "superadmin")
      return res.status(403).json({ error: "No permitido" });

    if (rolSolicitado === "admin" && rolRequerido !== "superadmin")
      return res.status(403).json({ error: "Solo el desarrollador puede crear directores" });

    if (rolSolicitado === "maestro" && !["superadmin","admin"].includes(rolRequerido))
      return res.status(403).json({ error: "Solo el director puede crear maestros" });

    if (get("SELECT id FROM usuarios WHERE email = ?", [email]))
      return res.status(409).json({ error: "Email ya registrado" });

    const id = uuidv4();
    const password_hash = await bcrypt.hash(password, 12);
    run("INSERT INTO usuarios (id, nombre, email, password_hash, rol, telefono) VALUES (?,?,?,?,?,?)",
      [id, nombre, email, password_hash, rolSolicitado, telefono || null]);
    const usuario = get("SELECT id, nombre, email, rol, telefono FROM usuarios WHERE id = ?", [id]);
    const token = generarToken(usuario);
    res.status(201).json({ token, usuario });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const perfil = (req, res) => {
  try {
    const u = get(
      "SELECT id, nombre, email, rol, avatar, descripcion, telefono, created_at FROM usuarios WHERE id = ?",
      [req.user.userId]
    );
    if (!u) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(u);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Solo superadmin: listar todos los admins/directores
const listarAdmins = (req, res) => {
  try {
    const admins = query("SELECT id, nombre, email, rol, activo, created_at FROM usuarios WHERE rol = 'admin' ORDER BY created_at DESC");
    res.json(admins);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Solo superadmin: crear director
const crearAdmin = async (req, res) => {
  try {
    const { nombre, email, password, telefono } = req.body;
    if (get("SELECT id FROM usuarios WHERE email = ?", [email]))
      return res.status(409).json({ error: "Email ya registrado" });
    const id = uuidv4();
    const hash = await bcrypt.hash(password, 12);
    run("INSERT INTO usuarios (id, nombre, email, password_hash, rol, telefono) VALUES (?,?,?,?,?,?)",
      [id, nombre, email, hash, "admin", telefono || null]);
    res.status(201).json(get("SELECT id, nombre, email, rol, telefono FROM usuarios WHERE id = ?", [id]));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Solo superadmin: activar/desactivar director
const toggleAdmin = (req, res) => {
  try {
    const admin = get("SELECT * FROM usuarios WHERE id = ? AND rol = 'admin'", [req.params.id]);
    if (!admin) return res.status(404).json({ error: "Director no encontrado" });
    run("UPDATE usuarios SET activo = ? WHERE id = ?", [admin.activo ? 0 : 1, req.params.id]);
    res.json({ mensaje: admin.activo ? "Director desactivado" : "Director reactivado" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { login, registro, perfil, listarAdmins, crearAdmin, toggleAdmin };
