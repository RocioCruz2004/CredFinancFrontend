import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { seguimientoService } from './seguimientoService';
import toast from 'react-hot-toast';
import './tailwind.css';
const AlertasPage = () => {
  const { solicitudId } = useParams();
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarAlertas = async () => {
      try {
        setLoading(true);
        const data = await seguimientoService.getAlertasBySolicitud(solicitudId);
        setAlertas(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar las alertas. Por favor, intente nuevamente.');
        toast.error('Error al cargar las alertas');
        setAlertas([]);
      } finally {
        setLoading(false);
      }
    };

    if (solicitudId) {
      cargarAlertas();
    }
  }, [solicitudId]);

  const getTipoAlertaClass = (tipo) => {
    switch (tipo) {
      case 'PagoAtrasado':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'AlertaVencimiento':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'AlertaInformativa':
        return 'bg-blue-100 border-blue-500 text-blue-700';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  const handleVerPago = (pagoId) => {
    if (pagoId) {
      navigate(`/seguimiento/pago/${pagoId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Alertas y Notificaciones</h1>
        <button
          onClick={() => navigate('/seguimiento/solicitudes')}
          className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Volver a Solicitudes
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">Solicitud #{solicitudId}</h2>
        <p className="text-gray-600">Alertas y notificaciones relacionadas con esta solicitud de crédito.</p>
      </div>

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && alertas.length === 0 && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p>No hay alertas activas para esta solicitud.</p>
        </div>
      )}

      {alertas.length > 0 && (
        <div className="space-y-4">
          {alertas.map((alerta, index) => (
            <div 
              key={index} 
              className={`p-4 border-l-4 rounded-md shadow-sm ${getTipoAlertaClass(alerta.tipo)}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{alerta.tipo}</h3>
                  <p className="mt-1">{alerta.mensaje}</p>
                  <p className="text-sm mt-2">
                    Fecha: {new Date(alerta.fecha).toLocaleDateString()} {new Date(alerta.fecha).toLocaleTimeString()}
                  </p>
                </div>
                {alerta.pagoId && (
                  <button
                    onClick={() => handleVerPago(alerta.pagoId)}
                    className="px-3 py-1 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    Ver Pago
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertasPage;