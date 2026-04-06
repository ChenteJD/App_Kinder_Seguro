require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const { connectDB } = require("./config/database");
const { setupSocketIO } = require("./websocket/socketHandlers");

const authRoutes = require("./routes/auth");
const alumnosRoutes = require("./routes/alumnos");
const radarRoutes = require("./routes/radar");
const saludRoutes = require("./routes/salud");
const incidentesRoutes = require("./routes/incidentes");
const nutricionRoutes = require("./routes/nutricion");
const diarioRoutes = require("./routes/diario");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "*", methods: ["GET","POST"] },
  pingTimeout: 60000,
});
setupSocketIO(io);
app.set("io", io);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use("/api", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/alumnos", alumnosRoutes);
app.use("/api/radar", radarRoutes);
app.use("/api/salud", saludRoutes);
app.use("/api/incidentes", incidentesRoutes);
app.use("/api/nutricion", nutricionRoutes);
app.use("/api/diario", diarioRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString(), uptime: process.uptime() }));
app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));
app.use((err, req, res, next) => { console.error(err.stack); res.status(500).json({ error: "Error interno" }); });

const PORT = process.env.PORT || 3001;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("Servidor en http://localhost:" + PORT);
    console.log("WebSocket listo en ws://localhost:" + PORT);
  });
});
