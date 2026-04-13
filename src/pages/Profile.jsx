import { useState, useRef } from 'react';
import { useAuthStore } from '../store';
import { api } from '../api';

export default function Profile() {
  const { user, setAuth, token } = useAuthStore();
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telefono, setTelefono] = useState(user?.telefono || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [toast, setToast] = useState('');
  
  // Flujo OTP para contraseña
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(null); // time when requested
  const [otpCode, setOtpCode] = useState('');
  const [otpMsj, setOtpMsj] = useState('');
  
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = { nombre, email, telefono, avatar };
      const { data } = await api.put('/perfil', payload);
      setAuth(token, data.usuario);
      setToast('✅ Perfil actualizado correctamente');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setToast('❌ Error: ' + (err.response?.data?.error || 'No se pudo guardar'));
      setTimeout(() => setToast(''), 4000);
    }
  };

  const requestPasswordReset = async () => {
    try {
      setOtpMsj('Enviando código...');
      const { data } = await api.post('/perfil/request-password', { email });
      setOtpSent(Date.now());
      setOtpMsj(data.mensaje);
    } catch (err) {
      setOtpMsj('❌ Error: ' + (err.response?.data?.error || 'Falló la solicitud'));
    }
  };

  const verifyPasswordReset = async () => {
    if (!newPassword || newPassword.length < 6) return setOtpMsj('❌ Contraseña muy corta (min. 6)');
    try {
      setOtpMsj('Validando...');
      const { data } = await api.post('/perfil/verify-password', { otp: otpCode, newPassword });
      setOtpMsj('✅ ' + data.mensaje);
      setTimeout(() => {
        setOtpSent(null);
        setOtpCode('');
        setNewPassword('');
        setOtpMsj('');
      }, 3000);
    } catch (err) {
      setOtpMsj('❌ Error: ' + (err.response?.data?.error || 'Código incorrecto'));
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Mi Perfil</h1>
        <p className="page-subtitle">Rango: {user?.rol}</p>
      </div>

      <div className="card" style={{ maxWidth: 500, margin: '0 auto 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* FOTO PERFIL BÁSICA O AVATAR */}
          <div 
            className="avatar avatar-lg" 
            style={{ 
              margin: '0 auto 12px', 
              background: avatar ? `url(${avatar}) center/cover` : 'var(--primary-light)',
              cursor: 'pointer',
              border: '4px solid var(--bg)',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={() => fileInputRef.current.click()}
          >
            {!avatar && (user?.nombre?.charAt(0) || '?')}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*"
            onChange={handleAvatarChange}
          />
          <button className="btn btn-sm btn-ghost" onClick={() => fileInputRef.current.click()}>
            ✏️ Mover foto de perfil
          </button>
        </div>

        <form onSubmit={handleSaveProfile}>
          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <input className="form-input" value={nombre} onChange={e => setNombre(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input className="form-input" type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Ej. 55-1234-5678" />
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 16 }}>Guardar Datos Básicos</button>
        </form>
      </div>

      {/* SECCIÓN SEGURIDAD / CONTRASEÑA */}
      <div className="card" style={{ maxWidth: 500, margin: '0 auto' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🔐 Seguridad Dinámica</h3>
        
        {!otpSent ? (
          <div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>
              Para cambiar tu contraseña te enviaremos un código de validación al correo registrado.
            </p>
            <button className="btn btn-ghost btn-block" onClick={requestPasswordReset}>
              Solicitar código de cambio
            </button>
            {otpMsj && <p style={{ fontSize: 13, marginTop: 8, color: 'var(--primary-dark)', fontWeight: 600 }}>{otpMsj}</p>}
          </div>
        ) : (
          <div style={{ background: 'var(--primary-light)', padding: 16, borderRadius: 12 }}>
            <p style={{ fontSize: 13, marginBottom: 12, fontWeight: 500 }}>
              Revisa tu correo y pon aquí el código de 6 dígitos enviado.
            </p>
            <div className="form-group">
              <label className="form-label">Código OTP</label>
              <input className="form-input" type="text" placeholder="123456" value={otpCode} onChange={e => setOtpCode(e.target.value)} maxLength={6} style={{ textAlign: 'center', letterSpacing: 4, fontWeight: 'bold' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Nueva Contraseña</label>
              <input className="form-input" type="password" placeholder="Mínimo 6 caracteres" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-block" onClick={verifyPasswordReset}>
              Confirmar Cambio Seguro
            </button>
            {otpMsj && <p style={{ fontSize: 13, margin: '12px 0 0', textAlign: 'center', color: 'var(--danger)' }}>{otpMsj}</p>}
          </div>
        )}
      </div>

      {toast && <div className={`toast toast-success`}>{toast}</div>}
    </div>
  );
}
