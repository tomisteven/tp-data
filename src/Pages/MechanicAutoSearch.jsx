import  { useState, useEffect } from "react";
import MechanicAutoCard from "./MechanicAutoCard"; // Componente correcto
import styles from "./MechanicAutoSearch.module.css"; // Cambia a .module.css
import axios from "axios";
import { useNavigate } from "react-router-dom";
/* import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faQrcode} from '@fortawesome/free-solid-svg-icons'; */
import Navbar from "../components/NavBar";
import { API_BASE_URL } from "../assets/config";

function AutoSearch() { // Nombre del componente corregido
  const [searchTerm, setSearchTerm] = useState("");
  const [allAutos, setAllAutos] = useState([]); // Estado para todos los autos
  const [filteredAutos, setFilteredAutos] = useState([]);
  const [error, setError] = useState(null); // Estado para manejar errores
  const navigate = useNavigate();

  useEffect(() => {
    // Llamada a la API para obtener los autos
    axios
      .get(`${API_BASE_URL}/autos`)
      .then((response) => {
        setAllAutos(response.data);
        setFilteredAutos(response.data); // Inicialmente, todos los autos están en la lista filtrada
      })
      .catch((error) => {
        console.error("Error al obtener los autos:", error);
        setError("No se pudo obtener la información de los autos."); // Manejo de errores
      });
  }, []);

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterAutos(term);
  };

  const filterAutos = (term) => {
    if (term === "") {
      setFilteredAutos(allAutos);
    } else {
      const filtered = allAutos.filter((auto) =>
        auto.nro_patente.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredAutos(filtered);
    }
  };

  const handleScanQR = () => {
    navigate("/escanear-qr");
  };

  return (
    <div className={styles['auto-search-container']}>
      <Navbar />
      <h2 className={styles['title']}>Búsqueda de Autos</h2>
      <div className={styles['search-add-container']}>
        <input
          type="text"
          placeholder="Buscar por patente..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles['auto-search-input']}
        />
        <div className={styles['buttons-search-add-container']}>
          <button onClick={handleScanQR} className={styles['scan-qr-button']}>
            1
          {/* <FontAwesomeIcon icon={faQrcode} style={{color: "#e0e0e0",}} /> */}
          </button>
        </div>
      </div>

      {error ? <p>{error}</p> : null}

      <div className={styles['auto-card-list']}>
        {filteredAutos.length > 0 ? (
          filteredAutos.map((auto) => (
            <MechanicAutoCard key={auto.id} auto={auto} />
          ))
        ) : (
          <p>No se encontraron autos.</p>
        )}
      </div>
    </div>
  );
}

export default AutoSearch; // Exportación corregida
