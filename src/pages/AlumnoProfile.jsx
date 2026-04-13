import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { api } from '../api';
import RadarEmocional from '../components/RadarEmocional';
import FichaMedica from '../components/FichaMedica';
import Nutricion from '../components/Nutricion';
import DiarioEscolar from '../components/DiarioEscolar';
import Incidentes from '../components/Incidentes';

export default function AlumnoProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [alumno, setAlumno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('radar');

  useEffect(() => {
    api.get(`/alumnos/${id}`)
      .then(r => setAlumno(r.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!alumno) return null;

  const edad = Math.floor((Date.now() - new Date(alumno.fecha_nacimiento)) / (365.25 * 24 * 60 * 60 * 1000));

  const tabs = [
    { key: 'radar', label: '😊 Radar', icon: '😊' },
    { key: 'salud', label: '🩺 Salud', icon: '🩺' },
    { key: 'nutricion', label: '🍎 Nutrición', icon: '🍎' },
    { key: 'diario', label: '📋 Diario', icon: '📋' },
    { key: 'incidentes', label: '🚨 Incidentes', icon: '🚨' },
  ];

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')} style={{ marginBottom: 16 }}>
        ← Volver
      </button>

      <div className="card" style={{ textAlign: 'center', marginBottom: 24, background: 'linear-gradient(135deg, var(--primary-light), var(--bg))' }}>
        <div className="avatar avatar-lg" style={{ margin: '0 auto 12px', background: 'white' }}>🧒</div>
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>{alumno.nombre} {alumno.apellido}</h2>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8, flexWrap: 'wrap' }}>
          <span className="badge badge-primary">{alumno.grupo_nombre}</span>
          <span className="badge badge-secondary">{alumno.grupo_nivel}</span>
          <span className="badge badge-blue">{edad} años</span>
        </div>
      </div>

      <div className="tabs">
        {tabs.map(t => (
          <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'radar' && <RadarEmocional alumnoId={id} userRol={user?.rol} />}
      {tab === 'salud' && <FichaMedica alumnoId={id} userRol={user?.rol} />}
      {tab === 'nutricion' && <Nutricion alumnoId={id} userRol={user?.rol} />}
      {tab === 'diario' && <DiarioEscolar alumnoId={id} userRol={user?.rol} />}
      {tab === 'incidentes' && <Incidentes alumnoId={id} userRol={user?.rol} />}
    </div>
  );
}
