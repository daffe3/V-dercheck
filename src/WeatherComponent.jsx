import React, { useState, useEffect } from 'react';

const OWMIcon = ({ icon, size = 80 }) => (
    <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt="väderikon"
        width={size}
        height={size}
        style={{ filter: 'drop-shadow(0 0 12px rgba(56,189,248,0.4))' }}
    />
);

const WeatherComponent = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiKey = 'f1b102a258dcd4a05d17adaa4c4ee0d1';
    const defaultCity = 'Gothenburg';

    useEffect(() => {
        setLoading(true);
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&appid=${apiKey}`)
            .then(r => r.json())
            .then(data => { setWeatherData(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const kelvinToCelsius = k => (k - 273.15).toFixed(1);

    return (
        <div className="weather-card">
            <h2>
                Aktuellt väder
                <span className="city-badge">{defaultCity}</span>
            </h2>

            {loading && (
                <div className="loading-dots">
                    <span /><span /><span />
                </div>
            )}

            {!loading && weatherData && weatherData.main && (
                <>
                    <div className="weather-icon">
                        <OWMIcon icon={weatherData.weather[0].icon} size={90} />
                    </div>
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
                    <p className="weather-desc">
                        {weatherData.weather?.[0]?.description}
                    </p>
                </>
            )}
        </div>
    );
};

export default WeatherComponent;
