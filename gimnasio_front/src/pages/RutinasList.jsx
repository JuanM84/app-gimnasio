/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RutinasApi } from '../api/api';
import SearchBar from '../components/shared/SearchBar';
import RutinaCard from '../components/RutinaCard';

import { debounce } from 'lodash-es';

import { Container, Typography, Button, Box, Grid, Alert, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';


const RutinasList = () => {
    const [rutinas, setRutinas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [buscando, setBuscando] = useState(false);

    const fetchRutinas = async (term) => {
        setBuscando(true);
        setError(null);
        try {
            const response = await RutinasApi.getRutinas(term);
            setRutinas(response.data);
        } catch (err) {
            console.error("Error al obtener rutinas:", err);
            setError("No se pudieron cargar las rutinas. Intenta recargar.");
        } finally {
            setBuscando(false);
            if (loading) setLoading(false);
        }
    };

    const fetchRutinasCallback = useCallback((term) => {
        fetchRutinas(term);
    }, []);

    const debouncedFetchRutinas = useMemo(() => {
        return debounce(fetchRutinasCallback, 400);
    }, [fetchRutinasCallback]);


    useEffect(() => {
        if (searchTerm === '') {
            fetchRutinas(searchTerm);
        }

        return () => {
            debouncedFetchRutinas.cancel();
        };
    }, []);

    useEffect(() => {
        if (searchTerm !== '') {
            debouncedFetchRutinas(searchTerm);
        } else {
            fetchRutinas('');
        }
    }, [searchTerm, debouncedFetchRutinas]);

    if (loading) return (
        <Container sx={{ textAlign: 'center', mt: 8 }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>Cargando rutinas iniciales...</Typography>
        </Container>
    );

    if (error) return (
        <Container sx={{ mt: 4 }}>
            <Alert severity="error">{error}</Alert>
        </Container>
    );

    return (
        <Container 
            component="main" 
            sx={{
                mt: 4, 
                mb: 4,
            }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Rutinas de Entrenamiento
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    flexDirection: { xs: 'column', sm: 'row' }
                }}
            >
                <Box sx={{ width: { xs: '100%', sm: 'auto' }, mb: { xs: 2, sm: 0 } }}>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/crear"
                        startIcon={<AddIcon />}
                        sx={{ margin: '10px' }}
                    >
                        Crear Nueva Rutina
                    </Button>
                    <SearchBar
                        onSearchChange={setSearchTerm}
                        value={searchTerm}
                    />
                </Box>
            </Box>


            {rutinas.length === 0 && !buscando ? (
                <Alert severity="info" sx={{ mt: 3 }}>
                    No se encontraron rutinas {searchTerm && `para el término "${searchTerm}"`}.
                    ¡Crea una nueva!
                </Alert>
            ) : (
                <Grid container spacing={3}>
                    {rutinas.map((rutina) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={rutina.id}>
                            <RutinaCard
                                rutina={rutina}
                                onDeleteSuccess={() => fetchRutinas(searchTerm)}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default RutinasList;