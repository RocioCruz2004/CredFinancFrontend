import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { seguimientoService } from './seguimientoService';
import toast from 'react-hot-toast';
import './tailwind.css';
const PagoDetallePage = () => {
  const { pagoId } = useParams();
  const [pago, setPago] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarPagoDetalle = async () => {
      try {
        setLoading(true);
        const data = await seguimientoService.getPagoDetalle(pagoId);
        setPago(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar el detalle del pago. Por favor, intente nuevamente.');
        toast.error('Error al cargar el detalle del pago');
        setPago(null);
      } finally {
        setLoading(false);
      }
    };

    if (pagoId) {
      cargarPagoDetalle();
    }
  }, [pagoId]);

  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'Pagado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Atrasado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Detalle del Pago</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Volver
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

      {!loading && !error && pago && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className={`p-6 border-b ${getEstadoClass(pago.estado)}`}>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Pago #{pago.id}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getEstadoClass(pago.estado)}`}>
                {pago.estado}
              </span>
            </div>
            <p className="text-gray-600 mt-1">Cliente: {pago.clienteNombre}</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Pago</h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Fecha de Pago:</span>
                    <span className="font-medium">{new Date(pago.fechaPago).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Monto:</span>
                    <span className="font-medium">${pago.monto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Estado:</span>
                    <span className={`font-medium ${pago.estado === 'Atrasado' ? 'text-red-600' : pago.estado === 'Pagado' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {pago.estado}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Crédito</h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Solicitud ID:</span>
                    <span className="font-medium">{pago.solicitudId}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Monto del Crédito:</span>
                    <span className="font-medium">${pago.montoCredito.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Tasa Aplicada:</span>
                    <span className="font-medium">{pago.tasaAplicada}%</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Plazo Aprobado:</span>
                    <span className="font-medium">{pago.plazoAprobado} meses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagoDetallePage;