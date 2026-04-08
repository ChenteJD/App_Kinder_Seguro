const { run, get } = require("../config/database");
const bcrypt = require("bcryptjs");
// Simulador de envío de correos (en prod usar nodemailer real)
// const nodemailer = require("nodemailer");

// Almacén temporal de OTPs en memoria para el demo
const otpStore = new Map();

const updateProfile = async (req, res) => {
  try {
    const { nombre, email, telefono, avatar } = req.body;
    const { userId } = req.user;

    // Verificar si el email lo tiene otro usuario
    const existe = get("SELECT id FROM usuarios WHERE email = ? AND id != ?", [email, userId]);
    if (existe) return res.status(400).json({ error: "El email ya está en uso por otra cuenta" });

    run("UPDATE usuarios SET nombre=?, email=?, telefono=?, avatar=? WHERE id=?", [
      nombre, email, telefono || null, avatar || null, userId
    ]);

    const userMod = get("SELECT id, nombre, email, rol, avatar, telefono FROM usuarios WHERE id = ?", [userId]);
    res.json({ mensaje: "Perfil actualizado correctamente", usuario: userMod });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const { userId } = req.user;
    
    // Verificar que coincida con el usuario logueado en este flujo interno
    const user = get("SELECT id FROM usuarios WHERE id = ? AND email = ?", [userId, email]);
    if (!user) return res.status(403).json({ error: "Validación de seguridad fallida" });

    // Código de 6 dígitos aleatorio
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Guardar OTP local (expira en 10 min)
    otpStore.set(userId, { otp, expires: Date.now() + 10 * 60000 });

    /* 
     * CONFIGURACIÓN REAL DE NODEMAILER PARA PRODUCCIÓN:
     * const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'chentejcruz@outlook.com', pass: '...' } });
     * await transporter.sendMail({ from: '"Vínculo Kinder" <chentejcruz@outlook.com>', to: email, subject: 'Código de Cambio de Contraseña', text: `Tu código OTP es: ${otp}` });
     */
    
    console.log(`\n\n======================`);
    console.log(`🔔 CÓDIGO OTP PARA ${email}: ${otp}`);
    console.log(`======================\n\n`);

    res.json({ mensaje: "Código enviado a tu correo (mira la consola mientras configuramos Nodemailer en prod)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const verifyPasswordReset = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    const { userId } = req.user;

    const storedOtp = otpStore.get(userId);
    if (!storedOtp) return res.status(400).json({ error: "No has solicitado un código o ya expiró" });
    if (Date.now() > storedOtp.expires) {
      otpStore.delete(userId);
      return res.status(400).json({ error: "El código ha expirado" });
    }
    if (storedOtp.otp !== otp) return res.status(400).json({ error: "Código incorrecto" });

    // Proceder
    const hash = await bcrypt.hash(newPassword, 12);
    run("UPDATE usuarios SET password_hash = ? WHERE id = ?", [hash, userId]);
    
    otpStore.delete(userId);
    res.json({ mensaje: "Contraseña actualizada exitosamente" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { updateProfile, requestPasswordReset, verifyPasswordReset };
