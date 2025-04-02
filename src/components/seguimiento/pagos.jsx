import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { seguimientoService } from './seguimientoService';
import toast from 'react-hot-toast';
import './tailwind.css';
const PagosPage = () => {
  const { solicitudId } = useParams();
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarPagos = async () => {
      try {
        setLoading(true);
        const data = await seguimientoService.getPagosBySolicitud(solicitudId);
        setPagos(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los pagos. Por favor, la Solicitud tiene que estar aprobada');
        toast.error('Error al cargar los pagos');
        setPagos([]);
      } finally {
        setLoading(false);
      }
    };

    if (solicitudId) {
      cargarPagos();
    }
  }, [solicitudId]);

  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'Pagado':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Atrasado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVerDetalle = (pagoId) => {
    navigate(`/seguimiento/pago/${pagoId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Historial de Pagos</h1>
        <button
          onClick={() => navigate('/seguimiento/solicitudes')}
          className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Volver a Solicitudes
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">Solicitud #{solicitudId}</h2>
        <p className="text-gray-600">Historial de pagos asociados a esta solicitud de crédito.</p>
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

      {!loading && !error && pagos.length === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p>No se encontraron pagos para esta solicitud.</p>
        </div>
      )}

      {pagos.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pagos.map((pago) => (
                <tr key={pago.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pago.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(pago.fechaPago).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${pago.monto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClass(pago.estado)}`}>
                      {pago.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleVerDetalle(pago.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver Detalle
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

export default PagosPage;