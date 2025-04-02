import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { getParametros, crearParametro, actualizarParametro, eliminarParametro } from '../../api/api';
import './GestionParametros.css';

function GestionParametros() {
  const [parametros, setParametros] = useState([]);
  const [tasaInteres, setTasaInteres] = useState('');
  const [plazoMaximo, setPlazoMaximo] = useState('');
  const [formatoContrato, setFormatoContrato] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchParametros();
  }, []);

  const fetchParametros = async () => {
    try {
      const data = await getParametros();
      setParametros(data);
    } catch (error) {
      setError('Error al obtener los parámetros');
      console.error(error);
    }
  };

  const handleCreate = async () => {
    const parametro = { 
      tasaInteres: parseFloat(tasaInteres), 
      plazoMaximo: parseInt(plazoMaximo), 
      formatoContrato, 
      idAdministrador: 1 
    };
    
    if (!parametro.tasaInteres || !parametro.plazoMaximo || !parametro.formatoContrato) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      await crearParametro(parametro);
      fetchParametros();
      resetForm();
    } catch (error) {
      setError('Error al crear el parámetro');
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    const parametro = { 
      tasaInteres: parseFloat(tasaInteres), 
      plazoMaximo: parseInt(plazoMaximo), 
      formatoContrato, 
      idAdministrador: 1 
    };
    
    if (!parametro.tasaInteres || !parametro.plazoMaximo || !parametro.formatoContrato) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      await actualizarParametro(editId, parametro);
      fetchParametros();
      resetForm();
    } catch (error) {
      setError('Error al actualizar el parámetro');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await eliminarParametro(id);
      fetchParametros();
    } catch (error) {
      setError('Error al eliminar el parámetro');
      console.error(error);
    }
  };

  const resetForm = () => {
    setTasaInteres('');
    setPlazoMaximo('');
    setFormatoContrato('');
    setEditId(null);
    setError('');
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  return (
    <div className="gestion-parametros">
      <h2 className="titulo">GESTIÓN DE PARÁMETROS</h2>
      {error && <p className="error">{error}</p>}

      <div className="main-container">
        <div className="parametros-container">
          <h3>Parámetros Actuales</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tasa de Interés</th>
                <th>Plazo Máximo</th>
                <th>Formato de Contrato</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {parametros.length > 0 ? (
                parametros.map((parametro) => (
                  <tr key={parametro.id}>
                    <td>{parametro.id}</td>
                    <td>{parametro.tasaInteres}</td>
                    <td>{parametro.plazoMaximo}</td>
                    <td>{parametro.formatoContrato}</td>
                    <td>
                      <div className="button-container">
                        <button
                          className="btn-edit"
                          onClick={() => {
                            setTasaInteres(parametro.tasaInteres.toString());
                            setPlazoMaximo(parametro.plazoMaximo.toString());
                            setFormatoContrato(parametro.formatoContrato);
                            setEditId(parametro.id);
                          }}
                        >
                          <FaEdit /> Editar
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(parametro.id)}
                        >
                          <FaTrash /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-reports">No se encontraron parámetros</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="form-container">
          <div className="form-card">
            {editId && (
              <button className="btn-cancel" onClick={handleCancelEdit}>
                X
              </button>
            )}
            <div className="input-container">
              <label>Tasa de Interés:</label>
              <input
                type="number"
                value={tasaInteres}
                onChange={(e) => setTasaInteres(e.target.value)}
                className="form-input"
                step="0.01"
              />
            </div>

            <div className="input-container">
              <label>Plazo Máximo (meses):</label>
              <input
                type="number"
                value={plazoMaximo}
                onChange={(e) => setPlazoMaximo(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="input-container">
              <label>Formato de Contrato:</label>
              <input
                type="text"
                value={formatoContrato}
                onChange={(e) => setFormatoContrato(e.target.value)}
                className="form-input"
              />
            </div>

            <button className="btn-submit" onClick={editId ? handleUpdate : handleCreate}>
              {editId ? 'Actualizar Parámetro' : 'Crear Parámetro'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GestionParametros;