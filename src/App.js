import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  // Importa Navigate
import GeneracionReportes from './components/ReportesFinancieros/GeneracionReportes';
import Gestionparametros from './components/ReportesFinancieros/GestionParametros';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import PasswordReset from './components/Login/PasswordReset';
import ListarSolicitudCredito from './components/SolicitudCredito/ListarSolicitudCredito';
import Inicio from './components/Inicio/Inicio';
import Layout from './components/layout'; // Asegúrate de que esta importación sea correcta
import LayoutAdmin from './components/layoutAdmin';
import InicioCliente from './components/PanelesInicio/InicioCliente';
import InicioAdmin from './components/PanelesInicio/InicioAdmin';
import CreditRequestDetailPage from "./components/credit-requests/[id]";
import ContratosPendientesPage from "./components/contrato/contratos-pendientes";
import FirmarContratoPage from "./components/contrato/firmar-contrato";
import VerContrato from "./components/contrato/ver-contrato";
import SolicitudesPage from "./components/seguimiento/solicitudes";
import PagosPage from "./components/seguimiento/pagos";
import PagoDetallePage from "./components/seguimiento/pago-detalle";
import AlertasPage from "./components/seguimiento/alertas";
import ReporteFinancieroPage from "./components/seguimiento/reporte-financiero";
import CreditHome from './components/CreditoCliente/CreditHome';
import CreditApplication from './components/CreditoCliente/CreditApplication';
import DocumentUpload from './components/CreditoCliente/DocumentUpload';
import ViewCredits from './components/CreditoCliente/ViewCredits';

function App() {
  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            {/* Rutas dentro del Layout (solo las que mencionaste) */}
            <Route element={<Layout />}>

              <Route path="/InicioCliente" element={<InicioCliente />} />
              <Route path="/solicitar-credito" element={<CreditHome />} />
              <Route path="/credit-application" element={<CreditApplication />} />
              <Route path="/view-credits" element={<ViewCredits />} />
              

              {/*Contratos*/}
              <Route path="/contratos-pendientes" element={<ContratosPendientesPage />} />
              <Route path="/cliente/firmar-contrato/:id" element={<FirmarContratoPage />} />
              <Route path="/cliente/ver-contrato/:id" element={<VerContrato />} />

              {/*Seguimientos*/}
              <Route path="/seguimiento/solicitudes" element={<SolicitudesPage />} />
              <Route path="/seguimiento/pagos/:solicitudId" element={<PagosPage />} />
              <Route path="seguimiento/pago/:pagoId" element={<PagoDetallePage />} />
              <Route path="/seguimiento/alertas/:solicitudId" element={<AlertasPage />} />
              <Route path="/seguimiento/reporte" element={<ReporteFinancieroPage />} />
            </Route>

            {/* Rutas dentro del LayoutAdmin (solo las que mencionaste) */}
            <Route element={<LayoutAdmin />}>

              <Route path="/InicioAdmin" element={<InicioAdmin />} />
              <Route path="/ListarSolicitudCredito" element={<ListarSolicitudCredito />} />
              <Route path="/credit-requests/:id" element={<CreditRequestDetailPage/>} />
              
              <Route path="/GeneracionReportes" element={<GeneracionReportes />} />
              <Route path="/GeneracionParametros" element={<Gestionparametros />} />
            </Route>

            {/* Ruta predeterminada: redirige a /Inicio */}
            <Route path="/" element={<Navigate to="/Inicio" />} />

            {/* Otras rutas fuera del Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/password-reset" element={<PasswordReset />} />

            {/* Rutas adicionales fuera del Layout */}
            <Route path="/GeneracionReportes" element={<GeneracionReportes />} />
            <Route path="/GeneracionParametros" element={<Gestionparametros />} />
            <Route path="/ListarSolicitudCredito" element={<ListarSolicitudCredito />} />
            <Route path="/Inicio" element={<Inicio />} />
            <Route path="/InicioAdmin" element={<InicioAdmin />} />
            
            
            <Route path="/subir-documentos" element={<DocumentUpload />} />

            
              
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
