import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import FondoHome from '../assets/fondo-home.jpg'

const Home = () => {
    return (
        <Box
            sx={{
                minHeight: '80vh',
                color: 'black',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                justifyContent: 'center',
                paddingLeft: '30px',
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url(${FondoHome})`
            }}
        >
            <main>
                <Typography variant="h4" component="h1" sx={{ fontSize: '4em', fontWeight: 'bold', color: 'white', marginBottom: 2 }}>
                    App de Rutinas
                </Typography>
                <Box
                    sx={{
                        color: 'black',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '10px',
                        gap: 2,
                    }}
                >
                    <Link to="/crear" style={{ textDecoration: "none", color: "#c2c1c1ff" }}>Crear Rutina</Link>
                    <Link to="/rutinas" style={{ textDecoration: "none", color: "#c2c1c1ff" }}>Listado de Rutinas</Link>
                </Box>
            </main>
        </Box>
    );
}

export default Home;