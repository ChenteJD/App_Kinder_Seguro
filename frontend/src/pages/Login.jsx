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
        <div className="login-shape" style={{ width: 350, height: 350, background: 'var(--primary)', top: -80, right: -80 }} />
        <div className="login-shape" style={{ width: 280, height: 280, background: 'var(--secondary)', bottom: -60, left: -60, animationDelay: '3s' }} />
        <div className="login-shape" style={{ width: 200, height: 200, background: 'var(--accent-blue)', top: '40%', left: '8%', animationDelay: '5s' }} />
        <div className="login-shape" style={{ width: 180, height: 180, background: 'var(--accent-purple)', top: '15%', right: '12%', animationDelay: '7s' }} />
      </div>

      <form className="card login-card" onSubmit={handleSubmit}>
        <div className="login-title">Vínculo</div>
        <div className="login-subtitle">Preescolar</div>

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
