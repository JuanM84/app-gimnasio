import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const EjercicioForm = ({ ejercicio, index, onChange, onRemove, errors }) => {

    const handleChange = (e) => {
        onChange(index, e);
    };
    const getErrorProps = (fieldName) => ({
        error: !!(errors && errors[fieldName]),
        helperText: errors && errors[fieldName],
    });

    return (
        <Box
            sx={{
                border: '1px solid #ffffff',
                p: 2,
                mb: 2,
                borderRadius: 1,
                background: `linear-gradient(to right, #f4f5e9ff, #b1ccf8ff)`
            }}
        >            <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 9 }}>
                    <h4>Ejercicio {index + 1}</h4>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }} sx={{ textAlign: { sm: 'right' } }}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => onRemove(index)}
                        size="small"
                    >
                        Eliminar
                    </Button>
                </Grid>

                {/* Fila 1: Nombre y Día */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label="Nombre Ejercicio"
                        name="nombre"
                        value={ejercicio.nombre}
                        onChange={handleChange}
                        required
                        size="small"
                        {...getErrorProps('nombre')}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small" required>
                        <InputLabel>Día</InputLabel>
                        <Select
                            name="dia_semana"
                            value={ejercicio.dia_semana}
                            label="Día"
                            onChange={handleChange}
                        >
                            {DIAS_SEMANA.map(day => (
                                <MenuItem key={day} value={day}>{day}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Fila 2: Series, Repeticiones, Peso */}
                <Grid size={{ xs: 4 }}>
                    <TextField
                        fullWidth
                        label="Series"
                        type="number"
                        name="series"
                        value={ejercicio.series || 0}
                        onChange={handleChange}
                        inputProps={{ min: 1 }}
                        required
                        size="small"
                        {...getErrorProps('series')}
                    />
                </Grid>
                <Grid size={{ xs: 4 }}>
                    <TextField
                        fullWidth
                        label="Repeticiones"
                        type="number"
                        name="repeticiones"
                        value={ejercicio.repeticiones || 0}
                        onChange={handleChange}
                        inputProps={{ min: 1 }}
                        required
                        size="small"
                        {...getErrorProps('repeticiones')}
                    />
                </Grid>
                <Grid size={{ xs: 4 }}>
                    <TextField
                        fullWidth
                        label="Peso (kg)"
                        type="number"
                        name="peso"
                        value={ejercicio.peso === null ? '' : ejercicio.peso}
                        onChange={handleChange}
                        inputProps={{ min: 0, step: 0.5 }}
                        size="small"
                        {...getErrorProps('peso')}
                    />
                </Grid>

                {/* Fila 3: Notas y Orden */}
                <Grid size={{ xs: 12, sm: 9 }}>
                    <TextField
                        fullWidth
                        label="Notas"
                        name="notas"
                        value={ejercicio.notas || ''}
                        onChange={handleChange}
                        size="small"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                    <TextField
                        fullWidth
                        label="Orden"
                        type="number"
                        name="orden"
                        value={ejercicio.orden || 1}
                        onChange={handleChange}
                        inputProps={{ min: 1 }}
                        required
                        size="small"
                        {...getErrorProps('orden')}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default EjercicioForm;