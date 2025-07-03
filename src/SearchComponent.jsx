import React, { useState } from 'react';

const SearchComponent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const apiKey = 'f1b102a258dcd4a05d17adaa4c4ee0d1';

    const handleSearch = () => {
        // Fetch current weather
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                setWeatherData(data);
            })
            .catch(error => {
                console.error('Error fetching current weather data:', error);
                setWeatherData(null); // Clear previous data on error
            });

        // Fetch forecast
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchQuery}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                // OpenWeatherMap provides forecast data every 3 hours.
                // Filter to get one entry per day (e.g., at noon or closest to it)
                const dailyForecast = data.list.filter((item, index) => index % 8 === 0);
                setForecastData(dailyForecast);
            })
            .catch(error => {
                console.error('Error fetching forecast data:', error);
                setForecastData(null); // Clear previous data on error
            });
    };

    const kelvinToCelsius = (kelvin) => {
        return (kelvin - 273.15).toFixed(1);
    };

    const formatDate = timestamp => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('sv-SE');
    };

    return (
        <div className="weather-card">
            <h2 style={{ marginBottom: '10px' }}>Sök väder</h2>
            <div className="search-container">
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
            </div>

            {weatherData && weatherData.cod === 200 && (
                <div>
                    <h3>Aktuellt väder för {weatherData.name}</h3>
                    <p>Temperatur: {kelvinToCelsius(weatherData.main.temp)}°C</p>
                    <p>Luftfuktighet: {weatherData.main.humidity}%</p>
                    <p>Beskrivning: {weatherData.weather[0].description}</p>
                </div>
            )}

            {forecastData && forecastData.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h3>5-dagars prognos för {searchQuery}</h3>
                    <ul className="forecast-list">
                        {forecastData.map((item, index) => (
                            <li key={index} className="forecast-item">
                                <p>Datum: {formatDate(item.dt)}</p>
                                <p>Temperatur: {kelvinToCelsius(item.main.temp)}°C</p>
                                <p>Luftfuktighet: {item.main.humidity}%</p>
                                <p>Beskrivning: {item.weather[0].description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {weatherData && weatherData.cod !== 200 && (
                <p style={{ color: 'red' }}>Ort hittades inte. Vänligen försök igen.</p>
            )}
        </div>
    );
}

export default SearchComponent;