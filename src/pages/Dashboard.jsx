import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { api } from '../api';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [data, setData] = useState({ directores: [], maestros: [], padres: [], alumnos: [] });
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(user?.rol === 'tutor' ? 'alumnos' : 'alumnos');

  useEffect(() => {
    const load = async () => {
      try {
        const [jRes, rRes] = await Promise.all([
          api.get('/jerarquia/usuarios'),
          api.get('/radar/hoy').catch(() => ({ data: [] })),
        ]);
        setData(jRes.data);
        setReportes(rRes.data);
        
        // Auto select tab
        if (user?.rol === 'superadmin') setActiveTab('directores');
        else if (user?.rol === 'admin') setActiveTab('maestros');
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [user]);

  const getEmoji = (alumnoId) => {
    const r = reportes.find((rep) => rep.alumno_id === alumnoId);
    return r ? r.emoji : '—';
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  // Determinar qué pestañas mostrar
  const tabs = [];
  if (['superadmin'].includes(user?.rol)) tabs.push({ key: 'directores', label: `👔 Directores (${data.directores.length})` });
  if (['superadmin', 'admin'].includes(user?.rol)) tabs.push({ key: 'maestros', label: `👩‍🏫 Maestros (${data.maestros.length})` });
  if (['superadmin', 'admin', 'maestro'].includes(user?.rol)) tabs.push({ key: 'padres', label: `👪 Padres (${data.padres.length})` });
  tabs.push({ key: 'alumnos', label: `🧒 ${user?.rol === 'tutor' ? 'Hijos' : 'Alumnos'} (${data.alumnos.length})` });

  return (
    <div>
      <div className="page-header">
        <div className="page-title text-vibrant" style={{ fontSize: 48 }}>¡Hola, {user?.nombre?.split(' ')[0]}! 👋</div>
        <div className="page-subtitle" style={{ fontWeight: 800, marginTop: -5 }}>PANEL DE CONTROL</div>
      </div>

      <div className="tabs" style={{ marginBottom: 24 }}>
        {tabs.map(t => (
          <button 
            key={t.key} 
            className={`tab ${activeTab === t.key ? 'active' : ''}`} 
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card">
        {data[activeTab]?.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-text">No hay {activeTab} registrados en tu jerarquía</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data[activeTab]?.map((item) => (
              <div 
                key={item.id} 
                className="list-item" 
                onClick={() => activeTab === 'alumnos' ? navigate(`/alumno/${item.id}`) : null}
                style={{ cursor: activeTab === 'alumnos' ? 'pointer' : 'default' }}
              >
                <div className="avatar" style={{ background: item.avatar ? `url(${item.avatar}) center/cover` : 'var(--primary-light)' }}>
                  {!item.avatar && (activeTab === 'alumnos' ? '🧒' : item.nombre?.charAt(0))}
                </div>
                
                <div className="list-item-content">
                  <div className="list-item-title">{item.nombre} {item.apellido || ''}</div>
                  <div className="list-item-sub">
                    {activeTab === 'alumnos' 
                      ? `${item.grupo_nombre || 'Sin Grupo'} — Tutor ID: ${item.tutor_id.substring(0,4)}...`
                      : `${item.email} • ${item.telefono || 'Sin 📞'}`}
                  </div>
                </div>
                
                {activeTab === 'alumnos' && (
                  <>
                    <div style={{ fontSize: 28 }}>{getEmoji(item.id)}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 18 }}>›</div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
