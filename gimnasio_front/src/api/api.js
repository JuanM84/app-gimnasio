import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// CRUD Rutinas
export const RutinasApi = {
    // Listado y Búsqueda
    getRutinas: (searchTerm = '') => {
        if (searchTerm) {
            return api.get(`/rutinas/buscar?nombre=${searchTerm}`);
        }
        return api.get('/rutinas');
    },
    // Detalle de una Rutina
    getRutinaById: (id) => api.get(`/rutinas/${id}`),

    // Crear una rutina
    createRutina: (data) => api.post('/rutinas', data),

    // Actualizar una rutina
    updateRutina: (id, data) => api.put(`/rutinas/${id}`, data),
    
    // Eliminar una rutina
    deleteRutina: (id) => api.delete(`/rutinas/${id}`),
};

// CRUD Ejercicios 
export const EjerciciosApi = {
    // Agregar ejercicio a una rutina
    addEjercicio: (rutinaId, data) => api.post(`/ejercicios/rutinas/${rutinaId}/ejercicios`, data),

    // Modificar un ejercicio
    updateEjercicio: (ejercicioId, data) => api.put(`/ejercicios/${ejercicioId}`, data),

    // Eliminar un Ejercicio
    deleteEjercicio: (ejercicioId) => api.delete(`/ejercicios/${ejercicioId}`),
};