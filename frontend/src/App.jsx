import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import InicioPublico from './pages/InicioPublico';
import Login from './pages/Login';
import CajaPOS from './pages/CajaPOS';
import AdminDashboard from './pages/AdminDashboard';
import CocinaDashboard from './pages/CocinaDashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Navbar visible en todas las rutas */}
          <Navbar />
          
          {/* Contenedor del contenido principal */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<InicioPublico />} />
              <Route path="/login" element={<Login />} />
              
              <Route 
                path="/caja" 
                element={
                  <ProtectedRoute allowedRoles={['Cajero', 'Administrador']}>
                    <CajaPOS />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['Administrador']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/cocina" 
                element={
                  <ProtectedRoute allowedRoles={['Cocina']}>
                    <CocinaDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

