"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getContratosPendientes } from "./contratoService"
import { formatDate, formatCurrency } from "./utils/formatters"
import './tailwind.css';

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



const ContratosPendientes = ({ clienteId: propClienteId }) => {


  
  const [contratos, setContratos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const user = getUserFromLocalStorage();
  const clienteId = user?.idCliente;

  useEffect(() => {
    const fetchContratos = async () => {
      try {
        setLoading(true)
        if (!clienteId) {
          setError("No se pudo identificar al cliente. Por favor, inicie sesión nuevamente.")
          setLoading(false)
          return
        }

        const data = await getContratosPendientes(clienteId)
        setContratos(data)
        setError(null)
      } catch (err) {
        console.error("Error al cargar contratos:", err)
        setError("Error al cargar los contratos. Por favor, intente nuevamente.")
      } finally {
        setLoading(false)
      }
    }

    fetchContratos()
  }, [clienteId])

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case "GENERADO":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pendiente de revisión
          </span>
        )
      case "PENDIENTE_FIRMA":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            Pendiente de firma
          </span>
        )
      case "FIRMADO":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Firmado
          </span>
        )
      case "RECHAZADO":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Rechazado
          </span>
        )
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {estado}
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contratos Pendientes</h1>
        <p className="mt-1 text-sm text-gray-500">Revise y firme sus contratos de crédito pendientes.</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {contratos.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <p className="text-gray-500">No tiene contratos pendientes en este momento.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Solicitud
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fecha
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Monto
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Plazo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contratos.map((contrato) => (
                  <tr key={contrato.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{contrato.idSolicitudCredito}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(contrato.fechaGeneracion)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(contrato.montoAprobado)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contrato.plazo} meses</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getEstadoLabel(contrato.estado)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {contrato.estado === "GENERADO" || contrato.estado === "PENDIENTE_FIRMA" ? (
                        <Link
                          to={`/cliente/firmar-contrato/${contrato.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Revisar y Firmar
                        </Link>
                      ) : contrato.estado === "FIRMADO" ? (
                        <Link
                          to={`/cliente/ver-contrato/${contrato.id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Ver Contrato
                        </Link>
                      ) : (
                        <span className="text-gray-400">No disponible</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContratosPendientes

