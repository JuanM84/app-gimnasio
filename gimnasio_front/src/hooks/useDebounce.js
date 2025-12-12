import { useState, useEffect } from 'react';

/**
 * Hook personalizado que devuelve un valor que se "retrasa" al cambiar.
 * @param {any} value - El valor actual (ej. searchTerm del input).
 * @param {number} delay - El tiempo de espera en milisegundos.
 * @returns {any} El valor debounced.
 */
export function useDebounce(value, delay) {
    
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
        
    }, [value, delay]); // El efecto se vuelve a ejecutar solo si 'value' o 'delay' cambian

    return debouncedValue;
}