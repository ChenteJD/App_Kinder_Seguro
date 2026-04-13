import { useState, useEffect } from 'react';
import { api } from '../api';

const ESTADOS = [
  { value: 'comio_bien', label: 'Comió bien', emoji: '😋', color: '#D4F4DD' },
  { value: 'comio_poco', label: 'Comió poco', emoji: '😐', color: '#FFF8E1' },
  { value: 'no_comio', label: 'No comió', emoji: '😕', color: '#FFE2E2' },
];

export default function Nutricion({ alumnoId, userRol }) {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ estado: '', nota: '' });
  const [toast, setToast] = useState('');

  useEffect(() => {
    // Get today's nutrition data (using diario endpoint as fallback)
    setLoading(false);
  }, [alumnoId]);

  const handleSave = async () => {
    if (!form.estado) return;
    try {
      await api.post('/nutricion', {
        alumno_id: alumnoId,
        fecha: new Date().toISOString().split('T')[0],
        estado: form.estado,
        nota: form.nota || null,
      });
      setRegistros([{ ...form, fecha: new Date().toISOString().split('T')[0], emoji: ESTADOS.find(e => e.value === form.estado)?.emoji }, ...registros]);
      setShowForm(false);
      setForm({ estado: '', nota: '' });
      setToast('✅ Nutrición registrada');
      setTimeout(() => setToast(''), 3000);
    } catch {
      setToast('❌ Error al registrar');
      setTimeout(() => setToast(''), 3000);
    }
  };

  const canEdit = ['maestro', 'admin', 'superadmin'].includes(userRol);

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>🍎 Nutrición</h3>
          {canEdit && !showForm && (
            <button className="btn btn-sm btn-primary" onClick={() => setShowForm(true)}>+ Registrar</button>
          )}
        </div>

        {showForm && (
          <div className="card card-sm" style={{ background: 'var(--bg)', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>¿Cómo comió hoy?</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {ESTADOS.map(e => (
                <button
                  key={e.value}
                  className={`btn btn-sm ${form.estado === e.value ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setForm({ ...form, estado: e.value })}
                  style={form.estado === e.value ? { background: e.color } : {}}
                >
                  {e.emoji} {e.label}
                </button>
              ))}
            </div>
            <div className="form-group">
              <textarea className="form-textarea" placeholder="Notas adicionales (opcional)" value={form.nota} onChange={e => setForm({ ...form, nota: e.target.value })} rows={2} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={!form.estado}>Guardar</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </div>
        )}

        {registros.length === 0 && !showForm ? (
          <div className="empty-state">
            <div className="empty-state-icon">🍎</div>
            <div className="empty-state-text">Sin registros de nutrición hoy</div>
          </div>
        ) : (
          registros.map((r, i) => (
            <div key={i} className="list-item" style={{ cursor: 'default' }}>
              <div style={{ fontSize: 28 }}>{r.emoji}</div>
              <div className="list-item-content">
                <div className="list-item-title">{ESTADOS.find(e => e.value === r.estado)?.label}</div>
                <div className="list-item-sub">{r.fecha} {r.nota ? `— ${r.nota}` : ''}</div>
              </div>
            </div>
          ))
        )}
      </div>
      {toast && <div className={`toast ${toast.includes('✅') ? 'toast-success' : 'toast-error'}`}>{toast}</div>}
    </div>
  );
}
