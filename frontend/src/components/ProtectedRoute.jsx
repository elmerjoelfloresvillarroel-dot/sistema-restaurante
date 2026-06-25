import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 flex-col gap-3">
        <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
        <span className="text-gray-500 text-sm font-medium">Verificando credenciales...</span>
      </div>
    );
  }

  // Redirigir a login si no ha iniciado sesión
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirigir a inicio si no tiene el rol necesario
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
