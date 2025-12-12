
const SearchBar = ({ onSearchChange, value }) => {

    const handleChange = (e) => {
        
        onSearchChange(e.target.value); 
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <input
                type="text"
                placeholder="Buscar rutina por nombre..."
                value={value}
                onChange={handleChange}
                style={{ padding: '10px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
        </div>
    );
};

export default SearchBar;