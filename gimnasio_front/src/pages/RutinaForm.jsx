import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RutinasApi, EjerciciosApi } from '../api/api';
import EjercicioForm from '../components/EjercicioForm';
import { Container, Typography, TextField, Button, Box, Alert, Grid, Divider } from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';


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

    const [listaEjerciciosInicial, setlistaEjerciciosInicial] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        ejercicios: [defaultEjercicio],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (editando) {
            setLoading(true);
            RutinasApi.getRutinaById(id)
                .then(res => {
                    const loadedRutina = res.data;
                    const ejercicios = loadedRutina.ejercicios.map(ej => ({
                        id: ej.id,
                        nombre: ej.nombre,
                        dia_semana: ej.dia_semana,
                        series: ej.series,
                        repeticiones: ej.repeticiones,
                        peso: ej.peso !== null ? parseFloat(ej.peso) : null,
                        notas: ej.notas,
                        orden: ej.orden,
                    }));
                    setFormData({
                        nombre: loadedRutina.nombre,
                        descripcion: loadedRutina.descripcion,
                        ejercicios: ejercicios,
                    });
                    setlistaEjerciciosInicial(ejercicios);
                })
                .catch(err => {
                    console.error("Error al cargar rutina para edición:", err);
                    setError("No se pudo cargar la rutina.");
                })
                .finally(() => setLoading(false));
        }
    }, [id, editando]);

    // Validaciones
    const validarForm = () => {
        let errors = {};
        let esValido = true;
        let mainErrorMessage = '';

        // Validar Campos de la Rutina
        if (!formData.nombre.trim()) {
            errors.nombre = 'El nombre de la rutina es obligatorio.';
            esValido = false;
        }

        // Validar Campos de los Ejercicios
        const ejerciciosValidados = [];
        const exerciseErrors = formData.ejercicios.map((ej) => {
            let ejErrors = {};

            if (!ej.nombre || !ej.nombre.trim()) {
                ejErrors.nombre = 'El nombre es obligatorio';
                esValido = false;
            }
            if (ej.series === null || ej.series <= 0) {
                ejErrors.series = 'Debe ser un entero mayor a 0';
                esValido = false;
            }
            if (ej.repeticiones === null || ej.repeticiones <= 0) {
                ejErrors.repeticiones = 'Debe ser un entero mayor a 0';
                esValido = false;
            }
            if (ej.peso !== null && ej.peso <= 0) {
                ejErrors.peso = 'El peso debe ser mayor a 0 kg (o dejar vacío para peso corporal).';
                esValido = false;
            }
            if (ej.orden === null || ej.orden <= 0) {
                ejErrors.orden = 'Mínimo 1.';
                esValido = false;
            }
            if (Object.keys(ejErrors).length === 0) {
                const datosLimpios = {
                    ...(ej.id && { id: ej.id }),
                    nombre: ej.nombre.trim(),
                    dia_semana: ej.dia_semana,
                    series: ej.series,
                    repeticiones: ej.repeticiones,
                    peso: ej.peso !== '' ? ej.peso : null,
                    notas: ej.notas || null,
                    orden: ej.orden,
                };
                ejerciciosValidados.push(datosLimpios);
            }

            return Object.keys(ejErrors).length > 0 ? ejErrors : null;
        });
        if (exerciseErrors.some(err => err !== null)) {
            errors.ejercicios = exerciseErrors;
            mainErrorMessage = "Por favor, revisa los errores en la lista de ejercicios."
        } else if (ejerciciosValidados.length === 0) {
            mainErrorMessage = "La rutina debe contener al menos un ejercicio válido.";
            esValido = false;
        }

        if (!esValido && !mainErrorMessage) {
            mainErrorMessage = "Por favor, revisa y corrige los campos marcados en rojo.";
        }

        setFormErrors(errors);
        return { esValido, mainErrorMessage, ejerciciosValidados };
    };

    const handleRutinaChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Limpiar para ReValidar
        setFormErrors(prev => {
            const newErrors = { ...prev };
            if (newErrors[name]) delete newErrors[name];
            return newErrors;
        });
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
                        if (name === 'peso') {
                            newValue = value === '' ? null : parseFloat(value);
                        } else {
                            const parsedInt = parseInt(value, 10);
                            newValue = isNaN(parsedInt) ? null : parsedInt;
                        }
                    }
                    return { ...ej, [name]: newValue };
                }
                return ej;
            });
            setFormErrors(prevErrors => {
                const newExerciseErrors = prevErrors.ejercicios ? [...prevErrors.ejercicios] : [];
                if (newExerciseErrors[index] && newExerciseErrors[index][name]) {
                    delete newExerciseErrors[index][name];
                }
                if (newExerciseErrors[index] && Object.keys(newExerciseErrors[index]).length === 0) {
                    newExerciseErrors[index] = null;
                }
                return { ...prevErrors, ejercicios: newExerciseErrors };
            });

            return { ...prev, ejercicios: updatedEjercicios };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { esValido, mainErrorMessage, ejerciciosValidados } = validarForm();

        if (!esValido) {
            setError(mainErrorMessage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const datosRutina = {
                nombre: formData.nombre,
                descripcion: formData.descripcion || null,
            };

            if (editando) {
                await RutinasApi.updateRutina(id, datosRutina);

                const initialIds = listaEjerciciosInicial.map(ej => ej.id).filter(id => id !== undefined);
                const currentIds = ejerciciosValidados.map(ej => ej.id).filter(id => id !== undefined);
                const deletedIds = initialIds.filter(id => !currentIds.includes(id));

                const deletePromises = deletedIds.map(ejId =>
                    EjerciciosApi.deleteEjercicio(ejId)
                );
                await Promise.all(deletePromises);

                const crudPromises = ejerciciosValidados.map(ej => {
                    // Quitamos el ID para el POST (creación)
                    const { id: ejId, ...datosEjercicio } = ej;
                    if (ejId) {
                        // Si tiene ID, es una actualización
                        return EjerciciosApi.updateEjercicio(ejId, datosEjercicio);
                    } else {
                        // Si NO tiene ID, es una nueva creación anidada
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
            navigate('/rutinas');

        } catch (err) {
            console.error("Error al guardar/sincronizar:", err);

            let message = "Error desconocido al guardar la rutina.";
            
            if (err.response && err.response.data && err.response.data.detail) {
                message = `Error de API: ${err.response.data.detail}`;
            } else if (err.code === 'ERR_NETWORK') {
                message = "Error de conexión: El servidor (Backend) no responde. Verifica si está encendido y si la configuración CORS es correcta.";
            } else {
                message = "Error desconocido al comunicarse con el servidor.";
            }

            setError(message);
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
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Nombre de la Rutina"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleRutinaChange}
                            required
                            error={!!formErrors.nombre}
                            helperText={formErrors.nombre}
                        />
                    </Grid>
                    {/* Descripción */}
                    <Grid size={{ xs: 12, sm: 6 }}>
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

                <Typography variant="h6" gutterBottom>Lista de Ejercicios ({formData.ejercicios.length})</Typography>

                {/* Lista de Ejercicios */}
                {formData.ejercicios.map((ejercicio, index) => (
                    <EjercicioForm
                        key={index}
                        ejercicio={ejercicio}
                        index={index}
                        onChange={handleEjercicioChange}
                        onRemove={removeEjercicio}
                        errors={formErrors.ejercicios ? formErrors.ejercicios[index] : null}
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