const { v4: uuidv4 } = require('uuid');
const { query, run, get } = require('../config/database');

const crearDiario = (req, res) => {
  try {
    const { alumno_id, siesta, banio, logro_clave, vinculo_social, humor_general } = req.body;
    const fecha = new Date().toISOString().split('T')[0];
    const existe = get('SELECT id FROM diario WHERE alumno_id = ? AND fecha = ?', [alumno_id, fecha]);

    if (existe) {
      run('UPDATE diario SET siesta=?, banio=?, logro_clave=?, vinculo_social=?, humor_general=? WHERE alumno_id=? AND fecha=?',
        [siesta ? 1 : 0, banio ? 1 : 0, logro_clave, vinculo_social, humor_general || 'bien', alumno_id, fecha]);
    } else {
      const id = uuidv4();
      run('INSERT INTO diario (id, alumno_id, maestro_id, fecha, siesta, banio, logro_clave, vinculo_social, humor_general) VALUES (?,?,?,?,?,?,?,?,?)',
        [id, alumno_id, req.user.userId, fecha, siesta ? 1 : 0, banio ? 1 : 0, logro_clave, vinculo_social, humor_general || 'bien']);
    }

    res.json(get('SELECT * FROM diario WHERE alumno_id = ? AND fecha = ?', [alumno_id, fecha]));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getDiario = (req, res) => {
  try {
    res.json(query(
      'SELECT * FROM diario WHERE alumno_id = ? ORDER BY fecha DESC LIMIT 30',
      [req.params.alumnoId]
    ));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { crearDiario, getDiario };
