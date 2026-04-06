const { v4: uuidv4 } = require("uuid");
const { query, run, get } = require("../config/database");
const COLORES = { ok: "#4CAF50", triste: "#2196F3", enojado: "#F44336", ansioso: "#FF9800", enfermo: "#9C27B0" };

const enviarReporte = (req, res) => {
  try {
    const { alumno_id, emoji, estado, nota, categoria } = req.body;
    const fecha = new Date().toISOString().split("T")[0];
    const existe = get("SELECT id FROM reportes_diarios WHERE alumno_id = ? AND fecha = ?", [alumno_id, fecha]);
    if (existe) {
      run("UPDATE reportes_diarios SET emoji=?, estado=?, nota=?, categoria=? WHERE alumno_id=? AND fecha=?", [emoji, estado, nota, categoria, alumno_id, fecha]);
    } else {
      run("INSERT INTO reportes_diarios (id, alumno_id, tutor_id, emoji, estado, nota, categoria, fecha) VALUES (?,?,?,?,?,?,?,?)", [uuidv4(), alumno_id, req.user.userId, emoji, estado, nota, categoria, fecha]);
    }
    const reporte = get("SELECT * FROM reportes_diarios WHERE alumno_id = ? AND fecha = ?", [alumno_id, fecha]);
    const io = req.app.get("io");
    if (io) {
      const alumno = get("SELECT a.*, g.maestro_id FROM alumnos a LEFT JOIN grupos g ON a.grupo_id = g.id WHERE a.id = ?", [alumno_id]);
      if (alumno && alumno.grupo_id) {
        io.to("grupo:" + alumno.grupo_id).emit("radar:nuevo_reporte", { alumnoId: alumno_id, alumnoNombre: alumno.nombre + " " + alumno.apellido, estado, emoji, nota, color: COLORES[estado] || "#4CAF50" });
      }
    }
    res.status(existe ? 200 : 201).json(reporte);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getReportesHoy = (req, res) => {
  try {
    const fecha = new Date().toISOString().split("T")[0];
    let sql = "SELECT r.*, a.nombre as alumno_nombre, a.apellido as alumno_apellido, a.foto as alumno_foto, a.grupo_id FROM reportes_diarios r JOIN alumnos a ON r.alumno_id = a.id WHERE r.fecha = ?";
    const params = [fecha];
    if (req.user.rol === "tutor") { sql += " AND a.tutor_id = ?"; params.push(req.user.userId); }
    else if (req.user.rol === "maestro") { sql += " AND a.grupo_id IN (SELECT id FROM grupos WHERE maestro_id = ?)"; params.push(req.user.userId); }
    res.json(query(sql, params));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { enviarReporte, getReportesHoy };
