import React, { useState, useEffect } from 'react';

const ForecastComponent = ({ city }) => {
    const [forecastData, setForecastData] = useState(null);
    const apiKey = 'f1b102a258dcd4a05d17adaa4c4ee0d1';

    useEffect(() => {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                const dailyForecast = data.list.filter((item, index) => index % 8 === 0);
                setForecastData(dailyForecast);
            })
            .catch(error => {
                console.error('Error fetching forecast data:', error);
            });
    }, [city, apiKey]);

    const kelvinToCelsius = kelvin => (kelvin - 273.15).toFixed(1); 

    const formatDate = timestamp => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('sv-SE'); 
    };

    return (
        <div style={{ marginBottom: '20px', background: '#f6fcfc', color: '#0a1c1e', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ marginBottom: '10px' }}>Väderprognos för {city}</h2>
            {forecastData &&
                <ul>
                    {forecastData.map((item, index) => (
                        <li key={index}>
                            <p>Datum: {formatDate(item.dt)}</p>
                            <p>Temperatur: {kelvinToCelsius(item.main.temp)}°C</p>
                            <p>Luftfuktighet: {item.main.humidity}%</p>
                        </li>
                    ))}
                </ul>
            }
        </div>
    );
};

export default ForecastComponent;