import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RutinasApi, EjerciciosApi } from '../api/api';

import EjercicioForm from '../components/EjercicioForm';

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];


const defaultEjercicio = {
    nombre: '',
    dia_semana: DIAS_SEMANA[0],
    series: 3,
    repeticiones: 10,
    peso: null,
    notas: '',
    orden: 1,
};

const RutinaForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const editando = !!id;

    const [listaEjercicios, setListaEjercicios] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        ejercicios: [defaultEjercicio],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Carga de Datos
    useEffect(() => {
        if (editando) {
            setLoading(true);
            RutinasApi.getRutinaById(id)
                .then(res => {
                    const loadedRutina = res.data;
                    const ejercicios = loadedRutina.ejercicios.map(ej =>({
                        id: ej.id,
                        ...ej,
                        peso: ej.peso != null ? parseFloat(ej.peso) : null
                    }));
                    setFormData({
                        nombre: loadedRutina.nombre,
                        descripcion: loadedRutina.descripcion,
                        ejercicios: ejercicios,
                    });
                    setListaEjercicios(ejercicios);
                })
                .catch(err => {
                    console.error("Error al cargar rutina para edición:", err);
                    setError("No se pudo cargar la rutina.");
                })
                .finally(() => setLoading(false));
        }
    }, [id, editando]);


    // Handlers de la Rutina
    const handleRutinaChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Agregar ejercicio de la rutina
    const addEjercicio = () => {
        setFormData(prev => ({
            ...prev,
            ejercicios: [...prev.ejercicios, { ...defaultEjercicio, orden: prev.ejercicios.length + 1 }],
        }));
    };

    // Eliminar un ejercicio
    const removeEjercicio = (index) => {
        setFormData(prev => ({
            ...prev,
            ejercicios: prev.ejercicios.filter((_, i) => i !== index),
        }));
    };

    // Actualizar un ejercicio
    const handleEjercicioChange = (index, e) => {
        const { name, value, type } = e.target;
        
        setFormData(prev => {
            const updatedEjercicios = prev.ejercicios.map((ej, i) => {
                if (i === index) {
                    let newValue = value;
                    if (type === 'number') {
                        if (name === 'peso' && value === '') {
                             newValue = null; 
                        } else if (name === 'peso') {
                             newValue = parseFloat(value);
                        } else {
                            newValue = parseInt(value, 10) || 0;
                        }
                    }

                    return { ...ej, [name]: newValue };
                }
                return ej;
            });
            return { ...prev, ejercicios: updatedEjercicios };
        });
    };

    // Handler del Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const datosRutina = {
                nombre: formData.nombre,
                descripcion: formData.descripcion || null, 
            };
            const ejerciciosValidados = formData.ejercicios.filter(
                ej => ej.nombre && ej.dia_semana && ej.series > 0 && ej.repeticiones > 0
            );

            if (editando) {
                // Actualizar datos de la rutina
                await RutinasApi.updateRutina(id, datosRutina);
                
                const initialIds = listaEjercicios.map(ej => ej.id).filter(id => id !== undefined);
                const currentIds = ejerciciosValidados.map(ej => ej.id).filter(id => id !== undefined);
                const deletedIds = initialIds.filter(id => !currentIds.includes(id));

                // Eliminar ejercicios borrados
                const deletePromises = deletedIds.map(ejId => 
                    EjerciciosApi.deleteEjercicio(ejId)
                );
                
                await Promise.all(deletePromises);

                const crudPromises = ejerciciosValidados.map(ej => {
                    const datosEjercicio = {
                        nombre: ej.nombre,
                        dia_semana: ej.dia_semana,
                        series: ej.series,
                        repeticiones: ej.repeticiones,
                        peso: ej.peso,
                        notas: ej.notas,
                        orden: ej.orden,
                    };

                    // Actualizar un ejercicio (sino existe lo crea)
                    if (ej.id) {
                        return EjerciciosApi.updateEjercicio(ej.id, datosEjercicio);
                    } else {
                        return EjerciciosApi.addEjercicio(id, datosEjercicio);
                    }
                });
                
                await Promise.all(crudPromises);
            } else {
                const dataRutina = {
                    ...datosRutina,
                    ejercicios: ejerciciosValidados.map(({ id: exerciseId, rutina_id, ...rest }) => rest)
                };
                await RutinasApi.createRutina(dataRutina);
            }
            alert(editando ? "Rutina actualizada con éxito." : "Rutina creada con éxito.");
            navigate('/');
                 
        } catch (err) {
            console.error("Error al guardar/sincronizar:", err.response?.data || err);
            const errorMsg = err.response?.data?.detail || "Error desconocido al guardar la rutina.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Renderizado
    if (loading && editando) return <div>Cargando datos de la rutina...</div>;

    return (
        <form onSubmit={handleSubmit}>
            <h3>{editando ? `Editar Rutina: ${formData.nombre}` : 'Crear Nueva Rutina'}</h3>
            
            {error && <div style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{error}</div>}

            {/* Campos de la Rutina */}
            <div>
                <label>Nombre:</label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleRutinaChange}
                    required
                />
            </div>
            <div>
                <label>Descripción:</label>
                <textarea
                    name="descripcion"
                    value={formData.descripcion || ''}
                    onChange={handleRutinaChange}
                />
            </div>

            <hr />

            {/* Lista de Ejercicios Anidados */}
            <h4>Ejercicios ({formData.ejercicios.length})</h4>
            {formData.ejercicios.map((ejercicio, index) => (
                <div key={index} style={{ border: '1px solid #ccc', padding: '15px', margin: '10px 0' }}>
                    
                    {/* Componente para el formulario de Ejercicio */}
                    <EjercicioForm
                        ejercicio={ejercicio}
                        index={index}
                        onChange={handleEjercicioChange}
                        onRemove={removeEjercicio}
                    />

                </div>
            ))}
            
            <button type="button" onClick={addEjercicio} disabled={loading}>
                + Agregar Otro Ejercicio
            </button>

            <br /><br />
            <button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : (editando ? 'Guardar Cambios' : 'Crear Rutina')}
            </button>
        </form>
    );
};

export default RutinaForm;