import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AlumnoProfile from './pages/AlumnoProfile';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Layout from './components/Layout';
import './index.css';

function PrivateRoute({ children }) {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { token } = useAuthStore();
  return token ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/alumno/:id" element={<PrivateRoute><Layout><AlumnoProfile /></Layout></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><Layout><Admin /></Layout></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
