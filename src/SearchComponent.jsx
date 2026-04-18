import React, { useState, useEffect, useRef } from 'react';

const OWMIcon = ({ icon, size = 60 }) => (
    <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt="väderikon"
        width={size}
        height={size}
        style={{ filter: 'drop-shadow(0 0 10px rgba(56,189,248,0.45))' }}
    />
);

const kelvinToCelsius = k => (k - 273.15).toFixed(1);
const formatDate = ts => new Date(ts * 1000).toLocaleDateString('sv-SE', { weekday: 'short', month: 'short', day: 'numeric' });

const MAP_LAYERS = [
    { id: 'precipitation_new', label: 'Nederbörd' },
    { id: 'clouds_new', label: 'Moln' },
    { id: 'wind_new', label: 'Vind' },
    { id: 'temp_new', label: 'Temperatur' },
];

const WeatherMap = ({ lat, lon, apiKey }) => {
    const mapRef = useRef(null);
    const leafletMap = useRef(null);
    const weatherLayer = useRef(null);
    const [activeLayer, setActiveLayer] = useState('precipitation_new');

    useEffect(() => {
        if (!window.L) return;
        const L = window.L;

        if (!leafletMap.current) {
            leafletMap.current = L.map(mapRef.current, { zoomControl: true }).setView([lat, lon], 7);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap © CARTO',
                maxZoom: 18,
            }).addTo(leafletMap.current);

            L.circleMarker([lat, lon], {
                radius: 8,
                color: '#38bdf8',
                fillColor: '#38bdf8',
                fillOpacity: 0.9,
                weight: 2,
            }).addTo(leafletMap.current);
        } else {
            leafletMap.current.setView([lat, lon], 7);
        }

        if (weatherLayer.current) {
            leafletMap.current.removeLayer(weatherLayer.current);
        }

        weatherLayer.current = window.L.tileLayer(
            `https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${apiKey}`,
            { opacity: 0.65, maxZoom: 18 }
        ).addTo(leafletMap.current);
    }, [lat, lon, activeLayer, apiKey]);

    return (
        <div style={{ marginTop: '1.5rem' }}>
            {/* Layer switcher */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {MAP_LAYERS.map(l => (
                    <button
                        key={l.id}
                        onClick={() => setActiveLayer(l.id)}
                        style={{
                            padding: '0.35rem 0.85rem',
                            fontSize: '0.75rem',
                            fontFamily: 'Syne, sans-serif',
                            fontWeight: 600,
                            borderRadius: '50px',
                            border: '1px solid',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: activeLayer === l.id ? '#38bdf8' : 'rgba(255,255,255,0.06)',
                            borderColor: activeLayer === l.id ? '#38bdf8' : 'rgba(255,255,255,0.12)',
                            color: activeLayer === l.id ? '#050d1a' : '#94b8d4',
                        }}
                    >
                        {l.label}
                    </button>
                ))}
            </div>

            {/* Map container */}
            <div
                ref={mapRef}
                style={{
                    height: '280px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: '1px solid rgba(56,189,248,0.2)',
                    boxShadow: '0 0 30px rgba(56,189,248,0.08)',
                }}
            />
        </div>
    );
};

const SearchComponent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [leafletReady, setLeafletReady] = useState(false);
    const apiKey = 'f1b102a258dcd4a05d17adaa4c4ee0d1';

    useEffect(() => {
        if (document.getElementById('leaflet-css')) { setLeafletReady(true); return; }

        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => setLeafletReady(true);
        document.head.appendChild(script);
    }, []);

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
            if (forecast.list) setForecastData(forecast.list.filter((_, i) => i % 8 === 0));
            setLoading(false);
        }).catch(() => setLoading(false));
    };

    const handleKeyDown = e => { if (e.key === 'Enter') handleSearch(); };

    const showMap = leafletReady && weatherData?.cod === 200 && weatherData?.coord;

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
                <button className="search-btn" onClick={handleSearch}>Sök</button>
            </div>

            {loading && <div className="loading-dots"><span /><span /><span /></div>}

            {weatherData && weatherData.cod === 200 && (
                <>
                    {/* Current weather */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.75rem 0' }}>
                        <OWMIcon icon={weatherData.weather[0].icon} size={70} />
                        <div>
                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#f0f8ff', marginBottom: '0.2rem' }}>
                                {weatherData.name}
                                {weatherData.sys?.country && (
                                    <span className="city-badge" style={{ marginLeft: '0.5rem' }}>{weatherData.sys.country}</span>
                                )}
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: '#94b8d4', fontStyle: 'italic' }}>
                                {weatherData.weather[0].description}
                            </p>
                        </div>
                    </div>

                    <div className="stat-row">
                        <div className="stat-box">
                            <div className="stat-label">Temp</div>
                            <div className="stat-value">{kelvinToCelsius(weatherData.main.temp)}<span className="stat-unit">°C</span></div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-label">Känns som</div>
                            <div className="stat-value">{kelvinToCelsius(weatherData.main.feels_like)}<span className="stat-unit">°C</span></div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-label">Luftfukt</div>
                            <div className="stat-value">{weatherData.main.humidity}<span className="stat-unit">%</span></div>
                        </div>
                    </div>

                    {/* Map */}
                    {showMap && (
                        <WeatherMap
                            key={weatherData.name}
                            lat={weatherData.coord.lat}
                            lon={weatherData.coord.lon}
                            apiKey={apiKey}
                        />
                    )}

                    {/* 5-day forecast */}
                    {forecastData && forecastData.length > 0 && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                5-dagars prognos
                            </p>
                            <ul className="forecast-list">
                                {forecastData.map((item, i) => (
                                    <li key={i} className="forecast-item" style={{ animationDelay: `${i * 0.07}s` }}>
                                        <span className="forecast-date">{formatDate(item.dt)}</span>
                                        <OWMIcon icon={item.weather[0]?.icon || '01d'} size={36} />
                                        <span className="forecast-temp">{kelvinToCelsius(item.main.temp)}°C</span>
                                        <span className="forecast-humid">{item.main.humidity}%</span>
                                        <span className="forecast-desc">{item.weather[0]?.description}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}

            {weatherData && weatherData.cod !== 200 && (
                <p className="error-msg">Ort hittades inte. Kontrollera stavningen och försök igen.</p>
            )}
        </div>
    );
};

export default SearchComponent;
