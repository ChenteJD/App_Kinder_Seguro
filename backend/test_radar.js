const { connectDB, get, run } = require('./src/config/database');
const { v4: uuidv4 } = require("uuid");

connectDB().then(() => {
  const alumno = get("SELECT * FROM alumnos LIMIT 1");
  const usuario = get("SELECT * FROM usuarios LIMIT 1");
  console.log("Alumno:", alumno);
  console.log("Usuario:", usuario);

  try {
    const fecha = new Date().toISOString().split("T")[0];
    run("INSERT INTO reportes_diarios (id, alumno_id, tutor_id, emoji, estado, nota, categoria, fecha) VALUES (?,?,?,?,?,?,?,?)", 
        [uuidv4(), alumno.id, usuario.id, "😡", "enojado", "Nota de prueba", null, fecha]);
    console.log("Insert success!");
  } catch (err) {
    console.error("Insert error:", err.message);
  }
  process.exit(0);
});
