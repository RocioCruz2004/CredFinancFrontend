import { FaHome, FaFileSignature, FaClipboardList, FaMoneyBillWave, FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/login");
  };

  const showSidebarRoutes = [
    "/solicitar-credito",
    "/cliente/ver-contrato/:id",
    "/seguimiento/solicitudes",
    "/seguimiento/pagos",
    "/seguimiento/alertas",
    "/InicioCliente",
    "/contratos-pendientes",
    "/cliente/firmar-contrato/:id",
    "/seguimiento/pagos/:solicitudId",
    "seguimiento/pago/:pagoId",
    "/seguimiento/alertas/:solicitudId",
    "/seguimiento/reporte",
    "/credit-aplication",
    "/view-credits"
  ];

  const showSidebar = showSidebarRoutes.some(route => {
    // Manejar rutas con parámetros
    if (route.includes('/:')) {
      const baseRoute = route.split('/:')[0];
      return location.pathname.startsWith(baseRoute);
    }
    return location.pathname.includes(route);
  });

  if (!showSidebar) {
    return null;
  }

  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="h-screen w-72 bg-[#102845] text-white p-6 flex flex-col z-50 shadow-2xl"
    >
      {/* Logo con animación */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10 text-center"
      >
        <h2 className="text-3xl font-bold tracking-wide">
          <span className="text-[#10a8e8]">Nexo</span><span className="text-white">Bank</span>
        </h2>
    <div className="h-1 bg-gradient-to-r from-[#10a8e8] to-transparent mt-2 w-3/4 mx-auto"></div>
      </motion.div>

      <nav className="flex flex-col gap-2 flex-grow">
        {[
          {
            to: "/InicioCliente",
            icon: <FaHome className="text-xl" />,
            text: "Inicio"
          },
          {
            to: "/solicitar-credito",
            icon: <FaMoneyBillWave className="text-xl" />,
            text: "Solicitar Crédito"
          },
          {
            to: "/contratos-pendientes",
            icon: <FaFileSignature className="text-xl" />,
            text: "Mis Contratos"
          },
          {
            to: "/seguimiento/solicitudes",
            icon: <FaClipboardList className="text-xl" />,
            text: "Seguimiento"
          }
        ].map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <NavLink 
              to={item.to}
              className={({ isActive }) => 
                `flex items-center gap-4 p-4 rounded-lg transition-all duration-200
                ${isActive ? 
                  'bg-[#10a8e8] text-white shadow-lg' : 
                  'hover:bg-[#1a3a5a] hover:text-[#10a8e8]'}`
              }
            >
              {item.icon}
              <span className="text-lg font-medium">{item.text}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Botón de Cerrar Sesión */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-auto"
      >
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-center gap-4 p-4 rounded-lg bg-gradient-to-r from-[#d53f3f] to-[#9b2c2c] hover:from-[#e53e3e] hover:to-[#c53030] transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FaSignOutAlt className="text-xl" />
          <span className="text-lg font-medium">Cerrar Sesión</span>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;