import axios from 'axios';

const API_URL = 'https://localhost:7177/api/Seguimiento';

export const seguimientoService = {
  // Obtener solicitudes de crédito de un cliente
  getSolicitudesByCliente: async (clienteId) => {
    try {
      const response = await axios.get(`${API_URL}/solicitudes/${clienteId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
      throw error;
    }
  },

  // Obtener pagos de una solicitud
  getPagosBySolicitud: async (solicitudId) => {
    try {
      const response = await axios.get(`${API_URL}/pagos/${solicitudId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener pagos:', error);
      throw error;
    }
  },

  // Obtener detalle de un pago
  getPagoDetalle: async (pagoId) => {
    try {
      const response = await axios.get(`${API_URL}/pago/${pagoId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalle del pago:', error);
      throw error;
    }
  },

  // Obtener alertas de una solicitud
  getAlertasBySolicitud: async (solicitudId) => {
    try {
      const response = await axios.get(`${API_URL}/alertas/${solicitudId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener alertas:', error);
      throw error;
    }
  },

  // Obtener reporte financiero de un cliente
  getReporteFinanciero: async (clienteId) => {
    try {
      const response = await axios.get(`${API_URL}/reporte/${clienteId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener reporte financiero:', error);
      throw error;
    }
  }
};