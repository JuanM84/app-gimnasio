import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <Box
            sx={{
                minHeight: '50vh',
                color: 'black',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '40px'
            }}
        >
            <main>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'black', marginBottom: 2 }}>
                    App de Rutinas
                </Typography>
                <Box
            sx={{
                color: 'black',
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px'
            }}
            >
                <Link to="/crear">Crear Rutina</Link>
                <Link to="/rutinas">Listado de Rutinas</Link> 
            </Box>
            </main>
        </Box>
    );
}

export default Home;