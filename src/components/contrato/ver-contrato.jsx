"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { formatDate } from "./utils/formatters"
import './tailwind.css';
const VerContrato = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contrato, setContrato] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchContrato = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`https://localhost:7177/api/Contrato/ver/${id}`)
        setContrato(response.data)
        setError(null)
      } catch (err) {
        console.error("Error al cargar el contrato:", err)
        setError("Error al cargar el contrato. Por favor, intente nuevamente.")
      } finally {
        setLoading(false)
      }
    }

    fetchContrato()
  }, [id])

  const handleVolver = () => {
    navigate("/contratos-pendientes")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleVolver}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Volver a Contratos
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!contrato) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="text-center text-gray-500">No se encontró el contrato solicitado.</div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleVolver}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Volver a Contratos
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-white">Visualización de Contrato</h1>
            <button
              onClick={handleVolver}
              className="px-3 py-1 bg-white text-blue-600 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Volver a Contratos
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Información del contrato */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Número de Contrato</h2>
              <p className="mt-1 text-lg font-semibold text-gray-900">#{contrato.id}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Solicitud de Crédito</h2>
              <p className="mt-1 text-lg font-semibold text-gray-900">#{contrato.idSolicitudCredito}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Fecha de Generación</h2>
              <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(contrato.fechaGeneracion)}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Estado</h2>
              <p className="mt-1">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  {contrato.estado}
                </span>
              </p>
            </div>
            {contrato.fechaFirma && (
              <div>
                <h2 className="text-sm font-medium text-gray-500">Fecha de Firma</h2>
                <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(contrato.fechaFirma)}</p>
              </div>
            )}
            <div>
              <h2 className="text-sm font-medium text-gray-500">Cliente</h2>
              <p className="mt-1 text-lg font-semibold text-gray-900">{contrato.nombreCliente}</p>
            </div>
          </div>

          {/* Sello de firmado */}
          {contrato.estaFirmado && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-700 font-medium">Este contrato ha sido firmado electrónicamente.</p>
              </div>
            </div>
          )}

          {/* Contenido del contrato */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h2 className="font-medium text-gray-700">Contenido del Contrato</h2>
            </div>
            <div className="p-4 bg-white">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contrato.contenido }} />
            </div>
          </div>

          {/* Botón de volver */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleVolver}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Volver a Contratos
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerContrato

