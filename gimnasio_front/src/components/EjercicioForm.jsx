import React from 'react';

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const EjercicioForm = ({ ejercicio, index, onChange, onRemove }) => {
    
    const handleChange = (e) => {
        onChange(index, e);
    };

    return (
        <div>
            <h5>Ejercicio #{index + 1}</h5>
            
            <label>Día:</label>
            <select name="dia_semana" value={ejercicio.dia_semana} onChange={handleChange} required>
                {DIAS_SEMANA.map(day => (
                    <option key={day} value={day}>{day}</option>
                ))}
            </select>
            
            <label>Nombre Ejercicio:</label>
            <input type="text" name="nombre" value={ejercicio.nombre} onChange={handleChange} required />

            <label>Series:</label>
            <input type="number" name="series" value={ejercicio.series || 0} onChange={handleChange} min="1" required />
            
            <label>Repeticiones:</label>
            <input type="number" name="repeticiones" value={ejercicio.repeticiones || 0} onChange={handleChange} min="1" required />

            <label>Peso (kg, opcional):</label>
            {/* Si el campo está vacío, enviamos null al backend. */}
            <input 
                type="number" 
                name="peso" 
                value={ejercicio.peso === null ? '' : ejercicio.peso} 
                onChange={handleChange} 
                min="0" 
                step="0.5"
            />
            
            <label>Notas:</label>
            <input type="text" name="notas" value={ejercicio.notas || ''} onChange={handleChange} />
            
            <label>Orden:</label>
            <input type="number" name="orden" value={ejercicio.orden || 1} onChange={handleChange} min="1" required />

            <button type="button" onClick={() => onRemove(index)} style={{ float: 'right' }}>
                Eliminar Ejercicio
            </button>
            <div style={{ clear: 'both' }}></div>
        </div>
    );
};

export default EjercicioForm;