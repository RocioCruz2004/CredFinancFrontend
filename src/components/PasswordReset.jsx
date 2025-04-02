import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiMail, FiLock, FiCheckCircle, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import './Login.css';

const PasswordReset = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    if (!formData.email.trim()) {
      setError('El email es obligatorio');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('El email no es válido');
      return;
    }
    
    if (!formData.password) {
      setError('La nueva contraseña es obligatoria');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('https://localhost:7177/api/Usuario/retablecer-contraseña', {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password 
      });
      
      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      console.error('Error al resetear contraseña:', err);
      setError(err.response?.data || 'Error al actualizar la contraseña. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button 
          onClick={() => navigate(-1)}
          className="login-link-button"
          style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}
        >
          <FiArrowLeft /> Volver
        </button>

        <div className="login-header">
          <h1>Restablecer Contraseña</h1>
          <p>Ingresa tus datos para actualizar tu contraseña</p>
        </div>
        
        {error && (
          <div className="login-error">
            <FiAlertCircle className="error-icon" />
            <p>{error}</p>
          </div>
        )}
        
        {success ? (
          <div className="login-success">
            <FiCheckCircle className="login-success-icon" />
            <p>¡Contraseña actualizada correctamente!</p>
            <p>Redirigiendo al login...</p>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="login-form">
            <div className="login-form-group">
              <label htmlFor="nombre">Nombre Completo*</label>
              <div className="login-input-container">
                <FiUser className="login-input-icon" />
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
            </div>

            <div className="login-form-group">
              <label htmlFor="email">Correo Electrónico*</label>
              <div className="login-input-container">
                <FiMail className="login-input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>
            
            <div className="login-form-group">
              <label htmlFor="password">Nueva Contraseña*</label>
              <div className="login-input-container">
                <FiLock className="login-input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <span className="login-spinner"></span>
              ) : (
                'Actualizar Contraseña'
              )}
            </button>
          </form>
        )}
        
        <div className="login-footer">
          <p>¿Recordaste tus datos?</p>
          <button 
            onClick={() => navigate('/login')}
            className="login-link-button"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;