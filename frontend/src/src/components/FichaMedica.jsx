import { useState, useEffect } from 'react';
import { api } from '../api';

export default function FichaMedica({ alumnoId, userRol }) {
  const [ficha, setFicha] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    tipo_sangre: '', alergias: '', medicamentos_base: '', condiciones: '',
    contacto_emergencia_nombre: '', contacto_emergencia_tel: '',
    contacto2_nombre: '', contacto2_tel: '', doctora: '', notas: '',
  });
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.get(`/salud/ficha/${alumnoId}`)
      .then(r => { setFicha(r.data); setForm({ ...form, ...r.data }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [alumnoId]);

  const handleSave = async () => {
    try {
      const { data } = await api.put(`/salud/ficha/${alumnoId}`, form);
      setFicha(data);
      setEditing(false);
      setToast('✅ Ficha médica actualizada');
      setTimeout(() => setToast(''), 3000);
    } catch {
      setToast('❌ Error al guardar');
      setTimeout(() => setToast(''), 3000);
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  const campos = [
    { key: 'tipo_sangre', label: 'Tipo de sangre', icon: '🩸' },
    { key: 'alergias', label: 'Alergias', icon: '⚠️' },
    { key: 'medicamentos_base', label: 'Medicamentos base', icon: '💊' },
    { key: 'condiciones', label: 'Condiciones médicas', icon: '🏥' },
    { key: 'contacto_emergencia_nombre', label: 'Contacto emergencia', icon: '📞' },
    { key: 'contacto_emergencia_tel', label: 'Teléfono emergencia', icon: '📱' },
    { key: 'contacto2_nombre', label: 'Contacto 2', icon: '📞' },
    { key: 'contacto2_tel', label: 'Teléfono contacto 2', icon: '📱' },
    { key: 'doctora', label: 'Doctor(a)', icon: '👩‍⚕️' },
    { key: 'notas', label: 'Notas adicionales', icon: '📝' },
  ];

  if (editing) {
    return (
      <div className="card">
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🩺 Editar Ficha Médica</h3>
        {campos.map(c => (
          <div className="form-group" key={c.key}>
            <label className="form-label">{c.icon} {c.label}</label>
            {c.key === 'notas' ? (
              <textarea className="form-textarea" value={form[c.key] || ''} onChange={e => setForm({ ...form, [c.key]: e.target.value })} />
            ) : (
              <input className="form-input" type="text" value={form[c.key] || ''} onChange={e => setForm({ ...form, [c.key]: e.target.value })} />
            )}
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
          <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancelar</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>🩺 Ficha Médica</h3>
          {['maestro','admin','superadmin','tutor'].includes(userRol) && (
            <button className="btn btn-sm btn-ghost" onClick={() => setEditing(true)}>✏️ Editar</button>
          )}
        </div>

        {!ficha ? (
          <div className="empty-state">
            <div className="empty-state-icon">🩺</div>
            <div className="empty-state-text">Sin ficha médica registrada</div>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => setEditing(true)}>Crear ficha</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {campos.map(c => (
              <div key={c.key} className="card card-sm" style={{ background: 'var(--bg)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{c.icon} {c.label}</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{ficha[c.key] || '—'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {toast && <div className={`toast ${toast.includes('✅') ? 'toast-success' : 'toast-error'}`}>{toast}</div>}
    </div>
  );
}
