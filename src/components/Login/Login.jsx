import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiMail, FiLock, FiLogIn, FiUserPlus, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import './Login.css';

const MAX_ATTEMPTS = 5;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isAccountLocked, setIsAccountLocked] = useState(false);

  useEffect(() => {
    let timeout;
    if (isAccountLocked) {
      timeout = setTimeout(() => {
        setIsAccountLocked(false);
        setFailedAttempts(0);
      }, 30 * 60 * 1000); 
    }
    return () => clearTimeout(timeout);
  }, [isAccountLocked]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.length < 3 || formData.nombre.length > 100) {
      newErrors.nombre = 'El nombre debe tener entre 3 y 100 caracteres';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordReset = async () => {
    try {
      setLoading(true);
      const response = await axios.post('https://localhost:7177/api/Usuario/reset-password', {
        email: formData.email,
        nombre: formData.nombre
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        navigate('/reset-password-confirmation', {
          state: {
            email: formData.email,
            message: response.data || 'Se ha enviado un enlace para restablecer tu contraseña'
          }
        });
      }
    } catch (error) {
      console.error('Error en reset-password:', error);
      if (error.response && error.response.status === 400) {
        setApiError('Datos inválidos para recuperación. Verifica tu email.');
      } else {
        setApiError('Error al solicitar recuperación. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    if (isAccountLocked) {
      setApiError('Cuenta bloqueada temporalmente. Redirigiendo...');
      setTimeout(handlePasswordReset, 1500);
      return;
    }
    
    setLoading(true);
    setApiError('');
    
    try {
      const response = await axios.post('https://localhost:7177/api/Usuario/Login', {
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setFailedAttempts(0);

      localStorage.setItem('token', response.data.token || '');
      localStorage.setItem('idUsuario', response.data.usuario?.idUsuario || '');
      localStorage.setItem('nombre', response.data.usuario?.nombre || formData.nombre);
      localStorage.setItem('email', response.data.usuario?.email || formData.email);
      localStorage.setItem('idCliente', response.data.usuario?.idCliente || '');


      const user = {
        id: response.data.usuario?.idUsuario || '',
        idCliente: response.data.usuario?.idCliente || '',
        nombre: response.data.usuario?.nombre || formData.nombre,
        email: response.data.usuario?.email || formData.email,
        rol:  'CLIENTE' // Ajusta según corresponda
    };
    
    // Guarda el objeto en localStorage
    localStorage.setItem('user', JSON.stringify(user));

      if (!response.data.usuario?.idCliente) {
        navigate('/InicioAdmin');
      } else {
        navigate('/InicioCliente');
      }
    } catch (error) {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);

      if (attempts >= MAX_ATTEMPTS) {
        setIsAccountLocked(true);
        setApiError('Demasiados intentos fallidos. Redirigiendo...');
        setTimeout(() => {
          navigate('/password-reset', { 
            state: { 
              email: formData.email,
              nombre: formData.nombre 
            } 
          });
        }, 1500);
        return;
      }

      if (error.response) {
        if (error.response.status === 401) {
          setApiError(`Credenciales incorrectas. Intentos restantes: ${MAX_ATTEMPTS - attempts}`);
        } else if (error.response.status === 400) {
          setApiError('Datos inválidos. Verifica tu información.');
        } else {
          setApiError(`Error del servidor: ${error.response.status}`);
        }
      } else if (error.request) {
        setApiError('No se recibió respuesta del servidor');
      } else {
        setApiError('Error al configurar la solicitud');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
          <h1>Iniciar Sesión</h1>
          <p>Ingresa tus datos para acceder a tu cuenta</p>
        </div>
        
        {apiError && (
          <div className={`login-error ${isAccountLocked ? 'account-locked' : ''}`}>
            <FiAlertCircle className="error-icon" />
            <p>{apiError}</p>
            {isAccountLocked && <p>Redirigiendo a recuperación de contraseña...</p>}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <div className={`login-input-container ${errors.nombre ? 'error' : ''} ${isAccountLocked ? 'disabled' : ''}`}>
              <FiUser className="login-input-icon" />
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                disabled={isAccountLocked || loading}
              />
            </div>
            {errors.nombre && <span className="login-error-message">{errors.nombre}</span>}
          </div>
          
          <div className="login-form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <div className={`login-input-container ${errors.email ? 'error' : ''} ${isAccountLocked ? 'disabled' : ''}`}>
              <FiMail className="login-input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                disabled={isAccountLocked || loading}
              />
            </div>
            {errors.email && <span className="login-error-message">{errors.email}</span>}
          </div>
          
          <div className="login-form-group">
            <label htmlFor="password">Contraseña</label>
            <div className={`login-input-container ${errors.password ? 'error' : ''} ${isAccountLocked ? 'disabled' : ''}`}>
              <FiLock className="login-input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isAccountLocked || loading}
              />
            </div>
            {errors.password && <span className="login-error-message">{errors.password}</span>}
          </div>
          
          <motion.button
            type="submit"
            className={`login-button ${isAccountLocked ? 'button-disabled' : ''}`}
            whileHover={!isAccountLocked && !loading ? { scale: 1.02 } : {}}
            whileTap={!isAccountLocked && !loading ? { scale: 0.98 } : {}}
            disabled={loading || isAccountLocked}
          >
            {loading ? (
              <span className="solicitar-credito"></span>
            ) : isAccountLocked ? (
              'Redirigiendo...'
            ) : (
              <>
                <FiLogIn className="login-button-icon" />
                Iniciar Sesión
              </>
            )}
          </motion.button>
        </form>
        
        <div className="login-footer">
          <p>¿No tienes una cuenta?</p>
          <button 
            onClick={() => navigate('/register')}
            className="login-link-button"
            disabled={loading || isAccountLocked}
          >
            <FiUserPlus className="login-button-icon" />
            Regístrate aquí
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;