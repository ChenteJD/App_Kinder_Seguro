const { v4: uuidv4 } = require("uuid");
const { query, run, get } = require("../config/database");

const registrarNutricion = (req, res) => {
  try {
    const { alumno_id, estado, nota, plan_accion, foto_url } = req.body;
    const fecha = new Date().toISOString().split("T")[0];
    const existe = get("SELECT id FROM nutricion WHERE alumno_id = ? AND fecha = ?", [alumno_id, fecha]);
    if (existe) {
      run("UPDATE nutricion SET estado=?,nota=?,plan_accion=?,foto_url=? WHERE alumno_id=? AND fecha=?", [estado, nota, plan_accion, foto_url, alumno_id, fecha]);
    } else {
      run("INSERT INTO nutricion (id,alumno_id,maestro_id,fecha,foto_url,estado,nota,plan_accion) VALUES (?,?,?,?,?,?,?,?)", [uuidv4(), alumno_id, req.user.userId, fecha, foto_url, estado, nota, plan_accion]);
    }
    if (estado !== "comio_bien") {
      const io = req.app.get("io");
      const alumno = get("SELECT * FROM alumnos WHERE id = ?", [alumno_id]);
      if (io && alumno) {
        io.to("user:" + alumno.tutor_id).emit("nutricion:alerta", { alumnoNombre: alumno.nombre + " " + alumno.apellido, estado, plan_accion });
      }
    }
    res.json(get("SELECT * FROM nutricion WHERE alumno_id = ? AND fecha = ?", [alumno_id, fecha]));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const enviarFotoGrupo = (req, res) => {
  try {
    const { grupoId, foto_url } = req.body;
    const fecha = new Date().toISOString().split("T")[0];
    const alumnos = query("SELECT id FROM alumnos WHERE grupo_id = ? AND activo = 1", [grupoId]);
    let creados = 0;
    for (const a of alumnos) {
      if (!get("SELECT id FROM nutricion WHERE alumno_id = ? AND fecha = ?", [a.id, fecha])) {
        run("INSERT INTO nutricion (id,alumno_id,maestro_id,fecha,foto_url,estado) VALUES (?,?,?,?,?,?)", [uuidv4(), a.id, req.user.userId, fecha, foto_url, "comio_bien"]);
        creados++;
      }
    }
    const io = req.app.get("io");
    if (io) io.to("grupo:" + grupoId).emit("nutricion:foto_recibida", { grupoId, foto_url, fecha });
    res.json({ total: alumnos.length, creados });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { registrarNutricion, enviarFotoGrupo };
