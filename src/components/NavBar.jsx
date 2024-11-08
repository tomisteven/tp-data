import "./Navbar.css";
import { useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { role } = useContext(AuthContext);
  const rol = localStorage.getItem("userData");
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navLinks = useMemo(() => {
    const commonLinks = [
      { to: "/", title: "Inicio", label: "1" },
      { to: "/mi-perfil", title: "Perfil", label: "" },
    ];

    const roleBasedLinks = {
      administrador: [
        { to: "/gestion-autos", title: "Búsqueda de Autos", label: "2" },
        {
          to: "/gestion-proveedores",
          title: "Proveedores",
          label: "3",
        },
        { to: "/gestion-mecanicos", title: "Mecánicos", label: "4" },
        {
          to: "/gestion-conductor",
          title: "Conductores",
          label: "5",
        },
        { to: "/reportes", title: "Reportes", label: "6" },
        { to: "/admin-gastos", title: "Gastos", label: "7" },
        {
          to: "/admin-usuarios",
          title: "Usuarios",
          label: "8",
        },
        { to: "/admin-flotas", title: "Flotas", label: "9" },
        { to: "/productos", title: "Productos", label: "10" },
        { to: "/orden-de-compra", title: "Órdenes de Compra", label: "11" },
      ],
      operador: [
        { to: "/ver-mi-ruta", title: "Rutas", label: "1.1" },
        { to: "/mis-gastos", title: "Mis Gastos", label: "1.2" },
        { to: "/pedir-acarreo", title: "Pedir Acarreo", label: "1.3" },
        {
          to: "/verificar-formularios",
          title: "Formularios",
          label: "1.4",
        },
      ],
      gerente: [
        {
          to: "/verificar-rutas",
          title: "Verificación de Rutas",
          label: "1.5",
        },
        { to: "/reportes-gerencia", title: "Reportes", label: "1.6" },
        { to: "/ver-gastos", title: "Visualizador de Gastos", label: "1.7" },
      ],
      supervisor: [
        { to: "/crear-ruta", title: "Crear Ruta", label: "1.8" },
        { to: "/formularios-supervisor", title: "Formularios", label: "1.9" },
      ],
      mecanico: [
        {
          to: "/busqueda-auto-mecanico",
          title: "Vehiculos de Operadores",
          label: "1.10",
        },
        { to: "/pedidos-ayuda", title: "Pedidos de Acarreo", label: "1.11" },
      ],
      cliente: [
        { to: "/visor-gastos", title: "Visor de Gastos", label: "1.12" },
        { to: "/visor-flota", title: "Visor de Flotas", label: "1.13" },
        { to: "/reportes", title: "Reportes", label: "1.14" },
      ],
    };

    return [...commonLinks, ...(roleBasedLinks[rol] || [])];
  }, [rol]);

  return (
    <nav className="navbar">
      <div className="navbar-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`navbar-list ${isOpen ? "navbar-list-open" : ""}`}>
        {navLinks.map((link, index) => (
          <li key={index} className="navbar-item">
            <Link
              to={link.to}
              className="navbar-link"
              title={link.title}
              onClick={closeMenu}
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
