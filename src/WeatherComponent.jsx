import React, { useState, useEffect } from 'react';

const WeatherComponent = () => {
    const [weatherData, setWeatherData] = useState(null);
    const apiKey = 'f1b102a258dcd4a05d17adaa4c4ee0d1';
    const defaultCity = 'Gothenburg';

    useEffect(() => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                setWeatherData(data);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    }, [apiKey]);

    const kelvinToCelsius = (kelvin) => {
        return (kelvin - 273.15).toFixed(1);
    };

    return (
        <div style={{ marginBottom: '20px', background: '#f6fcfc', color: '#0a1c1e', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ marginBottom: '10px' }}>Aktuellt väder för {defaultCity}</h2>
            {weatherData && (
                <div>
                    <p>Temperatur: {kelvinToCelsius(weatherData.main.temp)}°C</p>
                    <p>Luftfuktighet: {weatherData.main.humidity}%</p>
                </div>
            )}
        </div>
    );
}

export default WeatherComponent;