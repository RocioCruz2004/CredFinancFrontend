import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaChartLine, FaCog } from 'react-icons/fa';
import './InicioAdmin.css';

const InicioAdmin = () => {
    const navigate = useNavigate();

    const handleSolCredClick = () => navigate('/ListarSolicitudCredito');
    const handleVerReporClick = () => navigate('/GeneracionReportes');
    const handleParametrosClick = () => navigate('/GeneracionParametros');

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-white p-8 text-[#102845]">
            <div className="max-w-4xl w-full text-center mb-12">
                <h2 className="text-5xl font-extrabold mb-6">Panel de Administración</h2>
                <p className="text-3xl mb-10 font-semibold">GESTIÓN DEL SISTEMA FINANCIERO</p>
                <p className="text-xl mb-10 text-gray-600">Administra todas las funcionalidades del sistema</p>
            </div>

            {/* Contenedor de los botones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
                
                {/* Botón "Ver Solicitudes de Credito" */}
                <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                    <img 
                        src={require('../image/icono1-admin.png')}
                        alt="Solicitudes de crédito"
                        className="w-80 h-80 object-contain mb-4"
                    />
                    <button 
                        onClick={handleSolCredClick}
                        className="text-xl text-white w-full py-3 bg-[#1a62c6] rounded-lg hover:bg-[#155a9d] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <FaFileAlt /> Ver Solicitudes de Crédito
                    </button>
                </div>

                {/* Botón "Ver Reportes Financieros" */}
                <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                    <img 
                        src={require('../image/icono2-admin.png')}
                        alt="Reportes financieros"
                        className="w-80 h-80 object-contain mb-4"
                    />
                    <button 
                        onClick={handleVerReporClick}
                        className="text-xl text-white w-full py-3 bg-[#157dbf] rounded-lg hover:bg-[#126fa1] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <FaChartLine /> Ver Reportes Financieros
                    </button>
                </div>

                {/* Botón "Gestionar Parametros" */}
                <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                    <img 
                        src={require('../image/icono3-admin.png')} 
                        alt="Gestión de parámetros"
                        className="w-80 h-80 object-contain mb-4"
                    />
                    <button 
                        onClick={handleParametrosClick}
                        className="text-xl text-white w-full py-3 bg-[#10a8e8] rounded-lg hover:bg-[#0d8fc7] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <FaCog /> Gestionar Parámetros
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InicioAdmin;