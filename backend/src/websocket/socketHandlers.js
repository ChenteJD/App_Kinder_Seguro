const jwt = require("jsonwebtoken");

const setupSocketIO = (io) => {
  // Autenticación WebSocket con JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Token WebSocket requerido"));
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      next(new Error("Token WebSocket inválido"));
    }
  });

  io.on("connection", (socket) => {
    const { userId, rol, nombre } = socket.user;
    console.log(`?? Conectado: ${nombre} (${rol}) - socket: ${socket.id}`);

    // Unirse a sala de su grupo
    socket.on("join-grupo", (grupoId) => {
      socket.join(`grupo:${grupoId}`);
      console.log(`?? ${nombre} unido al grupo ${grupoId}`);
    });

    // Unirse a sala personal (notificaciones)
    socket.join(`user:${userId}`);

    // -- RADAR EMOCIONAL --
    // Tutor envía reporte matutino
    socket.on("radar:enviar_reporte", (data) => {
      // Notificar al maestro del grupo
      io.to(`grupo:${data.grupoId}`).emit("radar:nuevo_reporte", {
        alumnoId: data.alumnoId,
        alumnoNombre: data.alumnoNombre,
        estado: data.estado,
        emoji: data.emoji,
        nota: data.nota,
      });
    });

    // Maestro actualiza color de alumno
    socket.on("radar:actualizar_color", (data) => {
      io.to(`grupo:${data.grupoId}`).emit("radar:color_update", {
        alumnoId: data.alumnoId,
        estado: data.estado,
        color: getColorByEstado(data.estado),
      });
    });

    // -- MEDICAMENTOS --
    socket.on("medicamento:autorizar", (data) => {
      io.to(`grupo:${data.grupoId}`).emit("medicamento:autorizado", data);
    });

    socket.on("medicamento:confirmar", (data) => {
      io.to(`user:${data.tutorId}`).emit("medicamento:confirmado", {
        alumnoNombre: data.alumnoNombre,
        medicamento: data.medicamento,
        hora: data.hora,
        mensaje: `? ${data.alumnoNombre} recibió ${data.medicamento} a las ${data.hora}`,
      });
    });

    // -- INCIDENTES --
    socket.on("incidente:nuevo", (data) => {
      io.to(`user:${data.tutorId}`).emit("incidente:notificacion", {
        alumnoNombre: data.alumnoNombre,
        semaforo: data.semaforo,
        estado_actual: data.estado_actual,
        mensaje: `?? Reporte de ${data.alumnoNombre}: ${data.estado_actual}`,
      });
    });

    // -- NUTRICIÓN --
    socket.on("nutricion:enviar_foto", (data) => {
      io.to(`grupo:${data.grupoId}`).emit("nutricion:foto_recibida", data);
    });

    socket.on("nutricion:excepcion", (data) => {
      io.to(`user:${data.tutorId}`).emit("nutricion:alerta", {
        alumnoNombre: data.alumnoNombre,
        estado: data.estado,
        plan_accion: data.plan_accion,
        mensaje: `??? ${data.alumnoNombre} ${data.estado === "comio_poco" ? "comió poco" : "no comió"} hoy`,
      });
    });

    // -- ADMIN: Notificación general --
    socket.on("admin:notificacion_general", (data) => {
      if (rol !== "admin") return;
      io.emit("notification:general", { mensaje: data.mensaje, tipo: data.tipo });
    });

    socket.on("disconnect", () => {
      console.log(`?? Desconectado: ${nombre}`);
    });
  });
};

const getColorByEstado = (estado) => {
  const colores = { ok: "#4CAF50", triste: "#2196F3", enojado: "#F44336", ansioso: "#FF9800", enfermo: "#9C27B0" };
  return colores[estado] || "#4CAF50";
};

module.exports = { setupSocketIO };
