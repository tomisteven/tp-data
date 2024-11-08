import  { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import flotasData from '../data/flotas.json';
import './FlotaViewer.css';

function FlotaViewer() {
    const [flotasDisponibles, setFlotasDisponibles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newFlotaName, setNewFlotaName] = useState('');

    useEffect(() => {
        setFlotasDisponibles(flotasData.flotas);
    }, []);

    const handleAddFlota = () => {
        // Comprobar si el nombre de la nueva flota ya existe, ignorando mayúsculas/minúsculas y espacios
        const flotaExists = flotasDisponibles.some(
            (flota) => flota.nombre.trim().toLowerCase() === newFlotaName.trim().toLowerCase()
        );

        if (flotaExists) {
            Swal.fire({
                title: "Error",
                text: "Ya existe una flota con este nombre.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
            return; // Detener la creación si la flota ya existe
        }

        // Crear una nueva flota si no existe duplicado
        const newFlota = {
            id: flotasDisponibles.length + 1,
            nombre: newFlotaName.trim(),
            estado: "Disponible",
            en_uso: "No",
        };
        setFlotasDisponibles([...flotasDisponibles, newFlota]);

        // Limpiar el campo de nombre
        setNewFlotaName('');

        Swal.fire({
            title: "¡Éxito!",
            text: "La flota ha sido agregada correctamente.",
            icon: "success",
            confirmButtonText: "Aceptar",
        });
    };

    const filteredFlotas = flotasDisponibles.filter(flota =>
       flota.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="add-flota-container">
            <h3>Buscar Flota</h3>
            <input
                type="text"
                placeholder="Buscar por nombre o auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flota-search-input"
            />

            <h3>Agregar Nueva Flota</h3>
            <input
                type="text"
                placeholder="Nombre de la nueva flota"
                value={newFlotaName}
                onChange={(e) => setNewFlotaName(e.target.value)}
                className="flota-name-input"
            />
            <button onClick={handleAddFlota} className="add-flota-button">
                Agregar Flota
            </button>

            <div className="flota-list">
                {filteredFlotas.length > 0 ? (
                    filteredFlotas.map(flota => (
                        <div key={flota.id} className="flota-item">
                            <p>
                                <strong>Nombre:</strong> {flota.nombre}
                            </p>
                            <p>
                                <strong>Estado:</strong> {flota.estado}
                            </p>
                            <p>
                                <strong>La flota está siendo utilizada:</strong> {flota.en_uso}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron flotas.</p>
                )}
            </div>
        </div>
    );
}

export default FlotaViewer;
