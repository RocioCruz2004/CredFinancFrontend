import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { seguimientoService } from './seguimientoService';
import toast from 'react-hot-toast';
import './tailwind.css';
const SolicitudesPage = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Obtener el ID del cliente del localStorage
  const getUserFromLocalStorage = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        return null;
      }
    }
    return null;
  };
  
  const user = getUserFromLocalStorage();
  const clienteId = user?.idCliente;

  useEffect(() => {
    if (clienteId) {
      cargarSolicitudes(clienteId);
    } else {
      setError('No se pudo obtener el ID del cliente. Por favor, inicie sesión nuevamente.');
      setLoading(false);
    }
  }, [clienteId]);

  const cargarSolicitudes = async (id) => {
    try {
      setLoading(true);
      const data = await seguimientoService.getSolicitudesByCliente(id);
      setSolicitudes(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las solicitudes. Por favor, intente nuevamente.');
      toast.error('Error al cargar las solicitudes');
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerPagos = (solicitudId) => {
    navigate(`/seguimiento/pagos/${solicitudId}`);
  };

  const handleVerAlertas = (solicitudId) => {
    navigate(`/seguimiento/alertas/${solicitudId}`);
  };

  const handleGenerarReporte = () => {
    navigate(`/seguimiento/reporte`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mis Solicitudes de Crédito</h1>
        <button
          onClick={handleGenerarReporte}
          className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Generar Reporte Financiero
        </button>
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

      {!loading && !error && solicitudes.length === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p>No tienes solicitudes de crédito registradas.</p>
        </div>
      )}

      {solicitudes.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {solicitudes.map((solicitud) => (
                <tr key={solicitud.idSolicitudCredito} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{solicitud.idSolicitudCredito}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(solicitud.fechaSolicitud).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${solicitud.estado === 'Aprobada' ? 'bg-green-100 text-green-800' : 
                        solicitud.estado === 'Rechazada' ? 'bg-red-100 text-red-800' : 
                        solicitud.estado === 'En Proceso' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                      {solicitud.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${solicitud.monto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{solicitud.tipoCredito}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleVerPagos(solicitud.idSolicitudCredito)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Ver Pagos
                    </button>
                    <button
                      onClick={() => handleVerAlertas(solicitud.idSolicitudCredito)}
                      className="text-orange-600 hover:text-orange-900"
                    >
                      Ver Alertas
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SolicitudesPage;