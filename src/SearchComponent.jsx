import React, { useState, useEffect, useRef } from 'react';

// ── OWM ikon — faller tillbaka på tom sträng om icon saknas ──────────────
const OWMIcon = ({ icon, size = 60 }) => {
    if (!icon) return null;
    return (
        <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt="väderikon"
            width={size}
            height={size}
            style={{ filter: 'drop-shadow(0 0 10px rgba(56,189,248,0.45))', display: 'block' }}
        />
    );
};

const kelvinToCelsius = k => (k - 273.15).toFixed(1);
const formatDateShort  = ts => new Date(ts * 1000).toLocaleDateString('sv-SE', { weekday: 'short', month: 'short', day: 'numeric' });
const formatDateLong   = ts => new Date(ts * 1000).toLocaleDateString('sv-SE', { weekday: 'long', month: 'long', day: 'numeric' });
const formatHour       = ts => new Date(ts * 1000).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });

// ── Karta ─────────────────────────────────────────────────────────────────
const MAP_LAYERS = [
    { id: 'precipitation_new', label: 'Nederbörd' },
    { id: 'clouds_new',        label: 'Moln'      },
    { id: 'wind_new',          label: 'Vind'       },
    { id: 'temp_new',          label: 'Temperatur' },
];

const WeatherMap = ({ lat, lon, apiKey }) => {
    const mapRef      = useRef(null);
    const leafletMap  = useRef(null);
    const weatherLayer = useRef(null);
    const markerRef   = useRef(null);
    const [activeLayer, setActiveLayer] = useState('precipitation_new');

    useEffect(() => {
        if (!window.L || !mapRef.current) return;
        const L = window.L;

        if (!leafletMap.current) {
            leafletMap.current = L.map(mapRef.current, { zoomControl: true }).setView([lat, lon], 7);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap © CARTO', maxZoom: 18,
            }).addTo(leafletMap.current);
        } else {
            leafletMap.current.setView([lat, lon], 7);
        }

        if (markerRef.current) leafletMap.current.removeLayer(markerRef.current);
        markerRef.current = L.circleMarker([lat, lon], {
            radius: 8, color: '#38bdf8', fillColor: '#38bdf8', fillOpacity: 0.9, weight: 2,
        }).addTo(leafletMap.current);

        if (weatherLayer.current) leafletMap.current.removeLayer(weatherLayer.current);
        weatherLayer.current = L.tileLayer(
            `https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${apiKey}`,
            { opacity: 0.65, maxZoom: 18 }
        ).addTo(leafletMap.current);
    }, [lat, lon, activeLayer, apiKey]);

    return (
        <div style={{ marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                Väderkarta
            </p>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {MAP_LAYERS.map(l => (
                    <button key={l.id} onClick={() => setActiveLayer(l.id)} style={{
                        padding: '0.35rem 0.85rem', fontSize: '0.75rem',
                        fontFamily: 'Syne, sans-serif', fontWeight: 600,
                        borderRadius: '50px', border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
                        background:   activeLayer === l.id ? '#38bdf8' : 'rgba(255,255,255,0.06)',
                        borderColor:  activeLayer === l.id ? '#38bdf8' : 'rgba(255,255,255,0.12)',
                        color:        activeLayer === l.id ? '#050d1a' : '#94b8d4',
                    }}>
                        {l.label}
                    </button>
                ))}
            </div>
            <div ref={mapRef} style={{
                height: '280px', borderRadius: '14px', overflow: 'hidden',
                border: '1px solid rgba(56,189,248,0.2)',
                boxShadow: '0 0 30px rgba(56,189,248,0.08)',
            }} />
        </div>
    );
};

// ── Timprognos-modal ──────────────────────────────────────────────────────
const HourlyModal = ({ day, allData, onClose }) => {
    const dayStr = new Date(day.dt * 1000).toDateString();
    const hours  = allData.filter(item => new Date(item.dt * 1000).toDateString() === dayStr);

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 2000,
                background: 'rgba(2,8,20,0.80)',
                backdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1rem', animation: 'fadeIn 0.2s ease',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'linear-gradient(145deg, #0d1e35, #091525)',
                    border: '1px solid rgba(56,189,248,0.25)',
                    borderRadius: '20px', padding: '1.75rem',
                    width: '100%', maxWidth: '480px', maxHeight: '80vh', overflowY: 'auto',
                    position: 'relative', animation: 'slideUp 0.25s ease',
                    boxShadow: '0 0 60px rgba(56,189,248,0.12), 0 20px 60px rgba(0,0,0,0.5)',
                }}
            >
                {/* Stäng-knapp */}
                <button
                    onClick={onClose}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(56,189,248,0.2)'; e.currentTarget.style.color='#38bdf8'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#94b8d4'; }}
                    style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                        color: '#94b8d4', borderRadius: '50%', width: '32px', height: '32px',
                        cursor: 'pointer', fontSize: '1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s, color 0.2s',
                    }}
                >✕</button>

                <div style={{ marginBottom: '1.25rem', paddingRight: '2rem' }}>
                    <p style={{ fontSize: '0.7rem', color: '#4a7a9b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                        Timprognos
                    </p>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#f0f8ff', textTransform: 'capitalize' }}>
                        {formatDateLong(day.dt)}
                    </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {hours.length === 0 && (
                        <p style={{ color: '#4a7a9b', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
                            Ingen timdata tillgänglig för denna dag.
                        </p>
                    )}
                    {hours.map((item, i) => (
                        <div key={i} style={{
                            display: 'grid', gridTemplateColumns: '60px 44px 65px 1fr auto',
                            alignItems: 'center', gap: '0.6rem',
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '12px', padding: '0.5rem 1rem',
                            animation: `cardIn 0.3s ease ${i * 0.05}s both`,
                        }}>
                            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#38bdf8' }}>
                                {formatHour(item.dt)}
                            </span>
                            <OWMIcon icon={item.weather[0]?.icon} size={40} />
                            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#f0f8ff' }}>
                                {kelvinToCelsius(item.main.temp)}°C
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#94b8d4', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.weather[0]?.description}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#4a7a9b', textAlign: 'right' }}>
                                {item.main.humidity}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ── Huvudkomponent ────────────────────────────────────────────────────────
const SearchComponent = () => {
    const [searchQuery,  setSearchQuery]  = useState('');
    const [weatherData,  setWeatherData]  = useState(null);
    const [allForecast,  setAllForecast]  = useState(null);  
    const [dailyForecast,setDailyForecast]= useState(null);   
    const [loading,      setLoading]      = useState(false);
    const [selectedDay,  setSelectedDay]  = useState(null);
    const [leafletReady, setLeafletReady] = useState(false);
    const apiKey = 'f1b102a258dcd4a05d17adaa4c4ee0d1';

    useEffect(() => {
        if (window.L) { setLeafletReady(true); return; }
        if (document.getElementById('leaflet-css')) {
            const check = setInterval(() => { if (window.L) { setLeafletReady(true); clearInterval(check); } }, 100);
            return () => clearInterval(check);
        }
        const link = document.createElement('link');
        link.id = 'leaflet-css'; link.rel = 'stylesheet';
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
        setAllForecast(null);
        setDailyForecast(null);
        setSelectedDay(null);

        Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${apiKey}&lang=sv`).then(r => r.json()),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchQuery}&appid=${apiKey}&lang=sv`).then(r => r.json()),
        ]).then(([weather, forecast]) => {
            setWeatherData(weather);
            if (forecast.list) {
                setAllForecast(forecast.list);
                setDailyForecast(forecast.list.filter((_, i) => i % 8 === 0));
            }
            setLoading(false);
        }).catch(() => setLoading(false));
    };

    const handleKeyDown = e => { if (e.key === 'Enter') handleSearch(); };
    const showMap = leafletReady && weatherData?.cod === 200 && weatherData?.coord;

    return (
        <>
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
                        {/* Aktuellt väder */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.75rem 0' }}>
                            <OWMIcon icon={weatherData.weather[0]?.icon} size={70} />
                            <div>
                                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#f0f8ff', marginBottom: '0.2rem' }}>
                                    {weatherData.name}
                                    {weatherData.sys?.country && (
                                        <span className="city-badge" style={{ marginLeft: '0.5rem' }}>{weatherData.sys.country}</span>
                                    )}
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: '#94b8d4', fontStyle: 'italic' }}>
                                    {weatherData.weather[0]?.description}
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

                        {/* Karta */}
                        {showMap && (
                            <WeatherMap
                                key={`${weatherData.coord.lat}-${weatherData.coord.lon}`}
                                lat={weatherData.coord.lat}
                                lon={weatherData.coord.lon}
                                apiKey={apiKey}
                            />
                        )}

                        {/* 5-dagars prognos — klickbar */}
                        {dailyForecast && dailyForecast.length > 0 && (
                            <div style={{ marginTop: '1.5rem' }}>
                                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                                    5-dagars prognos
                                </p>
                                <p style={{ fontSize: '0.72rem', color: '#4a7a9b', marginBottom: '0.75rem' }}>
                                    Klicka på en dag för timprognos
                                </p>
                                <ul className="forecast-list">
                                    {dailyForecast.map((item, i) => (
                                        <li
                                            key={i}
                                            className="forecast-item"
                                            onClick={() => setSelectedDay(item)}
                                            style={{ animationDelay: `${i * 0.07}s`, cursor: 'pointer' }}
                                        >
                                            <span className="forecast-date">{formatDateShort(item.dt)}</span>
                                            <OWMIcon icon={item.weather[0]?.icon} size={36} />
                                            <span className="forecast-temp">{kelvinToCelsius(item.main.temp)}°C</span>
                                            <span className="forecast-humid">{item.main.humidity}%</span>
                                            <span className="forecast-desc">{item.weather[0]?.description}</span>
                                            <span style={{ marginLeft: 'auto', color: 'var(--accent-sky)', fontSize: '0.8rem', opacity: 0.7 }}>→</span>
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

            {/* Timprognos-modal */}
            {selectedDay && allForecast && (
                <HourlyModal
                    day={selectedDay}
                    allData={allForecast}
                    onClose={() => setSelectedDay(null)}
                />
            )}
        </>
    );
};

export default SearchComponent;
