import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CreditApplication.css';
import { FiDollarSign, FiFileText, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';

const CreditApplication = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    monto: '',
    ingresos: '',
    observaciones: '',
    idTipoCredito: '',
    idCliente: localStorage.getItem('idCliente') || '',
    idParametro: 2
  });
  const [creditTypes, setCreditTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [typesError, setTypesError] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchCreditTypes = async () => {
      try {
        setLoadingTypes(true);
        setTypesError('');
        const response = await axios.get('https://localhost:7177/api/TipoCredito', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data && Array.isArray(response.data)) {
          setCreditTypes(response.data);
        } else {
          setTypesError('Formato de datos inesperado');
        }
      } catch (error) {
        console.error('Error al obtener tipos de crédito:', error);
        setTypesError('No se pudieron cargar los tipos de crédito. Intenta recargar.');
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchCreditTypes();
  }, []);

  useEffect(() => {
    if (location.state?.idTipoCredito) {
      setFormData(prev => ({
        ...prev,
        idTipoCredito: location.state.idTipoCredito
      }));
    }
  }, [location, creditTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      newErrors.monto = "El monto debe ser mayor a cero";
    }
    if (!formData.ingresos || parseFloat(formData.ingresos) <= 0) {
      newErrors.ingresos = "Los ingresos deben ser mayores a cero";
    }
    if (!formData.idTipoCredito) {
      newErrors.idTipoCredito = "Debes seleccionar un tipo de crédito";
    }
    if (formData.observaciones && formData.observaciones.length > 500) {
      newErrors.observaciones = "Las observaciones no pueden exceder los 500 caracteres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        monto: parseFloat(formData.monto),
        ingresos: parseFloat(formData.ingresos),
        observaciones: formData.observaciones,
        idTipoCredito: parseInt(formData.idTipoCredito),
        idCliente: formData.idCliente,  
        idParametro: formData.idParametro
      };

      const response = await axios.post('https://localhost:7177/api/SolicitudCliente', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 200 || response.status === 201) {
        try {
          const lastIdResponse = await axios.get('https://localhost:7177/api/SolicitudCliente/ultimaSolicitudId', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
      
          const lastId = lastIdResponse.data; 
      
          // Opción 2: Si el ID está en .data.value (comenta la línea anterior y descomenta esta)
          // const lastId = lastIdResponse.data.value;
      
          console.log("ID obtenido:", lastId); // Verifica en consola
      
          if (!lastId) {
            throw new Error("No se recibió un ID válido");
          }
      
          navigate("/subir-documentos", {
            state: {
              idSolicitudCredito: lastId, 
            },
          });
        } catch (error) {
          console.error("Error al obtener o enviar el ID:", error);
        }
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setSubmitError(error.response?.data?.message || 'Error al procesar la solicitud. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/solicitar-credito'); 
  };

  const handleRetryLoadTypes = () => {
    setCreditTypes([]);
    setLoadingTypes(true);
    setTypesError('');
  };

  return (
    <div className="credit-application-container">
      <header className="credit-application-header">
        <button onClick={handleBack} className="back-button">
          <FiArrowLeft /> Volver
        </button>
        <h1>Solicitud de Crédito</h1>
      </header>
      
      <main className="credit-application-main">
        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-section">
            <h2>Información del Crédito</h2>
            
            <div className="form-group">
              <label htmlFor="idTipoCredito">Tipo de Crédito</label>
              
              {loadingTypes ? (
                <div className="loading-types">
                  <FiRefreshCw className="spinner" /> Cargando tipos de crédito...
                </div>
              ) : typesError ? (
                <div className="types-error">
                  <p>{typesError}</p>
                  <button 
                    type="button" 
                    onClick={handleRetryLoadTypes}
                    className="retry-button"
                  >
                    <FiRefreshCw /> Intentar nuevamente
                  </button>
                </div>
              ) : (
                <>
                  <select
                    id="idTipoCredito"
                    name="idTipoCredito"
                    value={formData.idTipoCredito}
                    onChange={handleChange}
                    className={errors.idTipoCredito ? 'error' : ''}
                  >
                    <option value="">Selecciona un tipo de crédito</option>
                    {creditTypes.map(type => (
                      <option key={type.idTipoCredito} value={type.idTipoCredito}>
                        {type.nombre} - {type.descripcion}
                      </option>
                    ))}
                  </select>
                  {errors.idTipoCredito && <span className="error-message">{errors.idTipoCredito}</span>}
                </>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="monto">
                  Monto Solicitado (Bs)
                </label>
                <input
                  type="number"
                  id="monto"
                  name="monto"
                  value={formData.monto}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  className={errors.monto ? 'error' : ''}
                  placeholder="Ej: 5000.00"
                />
                {errors.monto && <span className="error-message">{errors.monto}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="ingresos">
                Ingresos Mensuales (Bs)
                </label>
                <input
                  type="number"
                  id="ingresos"
                  name="ingresos"
                  value={formData.ingresos}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  className={errors.ingresos ? 'error' : ''}
                  placeholder="Ej: 1500.00"
                />
                {errors.ingresos && <span className="error-message">{errors.ingresos}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="observaciones">
                <FiFileText /> Observaciones (Opcional)
              </label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                className={errors.observaciones ? 'error' : ''}
                placeholder="Describe el propósito del crédito (máx. 500 caracteres)"
                rows="3"
                maxLength="500"
              />
              <div className="char-counter">
                {formData.observaciones.length}/500 caracteres
              </div>
              {errors.observaciones && <span className="error-message">{errors.observaciones}</span>}
            </div>
          </div>
          
          <div className="form-actions">
            {submitError && <div className="submit-error">{submitError}</div>}
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting || loadingTypes || typesError}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreditApplication;
