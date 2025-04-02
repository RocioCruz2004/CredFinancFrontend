// Servicio para gestionar contratos
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "https://localhost:7177/api"

// Obtener todos los contratos pendientes de un cliente específico
export const getContratosPendientes = async (clienteId) => {
  try {
    const response = await axios.get(`${API_URL}/contrato/cliente/${clienteId}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener contratos pendientes:", error)
    throw error
  }
}

// Obtener un contrato específico por ID
export const getContrato = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/contrato/${id}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener contrato:", error)
    throw error
  }
}

// Solicitar código de verificación para doble factor
export const solicitarDobleFactor = async (idContrato, metodo) => {
  try {
    const response = await axios.post(`${API_URL}/contrato/auth/doblefactor`, {
      idContrato,
      metodo,
    })
    return response.data
  } catch (error) {
    console.error("Error al solicitar código de verificación:", error)
    throw error
  }
}

// Firmar contrato con código de verificación
export const firmarContrato = async (idContrato, codigoVerificacion) => {
  try {
    const response = await axios.post(`${API_URL}/contrato/firmar`, {
      idContrato,
      codigoVerificacion,
    })
    return response.data
  } catch (error) {
    console.error("Error al firmar contrato:", error)
    throw error
  }
}

