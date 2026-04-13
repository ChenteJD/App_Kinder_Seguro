require("dotenv").config();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { connectDB, run, get, query, saveDB } = require("../config/database");

const seed = async () => {
  await connectDB();
  console.log("Iniciando seeds...");

  const ins = async (sql, p) => { try { run(sql, p); } catch(e) { /* ya existe */ } };

  // Admin
  const adminId = uuidv4();
  const adminHash = await bcrypt.hash("admin123", 12);
  await ins("INSERT INTO usuarios (id,nombre,email,password_hash,rol,telefono) VALUES (?,?,?,?,?,?)", [adminId,"Directora Lopez","admin@kinddo.com",adminHash,"admin","555-0001"]);

  // Maestras
  const hash = await bcrypt.hash("maestro123", 12);
  const m1Id = uuidv4(); const m2Id = uuidv4();
  await ins("INSERT INTO usuarios (id,nombre,email,password_hash,rol,descripcion,telefono) VALUES (?,?,?,?,?,?,?)",[m1Id,"Maestra Salma Rios","salma@kinddo.com",hash,"maestro","Especialista en educacion temprana con 8 anos de experiencia","555-0002"]);
  await ins("INSERT INTO usuarios (id,nombre,email,password_hash,rol,descripcion,telefono) VALUES (?,?,?,?,?,?,?)",[m2Id,"Maestra Berta Campos","berta@kinddo.com",hash,"maestro","Apasionada del arte y la creatividad infantil","555-0003"]);

  // Grupos
  const g1Id = uuidv4(); const g2Id = uuidv4(); const g3Id = uuidv4();
  await ins("INSERT INTO grupos (id,nombre,nivel,maestro_id,color) VALUES (?,?,?,?,?)",[g1Id,"Girasoles","3 anos",m1Id,"#FFD93D"]);
  await ins("INSERT INTO grupos (id,nombre,nivel,maestro_id,color) VALUES (?,?,?,?,?)",[g2Id,"Petalos","4 anos",m2Id,"#FF6B9D"]);
  await ins("INSERT INTO grupos (id,nombre,nivel,maestro_id,color) VALUES (?,?,?,?,?)",[g3Id,"Estrellas","5 anos",m1Id,"#6BCB77"]);

  // Tutores - 10 familias
  const tutorHash = await bcrypt.hash("tutor123", 12);
  const tutores = [];
  const datosTutores = [
    ["Carlos Mendoza","carlos.m@gmail.com"],
    ["Gabriela Torres","gabi.t@gmail.com"],
    ["Roberto Jimenez","roberto.j@gmail.com"],
    ["Lucia Sanchez","lucia.s@gmail.com"],
    ["Marco Herrera","marco.h@gmail.com"],
    ["Paola Vega","paola.v@gmail.com"],
    ["Diego Flores","diego.f@gmail.com"],
    ["Ana Ramirez","ana.r@gmail.com"],
    ["Sergio Castro","sergio.c@gmail.com"],
    ["Monica Ortiz","monica.o@gmail.com"],
  ];
  for (const [nombre, email] of datosTutores) {
    const id = uuidv4();
    await ins("INSERT INTO usuarios (id,nombre,email,password_hash,rol) VALUES (?,?,?,?,?)",[id,nombre,email,tutorHash,"tutor"]);
    const t = get("SELECT id FROM usuarios WHERE email = ?", [email]);
    tutores.push(t.id);
  }

  // Alumnos: 20 con hermanos
  const alumnos = [
    ["Sofia","Mendoza Garcia","2021-03-15",0,g1Id],
    ["Mateo","Mendoza Garcia","2020-07-22",0,g2Id],
    ["Alejandro","Mendoza Garcia","2019-06-11",0,g3Id],    // hermano de Sofia y Mateo
    ["Isabella","Torres Ruiz","2021-01-10",1,g1Id],
    ["Valentina","Torres Ruiz","2019-09-05",1,g3Id],        // hermana de Isabella
    ["Daniela","Torres Ruiz","2021-09-03",1,g1Id],          // hermana de Isabella
    ["Lucas","Jimenez Mora","2021-05-18",2,g1Id],
    ["Emma","Jimenez Mora","2020-11-30",2,g2Id],            // hermana de Lucas
    ["Santiago","Jimenez Mora","2019-02-14",2,g3Id],        // hermano de Lucas
    ["Ximena","Sanchez Lopez","2021-08-25",3,g1Id],
    ["Tomas","Sanchez Lopez","2020-03-27",3,g2Id],          // hermano de Ximena
    ["Bruno","Herrera Pena","2020-04-12",4,g2Id],
    ["Paula","Herrera Pena","2019-11-15",4,g3Id],           // hermana de Bruno
    ["Mia","Vega Cortes","2020-06-03",5,g2Id],
    ["Emilio","Flores Navarro","2021-12-01",6,g1Id],
    ["Renata","Flores Navarro","2019-10-17",6,g3Id],        // hermana de Emilio
    ["Camila","Ramirez Cruz","2019-07-29",7,g3Id],
    ["Nicolas","Castro Medina","2020-02-08",8,g2Id],
    ["Andres","Castro Medina","2021-07-09",8,g1Id],         // hermano de Nicolas
    ["Regina","Ortiz Blanco","2021-04-20",9,g1Id],
  ];

  const alumnoIds = [];
  for (const [nombre, apellido, fn, ti, gi] of alumnos) {
    const id = uuidv4();
    await ins("INSERT INTO alumnos (id,nombre,apellido,fecha_nacimiento,tutor_id,grupo_id) VALUES (?,?,?,?,?,?)",[id,nombre,apellido,fn,tutores[ti],gi]);
    const a = get("SELECT id FROM alumnos WHERE nombre = ? AND apellido = ?", [nombre, apellido]);
    alumnoIds.push(a ? a.id : id);
  }

  // Fichas medicas de muestra
  if (alumnoIds[0]) {
    await ins("INSERT INTO fichas_medicas (id,alumno_id,tipo_sangre,alergias,contacto_emergencia_nombre,contacto_emergencia_tel) VALUES (?,?,?,?,?,?)",
      [uuidv4(),alumnoIds[0],"O+","Polen, penicilina","Carlos Mendoza","555-1001"]);
  }
  if (alumnoIds[6]) {
    await ins("INSERT INTO fichas_medicas (id,alumno_id,tipo_sangre,condiciones,contacto_emergencia_nombre,contacto_emergencia_tel,notas) VALUES (?,?,?,?,?,?,?)",
      [uuidv4(),alumnoIds[6],"A+","Asma leve","Roberto Jimenez","555-1003","Usa inhalador si hace mucho ejercicio"]);
  }

  saveDB();
  console.log("Seeds completados!");
  console.log("  Admin: admin@kinddo.com / admin123");
  console.log("  Maestras: salma@kinddo.com / maestro123, berta@kinddo.com / maestro123");
  console.log("  Tutores: carlos.m@gmail.com / tutor123 (y mas)");
  console.log("  20 alumnos con familias de hermanos");
  process.exit(0);
};

seed().catch(err => { console.error("Error en seed:", err); process.exit(1); });
