// src/components/Auth/ProtectedRoute.jsx
import { useUser } from '../../contexts/UserContext';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../UI/LoadingSpinner';

function ProtectedRoute({ children, requireRole = null }) {
  const { user, loading } = useUser();

  if (loading) {
    return <LoadingSpinner message="Проверка авторизации..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;