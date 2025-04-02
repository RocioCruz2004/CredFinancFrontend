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

// Obtener logs de auditoría
export const getAuditLogs = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/auditlog?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    throw error;
  }
};

// Registrar acción en el log de auditoría
export const logAction = async (auditData) => {
  try {
    const response = await api.post("/auditlog", auditData);
    return response.data;
  } catch (error) {
    console.error("Error logging audit action:", error);
    throw error;
  }
};