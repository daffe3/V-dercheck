import React, { useState } from 'react';

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

const SearchComponent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(false);
    const apiKey = 'f1b102a258dcd4a05d17adaa4c4ee0d1';

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setWeatherData(null);
        setForecastData(null);

        Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${apiKey}`).then(r => r.json()),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchQuery}&appid=${apiKey}`).then(r => r.json()),
        ]).then(([weather, forecast]) => {
            setWeatherData(weather);
            if (forecast.list) {
                setForecastData(forecast.list.filter((_, i) => i % 8 === 0));
            }
            setLoading(false);
        }).catch(() => setLoading(false));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const kelvinToCelsius = k => (k - 273.15).toFixed(1);
    const formatDate = ts => new Date(ts * 1000).toLocaleDateString('sv-SE', { weekday: 'short', month: 'short', day: 'numeric' });

    return (
        <div className="weather-card">
            <h2>Sök väder</h2>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Stad, land…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="search-btn" onClick={handleSearch}>
                    Sök
                </button>
            </div>

            {loading && (
                <div className="loading-dots">
                    <span /><span /><span />
                </div>
            )}

            {weatherData && weatherData.cod === 200 && (
                <>
                    <div className="weather-icon">
                        {getWeatherIcon(weatherData.weather?.[0]?.description)}
                    </div>
                    <h2 style={{ marginBottom: '1rem', fontSize: '1rem' }}>
                        {weatherData.name}
                        {weatherData.sys?.country && (
                            <span className="city-badge">{weatherData.sys.country}</span>
                        )}
                    </h2>
                    <div className="stat-row">
                        <div className="stat-box">
                            <div className="stat-label">Temp</div>
                            <div className="stat-value">
                                {kelvinToCelsius(weatherData.main.temp)}
                                <span className="stat-unit">°C</span>
                            </div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-label">Känns som</div>
                            <div className="stat-value">
                                {kelvinToCelsius(weatherData.main.feels_like)}
                                <span className="stat-unit">°C</span>
                            </div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-label">Luftfukt</div>
                            <div className="stat-value">
                                {weatherData.main.humidity}
                                <span className="stat-unit">%</span>
                            </div>
                        </div>
                    </div>
                    <p className="weather-desc">{weatherData.weather?.[0]?.description}</p>
                </>
            )}

            {forecastData && forecastData.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                        5-dagars prognos
                    </p>
                    <ul className="forecast-list">
                        {forecastData.map((item, i) => (
                            <li key={i} className="forecast-item" style={{ animationDelay: `${i * 0.07}s` }}>
                                <span className="forecast-date">{formatDate(item.dt)}</span>
                                <span className="forecast-temp">{kelvinToCelsius(item.main.temp)}°C</span>
                                <span className="forecast-humid">{item.main.humidity}% 💧</span>
                                <span className="forecast-desc">
                                    {getWeatherIcon(item.weather[0]?.description)}{' '}
                                    {item.weather[0]?.description}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {weatherData && weatherData.cod !== 200 && (
                <p className="error-msg">Ort hittades inte. Kontrollera stavningen och försök igen.</p>
            )}
        </div>
    );
};

export default SearchComponent;
