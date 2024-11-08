import { useState, useContext } from "react";
import { Link } from "react-router-dom";
/* import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; */
/* import {
  faHome,
  faCar,
  faWrench,
  faUser,

  faRoute,
  faBox,
  faCarOn,
  faSheetPlastic,
  faBell,
  faChartLine,
  faMoneyBillWave,
  faUserShield,
  faWarehouse,
  faDolly,
  faClipboard,
  faRoad,

} from "@fortawesome/free-solid-svg-icons"; */
import "./Navbar.css";
import { AuthContext } from "../Context/AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { role } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Botón Hamburguesa */}
      <div className="navbar-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Lista de Navegación */}
      <ul className={`navbar-list ${isOpen ? "navbar-list-open" : ""}`}>
        {/* Opciones comunes a todos */}
        <li className="navbar-item">
          <Link
            to="/"
            className="navbar-link"
            title="Inicio"
            onClick={closeMenu}
          >
            1
          </Link>
        </li>
        <li>
          <Link
            to="/mi-perfil"
            className="navbar-link"
            title="Perfil"
            onClick={closeMenu}
          ></Link>
        </li>

        {/* Opciones solo para "administrador" */}
        {role === "administrador" && (
          <>
            <li className="navbar-item">
              <Link
                to="/gestion-autos"
                className="navbar-link"
                title="Búsqueda de Autos"
                onClick={closeMenu}
              >
                2
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/gestion-proveedores"
                className="navbar-link"
                title="Gestión de Proveedores"
                onClick={closeMenu}
              >
                3
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/gestion-mecanicos"
                className="navbar-link"
                title="Gestión de Mecánicos"
                onClick={closeMenu}
              >
                4
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/gestion-conductor"
                className="navbar-link"
                title="Gestión de Conductores"
                onClick={closeMenu}
              >
                5
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/reportes"
                className="navbar-link"
                title="Reportes"
                onClick={closeMenu}
              >
                6
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/admin-gastos"
                className="navbar-link"
                title="Administración de Gastos"
                onClick={closeMenu}
              >
                7
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/admin-usuarios"
                className="navbar-link"
                title="Administración de Usuarios"
                onClick={closeMenu}
              >
                8
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/admin-flotas"
                className="navbar-link"
                title="Administración de Flotas"
                onClick={closeMenu}
              >
                9
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/productos"
                className="navbar-link"
                title="Productos"
                onClick={closeMenu}
              >
                10
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/orden-de-compra"
                className="navbar-link"
                title="Órdenes de Compra"
                onClick={closeMenu}
              >
                11
              </Link>
            </li>
          </>
        )}

        {/* Opciones solo para "operador" */}
        {role === "operador" && (
          <>
            <li className="navbar-item">
              <Link
                to="/ver-mi-ruta"
                className="navbar-link"
                title="Visualizar Ruta"
                onClick={closeMenu}
              >
                1.1
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/mis-gastos"
                className="navbar-link"
                title="Mis Gastos"
                onClick={closeMenu}
              >
                1.2
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/pedir-acarreo"
                className="navbar-link"
                title="Pedir Acarreo"
                onClick={closeMenu}
              >
                1.3
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/verificar-formularios"
                className="navbar-link"
                title="Ver Formularios"
                onClick={closeMenu}
              >
                1.4
              </Link>
            </li>
          </>
        )}

        {/* Opciones solo para "gerente" */}
        {role === "gerente" && (
          <>
            <li className="navbar-item">
              <Link
                to="/verificar-rutas"
                className="navbar-link"
                title="Verificación de Rutas"
                onClick={closeMenu}
              >
                1.5
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/reportes-gerencia"
                className="navbar-link"
                title="Reportes"
                onClick={closeMenu}
              >
                1.6
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/ver-gastos"
                className="navbar-link"
                title="Visualizador de Gastos"
                onClick={closeMenu}
              >
                1.7
              </Link>
            </li>
          </>
        )}

        {/* Opciones solo para "supervisor" */}
        {role === "supervisor" && (
          <>
            <li className="navbar-item">
              <Link
                to="/crear-ruta"
                className="navbar-link"
                title="Crear Ruta"
                onClick={closeMenu}
              >
                1.8
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/formularios-supervisor"
                className="navbar-link"
                title="Formularios"
                onClick={closeMenu}
              >
                1.9
              </Link>
            </li>
          </>
        )}

        {/* Opciones solo para "mecanico" */}
        {role === "mecanico" && (
          <>
            <li className="navbar-item">
              <Link
                to="/busqueda-auto-mecanico"
                className="navbar-link"
                title="Vehiculos de Operadores"
                onClick={closeMenu}
              >
                1.10
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/pedidos-ayuda"
                className="navbar-link"
                title="Pedidos de Acarreo"
                onClick={closeMenu}
              >
                1.11
              </Link>
            </li>
          </>
        )}

        {/* Opciones solo para "cliente" */}
        {role === "cliente" && (
          <>
            <li className="navbar-item">
              <Link
                to="/visor-gastos"
                className="navbar-link"
                title="Visor de Gastos"
                onClick={closeMenu}
              >
                1.12
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/visor-flota"
                className="navbar-link"
                title="Visor de Flotas"
                onClick={closeMenu}
              >
                1.13
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/reportes"
                className="navbar-link"
                title="Reportes"
                onClick={closeMenu}
              >
                1.14
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
