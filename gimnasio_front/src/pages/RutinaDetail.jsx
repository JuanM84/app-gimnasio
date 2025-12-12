import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RutinasApi } from '../api/api';

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

    if (loading) return (
        <Container sx={{ textAlign: 'center', mt: 8 }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>Cargando detalles...</Typography>
        </Container>
    );

    if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
    if (!rutina) return <Container sx={{ mt: 4 }}><Alert severity="warning">Rutina no encontrada.</Alert></Container>;

    const ejerciciosPorDia = ordenEjerciciosPorDia(rutina.ejercicios);
    const diasConEjercicios = Object.keys(ejerciciosPorDia);

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold'}}>
                    {rutina.nombre}
                </Typography>

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

            {diasConEjercicios.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>Esta rutina no tiene ejercicios asignados.</Alert>
            ) : (
                <Box>
                    {DIAS_SEMANA_ORDENADO.map(dia => {
                        const ejerciciosDelDia = ejerciciosPorDia[dia];

                        if (!ejerciciosDelDia || ejerciciosDelDia.length === 0) {
                            return null;
                        }

                        return (
                            <Accordion key={dia} defaultExpanded sx={{ background: `linear-gradient(to right, #f4f5e9ff, #b1ccf8ff)`}}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography variant="h6">📅 {dia} ({ejerciciosDelDia.length} Ejercicios)</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <List dense>
                                        {ejerciciosDelDia.map((ej, index) => (
                                            <ListItem
                                                key={ej.id || index} // Usar el ID del ejercicio si existe, o el índice
                                                disablePadding
                                                sx={{ mb: 1, borderLeft: '4px solid #1976d2', pl: 1 }}
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
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </Box>
            )}
        </Container>
    );
};

export default RutinaDetail;