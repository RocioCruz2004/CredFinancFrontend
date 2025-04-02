import axios from "axios";
import toast from "react-hot-toast";

const API_URL = process.env.REACT_APP_API_URL || "https://localhost:7177/api";

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Ha ocurrido un error";
    
    // Mostrar mensaje de error
    toast.error(message);
    
    // Redirigir al login si hay un error de autenticación
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

export default api;

// Obtener todas las solicitudes de crédito
export const getAllCreditRequests = async (status = null) => {
  try {
    const url = status ? `/solicitudcredito/r/?estado=${status}` : "/SolicitudCredito/pendingr";
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching credit requests:", error);
    throw error;
  }
};

// Obtener solicitudes pendientes
export const getPendingCreditRequests = async () => {
  try {
    const response = await api.get("/solicitudcredito/pendingr");
    return response.data;
  } catch (error) {
    console.error("Error fetching pending credit requests:", error);
    throw error;
  }
};

// Obtener estadísticas de solicitudes
export const getCreditRequestStats = async () => {
  try {
    const response = await api.get("/solicitud/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching credit request stats:", error);
    throw error;
  }
};

// Obtener detalles de una solicitud específica
export const getCreditRequestDetails = async (id) => {
  try {
    const response = await api.get(`/solicitudcredito/r/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching credit request details for ID ${id}:`, error);
    throw error;
  }
};

// Actualizar condiciones de una solicitud
export const updateCreditRequestConditions = async (id, conditions) => {
  try {
    const response = await api.put(`/solicitudcredito/r/${id}`, conditions);
    return response.data;
  } catch (error) {
    console.error(`Error updating conditions for credit request ID ${id}:`, error);
    throw error;
  }
};

// Registrar evaluación de una solicitud
export const evaluateCreditRequest = async (evaluationData) => {
  try {
    const response = await api.post(`/evaluacioncredito`, evaluationData);
    if (evaluationData.decision == "APROBADO") {
      // Generar notificación para el cliente
    await api.post(`/notificacion`, {
      idSolicitudCredito: evaluationData.idSolicitudCredito,
      mensaje: "Felicidades Su Solicitud Fue Aprobada, por favor Ingresa a Tu Panel de Cliente en el Apartado de Contratos Eléctronicos",
      tipo: "SOLICITUD_APROBADA",
    });


    }
    return response.data;
  } catch (error) {
    console.error("Error evaluating credit request: ya fue procesado", error);
    throw error;
  }
};

// Solicitar información adicional
export const requestAdditionalInfo = async (id, requestData) => {
  try {
    // Actualizar estado de la solicitud
    await api.put(`/solicitudcredito/${id}/statusr`, {
      estado: "PENDIENTE",
    });

    // Generar notificación para el cliente
    const response = await api.post(`/notificacion`, {
      idSolicitudCredito: id,
      mensaje: requestData.mensaje,
      tipo: "SOLICITUD_INFO",
    });

    // Registrar en el log de auditoría
    await api.post(`/auditlog`, {
      accion: `Solicitud de información adicional para solicitud #${id}`,
      idAdministrador: requestData.idAdministrador,
      detalles: requestData.mensaje,
    });

    return response.data;
  } catch (error) {
    console.error(`Error requesting additional info for credit request ID ${id}:`, error);
    throw error;
  }
};