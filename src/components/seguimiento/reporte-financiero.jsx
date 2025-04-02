import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { seguimientoService } from './seguimientoService';
import toast from 'react-hot-toast';
import './tailwind.css';
const ReporteFinancieroPage = () => {
  const [reporte, setReporte] = useState(null);
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
    const cargarReporte = async () => {
      try {
        setLoading(true);
        const data = await seguimientoService.getReporteFinanciero(clienteId);
        setReporte(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar el reporte financiero. Por favor, intente nuevamente.');
        toast.error('Error al cargar el reporte financiero');
        setReporte(null);
      } finally {
        setLoading(false);
      }
    };

    if (clienteId) {
      cargarReporte();
    } else {
      setError('No se pudo obtener el ID del cliente. Por favor, inicie sesión nuevamente.');
      setLoading(false);
    }
  }, [clienteId]);


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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-2xl font-bold text-gray-800">Reporte Financiero</h1>
        <div className="space-x-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Imprimir
          </button>
          <button
            onClick={() => navigate('/seguimiento/solicitudes')}
            className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Volver a Solicitudes
          </button>
        </div>
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

      {!loading && !error && reporte && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden print:shadow-none">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">Reporte Financiero</h2>
                <p className="text-gray-600 mt-1">Cliente: {reporte.nombreCliente}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Fecha de Generación:</p>
                <p className="font-medium">{new Date(reporte.fechaGeneracion).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen Financiero</h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Total Pagado:</span>
                    <span className="font-medium text-green-600">${reporte.totalPagado.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Total Morosidad:</span>
                    <span className="font-medium text-red-600">${reporte.totalMorosidad.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Pagos Pendientes:</span>
                    <span className="font-medium">{reporte.pagosPendientes}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Pagos Atrasados:</span>
                    <span className="font-medium text-red-600">{reporte.pagosAtrasados}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Solicitudes</h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Solicitudes Activas:</span>
                    <span className="font-medium">{reporte.solicitudesActivas}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Pagos</h3>
            {reporte.historialPagos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reporte.historialPagos.map((pago) => (
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No hay pagos registrados.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReporteFinancieroPage;