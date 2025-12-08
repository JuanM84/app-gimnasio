import React from "react";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// Paginas
import RutinasList from './pages/RutinasList';
import RutinaDetail from './pages/RutinaDetail';
import RutinaForm from './pages/RutinaForm';

const App = () => {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Listado de Rutinas</Link> | 
        <Link to="/crear">Crear Rutina</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<RutinasList />} />
        <Route path="/crear" element={<RutinaForm />} /> 
        <Route path="/editar/:id" element={<RutinaForm />} />
        <Route path="/rutinas/:id" element={<RutinaDetail />} />
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;