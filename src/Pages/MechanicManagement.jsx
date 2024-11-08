import React, { useState, useEffect } from 'react';
import './MechanicManagement.css'; // Asegúrate de que el CSS está adaptado para el nuevo diseño
import Navbar from '../components/NavBar';
import axios from 'axios';
import { API_BASE_URL } from '../assets/config';

function MechanicManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMecanicos, setFilteredMecanicos] = useState([]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/mecanicos`)
            .then(response => setFilteredMecanicos(response.data))
            .catch(error => console.error('Error al obtener los mecánicos:', error));
    }, []);

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        filterMecanicos(term);
    };

    const filterMecanicos = (term) => {
        const filtered = filteredMecanicos.filter(mecanico =>
            mecanico.nombre.toLowerCase().includes(term.toLowerCase()) ||
            mecanico.apellido.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredMecanicos(filtered);
    };

    return (
        <div className="mechanic-management-container">
            <Navbar />
            <h2 className="title">Gestión de Mecánicos</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar por nombre o apellido..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="mechanic-search-input"
                />
            </div>
            
            <div className="mechanic-list">
                {filteredMecanicos.length > 0 ? (
                    filteredMecanicos.map(mecanico => (
                        <div key={mecanico.id} className="mechanic-card">
                            <p><strong>Nombre:</strong> {mecanico.nombre} {mecanico.apellido}</p>
                            <p><strong>Teléfono:</strong> {mecanico.telefono}</p>
                            <p><strong>Correo Electrónico:</strong> {mecanico.correo_electronico}</p>
                            <p><strong>Especialidad:</strong> {mecanico.especialidad}</p>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron mecánicos.</p>
                )}
            </div>
        </div>
    );
}

export default MechanicManagement;
