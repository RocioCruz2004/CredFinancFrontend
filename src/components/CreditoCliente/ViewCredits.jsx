import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiFileText, FiDollarSign, FiCalendar, FiCheckCircle, FiAlertCircle, FiClock, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';
import './ViewCredits.css';

const ViewCredits = () => {
  const navigate = useNavigate();
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCredit, setSelectedCredit] = useState(null);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const idCliente = localStorage.getItem('idCliente');
        const response = await axios.get(`https://localhost:7177/api/SolicitudCliente/cliente/${idCliente}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Mapear los datos para adaptarlos a la estructura esperada
        const mappedCredits = response.data.map(credit => ({
          ...credit,
          TipoCredito: {
            Nombre: credit.tipofeedito?.nombre || 'No especificado',
            Descripcion: credit.tipofeedito?.description || ''
          },
          Documentos: credit.documents?.map(doc => ({
            Tipo: doc.tipo,
            ArchivoUrl: doc.archivourl,
            FechaCarga: doc.fechacarga
          })) || []
        }));
        
        setCredits(mappedCredits);
      } catch (err) {
        console.error('Error fetching credits:', err);
        setError('No se pudieron cargar las solicitudes. Por favor intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, []);

  const handleBack = () => navigate(-1);

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getStatusColor = (status) => {
    if (!status) return '#6c757d';
    
    switch (status.toLowerCase()) {
      case 'aprobado':
        return '#4cc9f0';
      case 'rechazado':
        return '#f72585';
      case 'pendiente':
        return '#ffbe0b';
      case 'en revisión':
        return '#4361ee';
      default:
        return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return <FiFileText className="status-icon" />;
    
    switch (status.toLowerCase()) {
      case 'aceptada':
        return <FiCheckCircle className="status-icon" />;
      case 'rechazada':
        return <FiAlertCircle className="status-icon" />;
      case 'pendiente':
      case 'en revisión':
        return <FiClock className="status-icon" />;
      default:
        return <FiFileText className="status-icon" />;
    }
  };

  const downloadDocument = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando tus solicitudes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <FiAlertCircle className="error-icon" />
          <p>{error}</p>
          <button onClick={handleBack} className="back-button">
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-credits-container">
      <header className="credits-header">
        <button onClick={handleBack} className="back-btn">
          <FiArrowLeft />
        </button>
        <div className="header-content">
          <h1>Mis Solicitudes de Crédito</h1>
          <p>Revisa el estado y detalles de tus solicitudes</p>
        </div>
      </header>

      <main className="credits-main">
        {credits.length === 0 ? (
          <div className="empty-state">
            <FiFileText className="empty-icon" />
            <h2>No tienes solicitudes de crédito</h2>
            <p>Parece que aún no has solicitado ningún crédito.</p>
            <button onClick={() => navigate('/credit-application')} className="cta-button">
              Solicitar un crédito
            </button>
          </div>
        ) : (
          <div className="credits-content">
            <div className="credits-list">
              {credits.map((credit, index) => (
                <motion.div
                  key={index}
                  className={`credit-card ${selectedCredit?.fechaSolicitud === credit.fechaSolicitud ? 'active' : ''}`}
                  onClick={() => setSelectedCredit(credit)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="card-header">
                    <div className="credit-type">
                      <FiFileText className="type-icon" />
                      <span>{credit.tipoCredito?.nombre || 'Tipo no especificado'}</span>
                    </div>
                    <div 
                      className="credit-status"
                      style={{ color: getStatusColor(credit.estado) }}
                    >
                      {getStatusIcon(credit.estado)}
                      <span>{credit.estado || 'Estado desconocido'}</span>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="credit-amount">
                      <FiDollarSign className="amount-icon" />
                      <span>Monto solicitado: Bs {credit.monto?.toLocaleString('es-ES') || '0'}</span>
                    </div>
                    <div className="credit-date">
                      <FiCalendar className="date-icon" />
                      <span>Solicitado el: {formatDate(credit.fechaSolicitud)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {selectedCredit && (
              <motion.div 
                className="credit-details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Detalles de la solicitud</h2>
                
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Tipo de crédito:</span>
                    <span className="detail-value">{selectedCredit.tipoCredito?.nombre || 'No especificado'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Descripción:</span>
                    <span className="detail-value">{selectedCredit.tipoCredito?.descripcion || 'No hay descripción'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Estado:</span>
                    <span 
                      className="detail-value"
                      style={{ color: getStatusColor(selectedCredit.estado) }}
                    >
                      {selectedCredit.estado || 'Estado desconocido'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Fecha de solicitud:</span>
                    <span className="detail-value">{formatDate(selectedCredit.fechaSolicitud)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Monto solicitado:</span>
                    <span className="detail-value">Bs {selectedCredit.monto?.toLocaleString('es-ES') || '0'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Ingresos declarados:</span>
                    <span className="detail-value">Bs {selectedCredit.ingresos?.toLocaleString('es-ES') || '0'}</span>
                  </div>
                </div>

                {selectedCredit.observaciones && (
                  <div className="observations">
                    <h3>Observaciones</h3>
                    <p>{selectedCredit.observaciones}</p>
                  </div>
                )}

                <div className="documents-section">
                  <h3>Documentos adjuntos</h3>
                  {selectedCredit.documentos?.length > 0 ? (
                    <div className="documents-list">
                      {selectedCredit.documentos.map((doc, idx) => (
                        <div key={idx} className="document-item">
                          <div className="document-info">
                            <FiFileText className="document-icon" />
                            <div>
                              <span className="document-type">{doc.tipo || 'Documento'}</span>
                              <span className="document-date">Subido el: {doc.fechaCarga || 'Fecha desconocida'}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => downloadDocument(doc.urlArchivo)}
                            className="download-btn"
                            disabled={!doc.ArchivoUrl}
                          >
                            <FiDownload /> Descargar
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-documents">No hay documentos adjuntos a esta solicitud.</p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewCredits;