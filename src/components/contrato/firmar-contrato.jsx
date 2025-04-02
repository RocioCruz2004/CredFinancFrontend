"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getContrato, solicitarDobleFactor, firmarContrato } from "./contratoService"
import { formatCurrency, formatDate } from "./utils/formatters"
import './tailwind.css';
const FirmarContrato = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contrato, setContrato] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [step, setStep] = useState("review") // review, auth, verify, success
  const [metodoAuth, setMetodoAuth] = useState("EMAIL")
  const [codigo, setCodigo] = useState("")
  const [verificando, setVerificando] = useState(false)
  const [mensajeError, setMensajeError] = useState("")
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    const fetchContrato = async () => {
      try {
        setLoading(true)
        const data = await getContrato(id)
        setContrato(data)
        setError(null)
      } catch (err) {
        setError("Error al cargar el contrato. Por favor, intente nuevamente.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchContrato()
  }, [id])

  // Efecto para el contador regresivo
  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleSolicitarCodigo = async () => {
    try {
      setVerificando(true)
      setMensajeError("")
      const response = await solicitarDobleFactor(id, metodoAuth)
      if (response.exito) {
        setStep("verify")
        setCountdown(900) // 15 minutos en segundos
      } else {
        setMensajeError(response.mensaje || "Error al solicitar el código de verificación")
      }
    } catch (err) {
      setMensajeError("Error al solicitar el código de verificación. Por favor, intente nuevamente.")
      console.error(err)
    } finally {
      setVerificando(false)
    }
  }

  const handleFirmarContrato = async () => {
    if (!codigo) {
      setMensajeError("Por favor, ingrese el código de verificación")
      return
    }

    try {
      setVerificando(true)
      setMensajeError("")
      const response = await firmarContrato(id, codigo)
      if (response.exito) {
        setSuccess(true)
        setStep("success")
      } else {
        setMensajeError(response.mensaje || "Error al firmar el contrato")
      }
    } catch (err) {
      setMensajeError("Error al firmar el contrato. Por favor, intente nuevamente.")
      console.error(err)
    } finally {
      setVerificando(false)
    }
  }

  const handleVolver = () => {
    navigate("/contratos-pendientes")
  }

  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60)
    const seconds = countdown % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={handleVolver}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Volver a Contratos
          </button>
        </div>
      </div>
    )
  }

  if (!contrato) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">No se encontró el contrato solicitado.</span>
          <button
            onClick={handleVolver}
            className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            Volver a Contratos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {step === "success" ? "Contrato Firmado Exitosamente" : "Firma de Contrato"}
          </h1>
          <button onClick={handleVolver} className="text-gray-600 hover:text-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Barra de progreso */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step === "review" || step === "auth" || step === "verify" || step === "success" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                1
              </div>
              <div className="ml-2 text-sm font-medium text-gray-900">Revisar</div>
            </div>
            <div
              className={`flex-1 h-1 mx-4 ${step === "auth" || step === "verify" || step === "success" ? "bg-blue-600" : "bg-gray-200"}`}
            ></div>
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step === "auth" || step === "verify" || step === "success" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                2
              </div>
              <div className="ml-2 text-sm font-medium text-gray-900">Autenticar</div>
            </div>
            <div
              className={`flex-1 h-1 mx-4 ${step === "verify" || step === "success" ? "bg-blue-600" : "bg-gray-200"}`}
            ></div>
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step === "verify" || step === "success" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                3
              </div>
              <div className="ml-2 text-sm font-medium text-gray-900">Verificar</div>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step === "success" ? "bg-blue-600" : "bg-gray-200"}`}></div>
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step === "success" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                4
              </div>
              <div className="ml-2 text-sm font-medium text-gray-900">Confirmar</div>
            </div>
          </div>
        </div>

        {step === "review" && (
          <>
            <div className="mb-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Por favor, revise cuidadosamente el contrato antes de proceder con la firma.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Solicitud de Crédito</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">#{contrato.idSolicitudCredito}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Cliente</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{contrato.nombreCliente}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Monto Aprobado</h3>
                  <p className="mt-1 text-lg font-semibold text-green-600">{formatCurrency(contrato.montoAprobado)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tasa de Interés</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{contrato.tasaInteres}%</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Plazo</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{contrato.plazo} meses</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Fecha de Generación</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(contrato.fechaGeneracion)}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Contenido del Contrato</h3>
                <div className="border border-gray-300 rounded-md p-4 bg-gray-50 h-64 overflow-y-auto">
                  <div dangerouslySetInnerHTML={{ __html: contrato.contenido }} />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep("auth")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow-sm"
                >
                  Proceder a Firmar
                </button>
              </div>
            </div>
          </>
        )}

        {step === "auth" && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <svg
                  className="h-6 w-6 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="mt-3 text-lg font-medium text-gray-900">Autenticación de Doble Factor</h2>
              <p className="mt-1 text-sm text-gray-500">
                Para garantizar la seguridad de su firma, necesitamos verificar su identidad.
              </p>
            </div>

            {mensajeError && (
              <div
                className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{mensajeError}</span>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccione el método de autenticación
              </label>
              <select
                value={metodoAuth}
                onChange={(e) => setMetodoAuth(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="EMAIL">Correo Electrónico</option>
                <option value="SMS">Mensaje de Texto (SMS)</option>
              </select>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep("review")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md"
              >
                Volver
              </button>
              <button
                onClick={handleSolicitarCodigo}
                disabled={verificando}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow-sm ${verificando ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {verificando ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  "Enviar Código"
                )}
              </button>
            </div>
          </div>
        )}

        {step === "verify" && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
              <h2 className="mt-3 text-lg font-medium text-gray-900">Verificación de Código</h2>
              <p className="mt-1 text-sm text-gray-500">
                Hemos enviado un código de verificación a través de{" "}
                {metodoAuth === "EMAIL" ? "su correo electrónico" : "SMS"}. Por favor, ingrese el código para continuar.
              </p>
              {countdown > 0 && (
                <div className="mt-2 text-sm text-gray-500">
                  El código expirará en: <span className="font-medium text-blue-600">{formatCountdown()}</span>
                </div>
              )}
            </div>

            {mensajeError && (
              <div
                className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{mensajeError}</span>
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-2">
                Código de Verificación
              </label>
              <input
                type="text"
                id="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ingrese el código de 6 dígitos"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                maxLength={6}
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep("auth")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md"
              >
                Volver
              </button>
              <button
                onClick={handleFirmarContrato}
                disabled={verificando || !codigo || countdown === 0}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow-sm ${verificando || !codigo || countdown === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {verificando ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verificando...
                  </span>
                ) : countdown === 0 ? (
                  "Código expirado"
                ) : (
                  "Firmar Contrato"
                )}
              </button>
            </div>

            {countdown === 0 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-red-600 mb-2">El código ha expirado</p>
                <button
                  onClick={() => setStep("auth")}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Solicitar un nuevo código
                </button>
              </div>
            )}
          </div>
        )}

        {step === "success" && (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-3 text-lg font-medium text-gray-900">¡Contrato Firmado Exitosamente!</h2>
            <p className="mt-1 text-sm text-gray-500">
              Su contrato ha sido firmado y registrado correctamente. Recibirá una notificación con los detalles.
            </p>
            <div className="mt-6">
              <button
                onClick={handleVolver}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow-sm"
              >
                Volver a Contratos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FirmarContrato

