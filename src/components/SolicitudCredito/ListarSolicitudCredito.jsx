import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSolicitudesCredito } from '../../api/api';

const ListarSolicitudCredito = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [estado, setEstado] = useState('');
  const [idTipoCredito, setIdTipoCredito] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarSolicitudes = async () => {
      try {
        const data = await getSolicitudesCredito();
        setSolicitudes(data);
        setFilteredSolicitudes(data); // Se cargan los datos originales
      } catch (err) {
        console.error('Error al cargar solicitudes:', err);
        setError('No se pudieron cargar las solicitudes');
      }
    };

    cargarSolicitudes();
  }, []);

  useEffect(() => {
    filtrarSolicitudes();
  }, [estado, idTipoCredito, nombreCliente, ordenAscendente, solicitudes]);

  const filtrarSolicitudes = () => {
    let filtradas = [...solicitudes];

    if (estado) {
      filtradas = filtradas.filter((s) => s.estado.toLowerCase() === estado.toLowerCase());
    }

    if (idTipoCredito) {
      filtradas = filtradas.filter((s) => s.idTipoCredito.toString() === idTipoCredito);
    }

    if (nombreCliente) {
      filtradas = filtradas.filter((s) =>
        s.cliente?.usuario?.nombre.toLowerCase().includes(nombreCliente.toLowerCase())
      );
    }

    filtradas.sort((a, b) => {
      const fechaA = new Date(a.fechaSolicitud);
      const fechaB = new Date(b.fechaSolicitud);
      return ordenAscendente ? fechaA - fechaB : fechaB - fechaA;
    });

    setFilteredSolicitudes(filtradas);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) ? date.toLocaleDateString('es-ES') : 'Fecha inválida';
  };

  const verDetalles = (idSolicitudCredito) => {
    navigate(`/credit-requests/${idSolicitudCredito}`);
  };

  return (
    <div>
      <h2>Solicitudes de Crédito</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Filtros */}
      <div style={{ marginBottom: '15px' }}>
        <label>Estado:</label>
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Todos</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Aprobado">Aprobado</option>
          <option value="Rechazado">Rechazado</option>
        </select>

        <label> Tipo de Crédito:</label>
        <input
          type="number"
          placeholder="ID Tipo Crédito"
          value={idTipoCredito}
          onChange={(e) => setIdTipoCredito(e.target.value)}
        />

        <label> Nombre Cliente:</label>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={nombreCliente}
          onChange={(e) => setNombreCliente(e.target.value)}
        />

        <label>Orden:</label>
        <select value={ordenAscendente} onChange={(e) => setOrdenAscendente(e.target.value === 'true')}>
          <option value="true">Ascendente</option>
          <option value="false">Descendente</option>
        </select>
      </div>

      {/* Tabla de solicitudes */}
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Tipo de Crédito</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Observaciones</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {filteredSolicitudes.length > 0 ? (
            filteredSolicitudes.map((solicitud) => (
              <tr key={solicitud.idSolicitudCredito}>
                <td>{solicitud.idSolicitudCredito}</td>
                <td>{solicitud.cliente?.usuario?.nombre || 'N/A'}</td>
                <td>{solicitud.tipoCredito?.nombre || 'N/A'}</td>
                <td>${solicitud.monto?.toLocaleString('es-ES') || '0.00'}</td>
                <td>{formatDate(solicitud.fechaSolicitud)}</td>
                <td>{solicitud.estado || 'N/A'}</td>
                <td>{solicitud.observaciones || 'N/A'}</td>
                <td>
                  <button
                    onClick={() => verDetalles(solicitud.idSolicitudCredito)}
                    style={{
                      padding: '10px 15px',
                      fontSize: '16px',
                      cursor: 'pointer',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                    }}
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>No hay solicitudes disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListarSolicitudCredito;
