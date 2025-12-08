import React from 'react';
import { Link } from 'react-router-dom';
import { RutinasApi } from '../api/api';

const RutinaCard = ({ rutina, onDeleteSuccess }) => {
    
    const handleDelete = async () => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar la rutina "${rutina.nombre}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            await RutinasApi.deleteRutina(rutina.id);
            onDeleteSuccess(); 
            alert(`Rutina "${rutina.nombre}" eliminada correctamente.`);
        } catch (error) {
            console.error("Error al eliminar rutina:", error);
            alert("Hubo un error al intentar eliminar la rutina.");
        }
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}>
            <h4>{rutina.nombre}</h4>
            <p>{rutina.descripcion ? rutina.descripcion.substring(0, 100) + '...' : 'Sin descripción.'}</p>
            
            <Link to={`/rutinas/${rutina.id}`}>
                <button style={{ marginRight: '10px' }}>Ver Detalle</button>
            </Link>
            
            <Link to={`/editar/${rutina.id}`}>
                <button style={{ marginRight: '10px' }}>Editar</button>
            </Link>

            <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>
                Eliminar
            </button>
        </div>
    );
};

export default RutinaCard;