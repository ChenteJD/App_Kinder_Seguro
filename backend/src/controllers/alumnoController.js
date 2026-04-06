const { v4: uuidv4 } = require("uuid");
const { query, run, get } = require("../config/database");

const getAlumnos = (req, res) => {
  try {
    let sql = "SELECT a.*, u.nombre as tutor_nombre, u.telefono as tutor_telefono, g.nombre as grupo_nombre, g.nivel as grupo_nivel, g.color as grupo_color FROM alumnos a LEFT JOIN usuarios u ON a.tutor_id = u.id LEFT JOIN grupos g ON a.grupo_id = g.id WHERE a.activo = 1";
    const params = [];
    if (req.user.rol === "tutor") { sql += " AND a.tutor_id = ?"; params.push(req.user.userId); }
    else if (req.user.rol === "maestro") { sql += " AND g.maestro_id = ?"; params.push(req.user.userId); }
    res.json(query(sql, params));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getAlumnoById = (req, res) => {
  try {
    const alumno = get("SELECT a.*, u.nombre as tutor_nombre, u.email as tutor_email, u.telefono as tutor_telefono, g.nombre as grupo_nombre, g.nivel as grupo_nivel, g.color as grupo_color FROM alumnos a LEFT JOIN usuarios u ON a.tutor_id = u.id LEFT JOIN grupos g ON a.grupo_id = g.id WHERE a.id = ?", [req.params.id]);
    if (!alumno) return res.status(404).json({ error: "Alumno no encontrado" });
    const ficha = get("SELECT * FROM fichas_medicas WHERE alumno_id = ?", [alumno.id]);
    const hermanos = query("SELECT id, nombre, apellido, fecha_nacimiento, foto, grupo_id FROM alumnos WHERE tutor_id = ? AND id != ? AND activo = 1", [alumno.tutor_id, alumno.id]);
    res.json({ ...alumno, ficha_medica: ficha, hermanos });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const crearAlumno = (req, res) => {
  try {
    const { nombre, apellido, fecha_nacimiento, tutor_id, grupo_id, foto } = req.body;
    const id = uuidv4();
    run("INSERT INTO alumnos (id, nombre, apellido, fecha_nacimiento, tutor_id, grupo_id, foto) VALUES (?,?,?,?,?,?,?)", [id, nombre, apellido, fecha_nacimiento, tutor_id, grupo_id || null, foto || null]);
    res.status(201).json(get("SELECT * FROM alumnos WHERE id = ?", [id]));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const actualizarAlumno = (req, res) => {
  try {
    const { nombre, apellido, fecha_nacimiento, grupo_id, foto } = req.body;
    run("UPDATE alumnos SET nombre=?, apellido=?, fecha_nacimiento=?, grupo_id=?, foto=? WHERE id=?", [nombre, apellido, fecha_nacimiento, grupo_id, foto, req.params.id]);
    res.json(get("SELECT * FROM alumnos WHERE id = ?", [req.params.id]));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getAlumnos, getAlumnoById, crearAlumno, actualizarAlumno };
