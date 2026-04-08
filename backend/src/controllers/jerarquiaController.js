const { query, run, get } = require("../config/database");
const bcrypt = require("bcryptjs");

const getUsuariosJerarquia = (req, res) => {
  try {
    const { rol, userId } = req.user;
    
    let result = { directores: [], maestros: [], padres: [], alumnos: [] };

    if (rol === "superadmin") {
      result.directores = query("SELECT id, nombre, email, telefono, activo, avatar FROM usuarios WHERE rol = 'admin'");
      result.maestros = query("SELECT id, nombre, email, telefono, activo, avatar FROM usuarios WHERE rol = 'maestro'");
      result.padres = query("SELECT id, nombre, email, telefono, activo, avatar FROM usuarios WHERE rol = 'tutor'");
      // All alumnos with group and tutor info
      result.alumnos = query("SELECT a.id, a.nombre, a.apellido, a.grupo_id, a.tutor_id, g.nombre as grupo_nombre FROM alumnos a LEFT JOIN grupos g ON a.grupo_id = g.id");
    } 
    else if (rol === "admin") {
      // Directores can't see other directores or superadmins.
      result.maestros = query("SELECT id, nombre, email, telefono, activo, avatar FROM usuarios WHERE rol = 'maestro'");
      result.padres = query("SELECT id, nombre, email, telefono, activo, avatar FROM usuarios WHERE rol = 'tutor'");
      result.alumnos = query("SELECT a.id, a.nombre, a.apellido, a.grupo_id, a.tutor_id, g.nombre as grupo_nombre FROM alumnos a LEFT JOIN grupos g ON a.grupo_id = g.id");
    }
    else if (rol === "maestro") {
      // Maestros see only their alumnos and the parents of those alumnos
      const maestroGrupos = query("SELECT id FROM grupos WHERE maestro_id = ?", [userId]);
      const grupoIds = maestroGrupos.map(g => g.id);
      
      if (grupoIds.length > 0) {
        const placeholders = grupoIds.map(() => '?').join(',');
        result.alumnos = query(`SELECT a.id, a.nombre, a.apellido, a.grupo_id, a.tutor_id, g.nombre as grupo_nombre FROM alumnos a LEFT JOIN grupos g ON a.grupo_id = g.id WHERE a.grupo_id IN (${placeholders})`, grupoIds);
        
        const tutorIds = [...new Set(result.alumnos.map(a => a.tutor_id))];
        if (tutorIds.length > 0) {
          const tPlaceholders = tutorIds.map(() => '?').join(',');
          result.padres = query(`SELECT id, nombre, email, telefono, activo, avatar FROM usuarios WHERE id IN (${tPlaceholders}) AND rol = 'tutor'`, tutorIds);
        }
      }
    }
    else if (rol === "tutor") {
      // Tutor only sees their children, which is already handled in Dashboard but we send it anyway
      result.alumnos = query("SELECT a.id, a.nombre, a.apellido, a.grupo_id, a.tutor_id, g.nombre as grupo_nombre FROM alumnos a LEFT JOIN grupos g ON a.grupo_id = g.id WHERE a.tutor_id = ?", [userId]);
    }

    res.json(result);
  } catch (err) {
    console.error("Jerarquia Error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUsuariosJerarquia };
