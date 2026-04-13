import { useState, useEffect } from 'react';
import { api } from '../api';

const EMOCIONES = [
  { emoji: '😊', estado: 'ok', label: 'Feliz' },
  { emoji: '😢', estado: 'triste', label: 'Triste' },
  { emoji: '😡', estado: 'enojado', label: 'Enojado' },
  { emoji: '😰', estado: 'ansioso', label: 'Ansioso' },
  { emoji: '🤒', estado: 'enfermo', label: 'Enfermo' },
];

export default function RadarEmocional({ alumnoId, userRol }) {
  const [selected, setSelected] = useState(null);
  const [nota, setNota] = useState('');
  const [showNota, setShowNota] = useState(false);
  const [reporteHoy, setReporteHoy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.get('/radar/hoy')
      .then(r => {
        const rep = r.data.find(rep => rep.alumno_id === alumnoId);
        if (rep) {
          setReporteHoy(rep);
          setSelected(EMOCIONES.find(e => e.estado === rep.estado));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [alumnoId]);

  const handleSelect = (emocion) => {
    setSelected(emocion);
    if (['triste', 'enojado', 'ansioso', 'enfermo'].includes(emocion.estado) && !showNota) {
      setShowNota(true);
    }
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await api.post('/radar/reporte', {
        alumno_id: alumnoId,
        emoji: selected.emoji,
        estado: selected.estado,
        nota: nota || null,
        fecha: new Date().toISOString().split('T')[0],
      });
      setReporteHoy({ emoji: selected.emoji, estado: selected.estado, nota });
      setToast('✅ Reporte emocional guardado');
      setTimeout(() => setToast(''), 3000);
    } catch (e) {
      setToast('❌ Error al guardar');
      setTimeout(() => setToast(''), 3000);
    } finally { setSaving(false); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="card" style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Radar Emocional</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
          {reporteHoy ? 'Estado registrado hoy' : '¿Cómo se siente hoy?'}
        </p>

        <div className="emoji-grid">
          {EMOCIONES.map(e => (
            <button
              key={e.estado}
              className={`emoji-btn ${selected?.estado === e.estado ? 'selected' : ''}`}
              onClick={() => handleSelect(e)}
              title={e.label}
            >
              {e.emoji}
            </button>
          ))}
        </div>

        {selected && (
          <div style={{ marginTop: 16 }}>
            <span className="badge badge-primary" style={{ fontSize: 14, padding: '6px 16px' }}>
              {selected.emoji} {selected.label}
            </span>
          </div>
        )}

        {showNota && (
          <div style={{ marginTop: 16, textAlign: 'left' }}>
            <div style={{ background: '#FFF8E1', padding: '8px 14px', borderRadius: 10, fontSize: 13, color: '#B8860B', marginBottom: 8 }}>
              💡 Sugerencia: agrega una nota para dar contexto (es opcional)
            </div>
            <textarea
              className="form-textarea"
              placeholder="¿Qué pasó? (opcional)"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              rows={3}
            />
          </div>
        )}

        {selected && !reporteHoy && (
          <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar reporte'}
          </button>
        )}

        {reporteHoy && (
          <div style={{ marginTop: 16, padding: 16, background: 'var(--primary-light)', borderRadius: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary-dark)' }}>
              ✅ Reporte de hoy registrado: {reporteHoy.emoji} {EMOCIONES.find(e => e.estado === reporteHoy.estado)?.label}
            </div>
            {reporteHoy.nota && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Nota: {reporteHoy.nota}</div>}
          </div>
        )}
      </div>

      {toast && <div className={`toast ${toast.includes('✅') ? 'toast-success' : 'toast-error'}`}>{toast}</div>}
    </div>
  );
}
