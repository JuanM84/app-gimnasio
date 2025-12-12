import React from "react";

import { Routes, Route } from "react-router-dom";

// Paginas
import RutinasList from './pages/RutinasList';
import RutinaDetail from './pages/RutinaDetail';
import RutinaForm from './pages/RutinaForm';
import Home from "./pages/Home";
import Layout from "./components/shared/Layout";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rutinas" element={<RutinasList />} />
        <Route path="/crear" element={<RutinaForm />} />
        <Route path="/editar/:id" element={<RutinaForm />} />
        <Route path="/rutinas/:id" element={<RutinaDetail />} />
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </Layout>
  );
};

export default App;