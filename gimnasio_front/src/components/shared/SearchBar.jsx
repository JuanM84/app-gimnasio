import React, { useState } from 'react';

const SearchBar = ({ onSearchChange }) => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        onSearchChange(value); 
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <input
                type="text"
                placeholder="Buscar rutina por nombre..."
                value={inputValue}
                onChange={handleChange}
                style={{ padding: '10px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
        </div>
    );
};

export default SearchBar;