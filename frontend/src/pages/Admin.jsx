import { useState } from 'react';
import { useAuthStore } from '../store';

export default function Admin() {
  const { user } = useAuthStore();
  
  if (!['admin', 'superadmin'].includes(user?.rol)) {
    return <div className="empty-state">Acceso denegado</div>;
  }

  const [tab, setTab] = useState('maestros');

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Administración del Kinder</h1>
        <p className="page-subtitle">Gestiona al personal y los alumnos</p>
      </div>

      <div className="tabs" style={{ maxWidth: 400 }}>
        <button className={`tab ${tab === 'maestros' ? 'active' : ''}`} onClick={() => setTab('maestros')}>👩‍🏫 Maestros</button>
        {user?.rol === 'superadmin' && (
          <button className={`tab ${tab === 'directores' ? 'active' : ''}`} onClick={() => setTab('directores')}>🏢 Directores</button>
        )}
      </div>

      <div className="card">
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          {tab === 'maestros' ? 'Gestión de Maestros' : 'Gestión de Directores'}
        </h3>
        
        <button className="btn btn-sm btn-primary mb-16">+ Registrar nuevo {tab === 'maestros' ? 'Maestro' : 'Director'}</button>

        <div className="empty-state">
          <div className="empty-state-icon">🚧</div>
          <div className="empty-state-text">Módulo en construcción. Aquí aparecerá la lista de {tab}.</div>
        </div>
      </div>
    </div>
  );
}
