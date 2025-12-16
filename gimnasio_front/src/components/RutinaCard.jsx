import React from 'react';
import { Link } from 'react-router-dom';

import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

const RutinaCard = ({ rutina, onDeleteStart }) => {
    
    const handleButtonClick = () => {
        // Llama a la función del padre (RutinasList) y le pasa la rutina que se quiere eliminar
        if (onDeleteStart) {
            onDeleteStart(rutina);
        }
    };

    const formattedDate = rutina.fecha_creacion 
        ? new Date(rutina.fecha_creacion).toLocaleDateString()
        : 'N/A';

    return (
        <Card sx={{ minWidth: 275, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {rutina.nombre}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Creada: {formattedDate}
                </Typography>
                <Typography variant="body2">
                    {rutina.descripcion 
                        ? (rutina.descripcion.length > 150 ? rutina.descripcion.substring(0, 150) + '...' : rutina.descripcion)
                        : 'Sin descripción.'}
                </Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 2 }}>
                
                {/* Botón Ver Detalle */}
                <Button 
                    size="small" 
                    component={Link} 
                    to={`/rutinas/${rutina.id}`}
                    startIcon={<VisibilityIcon />}
                >
                    Ver
                </Button>
                
                {/* Botón Editar */}
                <Button 
                    size="small" 
                    component={Link} 
                    to={`/editar/${rutina.id}`}
                    startIcon={<EditIcon />}
                    color="secondary"
                >
                    Editar
                </Button>

                {/* Botón Eliminar */}
                <Button 
                    size="small" 
                    onClick={handleButtonClick} 
                    color="error"
                    startIcon={<DeleteIcon />}
                >
                    Eliminar
                </Button>
            </CardActions>
        </Card>
    );
};

export default RutinaCard;