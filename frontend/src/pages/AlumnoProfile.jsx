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
    <div className="alumno-profile-page">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')} style={{ marginBottom: 24, fontSize: 13, fontWeight: 700 }}>
        ← REGRESAR AL PANEL
      </button>

      <div className="card floating" style={{ 
        textAlign: 'center', 
        marginBottom: 32, 
        padding: 40,
        background: 'rgba(255, 255, 255, 0.4)',
        border: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Abstract background highlight */}
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'var(--pk-yellow)', filter: 'blur(80px)', opacity: 0.1 }} />
        
        <div className="avatar avatar-lg" style={{ 
          margin: '0 auto 20px', 
          background: 'white', 
          fontSize: 60,
          width: 120,
          height: 120,
          border: '8px solid white',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>🧒</div>
        
        <h2 className="text-vibrant" style={{ fontSize: 40, letterSpacing: -1 }}>{alumno.nombre} {alumno.apellido}</h2>
        
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
          <span className="badge border-green" style={{ background: 'rgba(138, 201, 38, 0.1)', color: 'var(--pk-green)', padding: '8px 20px' }}>{alumno.grupo_nombre}</span>
          <span className="badge border-red" style={{ background: 'rgba(255, 89, 94, 0.1)', color: 'var(--pk-red)', padding: '8px 20px' }}>Nivel {alumno.grupo_nivel}</span>
          <span className="badge border-blue" style={{ background: 'rgba(25, 130, 196, 0.1)', color: 'var(--pk-blue)', padding: '8px 20px' }}>{edad} años</span>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: 32, padding: 6, gap: 8 }}>
        {tabs.map(t => (
          <button 
            key={t.key} 
            className={`tab ${tab === t.key ? 'active shadow-vibrant' : ''}`} 
            onClick={() => setTab(t.key)}
            style={{ fontSize: 14, padding: '12px 20px' }}
          >
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
