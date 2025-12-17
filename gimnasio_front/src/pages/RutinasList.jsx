import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RutinasApi } from '../api/api';
import SearchBar from '../components/shared/SearchBar';
import RutinaCard from '../components/RutinaCard';

import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

import { debounce } from 'lodash-es';

import {
    Container,
    Typography,
    Button,
    Box,
    Grid,
    CircularProgress,
    Snackbar,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Pagination,
    Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';


const RutinasList = () => {
    const [rutinas, setRutinas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [buscando, setBuscando] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 6;

    const [openDialog, setOpenDialog] = useState(false);
    const [rutinaToDelete, setRutinaToDelete] = useState(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleClickOpenDialog = (rutina) => {
        setRutinaToDelete(rutina);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setRutinaToDelete(null);
    };
    const handleDelete = async () => {
        if (!rutinaToDelete) return;

        const { id, nombre } = rutinaToDelete;
        handleCloseDialog();
        setBuscando(true);

        try {
            await RutinasApi.deleteRutina(id);

            setSnackbar({
                open: true,
                message: `Rutina "${nombre}" eliminada con éxito.`,
                severity: 'success',
            });

            fetchRutinas(searchTerm);

        } catch (err) {
            console.error("Error al eliminar la rutina:", err);

            let message = "Error desconocido al eliminar la rutina.";
            if (err.response && err.response.data && err.response.data.detail) {
                message = `Error de API: ${err.response.data.detail}`;
            } else if (err.code === 'ERR_NETWORK') {
                message = "Error de conexión: El servidor (Backend) no responde.";
            }

            setSnackbar({
                open: true,
                message: message,
                severity: 'error',
            });
            setBuscando(false);
        }
    };

    const fetchRutinas = async (term, currentPage = 1) => {
        setBuscando(true);
        setError(null);
        try {
            const offset = (currentPage - 1) * limit;
            const response = await RutinasApi.getRutinas(term, offset, limit);
            setRutinas(response.data.items);
            setTotal(response.data.total);
        } catch (err) {
            console.error("Error al obtener rutinas:", err);
            setError("No se pudieron cargar las rutinas. Intenta recargar.");
        } finally {
            setBuscando(false);
            if (loading) setLoading(false);
        }
    };
    const handlePageChange = (event, value) => {
        setPage(value);
        fetchRutinas(searchTerm, value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleSearch = (term) => {
        setSearchTerm(term);
        setPage(1);
        fetchRutinas(term, 1);
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
                <Container>
                    <Grid container spacing={3}>
                        {rutinas.map((rutina) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={rutina.id}>
                                <RutinaCard
                                    rutina={rutina}
                                    onDeleteStart={handleClickOpenDialog}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    {total > limit && (
                        <Stack sx={{ mt: 4, alignItems: 'center' }}>
                            <Pagination
                                count={Math.ceil(total / limit)}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Stack>
                    )}
                </Container>
            )}
            {/* DIÁLOGO DE CONFIRMACIÓN */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{"Confirmar Eliminación"}</DialogTitle>
                <DialogContent dividers>
                    <Typography>
                        ¿Estás seguro de que deseas eliminar la rutina: **{rutinaToDelete?.nombre}**?
                        Esta acción eliminará todos los ejercicios asociados y es irreversible.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        disabled={loading || buscando}
                        autoFocus
                    >
                        Sí, Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* SNACKBAR DE NOTIFICACIONES */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default RutinasList;