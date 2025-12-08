import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RutinasApi } from '../api/api';

const DIAS_SEMANA_ORDENADO = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const RutinaDetail = () => {
    const { id } = useParams();
    const [rutina, setRutina] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRutina = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await RutinasApi.getRutinaById(id);
                setRutina(res.data);
            } catch (err) {
                console.error("Error al cargar detalle de rutina:", err);
                setError("No se pudo cargar la rutina o no existe.");
            } finally {
                setLoading(false);
            }
        };
        fetchRutina();
    }, [id]);

    const OrdenarEjerciciosPorDia = (ejercicios) => {
        if (!ejercicios) return {};

        // Por día
        const agrupados = ejercicios.reduce((acc, ejercicio) => {
            const dia = ejercicio.dia_semana;
            if (!acc[dia]) {
                acc[dia] = [];
            }
            acc[dia].push(ejercicio);
            return acc;
        }, {});

        // Por Orden
        for (const dia in agrupados) {
            agrupados[dia].sort((a, b) => a.orden - b.orden);
        }

        return agrupados;
    };

    if (loading) return <div>Cargando detalle de rutina...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
    if (!rutina) return <div>Rutina no encontrada.</div>;

    const ejercicioPorDia = OrdenarEjerciciosPorDia(rutina.ejercicios);

    return (
        <div style={{ padding: '20px' }}>
            <h1>💪 {rutina.nombre}</h1>
            <p><strong>Descripción:</strong> {rutina.descripcion || 'Sin descripción.'}</p>
            <p>Creada el: {new Date(rutina.fecha_creacion).toLocaleDateString()}</p>
            
            <div style={{ marginBottom: '20px' }}>
                <Link to={`/editar/${rutina.id}`}>
                    <button>✏️ Editar Rutina</button>
                </Link>
            </div>

            <hr />

            <h2>Plan de Entrenamiento por Día</h2>
            
            {DIAS_SEMANA_ORDENADO.map(dia => {
                const ejerciciosDelDia = ejercicioPorDia[dia];

                if (!ejerciciosDelDia || ejerciciosDelDia.length === 0) {
                    return null;
                }

                return (
                    <div key={dia} style={{ marginTop: '15px', borderLeft: '3px solid blue', paddingLeft: '10px' }}>
                        <h3>📅 {dia}</h3>
                        
                        <ol>
                            {ejerciciosDelDia.map((ej, index) => (
                                <li key={index} style={{ marginBottom: '10px' }}>
                                    <strong>{ej.nombre}</strong> (Orden: {ej.orden})
                                    <ul>
                                        <li>Series: {ej.series}</li>
                                        <li>Repeticiones: {ej.repeticiones}</li>
                                        <li>Peso: {ej.peso !== null ? `${ej.peso} kg` : 'Peso Corporal'}</li>
                                        {ej.notas && <li>Notas: {ej.notas}</li>}
                                    </ul>
                                </li>
                            ))}
                        </ol>
                    </div>
                );
            })}
        </div>
    );
};

export default RutinaDetail;