import { useState, useEffect } from "react";
import AutoCard from "./AutoCard";
import "./AutoSearch.css";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import { API_BASE_URL } from "../assets/config";

function AutoSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMarcaTerm, setSearchMarcaTerm] = useState("");
  const [searchModeloTerm, setSearchModeloTerm] = useState("");
  const [allAutos, setAllAutos] = useState([]);
  const [filteredAutos, setFilteredAutos] = useState([]);
  const navigate = useNavigate();
  const marcas = ["Mercedez Benz", "Volkswagen", "Renault", "Iveco"];
  const modelos = {
    "Mercedez Benz": ["Actros", "Arocs", "Atego", "Econic"],
    Volkswagen: ["Delivery", "Constellation", "Meteor"],
    Renault: ["Master", "Trafic", "D-Truck", "Midlum"],
    Iveco: ["Stralis", "Trakker", "Eurocargo"],
  };
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedModelo, setSelectedModelo] = useState("");
  const [selectedKilometraje, setSelectedKilometraje] = useState(0);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/obtener_autos`)
      .then((response) => {
        setAllAutos(response.data);
        setFilteredAutos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los autos:", error);
      });
  }, []);

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterAutos(term);
  };
  const handleMarcaChange = (e) => {
    const marca = e.target.value === "" ? "Todas" : e.target.value;
    setSelectedMarca(marca);
    setSelectedModelo("");
    setSearchMarcaTerm(marca);
    filterAutosMarca(marca);
    applyAllFilters();
  };
  const handleModeloChange = (e) => {
    const modelo = e.target.value === "" ? "Todos" : e.target.value;
    setSelectedModelo(modelo);
    setSearchModeloTerm(modelo);
    filterAutosModelo(modelo);
    applyAllFilters();
  };
  const handleKilometrajeChange = (e) => {
    const kilometraje = e.target.value;
    setSelectedKilometraje(kilometraje);
    filterAutosKilometraje(kilometraje);
    applyAllFilters();
  };
  const handleResetKilometraje = () => {
    setSelectedKilometraje(0);
    applyAllFilters();
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
  const filterAutosMarca = (term) => {
    if (term === "Todas" || term === "") {
      setFilteredAutos(allAutos);
    } else {
      const filtered = allAutos.filter((auto) => auto.marca.includes(term));
      setFilteredAutos(filtered);
    }
    applyAllFilters();
  };
  const filterAutosModelo = (term) => {
    if (term === "Todos" || term === "") {
      if (selectedMarca === "Todas") {
        setFilteredAutos(allAutos);
      } else {
        const filtered = allAutos.filter(
          (auto) => auto.marca === selectedMarca
        );
        setFilteredAutos(filtered);
      }
    } else {
      const filtered = allAutos.filter((auto) => auto.modelo.includes(term));
      setFilteredAutos(filtered);
    }
    applyAllFilters();
  };
  const filterAutosKilometraje = (kilometraje) => {
    if (kilometraje === 0) {
      setFilteredAutos(allAutos);
    }
    const filtered = allAutos.filter((auto) => auto.kilometraje <= kilometraje);
    setFilteredAutos(filtered);
    applyAllFilters();
  };

  const applyAllFilters = () => {
    let filtered = allAutos;
    if (selectedMarca && selectedMarca !== "Todas") {
      filtered = filtered.filter((auto) => auto.marca.includes(selectedMarca));
    }
    if (selectedModelo && selectedModelo !== "Todos") {
      filtered = filtered.filter((auto) =>
        auto.modelo.includes(selectedModelo)
      );
    }
    if (selectedKilometraje) {
      filtered = filtered.filter(
        (auto) => auto.kilometraje <= selectedKilometraje
      );
    }
    setFilteredAutos(filtered);
  };

  const handleAddAuto = () => {
    navigate("/agregar-auto");
  };

  const handleScanQR = () => {
    navigate("/escanear-qr");
  };

  return (
    <div className="auto-search">
      <Navbar />
      <h2 className="auto-search__title">Búsqueda de Autos</h2>
      <div className="auto-search__search-add">
        <div className="auto-search-filters">
          <input
            type="text"
            placeholder="Buscar por patente..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="auto-search__input"
          />
          <select
            name="marca"
            value={selectedMarca}
            onChange={handleMarcaChange}
          >
            {" "}
            <option value="" disabled>
              {" "}
              Buscar por marca del vehículo{" "}
            </option>{" "}
            <option value="">Todas</option>
            {marcas.map((marca) => (
              <option key={marca} value={marca}>
                {" "}
                {marca}{" "}
              </option>
            ))}{" "}
          </select>

          <select
            name="modelo"
            value={selectedModelo}
            onChange={handleModeloChange}
            required
          >
            <option value="" disabled>
              Buscar por modelo
            </option>{" "}
            <option value="">Todos</option>
            {selectedMarca &&
              (selectedMarca === "Todas"
                ? Object.keys(modelos).flatMap((marca) =>
                    modelos[marca].map((modelo) => (
                      <option key={modelo} value={modelo}>
                        {" "}
                        {modelo}{" "}
                      </option>
                    ))
                  )
                : modelos[selectedMarca].map((modelo) => (
                    <option key={modelo} value={modelo}>
                      {" "}
                      {modelo}{" "}
                    </option>
                  )))}
          </select>
        </div>
        <button onClick={handleResetKilometraje}>Aplicar</button>
        <input
          type="range"
          min="0"
          max="10000"
          value={selectedKilometraje}
          onChange={handleKilometrajeChange}
        />
        <span>{selectedKilometraje} km</span>

        <div className="auto-search__buttons">
          <button onClick={handleAddAuto} className="auto-search__add-auto">
            1
          </button>
          <button onClick={handleScanQR} className="auto-search__scan-qr">
            2
          </button>
        </div>
      </div>
      <div className="auto-search__list">
        {filteredAutos.length > 0 ? (
          filteredAutos.map((auto) => <AutoCard key={auto.id} auto={auto} />)
        ) : (
          <p>No se encontraron autos.</p>
        )}
      </div>
    </div>
  );
}

export default AutoSearch;
