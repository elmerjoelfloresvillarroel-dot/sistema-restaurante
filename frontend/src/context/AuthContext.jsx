import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sesión al cargar la aplicación
  useEffect(() => {
    const checkSessionAndConfig = async () => {
      const savedToken = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('authUser');

      if (savedToken && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          
          // Si no es Administrador, verificar si el restaurante está abierto
          if (parsedUser.rol !== 'Administrador') {
            try {
              const res = await axios.get('http://127.0.0.1:8000/api/configuracion/');
              if (res.data && res.data.esta_abierto === false) {
                // Restaurante cerrado: limpiar sesión
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
                setLoading(false);
                return;
              }
            } catch (err) {
              console.error('Error al verificar configuración en restauración de sesión:', err);
            }
          }

          setToken(savedToken);
          setUser(parsedUser);
          // Configurar token por defecto para peticiones Axios
          axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        } catch (err) {
          console.error('Error al restaurar sesión:', err);
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
      }
      setLoading(false);
    };

    checkSessionAndConfig();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password
      });

      const { access, username: uName, rol, id } = res.data;
      const userData = { id, username: uName, rol };

      // Si no es Administrador, verificar si el restaurante está abierto
      if (rol !== 'Administrador') {
        try {
          const configRes = await axios.get('http://127.0.0.1:8000/api/configuracion/');
          if (configRes.data && configRes.data.esta_abierto === false) {
            return { 
              success: false, 
              error: 'El restaurante se encuentra cerrado actualmente. Solo el administrador puede iniciar sesión.' 
            };
          }
        } catch (configErr) {
          console.error('Error al verificar configuración en login:', configErr);
        }
      }

      // Guardar en localStorage
      localStorage.setItem('authToken', access);
      localStorage.setItem('authUser', JSON.stringify(userData));

      // Configurar Axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // Actualizar estado
      setToken(access);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      console.error('Error en login:', err);
      let errorMsg = 'Error al conectar con el servidor.';
      if (err.response && err.response.data) {
        errorMsg = err.response.data.detail || 'Usuario o contraseña incorrectos.';
      }
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');

    // Limpiar Axios
    delete axios.defaults.headers.common['Authorization'];

    // Limpiar estado
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
