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
        <div className="weather-card">
            <h2 style={{ marginBottom: '10px' }}>Väderprognos för {city}</h2>
            {forecastData &&
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
            }
        </div>
    );
};

export default ForecastComponent;