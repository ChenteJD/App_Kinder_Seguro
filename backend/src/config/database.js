require("dotenv").config();
const path = require("path");
const fs = require("fs");
const initSqlJs = require("sql.js");

const DB_PATH = path.resolve(process.env.DB_PATH || "./database.sqlite");

let db = null;

const saveDB = () => {
  if (db) {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }
};

const query = (sql, params = []) => {
  if (!db) throw new Error("DB no inicializada");
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
};

const run = (sql, params = []) => {
  if (!db) throw new Error("DB no inicializada");
  db.run(sql, params);
  return db;
};

const get = (sql, params = []) => {
  const rows = query(sql, params);
  return rows[0] || null;
};

const crearTablas = () => {
  run(`CREATE TABLE IF NOT EXISTS usuarios (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    rol TEXT NOT NULL CHECK(rol IN ('superadmin','admin','maestro','tutor')),
    avatar TEXT,
    descripcion TEXT,
    telefono TEXT,
    activo INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`);

  run(`CREATE TABLE IF NOT EXISTS grupos (
    id TEXT PRIMARY KEY, nombre TEXT NOT NULL, nivel TEXT NOT NULL,
    ciclo_escolar TEXT DEFAULT '2024-2025', maestro_id TEXT REFERENCES usuarios(id),
    color TEXT DEFAULT '#FF6B9D',
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  run(`CREATE TABLE IF NOT EXISTS alumnos (
    id TEXT PRIMARY KEY, nombre TEXT NOT NULL, apellido TEXT NOT NULL,
    fecha_nacimiento TEXT NOT NULL, foto TEXT,
    tutor_id TEXT NOT NULL REFERENCES usuarios(id),
    grupo_id TEXT REFERENCES grupos(id),
    activo INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  run(`CREATE TABLE IF NOT EXISTS fichas_medicas (
    id TEXT PRIMARY KEY, alumno_id TEXT UNIQUE NOT NULL REFERENCES alumnos(id),
    tipo_sangre TEXT, alergias TEXT, medicamentos_base TEXT, condiciones TEXT,
    contacto_emergencia_nombre TEXT NOT NULL, contacto_emergencia_tel TEXT NOT NULL,
    contacto2_nombre TEXT, contacto2_tel TEXT, doctora TEXT, notas TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
  )`);

  run(`CREATE TABLE IF NOT EXISTS reportes_diarios (
    id TEXT PRIMARY KEY, alumno_id TEXT NOT NULL REFERENCES alumnos(id),
    tutor_id TEXT NOT NULL REFERENCES usuarios(id),
    emoji TEXT DEFAULT '😊',
    estado TEXT DEFAULT 'ok' CHECK(estado IN ('ok','triste','enojado','ansioso','enfermo')),
    nota TEXT, categoria TEXT, fecha TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(alumno_id, fecha)
  )`);

  run(`CREATE TABLE IF NOT EXISTS nutricion (
    id TEXT PRIMARY KEY, alumno_id TEXT NOT NULL REFERENCES alumnos(id),
    maestro_id TEXT NOT NULL REFERENCES usuarios(id),
    fecha TEXT NOT NULL, foto_url TEXT,
    estado TEXT DEFAULT 'comio_bien' CHECK(estado IN ('comio_bien','comio_poco','no_comio')),
    nota TEXT, plan_accion TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(alumno_id, fecha)
  )`);

  run(`CREATE TABLE IF NOT EXISTS incidentes (
    id TEXT PRIMARY KEY, alumno_id TEXT NOT NULL REFERENCES alumnos(id),
    maestro_id TEXT NOT NULL REFERENCES usuarios(id),
    semaforo TEXT NOT NULL CHECK(semaforo IN ('verde','amarillo','rojo')),
    descripcion TEXT NOT NULL, accion_tomada TEXT NOT NULL,
    estado_actual TEXT NOT NULL, es_social INTEGER DEFAULT 0,
    otro_alumno_anonimo TEXT, notificado_tutor INTEGER DEFAULT 0,
    fecha TEXT DEFAULT (date('now')),
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  run(`CREATE TABLE IF NOT EXISTS diario (
    id TEXT PRIMARY KEY, alumno_id TEXT NOT NULL REFERENCES alumnos(id),
    maestro_id TEXT NOT NULL REFERENCES usuarios(id),
    fecha TEXT NOT NULL, siesta INTEGER DEFAULT 0, banio INTEGER DEFAULT 0,
    logro_clave TEXT, vinculo_social TEXT,
    humor_general TEXT DEFAULT 'bien' CHECK(humor_general IN ('excelente','bien','regular','dificil')),
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(alumno_id, fecha)
  )`);

  run(`CREATE TABLE IF NOT EXISTS medicamentos_auth (
    id TEXT PRIMARY KEY, alumno_id TEXT NOT NULL REFERENCES alumnos(id),
    tutor_id TEXT NOT NULL REFERENCES usuarios(id),
    medicamento TEXT NOT NULL, dosis TEXT NOT NULL, hora TEXT NOT NULL,
    instrucciones TEXT, autorizado INTEGER DEFAULT 1,
    confirmado_maestro INTEGER DEFAULT 0, confirmado_en TEXT,
    fecha TEXT DEFAULT (date('now')),
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  saveDB();
  console.log("Tablas SQLite creadas/verificadas");
};

const initSuperadmin = async () => {
  const email = process.env.SUPERADMIN_EMAIL;
  const password = process.env.SUPERADMIN_PASSWORD;
  const nombre = process.env.SUPERADMIN_NOMBRE || "Superadmin";
  if (!email || !password) return;

  const existe = get("SELECT id FROM usuarios WHERE email = ?", [email]);
  if (existe) {
    // Asegurarse que siempre tenga rol superadmin
    run("UPDATE usuarios SET rol = 'superadmin', activo = 1 WHERE email = ?", [email]);
    console.log("Superadmin verificado: " + email);
    return;
  }

  const bcrypt = require("bcryptjs");
  const { v4: uuidv4 } = require("uuid");
  const hash = await bcrypt.hash(password, 12);
  run("INSERT INTO usuarios (id, nombre, email, password_hash, rol) VALUES (?,?,?,?,?)",
    [uuidv4(), nombre, email, hash, "superadmin"]);
  saveDB();
  console.log("Superadmin creado: " + email);
};

const connectDB = async () => {
  try {
    const SQL = await initSqlJs();
    if (fs.existsSync(DB_PATH)) {
      const fileBuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
      console.log("SQLite cargado desde disco: " + DB_PATH);
    } else {
      db = new SQL.Database();
      console.log("Nueva base de datos SQLite creada");
    }
    setInterval(saveDB, 30000);
    process.on("exit", saveDB);
    process.on("SIGINT", () => { saveDB(); process.exit(0); });
    process.on("SIGTERM", () => { saveDB(); process.exit(0); });
    crearTablas();
    await initSuperadmin();
  } catch (err) {
    console.error("Error al conectar SQLite:", err);
    process.exit(1);
  }
};

const getDB = () => db;

module.exports = { connectDB, query, run, get, saveDB, getDB };
