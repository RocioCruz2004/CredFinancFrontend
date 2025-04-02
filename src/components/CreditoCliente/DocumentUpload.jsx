import React, { useState } from 'react';
import axios from 'axios';
import './DocumentUpload.css';
import { FiUpload, FiArrowLeft, FiFile, FiCheckCircle, FiX, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const DocumentUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { idSolicitudCredito } = location.state || {}; 
  const [documentData, setDocumentData] = useState({
    tipo: '',
    archivo: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const documentTypes = [
    { value: 'Carnet de Identidad', label: 'Carnet de Identidad', icon: '🆔' },
    { value: 'Comprobante de Domicilio', label: 'Comprobante de Domicilio', icon: '🏠' },
    { value: 'Comprobante de Ingresos', label: 'Comprobante de Ingresos', icon: '💰' }
  ];

  const handleChange = (e) => {
    setDocumentData({
      ...documentData,
      [e.target.name]: e.target.value
    });
    setSubmitError('');
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setDocumentData({
        ...documentData,
        archivo: e.target.files[0]
      });
      setSubmitError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      setDocumentData({
        ...documentData,
        archivo: e.dataTransfer.files[0]
      });
      setSubmitError('');
    }
  };

  const removeFile = () => {
    setDocumentData({
      ...documentData,
      archivo: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!documentData.tipo) {
      setSubmitError('Por favor selecciona un tipo de documento');
      return;
    }
    
    if (!documentData.archivo) {
      setSubmitError('Por favor sube un archivo');
      return;
    }

    if (!idSolicitudCredito) {
      setSubmitError('Error: No se encontró el ID de la solicitud.');
      return;
    }
  

    const MAX_FILE_SIZE = 10 * 1024 * 1024; 
    if (documentData.archivo.size > MAX_FILE_SIZE) {
      setSubmitError('El archivo es demasiado grande (máximo 5MB permitido)');
      return;
    }
  
    // Validación de tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(documentData.archivo.type)) {
      setSubmitError('Formato de archivo no soportado. Use JPG, PNG o PDF');
      return;
    }
  
    setIsSubmitting(true);
    setSubmitError('');
  
    try {
      const formData = new FormData();
      formData.append('tipo', documentData.tipo);
      formData.append('archivo', documentData.archivo);
      formData.append('idSolicitudCredito', idSolicitudCredito);
  
      const response = await axios.post(
        'https://localhost:7177/api/SolicitudCliente/GuardarDocumento', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          timeout: 30000 
        }
      );
  
      setSubmitSuccess(true);
      setTimeout(() => navigate('/view-credits'), 2000);
    } catch (error) {
      console.error('Error:', error);
      
      let errorMessage = 'Error al subir el documento';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Sesión expirada. Por favor inicie sesión nuevamente';
          navigate('/login');
        } else if (error.response.status === 413) {
          errorMessage = 'El archivo es demasiado grande';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Tiempo de espera agotado. Intente nuevamente';
        } else {
          errorMessage = 'No se pudo conectar con el servidor';
        }
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => navigate(-1);

  if (submitSuccess) {
    return (
      <motion.div 
        className="success-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="success-content">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <FiCheckCircle className="success-icon" />
          </motion.div>
          <h2>¡Documento cargado exitosamente!</h2>
          <p>Tu documento ha sido verificado y está siendo procesado.</p>
          <motion.button
            onClick={() => navigate('/view-credits')}
            className="success-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continuar
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="document-upload-container">
      <header className="upload-header">
        <motion.button 
          onClick={handleBack} 
          className="back-btn"
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiArrowLeft />
        </motion.button>
        <div className="header-content">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Cargar Documento
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Sube el documento requerido para completar tu solicitud
          </motion.p>
        </div>
      </header>

      <main className="upload-main">
        <motion.div 
          className="upload-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tipo de Documento</label>
              <div className="document-type-selector">
                {documentTypes.map((docType) => (
                  <motion.div
                    key={docType.value}
                    className={`document-type-option ${documentData.tipo === docType.value ? 'selected' : ''}`}
                    onClick={() => {
                      setDocumentData({ ...documentData, tipo: docType.value });
                      setSubmitError('');
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="doc-icon">{docType.icon}</span>
                    <span className="doc-label">{docType.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Subir Archivo</label>
              <motion.div 
                className={`upload-zone ${isDragging ? 'dragging' : ''} ${documentData.archivo ? 'has-file' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                whileHover={{ scale: 1.005 }}
              >
                <input 
                  type="file" 
                  id="file-upload"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label htmlFor="file-upload" className="upload-label">
                  {documentData.archivo ? (
                    <div className="file-preview">
                      <div className="file-info">
                        <FiFile className="file-icon" />
                        <div className="file-details">
                          <span className="file-name">{documentData.archivo.name}</span>
                          <span className="file-size">{(documentData.archivo.size / 1024).toFixed(2)} KB</span>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="remove-file-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <>
                      <FiUpload className="upload-icon" />
                      <span>Arrastra tu archivo aquí o haz clic para buscar</span>
                      <span className="file-types">Formatos soportados: PDF, JPG, PNG (Max. 5MB)</span>
                    </>
                  )}
                </label>
              </motion.div>
            </div>

            <AnimatePresence>
              {submitError && (
                <motion.div 
                  className="error-message"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {submitError}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting || !documentData.tipo || !documentData.archivo}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="spinner" />
                  Procesando...
                </>
              ) : (
                'Enviar Documento'
              )}
            </motion.button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default DocumentUpload;