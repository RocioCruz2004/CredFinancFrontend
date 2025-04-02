import React, { useState } from 'react';
import DatePicker from 'react-datepicker'; 
import "react-datepicker/dist/react-datepicker.css"; 
import { getReportes } from '../../api/api';  
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { saveAs } from 'file-saver';
import { FaFileExcel, FaFilePdf, FaSearch } from 'react-icons/fa';
import './GeneracionReportes.css';

function GeneracionReportes() {
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [estado, setEstado] = useState('');
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setReportes([]);
    setLoading(true);
    setError('');
    try {
      const data = await getReportes(fechaInicio, fechaFin, estado);
      if (data && data.length > 0) {
        setReportes(data);
      } else {
        setReportes([]); // Si no hay reportes, vaciar la lista
      }
    } catch (err) {
      setError('No se pudo obtener los reportes');
      console.error(err);
    }
    setLoading(false);
  };


  const exportToExcel = () => {
    if (reportes.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Preparar los datos
    const data = reportes.map(reporte => ({
      'ID Reporte': reporte.id,
      'Cliente': reporte.cliente.usuario.nombre,
      'Total Pagado': reporte.totalPagado,
      'Total Morosidad': reporte.totalMorosidad,
      'Teléfono': reporte.cliente.telefono,
      'Dirección': reporte.cliente.direccion
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reportes");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `reportes_financieros_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Versión alternativa que siempre funciona
const exportToPDF = async () => {
  if (reportes.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  // Importación dinámica
  const { jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  
  const doc = new jsPDF();
  
  // Configuración del documento...
  autoTable(doc, {
    head: [['ID', 'Cliente', 'Total Pagado', 'Total Morosidad']],
    body: reportes.map(r => [
      r.id, 
      r.cliente.usuario.nombre, 
      r.totalPagado, 
      r.totalMorosidad
    ]),
    startY: 20
  });
  
  doc.save('reporte.pdf');
};

return (
  <div className="generacion-reportes">
    <h2 className="titulo-reportes">GENERACIÓN DE REPORTES FINANCIEROS</h2>
    
    <div className="filtros-container">
      <div className="filtros-card">
        <div className="input-group">
          <div className="input-container">
            <label>Fecha de Inicio:</label>
            <DatePicker
              selected={fechaInicio}
              onChange={(date) => setFechaInicio(date)}
              dateFormat="dd/MM/yyyy"
              maxDate={new Date()}
              isClearable
              placeholderText="Seleccione una fecha"
              className="date-picker"
            />
          </div>
          
          <div className="input-container">
            <label>Fecha de Fin:</label>
            <DatePicker
              selected={fechaFin}
              onChange={(date) => setFechaFin(date)}
              dateFormat="dd/MM/yyyy"
              minDate={fechaInicio}
              maxDate={new Date()}
              isClearable
              placeholderText="Seleccione una fecha"
              className="date-picker"
            />
          </div>
          
          <div className="input-container">
            <label>Estado:</label>
            <select 
              value={estado} 
              onChange={(e) => setEstado(e.target.value)}
              className="select-estado"
            >
              <option value="">Todos los estados</option>
              <option value="Pagado">Pagado</option>
              <option value="Atrasado">Atrasado</option>
              <option value="Pendiente">Pendiente</option>
            </select>
          </div>
          
          <button 
            onClick={handleSubmit} 
            className="btn-generar"
          >
            <FaSearch /> Generar Reporte
          </button>
        </div>
      </div>
    </div>

    {loading && <p className="loading-message">Cargando reportes...</p>}
    {error && <p className="error-message">{error}</p>}

    {reportes.length > 0 && (
      <div className="export-buttons">
        <button onClick={exportToExcel} className="export-btn excel-btn">
          <FaFileExcel /> Exportar a Excel
        </button>
        <button onClick={exportToPDF} className="export-btn pdf-btn">
          <FaFilePdf /> Exportar a PDF
        </button>
      </div>
    )}

    <div className="reportes-container">
      <h3>REPORTES GENERADOS</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID Reporte</th>
              <th>Cliente</th>
              <th>Total Pagado</th>
              <th>Total Morosidad</th>
              <th>Fecha de Pago</th>
              <th>Monto Pago</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reportes.length > 0 ? (
              reportes.map((reporte) => (
                <tr key={reporte.id}>
                  <td>{reporte.id}</td>
                  <td>{reporte.cliente.usuario ? reporte.cliente.usuario.nombre : 'No Disponible'}</td>
                  <td>${reporte.totalPagado.toLocaleString()}</td>
                  <td>${reporte.totalMorosidad.toLocaleString()}</td>
                  {reporte.cliente.pagos.map((pago, index) => (
                    <React.Fragment key={index}>
                      <td>{new Date(pago.fechaPago).toLocaleDateString()}</td>
                      <td>${pago.monto.toLocaleString()}</td>
                      <td className={`estado-${pago.estado}`}>
                        {pago.estado === 1 ? 'Pagado' : pago.estado === 2 ? 'Atrasado' : 'Pendiente'}
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-reports">No se encontraron reportes con los filtros seleccionados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}

export default GeneracionReportes;