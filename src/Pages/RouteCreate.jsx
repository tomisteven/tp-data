import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "./RouteCreate.css";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../assets/config";
import axios from "axios";

function RouteCreate() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const routingControlRef = useRef(null); // Control de routing
  const [rutaData, setRutaData] = useState({
    desde: "",
    hasta: "",
    conductor: "",
    conductorDni: "",
  });

  const [desdeCoords, setDesdeCoords] = useState(null);
  const [hastaCoords, setHastaCoords] = useState(null);
  const [suggestionsDesde, setSuggestionsDesde] = useState([]);
  const [suggestionsHasta, setSuggestionsHasta] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [distanciaTotal, setDistanciaTotal] = useState(0);
  const [trazado, setTrazado] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRutaData({ ...rutaData, [name]: value });

    if (name === "desde") {
      handleAutocomplete(value, setSuggestionsDesde);
    } else if (name === "hasta") {
      handleAutocomplete(value, setSuggestionsHasta);
    }
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    if (!desdeCoords || !hastaCoords) {
      alert("Una o ambas ubicaciones no han sido seleccionadas.");
      return;
    }
    // Crear ruta y calcular datos
    geocodeAndCreateRoute(desdeCoords, hastaCoords);
  };

  useEffect(() => {
    const fetchConductores = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/conductores`);
        const conductoresHabilitados = response.data.filter(
          (conductor) => conductor.habilitado
        );
        setConductores(conductoresHabilitados);
      } catch (error) {
        console.error("Error al obtener los conductores:", error);
      }
    };
    fetchConductores();
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [51.505, -0.09],
        zoom: 13,
        zoomControl: true,
        dragging: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }
  }, []);

  const geocodeAndCreateRoute = async (desdeCoords, hastaCoords) => {
    if (mapRef.current) {
      if (routingControlRef.current) {
        mapRef.current.removeControl(routingControlRef.current); // Eliminar la ruta anterior
      }

      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(desdeCoords.lat, desdeCoords.lon),
          L.latLng(hastaCoords.lat, hastaCoords.lon),
        ],
        routeWhileDragging: true,
        show: false, // Oculta el panel de instrucciones de ruta
      }).addTo(mapRef.current);

      routingControlRef.current.on("routesfound", function (e) {
        const route = e.routes[0];
        setDistanciaTotal(route.summary.totalDistance / 1000); // Guardar distancia en km
        setTrazado(route.coordinates); // Guardar el trazado de la ruta
      });

      Swal.fire({
        title: "¡Ruta creada!",
        text: "La ruta fue creada con éxito.",
        icon: "success",
        confirmButtonText: '<i class="fas fa-check"></i> Aceptar',
        customClass: {
          confirmButton: "swal-confirm-button",
        },
      });
    } else {
      alert("Hubo un problema al generar el mapa.");
    }
  };

  const handleAutocomplete = async (query, setSuggestions) => {
    if (query.length > 3) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
        query
      )}&countrycodes=AR&limit=5`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.length > 0) {
          setSuggestions(data);
        }
      } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
      }
    }
  };

  const handleSuggestionClick = (
    suggestion,
    setCoords,
    setSuggestions,
    field
  ) => {
    const { lat, lon, display_name } = suggestion;
    setCoords({ lat, lon });
    setRutaData((prev) => ({ ...prev, [field]: display_name }));
    setSuggestions([]);
  };

  const submitRoute = async () => {
    const routeData = {
      conductor: rutaData.conductor,
      dni_conductor: rutaData.conductorDni,
      latitudA: desdeCoords.lat,
      longitudA: desdeCoords.lon,
      latitudB: hastaCoords.lat,
      longitudB: hastaCoords.lon,
      trazado,
      estado: "pendiente",
      distancia_total_km: distanciaTotal,
      id_gerente: 1, // Cambia esto si es necesario
    };

    try {
      await axios.post(`${API_BASE_URL}/rutas`, routeData);
      Swal.fire({
        title: "¡Ruta enviada!",
        text: "La ruta se ha enviado al servidor.",
        icon: "success",
      });
      navigate("/"); // Navegar a otra ruta después de enviar
    } catch (error) {
      console.error("Error al enviar la ruta:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al enviar la ruta.",
        icon: "error",
      });
    }
  };

  return (
    <div className="add-route">
      <h2>Crear Nueva Ruta</h2>
      <form onSubmit={handleAddRoute}>
        <input
          type="text"
          name="desde"
          placeholder="Punto de partida"
          value={rutaData.desde}
          onChange={handleInputChange}
          required
        />
        {suggestionsDesde.length > 0 && (
          <ul className="suggestions">
            {suggestionsDesde.map((suggestion, index) => (
              <li
                key={index}
                onClick={() =>
                  handleSuggestionClick(
                    suggestion,
                    setDesdeCoords,
                    setSuggestionsDesde,
                    "desde"
                  )
                }
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}

        <input
          type="text"
          name="hasta"
          placeholder="Destino"
          value={rutaData.hasta}
          onChange={handleInputChange}
          required
        />
        {suggestionsHasta.length > 0 && (
          <ul className="suggestions">
            {suggestionsHasta.map((suggestion, index) => (
              <li
                key={index}
                onClick={() =>
                  handleSuggestionClick(
                    suggestion,
                    setHastaCoords,
                    setSuggestionsHasta,
                    "hasta"
                  )
                }
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
        <select
          name="conductor"
          className="conductor-route-create"
          required
          onChange={(e) =>
            setRutaData((prev) => ({
              ...prev,
              conductor: e.target.selectedOptions[0].text,
              conductorDni: e.target.value,
            }))
          }
        >
          <option value="" selected disabled>
            Selecciona un conductor
          </option>
          {conductores.map((conductor) => (
            <option key={conductor.dni} value={conductor.dni}>
              {conductor.nombre} ({conductor.dni})
            </option>
          ))}
        </select>
        <input id="submit-ruta" type="submit" value="Crear Ruta" />
        <button type="button" onClick={submitRoute}>
          Enviar Ruta
        </button>
      </form>

      <div
        id="map"
        style={{ height: "400px", width: "100%", marginTop: "20px" }}
      ></div>
    </div>
  );
}

export default RouteCreate;
