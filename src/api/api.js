import axios from 'axios';

// Crear una instancia de Axios con la URL base del backend
const api = axios.create({
  baseURL: 'https://localhost:7177/api',  // Cambiado a la URL de tu backend
});
// Función para obtener los reportes financieros CHIO
export const getReportes = async (fechaInicio, fechaFin, estado) => {
    try {
      const response = await api.get('/reportefinanciero', {
        params: { fechaInicio, fechaFin, estado },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener los reportes', error);
      throw error;
    }
  };
  
  export const getParametros = async () => {
    try {
      const response = await api.get('/Parametro/Lista');
      return response.data;
    } catch (error) {
      console.error('Error al obtener parámetros', error);
      throw error;
    }
  };
  
  export const actualizarParametro = async (id, parametro) => {
    try {
      const response = await api.put(`/Parametro/modificar?idParametro=${id}`, parametro);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el parámetro', error);
      throw error;
    }
  };
  
  export const crearParametro = async (parametro) => {
    try {
      const response = await api.post('/Parametro/Crear', parametro);
      return response.data;
    } catch (error) {
      console.error('Error al crear el parámetro', error);
      throw error;
    }
  };
  
  export const eliminarParametro = async (id) => {
    try {
      const response = await api.delete(`/Parametro/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar el parámetro', error);
      throw error;
    }
  }; 


// listar solicitudes de creditoexport 
export const getSolicitudesCredito = async (filtros) => {
  try {
    const response = await api.get('/SolicitudCredito/Enlistar', {
      params: filtros, // Recibe filtros como fecha, estado, tipoCredito, etc.
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener solicitudes de crédito:', error);
    throw error;
  }
};