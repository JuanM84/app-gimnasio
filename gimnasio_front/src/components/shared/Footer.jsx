import React from 'react';
import {
    Box,
    Grid,
    Typography,

} from '@mui/material'

import Divider from '@mui/material/Divider';

const FooterSection = () => (
    <Box
        component="footer"
        sx={{
            paddingY: 5,
            backgroundColor: '#e6e6faff',
            width: '100%',
        }}
    >
        {/* Contenido centrado y limitado internamente */}
        <Box
            maxWidth="lg"
            sx={{
                marginX: 'auto',
                paddingX: { xs: 2, md: 4, lg: 8, xl: 16 },
                width: '100%',
            }}
        >
            <Grid container spacing={2} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                {/* Columna 1: Logo y descripción */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'center' }, gap: 2 }}>
                        <Typography sx={{ color: '#313198ff' }}>
                            Programación IV
                        </Typography>
                        <Typography sx={{ color: '#313198ff' }}>
                            UTN Regional Paraná
                        </Typography>
                    </Box>
                </Grid>

                {/* Columna 2: Contacto */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle1" component="h4" sx={{ fontWeight: 'bold', color: 'black', marginBottom: 1 }}>
                        Contacto
                    </Typography>
                    <Typography component="a" href="mailto:panchis.fc@gmail.com" sx={{ display: 'block', fontSize: '0.9rem', color: 'text.secondary', textDecoration: 'none', '&:hover': { color: '#313198ff' } }}>
                        jmgonzalez.parana@gmail.com
                    </Typography>
                    <Typography component="a" href="tel:+543434559356" sx={{ display: 'block', fontSize: '0.9rem', color: 'text.secondary', textDecoration: 'none', '&:hover': { color: '#313198ff' } }}>
                        +54 343 455 9356
                    </Typography>
                </Grid>

                {/* Columna 3: Síguenos */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle1" component="h4" sx={{ fontWeight: 'bold', color: '#313198ff', marginBottom: 1 }}>
                        Repositorio
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                        <Typography component="a" href="https://github.com/JuanM84/app-gimnasio/" target="_blank" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'ochre.main' } }}>
                            GitHub
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            {/* Derechos de Autor */}
            <Divider sx={{ marginTop: 5, marginBottom: 2 }} />
            <Box sx={{ textAlign: 'center', fontSize: '0.75rem', color: '#313198ff', opacity: 0.8 }}>
                <Typography variant="caption">
                    © 2025 Juan Manuel Gonzalez. Todos los derechos reservados.
                </Typography>
            </Box>
        </Box>
    </Box>
);
export default FooterSection;