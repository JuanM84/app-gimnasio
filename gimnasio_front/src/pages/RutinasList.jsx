import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RutinasApi } from '../api/api';
import SearchBar from '../components/shared/SearchBar'; 
import RutinaCard from '../components/RutinaCard'; 
// (Asumimos el uso de Material UI para componentes)

const RutinasList = () => {
    const [rutinas, setRutinas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchRutinas = async (term) => {
        setLoading(true);
        setError(null);
        try {
            const response = await RutinasApi.getRutinas(term);
            setRutinas(response.data);
        } catch (err) {
            console.error("Error al obtener rutinas:", err);
            setError("No se pudieron cargar las rutinas. Intenta recargar.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRutinas(searchTerm);
    }, [searchTerm]);

    if (loading) return <div>Cargando rutinas...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div>
            <h2>🏋️ Listado de Rutinas</h2>
            <SearchBar onSearchChange={setSearchTerm} />

            <Link to="/crear">
                <button>+ Crear Nueva Rutina</button>
            </Link>

            {rutinas.length === 0 ? (
                <p>No se encontraron rutinas.</p>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {rutinas.map((rutina) => (
                        <RutinaCard key={rutina.id} rutina={rutina} onDeleteSuccess={() => fetchRutinas(searchTerm)} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RutinasList;