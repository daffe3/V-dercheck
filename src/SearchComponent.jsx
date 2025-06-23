import React, { useState } from 'react';

const SearchComponent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const apiKey = 'f1b102a258dcd4a05d17adaa4c4ee0d1';

    const handleSearch = () => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                setWeatherData(data);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    };

    const kelvinToCelsius = (kelvin) => {
        return kelvin - 273.15;
    };

    return (
        <div style={{ marginBottom: '20px', background: '#f6fcfc', color: '#0a1c1e', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ marginBottom: '10px' }}>Sök väder</h2>
            <input 
                type="text" 
                placeholder="Ange plats" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                style={{ 
                    padding: '10px', 
                    fontSize: '16px', 
                    width: '200px', 
                    borderRadius: '4px', 
                    border: '1px solid #ccc',
                    marginBottom: '10px'
                }} 
            />
            <button 
                onClick={handleSearch} 
                style={{ 
                    padding: '10px 20px', 
                    fontSize: '16px', 
                    borderRadius: '4px', 
                    backgroundColor: '#20d9e9', 
                    color: '#fff', 
                    border: 'none', 
                    cursor: 'pointer',
                    marginRight: '10px'
                }}
            >
                Sök
            </button>

            {weatherData && (
                <div>
                    <h3>Aktuellt väder för {weatherData.name}</h3>
                    <p>Temperatur: {kelvinToCelsius(weatherData.main.temp).toFixed(1)}°C</p>
                    <p>Luftfuktighet: {weatherData.main.humidity}%</p>
                </div>
            )}
        </div>
    );
}

export default SearchComponent;
