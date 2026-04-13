import { useState } from 'react';
import { useAuthStore } from '../store';
import { api } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError('Ingresa usuario y contraseña');
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.token, data.usuario);
      localStorage.setItem('saved_email', email);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo conectar al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-shapes">
        <div className="login-shape" style={{ width: 450, height: 450, background: 'var(--pk-green)', top: -100, right: -100, filter: 'blur(60px)', opacity: 0.2 }} />
        <div className="login-shape" style={{ width: 400, height: 400, background: 'var(--pk-red)', bottom: -80, left: -80, animationDelay: '3s', filter: 'blur(60px)', opacity: 0.15 }} />
        <div className="login-shape" style={{ width: 300, height: 300, background: 'var(--pk-blue)', top: '30%', left: '5%', animationDelay: '5s', filter: 'blur(40px)', opacity: 0.1 }} />
      </div>

      <form className="card login-card" onSubmit={handleSubmit} style={{ border: 'none' }}>
        <div className="login-title" style={{ fontSize: 56, letterSpacing: -3, marginBottom: 0 }}>
            <span style={{ color: '#FF595E' }}>K</span><span style={{ color: '#FFCA3A' }}>i</span><span style={{ color: '#8AC926' }}>n</span><span style={{ color: '#1982C4' }}>d</span><span style={{ color: '#6A4C93' }}>d</span><span style={{ color: '#FF924C' }}>o</span>
        </div>
        <div className="login-subtitle" style={{ fontWeight: 800, color: 'var(--text-secondary)', marginTop: -10, marginBottom: 30 }}>ESCOLAR</div>

        {error && (
          <div style={{ background: '#FFE2E2', color: '#C62828', padding: '10px 16px', borderRadius: 12, fontSize: 13, marginBottom: 16, fontWeight: 500 }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Correo o Nombre de usuario</label>
          <input
            className="form-input"
            type="text"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            name="acct_rand_email"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contraseña</label>
          <div className="form-input-icon">
            <input
              className="form-input"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              name="acct_rand_pass"
            />
            <button type="button" className="icon-btn" onClick={() => setShowPass(!showPass)}>
              {showPass ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading} style={{ marginTop: 8, padding: '14px 24px', fontSize: 16 }}>
          {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
