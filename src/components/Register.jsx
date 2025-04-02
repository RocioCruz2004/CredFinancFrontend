import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiMail, FiLock, FiPhone, FiHome, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    genero: '',
    nacionalidad: '',
    direccion: '',
    telefono: '',
    fechaNacimiento: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdUserId, setCreatedUserId] = useState(null);

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
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.nombre.trim()) newErrors.nombre = 'Nombre es obligatorio';
      if (!formData.email.trim()) newErrors.email = 'Email es obligatorio';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email no válido';
      if (!formData.password) newErrors.password = 'Contraseña es requerida';
      else if (formData.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    } else {
      if (!formData.genero) newErrors.genero = 'Género es requerido';
      if (!formData.direccion?.trim()) newErrors.direccion = 'Dirección es requerida';
      if (!formData.telefono?.trim()) newErrors.telefono = 'Teléfono es obligatorio';
      if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'Fecha de nacimiento es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUserRegistration = async () => {
    try {
      const response = await axios.post('https://localhost:7177/api/Usuario/crear-cuenta-usuario', {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password
      });

      console.log('Respuesta del servidor (Usuario):', response.data);

      // Modificado para manejar diferentes estructuras de respuesta
      if (response.data.idUsuario) {
        return response.data.idUsuario;
      } else if (response.data.success === false) {
        throw new Error(response.data.message || 'Error al registrar usuario');
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error('Error en registro de usuario:', error);
      let errorMessage = 'Error al registrar usuario';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  };

  const handleClientRegistration = async (userId) => {
    try {
      const response = await axios.post('https://localhost:7177/api/Cliente/crear-cliente', {
        idUsuario: userId,
        genero: formData.genero,
        nacionalidad: formData.nacionalidad,
        direccion: formData.direccion,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento
      });

      console.log('Respuesta del servidor (Cliente):', response.data);

      if (!response.data.success && !response.data.idCliente) {
        throw new Error(response.data.message || 'Error al registrar cliente');
      }

      return response.data;
    } catch (error) {
      console.error('Error en registro de cliente:', error);
      let errorMessage = 'Error al registrar cliente';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      throw new Error(errorMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    setLoading(true);
    setApiError('');
    
    try {
      if (step === 1) {
        const userId = await handleUserRegistration();
        console.log('Usuario registrado con ID:', userId);
        setCreatedUserId(userId);
        setTimeout(() => setStep(2), 500); // Pequeño delay para mejor UX
      } else {
        if (!createdUserId) {
          throw new Error('No se encontró el ID de usuario');
        }
        await handleClientRegistration(createdUserId);
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error('Error en el proceso:', error);
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Registro {step === 1 ? 'de Usuario' : 'de Cliente'}</h1>
          <p>Paso {step} de 2</p>
        </div>
        
        {apiError && (
          <div className="register-error">
            <p>{apiError}</p>
          </div>
        )}
        
        {success ? (
          <div className="register-success">
            <FiCheckCircle className="success-icon" />
            <p>¡Registro completado exitosamente!</p>
            <p>Redirigiendo al login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <>
                <div className="form-group">
                  <label>Nombre Completo*</label>
                  <div className="input-with-icon">
                    <FiUser className="input-icon" />
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className={errors.nombre ? 'error' : ''}
                      placeholder="Ingrese su nombre completo"
                    />
                  </div>
                  {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                </div>

                <div className="form-group">
                  <label>Email*</label>
                  <div className="input-with-icon">
                    <FiMail className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="ejemplo@correo.com"
                    />
                  </div>
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>Contraseña*</label>
                  <div className="input-with-icon">
                    <FiLock className="input-icon" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={errors.password ? 'error' : ''}
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label>Confirmar Contraseña*</label>
                  <div className="input-with-icon">
                    <FiLock className="input-icon" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={errors.confirmPassword ? 'error' : ''}
                      placeholder="Confirme su contraseña"
                    />
                  </div>
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>

                <button type="submit" className="primary-button" disabled={loading}>
                  {loading ? 'Registrando...' : 'Siguiente'}
                </button>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Género*</label>
                  <select
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    className={errors.genero ? 'error' : ''}
                  >
                    <option value="">Seleccionar género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                    <option value="Prefiero no decir">Prefiero no decir</option>
                  </select>
                  {errors.genero && <span className="error-message">{errors.genero}</span>}
                </div>

                <div className="form-group">
                  <label>Dirección*</label>
                  <div className="input-with-icon">
                    <FiHome className="input-icon" />
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      className={errors.direccion ? 'error' : ''}
                      placeholder="Ingrese su dirección completa"
                    />
                  </div>
                  {errors.direccion && <span className="error-message">{errors.direccion}</span>}
                </div>

                <div className="form-group">
                  <label>Teléfono*</label>
                  <div className="input-with-icon">
                    <FiPhone className="input-icon" />
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className={errors.telefono ? 'error' : ''}
                      placeholder="Número de teléfono"
                    />
                  </div>
                  {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                </div>

                <div className="form-group">
                  <label>Fecha de Nacimiento*</label>
                  <div className="input-with-icon">
                    <FiCalendar className="input-icon" />
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className={errors.fechaNacimiento ? 'error' : ''}
                    />
                  </div>
                  {errors.fechaNacimiento && <span className="error-message">{errors.fechaNacimiento}</span>}
                </div>

                <div className="form-group">
                  <label>Nacionalidad</label>
                  <input
                    type="text"
                    name="nacionalidad"
                    value={formData.nacionalidad}
                    onChange={handleChange}
                    placeholder="Ingrese su nacionalidad"
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="secondary-button"
                    disabled={loading}
                  >
                    Atrás
                  </button>
                  <button 
                    type="submit" 
                    className="primary-button"
                    disabled={loading}
                  >
                    {loading ? 'Registrando...' : 'Completar Registro'}
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;