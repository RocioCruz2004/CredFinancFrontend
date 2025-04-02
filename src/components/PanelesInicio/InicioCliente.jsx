import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaCheckCircle, FaRegMoneyBillAlt } from 'react-icons/fa'; 
import './InicioCliente.css';

const InicioCliente = () => {
    const navigate = useNavigate();

    const handleCreditoInfoClick = () => navigate('/solicitar-credito');
    const handleEstadoSolCredClick = () => navigate('/seguimiento/solicitudes');
    const handleSaldoPendienteClick = () => navigate('/seguimiento/pagos/:solicitudId');

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-white p-8 text-[#102845]">
            <div className="max-w-4xl w-full text-center mb-12">
                <h2 className="text-5xl font-extrabold mb-6">Bienvenido a tu Panel Cliente</h2>
                <p className="text-3xl mb-10 font-semibold">ACCEDE A LOS SERVICIOS FINANCIEROS</p>
                <p className="text-xl mb-10 text-gray-600">Consulta tu información de manera fácil y rápida</p>
            </div>

            {/* Contenedor de los botones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
                
                {/* Botón "Cómo obtener un crédito financiero" */}
                <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                    <img 
                        src={require('../image/icono1-cliente.png')} 
                        alt="Crédito financiero"
                        className="w-80 h-80 object-contain mb-4"
                    />
                    <button 
                        onClick={handleCreditoInfoClick}
                        className="text-xl text-white w-full py-3 bg-[#1a62c6] rounded-lg hover:bg-[#155a9d] transition-all duration-300"
                    >
                        Cómo obtener un crédito financiero
                    </button>
                </div>

                {/* Botón "Consultar estado de mi solicitud de Crédito" */}
                <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                    <img 
                        src={require('../image/icono2-cliente.png')}
                        alt="Estado de solicitud"
                        className="w-80 h-80 object-contain mb-4"
                    />
                    <button 
                        onClick={handleEstadoSolCredClick}
                        className="text-xl text-white w-full py-3 bg-[#157dbf] rounded-lg hover:bg-[#126fa1] transition-all duration-300"
                    >
                        Consultar estado de mi solicitud
                    </button>
                </div>

                {/* Botón "Consultar saldo pendiente" */}
                <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                    <img 
                        src={require('../image/icono3-cliente.png')} 
                        alt="Saldo pendiente"
                        className="w-80 h-80 object-contain mb-4"
                    />
                    <button 
                        onClick={handleSaldoPendienteClick}
                        className="text-xl text-white w-full py-3 bg-[#10a8e8] rounded-lg hover:bg-[#0d8fc7] transition-all duration-300"
                    >
                        Consultar saldo pendiente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InicioCliente;   