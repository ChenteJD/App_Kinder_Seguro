const { v4: uuidv4 } = require("uuid");
const { query, run, get } = require("../config/database");

const getFicha = (req, res) => {
  try {
    const ficha = get("SELECT * FROM fichas_medicas WHERE alumno_id = ?", [req.params.alumnoId]);
    if (!ficha) return res.status(404).json({ error: "Ficha medica no encontrada" });
    res.json(ficha);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const crearOActualizarFicha = (req, res) => {
  try {
    const { alumno_id } = req.params;
    const f = req.body;
    const existe = get("SELECT id FROM fichas_medicas WHERE alumno_id = ?", [alumno_id]);
    if (existe) {
      run("UPDATE fichas_medicas SET tipo_sangre=?,alergias=?,medicamentos_base=?,condiciones=?,contacto_emergencia_nombre=?,contacto_emergencia_tel=?,contacto2_nombre=?,contacto2_tel=?,doctora=?,notas=? WHERE alumno_id=?",
        [f.tipo_sangre,f.alergias,f.medicamentos_base,f.condiciones,f.contacto_emergencia_nombre,f.contacto_emergencia_tel,f.contacto2_nombre,f.contacto2_tel,f.doctora,f.notas,alumno_id]);
    } else {
      run("INSERT INTO fichas_medicas (id,alumno_id,tipo_sangre,alergias,medicamentos_base,condiciones,contacto_emergencia_nombre,contacto_emergencia_tel,contacto2_nombre,contacto2_tel,doctora,notas) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
        [uuidv4(),alumno_id,f.tipo_sangre,f.alergias,f.medicamentos_base,f.condiciones,f.contacto_emergencia_nombre,f.contacto_emergencia_tel,f.contacto2_nombre,f.contacto2_tel,f.doctora,f.notas]);
    }
    res.json(get("SELECT * FROM fichas_medicas WHERE alumno_id = ?", [alumno_id]));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const autorizarMedicamento = (req, res) => {
  try {
    const id = uuidv4();
    const { alumno_id, medicamento, dosis, hora, instrucciones } = req.body;
    run("INSERT INTO medicamentos_auth (id,alumno_id,tutor_id,medicamento,dosis,hora,instrucciones,autorizado) VALUES (?,?,?,?,?,?,?,1)",
      [id, alumno_id, req.user.userId, medicamento, dosis, hora, instrucciones || null]);
    const med = get("SELECT * FROM medicamentos_auth WHERE id = ?", [id]);
    const io = req.app.get("io");
    if (io) {
      const alumno = get("SELECT * FROM alumnos WHERE id = ?", [alumno_id]);
      if (alumno && alumno.grupo_id) {
        io.to("grupo:" + alumno.grupo_id).emit("medicamento:autorizado", { alumnoId: alumno_id, alumnoNombre: alumno.nombre + " " + alumno.apellido, medicamento, dosis, hora, medId: id });
      }
    }
    res.status(201).json(med);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const confirmarMedicamento = (req, res) => {
  try {
    const med = get("SELECT * FROM medicamentos_auth WHERE id = ?", [req.params.id]);
    if (!med) return res.status(404).json({ error: "No encontrada" });
    run("UPDATE medicamentos_auth SET confirmado_maestro=1, confirmado_en=datetime('now') WHERE id=?", [req.params.id]);
    const io = req.app.get("io");
    if (io) {
      io.to("user:" + med.tutor_id).emit("medicamento:confirmado", { medicamento: med.medicamento, hora: med.hora, mensaje: "Medicamento " + med.medicamento + " administrado a las " + med.hora });
    }
    res.json(get("SELECT * FROM medicamentos_auth WHERE id = ?", [req.params.id]));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getFicha, crearOActualizarFicha, autorizarMedicamento, confirmarMedicamento };
