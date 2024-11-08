import { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AutoSearch from "../Pages/AutoSearch";
import AutoDetail from "../Pages/AutoDetail";
import MechanicManagement from "../Pages/MechanicManagement";
import Navbar from "../components/NavBar";
import AddAuto from "../Pages/AddAuto";
import QRScanner from "../Pages/QRScanner";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import AddMechanic from "../Pages/AddMechanic";
import DriversManagement from "../Pages/DriversManagement";
import MyRoute from "../Pages/MyRoute";
import MyBills from "../Pages/MyBills";
import AddBills from "../Pages/AddBills";
import Reports from "../Pages/Reports";
import BillsManagement from "../Pages/BillsManagement";
import UsersManagement from "../Pages/UsersManagement";
import AuthProvider, { AuthContext } from "../Context/AuthContext";
import AddFlota from "../Pages/AddFlota";
import EditFlota from "../Pages/EditFlota";
import AddAutoFlota from "../Pages/AddAutoFlota";
import BillStates from "../Pages/BillsStates";
import RoutesVerify from "../Pages/RoutesVerify";
import RouteViewVerify from "../Pages/RouteViewVerify";
import ReportManagement from "../Pages/ReportManagement";
import RouteCreate from "../Pages/RouteCreate";
import AutoAccidentRegister from "../Pages/AutoAccidentRegister";
import BillsViewer from "../Pages/BillsViewer";
import FlotaViewer from "../Pages/FlotaViewer";
import MechanicAutoSearch from "../Pages/MechanicAutoSearch";
import ProveedoresViewer from "../Pages/ProveedoresViewer";
import AddProveedor from "../Pages/AddProveedor";
import EditProveedor from "../Pages/EditProveedor";
import Products from "../Pages/Products";
import OrdenesDeCompra from "../Pages/OrdenesDeCompra";
import AddOrden from "../Pages/AddOrden";
import EditProducto from "../Pages/EditProducto";
import EditMechanic from "../Pages/EditMechanic";
import EditCar from "../Pages/EditCar";
import ViewFormsOperador from "../Pages/ViewFormsOperador";
import HelpRequest from "../Pages/HelpRequest";
import AutoDetailForAdmin from "../Pages/AutoDetailForAdmin";
import RestorePassword from "../Pages/SecretAnswerLogin";
import MechanicAidRequest from "../Pages/MechanicAidRequest";
import AutoAccidentsForAdmin from "../Pages/AutoAccidentsForAdmin";
import FormularioAccidenteMechanic from "../Pages/FormularioAccidenteMechanic";
import Perfil from "../Pages/Perfil";
import ViewFormsSupervisor from "../Pages/ViewFormsSupervisor";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  );
};

const MainApp = () => {
  const { handleLogout } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("user")); // Obtener el usuario del localStorage

  //
  return (
    <>
      {user && <Navbar />}{" "}
      {/* Renderizar Navbar solo si hay un usuario autenticado */}
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestion-autos"
            element={
              <ProtectedRoute>
                <AutoSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/autos/:id"
            element={
              <ProtectedRoute>
                <AutoDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/autos-admin/:id"
            element={
              <ProtectedRoute>
                <AutoDetailForAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestion-mecanicos"
            element={
              <ProtectedRoute>
                <MechanicManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agregar-auto"
            element={
              <ProtectedRoute>
                <AddAuto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/escanear-qr"
            element={
              <ProtectedRoute>
                <QRScanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agregar-mecanico"
            element={
              <ProtectedRoute>
                <AddMechanic />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestion-conductor"
            element={
              <ProtectedRoute>
                <DriversManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ver-mi-ruta"
            element={
              <ProtectedRoute>
                <MyRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-gastos"
            element={
              <ProtectedRoute>
                <MyBills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agregar-gastos"
            element={
              <ProtectedRoute>
                <AddBills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reportes"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-gastos"
            element={
              <ProtectedRoute>
                <BillsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-usuarios"
            element={
              <ProtectedRoute>
                <UsersManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-flotas"
            element={
              <ProtectedRoute>
                <AddFlota />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-flotas/edit/:id"
            element={
              <ProtectedRoute>
                <EditFlota />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-flotas/:flotaId/add-auto"
            element={
              <ProtectedRoute>
                <AddAutoFlota />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ver-gastos"
            element={
              <ProtectedRoute>
                <BillStates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verificar-rutas"
            element={
              <ProtectedRoute>
                <RoutesVerify />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rutas/:id"
            element={
              <ProtectedRoute>
                <RouteViewVerify />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reportes-gerencia"
            element={
              <ProtectedRoute>
                <ReportManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crear-ruta"
            element={
              <ProtectedRoute>
                <RouteCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/autos-accidentes/:id"
            element={
              <ProtectedRoute>
                <AutoAccidentRegister />
              </ProtectedRoute>
            }
          />
          <Route
            path="/busqueda-auto-mecanico"
            element={
              <ProtectedRoute>
                <MechanicAutoSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/formularios-supervisor"
            element={
              <ProtectedRoute>
                <ViewFormsSupervisor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visor-gastos"
            element={
              <ProtectedRoute>
                <BillsViewer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pedidos-ayuda"
            element={
              <ProtectedRoute>
                <MechanicAidRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/autos-accidentes-admin/:id"
            element={
              <ProtectedRoute>
                <AutoAccidentsForAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forms-accidente"
            element={
              <ProtectedRoute>
                <FormularioAccidenteMechanic />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visor-flota"
            element={
              <ProtectedRoute>
                <FlotaViewer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestion-proveedores"
            element={
              <ProtectedRoute>
                <ProveedoresViewer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agregar-proveedor"
            element={
              <ProtectedRoute>
                <AddProveedor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orden-de-compra"
            element={
              <ProtectedRoute>
                <OrdenesDeCompra />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pedir-acarreo"
            element={
              <ProtectedRoute>
                <HelpRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verificar-formularios"
            element={
              <ProtectedRoute>
                <ViewFormsOperador />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-proveedor/:id"
            element={
              <ProtectedRoute>
                <EditProveedor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-mechanic/:id"
            element={
              <ProtectedRoute>
                <EditMechanic />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-car/:id"
            element={
              <ProtectedRoute>
                <EditCar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productos"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-orden"
            element={
              <ProtectedRoute>
                <AddOrden />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-producto/:id"
            element={
              <ProtectedRoute>
                <EditProducto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mi-perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
          <Route path="/recuperar-contraseña" element={<RestorePassword />} />{" "}
          {/* Ruta pública */}
        </Routes>

        <button onClick={handleLogout} className="btn-flotante">
          LOGOUT
        </button>
        <div className="info-user">
          <p>
            {user ? `Usuario: ${user.email} ` : "No hay usuario autenticado"}
          </p>
          <p>
            {user ? `Rol:  ${localStorage.getItem("userData")}` : "No hay rol"}
          </p>
        </div>
      </main>
    </>
  );
};

// Componente de ruta protegida
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user")); // Obtener el usuario del localStorage
  return user ? children : <Login />;
};

export default App;
