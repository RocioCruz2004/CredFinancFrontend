import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CreditHome.css';
import { FiTrendingUp, FiDollarSign, FiTruck, FiEye } from 'react-icons/fi';
import { BsArrowRightShort, BsCheckCircle } from 'react-icons/bs';
import creditHero from '../image/Bank.png';

const CreditHome = () => {
  const navigate = useNavigate();

  const handleStartApplication = () => {
    navigate('/credit-application');
  };

  const handleViewCredits = () => {
    navigate('/view-credits');
  };

  const creditTypes = [
    {
      icon: <FiTrendingUp size={32} />,
      title: "Crédito de Emprendimiento",
      description: "Capital para iniciar o expandir tu negocio con condiciones especiales para emprendedores",
      color: "#1a62c6"
    },
    {
      icon: <FiDollarSign size={32} />,
      title: "Crédito de Inversión",
      description: "Financiamiento para proyectos de inversión con rendimientos atractivos",
      color: "#224e99"
    },
    {
      icon: <FiTruck size={32} />,
      title: "Crédito para Vehículo",
      description: "Adquiere el automóvil que necesitas con tasas preferenciales",
      color: "#1a62c6"
    }
  ];

  const benefits = [
    "Proceso 100% digital",
    "Respuesta en 24 horas",
    "Sin comisiones ocultas",
    "Atención personalizada"
  ];

  return (
    <div className="credit-home-container">
      <header className="credit-home-header">
        <div className="header-content">
          <h1>Solicita tu crédito en línea</h1>
          <p>La solución financiera que necesitas, rápida y segura</p>
        </div>
      </header>
      
      <main className="credit-home-main">
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h2>Financia tus proyectos con nuestras opciones de crédito</h2>
              <p className="hero-description">
                Obtén el financiamiento que necesitas con las mejores condiciones del mercado, 
                diseñadas para apoyar tus metas personales y profesionales.
              </p>
              
              <div className="benefits-list">
                {benefits.map((benefit, index) => (
                  <div key={index} className="benefit-item">
                    <BsCheckCircle className="check-icon" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="buttons-container">
                <button onClick={handleStartApplication} className="cta-button">
                  Iniciar solicitud <BsArrowRightShort className="arrow-icon" />
                </button>
                <button onClick={handleViewCredits} className="cta-button view-button">
                  <FiEye className="button-icon" /> Ver Créditos
                </button>
              </div>
            </div>
            
            <div className="hero-image">
              <img src={creditHero} alt="Ilustración financiera" />
            </div>
          </div>
        </section>

        <section className="credit-types-section">
          <div className="section-header">
            <h2>Nuestros productos crediticios</h2>
            <p>Soluciones diseñadas para cada necesidad financiera</p>
          </div>
          
          <div className="credit-cards-container">
            {creditTypes.map((type, index) => (
              <div 
                key={index} 
                className="credit-card"
                style={{ borderTop: `4px solid ${type.color}` }}
              >
                <div className="card-icon" style={{ color: type.color }}>
                  {type.icon}
                </div>
                <h3>{type.title}</h3>
                <p className="card-description">{type.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CreditHome;