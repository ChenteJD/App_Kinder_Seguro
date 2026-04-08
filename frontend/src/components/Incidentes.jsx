import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Incidentes({ alumnoId, userRol }) {
  const [incidentes, setIncidentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    semaforo: 'verde', descripcion: '', accion_tomada: '', estado_actual: '', es_social: false, otro_alumno_anonimo: '',
  });
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.get(`/incidentes/${alumnoId}`)
      .then(r => setIncidentes(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [alumnoId]);

  const handleSave = async () => {
    if (!form.descripcion || !form.accion_tomada || !form.estado_actual) return;
    try {
      await api.post('/incidentes', {
        alumno_id: alumnoId,
        semaforo: form.semaforo,
        descripcion: form.descripcion,
        accion_tomada: form.accion_tomada,
        estado_actual: form.estado_actual,
        es_social: form.es_social ? 1 : 0,
        otro_alumno_anonimo: form.otro_alumno_anonimo || null,
      });
      setShowForm(false);
      setForm({ semaforo: 'verde', descripcion: '', accion_tomada: '', estado_actual: '', es_social: false, otro_alumno_anonimo: '' });
      setToast('✅ Incidente registrado');
      setTimeout(() => setToast(''), 3000);
      const r = await api.get(`/incidentes/${alumnoId}`);
      setIncidentes(Array.isArray(r.data) ? r.data : []);
    } catch {
      setToast('❌ Error al registrar');
      setTimeout(() => setToast(''), 3000);
    }
  };

  const canEdit = ['maestro', 'admin', 'superadmin'].includes(userRol);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>🚨 Incidentes</h3>
          {canEdit && !showForm && (
            <button className="btn btn-sm btn-danger" onClick={() => setShowForm(true)}>+ Reportar</button>
          )}
        </div>

        {showForm && (
          <div className="card card-sm" style={{ background: 'var(--bg)', marginBottom: 16 }}>
            <div className="form-group">
              <label className="form-label">Semáforo de gravedad</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['verde', 'amarillo', 'rojo'].map(s => (
                  <button key={s} className={`btn btn-sm ${form.semaforo === s ? '' : 'btn-ghost'}`}
                    style={form.semaforo === s ? { background: s === 'verde' ? '#D4F4DD' : s === 'amarillo' ? '#FFF8E1' : '#FFE2E2' } : {}}
                    onClick={() => setForm({ ...form, semaforo: s })}>
                    {s === 'verde' ? '🟢' : s === 'amarillo' ? '🟡' : '🔴'} {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Descripción del incidente *</label>
              <textarea className="form-textarea" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} placeholder="¿Qué ocurrió?" rows={3} />
            </div>

            <div className="form-group">
              <label className="form-label">Acción tomada *</label>
              <input className="form-input" value={form.accion_tomada} onChange={e => setForm({ ...form, accion_tomada: e.target.value })} placeholder="¿Qué se hizo?" />
            </div>

            <div className="form-group">
              <label className="form-label">Estado actual del niño *</label>
              <input className="form-input" value={form.estado_actual} onChange={e => setForm({ ...form, estado_actual: e.target.value })} placeholder="¿Cómo se encuentra ahora?" />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, marginBottom: 12 }}>
              <input type="checkbox" checked={form.es_social} onChange={e => setForm({ ...form, es_social: e.target.checked })} style={{ width: 18, height: 18, accentColor: 'var(--primary-dark)' }} />
              Involucra a otro alumno
            </label>

            {form.es_social && (
              <div className="form-group">
                <label className="form-label">Otro alumno (anónimo)</label>
                <input className="form-input" value={form.otro_alumno_anonimo} onChange={e => setForm({ ...form, otro_alumno_anonimo: e.target.value })} placeholder="Descripción anónima" />
              </div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-danger btn-sm" onClick={handleSave}>Registrar incidente</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </div>
        )}

        {incidentes.length === 0 && !showForm ? (
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <div className="empty-state-text">Sin incidentes registrados. ¡Excelente!</div>
          </div>
        ) : (
          incidentes.map((inc, i) => (
            <div key={i} className="card card-sm" style={{ marginBottom: 8, borderLeft: `4px solid ${inc.semaforo === 'verde' ? '#4CAF50' : inc.semaforo === 'amarillo' ? '#FFC107' : '#F44336'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span className={`semaforo semaforo-${inc.semaforo}`}>
                  {inc.semaforo === 'verde' ? '🟢' : inc.semaforo === 'amarillo' ? '🟡' : '🔴'} {inc.semaforo}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{inc.fecha || inc.created_at}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{inc.descripcion}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>✅ Acción: {inc.accion_tomada}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>📊 Estado: {inc.estado_actual}</div>
            </div>
          ))
        )}
      </div>
      {toast && <div className={`toast ${toast.includes('✅') ? 'toast-success' : 'toast-error'}`}>{toast}</div>}
    </div>
  );
}
