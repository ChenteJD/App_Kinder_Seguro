import { useState, useEffect } from 'react';
import { api } from '../api';

const HUMOR = [
  { value: 'excelente', label: 'Excelente', emoji: '🌟' },
  { value: 'bien', label: 'Bien', emoji: '😊' },
  { value: 'regular', label: 'Regular', emoji: '😐' },
  { value: 'dificil', label: 'Difícil', emoji: '😟' },
];

export default function DiarioEscolar({ alumnoId, userRol }) {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    siesta: false, banio: false, logro_clave: '', vinculo_social: '', humor_general: 'bien',
  });
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.get(`/diario/${alumnoId}`)
      .then(r => setRegistros(Array.isArray(r.data) ? r.data : r.data ? [r.data] : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [alumnoId]);

  const handleSave = async () => {
    try {
      await api.post('/diario', {
        alumno_id: alumnoId,
        fecha: new Date().toISOString().split('T')[0],
        siesta: form.siesta ? 1 : 0,
        banio: form.banio ? 1 : 0,
        logro_clave: form.logro_clave || null,
        vinculo_social: form.vinculo_social || null,
        humor_general: form.humor_general,
      });
      setShowForm(false);
      setForm({ siesta: false, banio: false, logro_clave: '', vinculo_social: '', humor_general: 'bien' });
      setToast('✅ Diario guardado');
      setTimeout(() => setToast(''), 3000);
      // Reload
      const r = await api.get(`/diario/${alumnoId}`);
      setRegistros(Array.isArray(r.data) ? r.data : r.data ? [r.data] : []);
    } catch {
      setToast('❌ Error al guardar');
      setTimeout(() => setToast(''), 3000);
    }
  };

  const canEdit = ['maestro', 'admin', 'superadmin'].includes(userRol);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>📋 Diario Escolar</h3>
          {canEdit && !showForm && (
            <button className="btn btn-sm btn-primary" onClick={() => setShowForm(true)}>+ Registrar hoy</button>
          )}
        </div>

        {showForm && (
          <div className="card card-sm" style={{ background: 'var(--bg)', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                <input type="checkbox" checked={form.siesta} onChange={e => setForm({ ...form, siesta: e.target.checked })} style={{ width: 18, height: 18, accentColor: 'var(--primary-dark)' }} />
                😴 Tomó siesta
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                <input type="checkbox" checked={form.banio} onChange={e => setForm({ ...form, banio: e.target.checked })} style={{ width: 18, height: 18, accentColor: 'var(--primary-dark)' }} />
                🚽 Fue al baño
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Humor general</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {HUMOR.map(h => (
                  <button key={h.value} className={`btn btn-sm ${form.humor_general === h.value ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setForm({ ...form, humor_general: h.value })}>
                    {h.emoji} {h.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">🏆 Logro clave del día</label>
              <input className="form-input" placeholder="Ej: Aprendió a contar hasta 10" value={form.logro_clave} onChange={e => setForm({ ...form, logro_clave: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">🤝 Vínculo social</label>
              <input className="form-input" placeholder="Ej: Jugó con Lucas y Emma" value={form.vinculo_social} onChange={e => setForm({ ...form, vinculo_social: e.target.value })} />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={handleSave}>Guardar</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </div>
        )}

        {registros.length === 0 && !showForm ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-text">Sin registros en el diario</div>
          </div>
        ) : (
          registros.map((r, i) => (
            <div key={i} className="card card-sm" style={{ marginBottom: 8, background: 'var(--bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{r.fecha}</span>
                <span>{HUMOR.find(h => h.value === r.humor_general)?.emoji} {HUMOR.find(h => h.value === r.humor_general)?.label}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 13, flexWrap: 'wrap' }}>
                <span>{r.siesta ? '😴 Siesta ✅' : '😴 Sin siesta'}</span>
                <span>{r.banio ? '🚽 Baño ✅' : '🚽 Sin baño'}</span>
              </div>
              {r.logro_clave && <div style={{ fontSize: 13, marginTop: 6 }}>🏆 {r.logro_clave}</div>}
              {r.vinculo_social && <div style={{ fontSize: 13, marginTop: 4 }}>🤝 {r.vinculo_social}</div>}
            </div>
          ))
        )}
      </div>
      {toast && <div className={`toast ${toast.includes('✅') ? 'toast-success' : 'toast-error'}`}>{toast}</div>}
    </div>
  );
}
