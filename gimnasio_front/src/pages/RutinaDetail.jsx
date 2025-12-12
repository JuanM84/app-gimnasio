import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RutinasApi, EjerciciosApi } from '../api/api';

import {
    Container,
    Typography,
    Box,
    Button,
    CircularProgress,
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    Chip,
    Divider
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';

// Importación de la librería DND compatible
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const DIAS_SEMANA_ORDENADO = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

// Función para reordenar un array (DND)
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const RutinaDetail = () => {
    const { id } = useParams();
    const [rutina, setRutina] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedPanel, setExpandedPanel] = useState(null);
    // DND
    const [ordenModificado, setOrdenModificado] = useState(false);

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

    const ordenEjerciciosPorDia = (ejercicios) => {
        if (!ejercicios) return {};

        const agrupado = ejercicios.reduce((acc, ejercicio) => {
            const dia = ejercicio.dia_semana;
            if (!acc[dia]) {
                acc[dia] = [];
            }
            acc[dia].push(ejercicio);
            return acc;
        }, {});

        for (const dia in agrupado) {
            agrupado[dia].sort((a, b) => a.orden - b.orden);
        }

        return agrupado;
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;
        // 1. Si se suelta fuera de una zona válida, ignorar
        if (!destination) {
            return;
        }
        // 2. Si se suelta en la misma posición, ignorar
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const dia = source.droppableId; // El droppableId es el día de la semana
        // 3. Crear una copia de los ejercicios agrupados para trabajar en ellos
        const ejerciciosByDay = ordenEjerciciosPorDia(rutina.ejercicios);
        const ejerciciosDelDia = ejerciciosByDay[dia];
        // 4. Reordenar el array de ejercicios para ese día
        const newOrder = reorder(
            ejerciciosDelDia,
            source.index,
            destination.index
        );
        // 5. Aplicar la nueva propiedad 'orden' (basada en el nuevo índice)
        const updatedEjercicios = newOrder.map((ej, index) => ({
            ...ej,
            orden: index + 1, // El orden es 1-based (índice + 1)
        }));
        // 6. Actualizar el estado global de la rutina con el nuevo array reordenado
        setRutina(prevRutina => ({
            ...prevRutina,
            ejercicios: prevRutina.ejercicios
                .filter(ej => ej.dia_semana !== dia) // Quitar los ejercicios viejos de ese día
                .concat(updatedEjercicios) // Añadir los ejercicios reordenados
        }));
        // 7. Habilitar el botón de guardar
        setOrdenModificado(true);
    };

    const handleGuardarOrden = async () => {
        
        if (!ordenModificado) return;
        // En este punto, 'rutina.ejercicios' tiene los nuevos valores de 'orden'.
        setLoading(true);
        setError(null);

        const putPromises = rutina.ejercicios.map(ej => {
            // Solo necesitamos enviar el ID del ejercicio y el nuevo campo 'orden'.
            const dataToSend = { orden: ej.orden };
            return EjerciciosApi.updateEjercicio(ej.id, dataToSend);
        });

        try {
            await Promise.all(putPromises);
            setOrdenModificado(false);
            console.log("El orden de los ejercicios ha sido guardado exitosamente.");
        } catch (err) {
            console.error("Error al guardar el nuevo orden:", err);
            setError("Error al guardar el orden automáticamente. Por favor, recarga la página.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (panelName) => (event, isExpanded) => {
        if(!isExpanded && expandedPanel === panelName) {
            if(ordenModificado){
                handleGuardarOrden();
            }
        }
        // Si isExpanded es true, guarda el panelName. Si es false (se está cerrando), guarda null.
        setExpandedPanel(isExpanded ? panelName : null);
    };

    if (loading) return (
        <Container sx={{ textAlign: 'center', mt: 8 }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>Cargando detalles...</Typography>
        </Container>
    );

    if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
    if (!rutina) return <Container sx={{ mt: 4 }}><Alert severity="warning">Rutina no encontrada.</Alert></Container>;

    const ejerciciosPorDia = ordenEjerciciosPorDia(rutina.ejercicios);

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    {rutina.nombre}
                </Typography>
                {/* Botón Guardar Orden (visible solo si se modificó) */}
                {ordenModificado && (
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleGuardarOrden}
                        disabled={loading}
                        sx={{ mr: 1 }}
                    >
                        Guardar Nuevo Orden
                    </Button>
                )} 
                <Button
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to={`/editar/${rutina.id}`}
                    startIcon={<EditIcon />}
                >
                    Editar Rutina
                </Button>
            </Box>

            <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Descripción:</strong> {rutina.descripcion || 'Sin descripción.'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
                Creada el: {new Date(rutina.fecha_creacion).toLocaleDateString()}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" component="h2" gutterBottom>
                Plan de Entrenamiento por Día
            </Typography>

            {/* Iniciar el contexto de Drag and Drop */}
            <DragDropContext onDragEnd={onDragEnd}>
                {ejerciciosPorDia && ejerciciosPorDia.length === 0 ? (
                    <Alert severity="info" sx={{ mt: 2 }}>Esta rutina no tiene ejercicios asignados.</Alert>
                ) : (
                    <Box>
                        {DIAS_SEMANA_ORDENADO.map(dia => {
                            const ejerciciosDelDia = ejerciciosPorDia[dia];

                            if (!ejerciciosDelDia || ejerciciosDelDia.length === 0) {
                                return null;
                            }

                            return (
                                <Accordion 
                                    key={dia}
                                    expanded={expandedPanel === dia}
                                    onChange={handleChange(dia)}
                                    sx={{ border: '1px solid #ad1515ff', mb: 1 }}
                                >
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h6">📅 {dia}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 0 }}>
                                        {/* Área donde se pueden soltar los elementos */}
                                        <Droppable droppableId={dia}>
                                            {(provided) => (
                                                <List
                                                    dense
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                >
                                                    {ejerciciosDelDia.map((ej, index) => (
                                                        <Draggable key={ej.id} draggableId={String(ej.id)} index={index} >
                                                            {(provided, snapshot) => (
                                                                <ListItem
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    sx={{
                                                                        mb: 1,
                                                                        borderLeft: '4px solid #1976d2',
                                                                        pl: 1,
                                                                        bgcolor: snapshot.isDragging ? '#e0f7fa' : 'inherit', // Resaltar si se está arrastrando
                                                                    }}
                                                                >
                                                                    <ListItemText
                                                                        primary={
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                <Typography component="span" fontWeight="bold">
                                                                                    {ej.orden}. {ej.nombre}
                                                                                </Typography>
                                                                                <Chip label={`Series: ${ej.series}`} size="small" variant="outlined" />
                                                                                <Chip label={`Reps: ${ej.repeticiones}`} size="small" variant="outlined" />
                                                                                {ej.peso !== null && <Chip label={`${ej.peso} kg`} size="small" color="primary" />}
                                                                            </Box>
                                                                        }
                                                                        secondary={ej.notas ? `Notas: ${ej.notas}` : ' '}
                                                                    />
                                                                </ListItem>
                                                            )}
                                                        </Draggable>
                                                    )
                                                    )}
                                                </List>
                                            )}
                                        </Droppable>
                                    </AccordionDetails>
                                </Accordion>
                            )
                        })}
                    </Box>
                )}
            </DragDropContext>
        </Container>
    );
};

export default RutinaDetail;