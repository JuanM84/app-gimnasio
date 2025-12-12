// src/pages/RutinaForm.jsx (Usando MUI)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RutinasApi, EjerciciosApi } from '../api/api';
import EjercicioForm from '../components/EjercicioForm';
// Importaciones de Material UI
import { Container, Typography, TextField, Button, Box, Alert, Grid, Divider } from '@mui/material';


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

    const [listaEjercicios, setlistaEjercicios] = useState([]); 
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        ejercicios: [defaultEjercicio],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
                    setlistaEjercicios(ejercicios);
                })
                .catch(err => {
                    console.error("Error al cargar rutina para edición:", err);
                    setError("No se pudo cargar la rutina.");
                })
                .finally(() => setLoading(false));
        }
    }, [id, editando]);

    const handleRutinaChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addEjercicio = () => {
        setFormData(prev => ({
            ...prev,
            ejercicios: [...prev.ejercicios, { ...defaultEjercicio, orden: prev.ejercicios.length + 1 }],
        }));
    };

    const removeEjercicio = (index) => {
        setFormData(prev => ({
            ...prev,
            ejercicios: prev.ejercicios.filter((_, i) => i !== index),
        }));
    };

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
                await RutinasApi.updateRutina(id, datosRutina);
                
                const initialIds = listaEjercicios.map(ej => ej.id).filter(id => id !== undefined);
                const currentIds = ejerciciosValidados.map(ej => ej.id).filter(id => id !== undefined);
                const deletedIds = initialIds.filter(id => !currentIds.includes(id));

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
                    // eslint-disable-next-line no-unused-vars
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


    if (loading && editando) return <Container><Typography>Cargando datos de la rutina...</Typography></Container>;

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {editando ? `Editar Rutina: ${formData.nombre}` : 'Crear Nueva Rutina'}
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Typography variant="h6" gutterBottom>Datos Generales</Typography>
                <Grid container spacing={3}>
                    {/* Nombre */}
                    <Grid size={{ xs: 12, sm: 6}}>
                        <TextField
                            fullWidth
                            label="Nombre de la Rutina"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleRutinaChange}
                            required
                        />
                    </Grid>
                    {/* Descripción */}
                    <Grid size={{ xs: 12, sm: 6}}>
                        <TextField
                            fullWidth
                            label="Descripción (Opcional)"
                            name="descripcion"
                            value={formData.descripcion || ''}
                            onChange={handleRutinaChange}
                            multiline
                            rows={1}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" gutterBottom>Ejercicios ({formData.ejercicios.length})</Typography>
                
                {/* Lista de Ejercicios */}
                {formData.ejercicios.map((ejercicio, index) => (
                    <EjercicioForm
                        key={index}
                        ejercicio={ejercicio}
                        index={index}
                        onChange={handleEjercicioChange}
                        onRemove={removeEjercicio}
                    />
                ))}
                
                <Button 
                    variant="outlined" 
                    onClick={addEjercicio} 
                    disabled={loading} 
                    sx={{ mt: 2, mb: 4 }}
                >
                    + Agregar Otro Ejercicio
                </Button>

                <Button 
                    fullWidth
                    variant="contained" 
                    color="primary"
                    type="submit" 
                    disabled={loading}
                    size="large"
                >
                    {loading ? 'Guardando...' : (editando ? 'Guardar Cambios' : 'Crear Rutina')}
                </Button>
            </Box>
        </Container>
    );
};

export default RutinaForm;