const { v4: uuidv4 } = require('uuid');
const { query, run, get } = require('../config/database');

const crearIncidente = (req, res) => {
  try {
    const id = uuidv4();
    const { alumno_id, semaforo, descripcion, accion_tomada, estado_actual, es_social, otro_alumno_anonimo } = req.body;
    run(`INSERT INTO incidentes (id, alumno_id, maestro_id, semaforo, descripcion, accion_tomada, estado_actual, es_social, otro_alumno_anonimo)
      VALUES (?,?,?,?,?,?,?,?,?)`,
      [id, alumno_id, req.user.userId, semaforo, descripcion, accion_tomada, estado_actual, es_social ? 1 : 0, otro_alumno_anonimo || null]);

    const incidente = get('SELECT * FROM incidentes WHERE id = ?', [id]);

    const io = req.app.get('io');
    if (io) {
      const alumno = get('SELECT * FROM alumnos WHERE id = ?', [alumno_id]);
      if (alumno) {
        io.to(`user:${alumno.tutor_id}`).emit('incidente:notificacion', {
          alumnoNombre: `${alumno.nombre} ${alumno.apellido}`,
          semaforo, estado_actual,
          mensaje: `📋 Reporte sobre ${alumno.nombre}: ${estado_actual}`,
        });
        run('UPDATE incidentes SET notificado_tutor = 1 WHERE id = ?', [id]);
      }
    }
    res.status(201).json(incidente);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getIncidentes = (req, res) => {
  try {
    const params = [];
    let sql = `SELECT i.*, a.nombre as alumno_nombre, a.apellido as alumno_apellido
               FROM incidentes i JOIN alumnos a ON i.alumno_id = a.id`;
    if (req.params.alumnoId) {
      sql += ' WHERE i.alumno_id = ?';
      params.push(req.params.alumnoId);
    }
    sql += ' ORDER BY i.created_at DESC LIMIT 50';
    res.json(query(sql, params));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { crearIncidente, getIncidentes };
