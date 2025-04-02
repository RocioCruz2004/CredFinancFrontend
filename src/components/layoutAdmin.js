import React from 'react';
import MenuLateralAdmin from './Inicio/MenuLateralAdmin'; // Asegúrate de que la ruta sea correcta
import { Outlet } from 'react-router-dom'; // Outlet es donde las rutas cambiarán

const Layout = () => {
  return (
    <div className="flex">
      {/* Menú lateral */}
      <MenuLateralAdmin />
      
      {/* Área de contenido donde las rutas se renderizarán */}
      <div className="flex-1 p-5">
        <Outlet /> {/* Las rutas se renderizarán aquí */}
      </div>
    </div>
  );
};

export default Layout;
