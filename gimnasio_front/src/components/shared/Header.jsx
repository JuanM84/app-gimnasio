import { AppBar, Box, Button, Divider, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const HeaderSection = () => {

    return (
        <AppBar position="sticky"
            elevation={0}
            sx={{
                backdropFilter: 'blur(3px)',
                backgroundColor: '#445a6fff',
                color: '#ababb0ff'
            }}
        >
            <Toolbar sx={{
                paddingX: { xs: 2, sm: 5 },
                justifyContent: 'space-between',
                display: 'flex',
                alignItems: 'center',
            }}>
                {/* Logo y Nombre */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            fontWeight: 'bold',
                            letterSpacing: '-0.015em',
                            color: '#ababb0ff',
                            textDecoration: 'none',
                        }}
                    >
                        Mis Rutinas
                    </Typography>
                </Box>

                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                    <Button
                        component={Link}
                        to='/rutinas'
                        sx={{ color: '#ababb0ff', fontSize: '0.875rem', fontWeight: 500, '&:hover': { color: '#8abdd4ff', backgroundColor: 'transparent' } }}
                    >
                        Lista de Rutinas
                    </Button>

                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default HeaderSection;
