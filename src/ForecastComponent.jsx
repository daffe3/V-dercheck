import React, { useState, useEffect } from 'react';

const getWeatherIcon = (description = '') => {
    const d = description.toLowerCase();
    if (d.includes('thunder')) return '⛈️';
    if (d.includes('rain') || d.includes('drizzle')) return '🌧️';
    if (d.includes('snow')) return '❄️';
    if (d.includes('fog') || d.includes('mist')) return '🌫️';
    if (d.includes('cloud')) return '☁️';
    if (d.includes('clear')) return '✨';
    return '🌤️';
};

const ForecastComponent = ({ city }) => {
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiKey = 'f1b102a258dcd4a05d17adaa4c4ee0d1';

    useEffect(() => {
        setLoading(true);
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
            .then(r => r.json())
            .then(data => {
                const daily = data.list.filter((_, i) => i % 8 === 0);
                setForecastData(daily);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [city]);

    const kelvinToCelsius = k => (k - 273.15).toFixed(1);

    const formatDate = ts => {
        const d = new Date(ts * 1000);
        return d.toLocaleDateString('sv-SE', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <div className="weather-card">
            <h2>
                5-dagars prognos
                <span className="city-badge">{city}</span>
            </h2>

            {loading && (
                <div className="loading-dots">
                    <span /><span /><span />
                </div>
            )}

            {!loading && forecastData && (
                <ul className="forecast-list">
                    {forecastData.map((item, i) => (
                        <li key={i} className="forecast-item" style={{ animationDelay: `${i * 0.08}s` }}>
                            <span className="forecast-date">{formatDate(item.dt)}</span>
                            <span className="forecast-temp">
                                {kelvinToCelsius(item.main.temp)}°C
                            </span>
                            <span className="forecast-humid">
                                {item.main.humidity}% 💧
                            </span>
                            <span className="forecast-desc">
                                {getWeatherIcon(item.weather[0]?.description)}{' '}
                                {item.weather[0]?.description}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ForecastComponent;
