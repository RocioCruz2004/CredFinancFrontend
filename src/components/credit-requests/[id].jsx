import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCreditRequestDetails,
  updateCreditRequestConditions,
  evaluateCreditRequest,
  requestAdditionalInfo,
} from "./creditRequestService";
import { formatDate, formatCurrency, formatPercentage } from "./utils/formatters";
import LoadingSpinner from "./common/LoadingSpinner";
import { User, FileText, DollarSign, Percent, Clock, CheckCircle, AlertCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import toast from "react-hot-toast";
import './tailwind.css';

const CreditRequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creditRequest, setCreditRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para las condiciones modificables
  const [interestRate, setInterestRate] = useState(0);
  const [term, setTerm] = useState(0);
  const [conditionsModified, setConditionsModified] = useState(false);

  // Estado para la evaluación
  const [decision, setDecision] = useState("");
  const [comments, setComments] = useState("");
  const [additionalInfoRequest, setAdditionalInfoRequest] = useState("");

  // Estado para las pestañas
  const [activeTab, setActiveTab] = useState("evaluation");

  // ID del administrador actual (en una aplicación real vendría del contexto de autenticación)
  const currentAdminId = 1; //cambiar localstorage

  useEffect(() => {
    const fetchCreditRequestDetails = async () => {
      try {
        if (!id) return;

        const data = await getCreditRequestDetails(Number.parseInt(id));
        setCreditRequest(data);

        // Inicializar los valores de las condiciones
        setInterestRate(data.parametro.tasaInteres);
        setTerm(data.parametro.plazo);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching credit request details:", error);
        setError("No se pudo cargar los detalles de la solicitud");
        setLoading(false);
      }
    };

    fetchCreditRequestDetails();
  }, [id]);

  const handleConditionsUpdate = async () => {
    try {
      if (!creditRequest || !id) return;

      await updateCreditRequestConditions(Number.parseInt(id), {
        idParametro: creditRequest.parametro.idParametro,
        tasaInteres: interestRate,
        plazo: term,
        formatoContrato: creditRequest.parametro.formatoContrato,
      });

      toast.success("Condiciones actualizadas correctamente");
      setConditionsModified(true);
    } catch (error) {
      console.error("Error updating conditions:", error);
      toast.error("No se pudieron actualizar las condiciones");
    }
  };

  const handleEvaluation = async () => {
    try {
      if (!creditRequest || !id) return;

      if (!decision) {
        toast.error("Debe seleccionar una decisión");
        return;
      }

      const evaluationData = {
        decision,
        comentarios: comments,
        idSolicitudCredito: Number.parseInt(id),
        idAdministrador: currentAdminId,
      };

      await evaluateCreditRequest(evaluationData);

      toast.success(`Solicitud ${decision.toLowerCase()} correctamente`);

      // Redirigir a la lista después de 2 segundos
      setTimeout(() => {
        navigate("/ListarSolicitudCredito");
      }, 1000);
    } catch (error) {
      console.error("Error evaluating credit request:", error);
      toast.error("No se pudo procesar la evaluación, porque ya existe un Credito Aprobado para esta Evaluacion");
    }
  };

  const handleRequestAdditionalInfo = async () => {
    try {
      if (!creditRequest || !id || !additionalInfoRequest) return;

      await requestAdditionalInfo(Number.parseInt(id), {
        mensaje: additionalInfoRequest,
        idAdministrador: currentAdminId,
      });

      toast.success("Solicitud de información adicional enviada correctamente");

      // Redirigir a la lista después de 2 segundos
      setTimeout(() => {
        navigate("/ListarSolicitudCredito");
      }, 2000);
    } catch (error) {
      console.error("Error requesting additional info:", error);
      toast.error("No se pudo enviar la solicitud de información adicional");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error && !creditRequest) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate("/ListarSolicitudCredito")}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  if (!creditRequest) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">No se encontró la solicitud</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate("/ListarSolicitudCredito")}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/ListarSolicitudCredito")}
          className="flex items-center mr-4 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Evaluación de Solicitud #{creditRequest.idSolicitudCredito}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Información del Cliente */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900">Información del Cliente</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre</p>
                <p className="mt-1">{creditRequest.cliente.nombre}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1">{creditRequest.cliente.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p className="mt-1">{creditRequest.cliente.telefono}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Dirección</p>
                <p className="mt-1">{creditRequest.cliente.direccion}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Fecha de Nacimiento</p>
                <p className="mt-1">{formatDate(creditRequest.cliente.fechaNacimiento)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Género</p>
                <p className="mt-1">{creditRequest.cliente.genero}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nacionalidad</p>
                <p className="mt-1">{creditRequest.cliente.nacionalidad}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detalles de la Solicitud */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900">Detalles de la Solicitud</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">ID de Solicitud</p>
                <p className="mt-1">{creditRequest.idSolicitudCredito}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo de Crédito</p>
                <p className="mt-1">{creditRequest.tipoCredito.nombre}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Descripción</p>
                <p className="mt-1">{creditRequest.tipoCredito.descripcion}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Fecha de Solicitud</p>
                <p className="mt-1">{formatDate(creditRequest.fechaSolicitud)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Estado</p>
                <p className="mt-1">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full 
                    ${creditRequest.estado.toLowerCase() === "pendiente" ? "bg-yellow-100 text-yellow-800" : ""}
                    ${creditRequest.estado.toLowerCase() === "aprobado" ? "bg-green-100 text-green-800" : ""}
                    ${creditRequest.estado.toLowerCase() === "rechazado" ? "bg-red-100 text-red-800" : ""}
                    ${creditRequest.estado.toLowerCase() === "pendiente_info" ? "bg-blue-100 text-blue-800" : ""}
                  `}
                  >
                    {creditRequest.estado}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Observaciones</p>
                <p className="mt-1">{creditRequest.observaciones || "Sin observaciones"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información Financiera */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900">Información Financiera</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Monto Solicitado</p>
                <p className="mt-1 text-xl font-bold">{formatCurrency(creditRequest.monto)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ingresos Declarados</p>
                <p className="mt-1">{formatCurrency(creditRequest.ingresos)}</p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-500">Tasa de Interés Actual</p>
                <div className="flex items-center mt-1">
                  <Percent className="h-4 w-4 mr-2 text-gray-400" />
                  <p>{formatPercentage(creditRequest.parametro.tasaInteres)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Plazo Actual</p>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <p>{creditRequest.parametro.plazo} meses</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Relación Cuota/Ingreso</p>
                <div className="flex items-center mt-1">
                  <p className="text-sm">
                    {((creditRequest.monto / creditRequest.parametro.plazo / creditRequest.ingresos) * 100).toFixed(2)}%
                    del ingreso mensual
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documentos Adjuntos */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Documentos Adjuntos</h2>
        </div>
        <div className="p-6">
          {creditRequest.documentos.length === 0 ? (
            <p className="text-gray-500">No hay documentos adjuntos</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {creditRequest.documentos.map((doc) => (
                <div key={doc.idDocumento} className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <FileText className="h-5 w-5 mr-2 text-blue-500" />
                      <p className="font-medium">{doc.tipo}</p>
                    </div>
                    <p className="text-sm text-gray-500">Cargado: {formatDate(doc.fechaCarga)}</p>
                    <div className="mt-3">
                      <a
                        href={"https://localhost:7177/api/Documento/download/"+doc.idDocumento}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Ver documento
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pestañas */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab("evaluation")}
              className={`py-4 px-6 font-medium text-sm border-b-2 focus:outline-none ${
                activeTab === "evaluation"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Evaluación
            </button>
            <button
              onClick={() => setActiveTab("conditions")}
              className={`py-4 px-6 font-medium text-sm border-b-2 focus:outline-none ${
                activeTab === "conditions"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Modificar Condiciones
            </button>
            <button
              onClick={() => setActiveTab("additional-info")}
              className={`py-4 px-6 font-medium text-sm border-b-2 focus:outline-none ${
                activeTab === "additional-info"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Solicitar Información
            </button>
          </nav>
        </div>

        {/* Contenido de las pestañas */}
        <div className="mt-6">
          {/* Pestaña de Evaluación */}
          {activeTab === "evaluation" && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                  <h2 className="text-lg font-medium text-gray-900">Evaluación de la Solicitud</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Decisión</label>
                    <select
                      value={decision}
                      onChange={(e) => setDecision(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Seleccione una decisión</option>
                      <option value="APROBADO">Aprobar</option>
                      <option value="RECHAZADO">Rechazar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comentarios</label>
                    <textarea
                      placeholder="Ingrese comentarios sobre la evaluación..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  {conditionsModified && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            Las condiciones de esta solicitud han sido modificadas. La evaluación se realizará con las
                            nuevas condiciones.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-2">
                <button
                  onClick={() => navigate("/ListarSolicitudCredito")}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEvaluation}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Registrar Evaluación
                </button>
              </div>
            </div>
          )}

          {/* Pestaña de Modificar Condiciones */}
          {activeTab === "conditions" && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Percent className="h-5 w-5 mr-2 text-blue-600" />
                  <h2 className="text-lg font-medium text-gray-900">Modificar Condiciones</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tasa de Interés (%)</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Percent className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number.parseFloat(e.target.value))}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plazo (meses)</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        min="1"
                        value={term}
                        onChange={(e) => setTerm(Number.parseInt(e.target.value))}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="bg-gray-50 border-l-4 border-gray-500 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">
                          Las modificaciones en las condiciones deben cumplir con las políticas de la cooperativa. Estos
                          cambios serán registrados en el historial de auditoría.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
                <button
                  onClick={handleConditionsUpdate}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Actualizar Condiciones
                </button>
              </div>
            </div>
          )}

          {/* Pestaña de Solicitar Información Adicional */}
          {activeTab === "additional-info" && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
                  <h2 className="text-lg font-medium text-gray-900">Solicitar Información Adicional</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Al solicitar información adicional, el proceso de evaluación quedará en pausa hasta recibir la
                          respuesta del cliente.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje para el Cliente</label>
                    <textarea
                      placeholder="Describa la información adicional requerida..."
                      value={additionalInfoRequest}
                      onChange={(e) => setAdditionalInfoRequest(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-2">
                <button
                  onClick={() => navigate("/ListarSolicitudCredito")}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRequestAdditionalInfo}
                  disabled={!additionalInfoRequest}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    !additionalInfoRequest
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  }`}
                >
                  Enviar Solicitud de Información
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditRequestDetailPage;