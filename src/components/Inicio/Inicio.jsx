import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUserShield, 
  FaRegCreditCard, 
  FaChartLine, 
  FaShieldAlt, 
  FaPiggyBank, 
  FaAward,
  FaTachometerAlt 
} from 'react-icons/fa';
import { body } from 'framer-motion/client';


const Inicio = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => navigate('../Login');
  const handleRegisterClick = () => navigate('../Register');

  return (
    <body>
      <div className="text-[#102845]">
      {/* --- HERO SECTION (VERSIÓN ORIGINAL QUE TE GUSTABA) --- */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between min-h-screen bg-[#102845] p-4 lg:p-8 text-white overflow-hidden">
        {/* Columna de texto */}
        <motion.div 
          className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center lg:px-12 mb-8 lg:mb-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-7xl lg:text-9xl font-extrabold text-white leading-tight mb-6">
            Bienvenido a <span className="text-[#10a8e8]">NexoBank</span>
          </h1>
          
          <p className="text-3xl lg:text-4xl font-bold text-white opacity-90 uppercase mb-8">
            TU BANCO DIGITAL DE CONFIANZA
          </p>

          <motion.p className="text-2xl lg:text-3xl text-white opacity-90 mb-12">
            Nos dedicamos a ayudarte con soluciones financieras personalizadas y accesibles para que tomes el control de tus finanzas.
          </motion.p>

          {/* Botones de acción - en horizontal */}
          <div className="flex flex-row gap-6 w-full">
            <motion.button 
              className="flex-1 flex items-center justify-center gap-3 px-4 py-3 text-white bg-[#1a62c6] rounded-lg uppercase hover:bg-[#155a9d] transition-all text-lg lg:text-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoginClick}
            >
              <FaUserShield size={24} /> INICIAR SESIÓN
            </motion.button>
            
            <motion.button 
              className="flex-1 flex items-center justify-center gap-3 px-4 py-3 text-white bg-[#10a8e8] rounded-lg uppercase hover:bg-[#0d8fc7] transition-all text-lg lg:text-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRegisterClick}
            >
              <FaRegCreditCard size={24} /> REGISTRARSE
            </motion.button>
          </div>
        </motion.div>

        {/* Columna de imagen */}
        <div className="relative z-10 w-full lg:w-1/2 h-full flex items-center justify-center">
          <img 
            src={require('../image/avatar_inicio.png')}
            alt="Finanzas"
            className="w-full h-auto max-h-[90vh] object-contain" 
          />
        </div>

        {/* Flecha de scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-8 border-b-4 border-r-4 border-white rotate-45"></div>
        </div>
      </section>

      {/* --- SECCIONES SCROLLEABLES NUEVAS --- */}
      
      {/* Sección Beneficios (fondo blanco) */}
      <section className="py-16 lg:py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16 text-[#102845]"
          >
            ¿Por qué elegir <span className="text-[#10a8e8]">NexoBank</span>?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaTachometerAlt className="text-4xl text-[#10a8e8]" />,
                title: "Operaciones instantáneas",
                desc: "Transfiere dinero en segundos a cualquier hora"
              },
              {
                icon: <FaShieldAlt className="text-4xl text-[#10a8e8]" />,
                title: "Seguridad avanzada",
                desc: "Tecnología blockchain y autenticación biométrica"
              },
              {
                icon: <FaPiggyBank className="text-4xl text-[#10a8e8]" />,
                title: "Sin comisiones",
                desc: "Sin cargos ocultos ni letra pequeña"
              },
              {
                icon: <FaChartLine className="text-4xl text-[#10a8e8]" />,
                title: "Inversiones inteligentes",
                desc: "Portafolios automatizados con IA"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-[#102845]">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Stats */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-[#102845] to-[#10a8e8] text-white px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <FaAward className="text-5xl mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              El banco digital <span className="text-yellow-300">#1</span> en satisfacción
            </h2>
            <p className="text-xl max-w-3xl mx-auto">
              Reconocidos por innovación y experiencia de usuario
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "5M+", label: "Clientes activos" },
              { number: "$2B", label: "En transacciones" },
              { number: "98%", label: "Satisfacción" },
              { number: "24/7", label: "Soporte" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-16 lg:py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16"
          >
            Lo que dicen nuestros clientes
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Nunca pensé que un banco podría ser tan fácil de usar. ¡Cambió mi vida financiera!",
                author: "María G., Emprendedora",
                role: "Cliente desde 2022"
              },
              {
                quote: "Las inversiones automatizadas me generaron un 15% más que mi banco tradicional",
                author: "Carlos R., Ingeniero",
                role: "Cliente desde 2021"
              },
              {
                quote: "Por fin un banco que entiende lo que necesitamos los jóvenes profesionales",
                author: "Ana L., Diseñadora",
                role: "Cliente desde 2023"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-xl border-l-4 border-[#10a8e8]"
              >
                <p className="text-lg italic mb-6">"{testimonial.quote}"</p>
                <div className="font-bold">{testimonial.author}</div>
                <div className="text-gray-500 text-sm">{testimonial.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#102845] text-white text-center text-sm">
        <p>&copy; 2025 NexoBank. Todos los derechos reservados.</p>
      </footer>
    </div>
    </body>
    
  );
};

export default Inicio;