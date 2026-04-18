import React, { useState, useEffect } from 'react';

const OWMIcon = ({ icon, size = 40 }) => (
    <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt="väderikon"
        width={size}
        height={size}
        style={{ filter: 'drop-shadow(0 0 6px rgba(56,189,248,0.35))' }}
    />
);

const kelvinToCelsius = k => (k - 273.15).toFixed(1);

const formatDate = ts =>
    new Date(ts * 1000).toLocaleDateString('sv-SE', { weekday: 'long', month: 'long', day: 'numeric' });

const formatHour = ts =>
    new Date(ts * 1000).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });

const HourlyModal = ({ day, allData, onClose }) => {
    const dayStr = new Date(day.dt * 1000).toDateString();
    const hours = allData.filter(item => new Date(item.dt * 1000).toDateString() === dayStr);

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                background: 'rgba(2, 8, 20, 0.75)',
                backdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1rem',
                animation: 'fadeIn 0.2s ease',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'linear-gradient(145deg, #0d1e35, #091525)',
                    border: '1px solid rgba(56,189,248,0.25)',
                    borderRadius: '20px',
                    padding: '1.75rem',
                    width: '100%',
                    maxWidth: '480px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    position: 'relative',
                    animation: 'slideUp 0.25s ease',
                    boxShadow: '0 0 60px rgba(56,189,248,0.12), 0 20px 60px rgba(0,0,0,0.5)',
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#94b8d4',
                        borderRadius: '50%',
                        width: '32px', height: '32px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s, color 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.2)'; e.currentTarget.style.color = '#38bdf8'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94b8d4'; }}
                >
                    ✕
                </button>

                <div style={{ marginBottom: '1.25rem', paddingRight: '2rem' }}>
                    <p style={{ fontSize: '0.7rem', color: '#4a7a9b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                        Timprognos
                    </p>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#f0f8ff', textTransform: 'capitalize' }}>
                        {formatDate(day.dt)}
                    </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {hours.map((item, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '60px 44px 65px 1fr auto',
                                alignItems: 'center',
                                gap: '0.6rem',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '12px',
                                padding: '0.5rem 1rem',
                                animation: `cardIn 0.3s ease ${i * 0.05}s both`,
                            }}
                        >
                            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#38bdf8' }}>
                                {formatHour(item.dt)}
                            </span>
                            <OWMIcon icon={item.weather[0]?.icon || '01d'} size={40} />
                            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#f0f8ff' }}>
                                {kelvinToCelsius(item.main.temp)}°C
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#94b8d4', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.weather[0]?.description}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#4a7a9b', textAlign: 'right' }}>
                                {item.main.humidity}%
                            </span>
                        </div>
                    ))}

                    {hours.length === 0 && (
                        <p style={{ color: '#4a7a9b', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
                            Ingen timdata tillgänglig för denna dag.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const ForecastComponent = ({ city }) => {
    const [forecastData, setForecastData] = useState(null);
    const [allData, setAllData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(null);
    const apiKey = 'f1b102a258dcd4a05d17adaa4c4ee0d1';

    useEffect(() => {
        setLoading(true);
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
            .then(r => r.json())
            .then(data => {
                setAllData(data.list);
                setForecastData(data.list.filter((_, i) => i % 8 === 0));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [city]);

    const formatDateShort = ts =>
        new Date(ts * 1000).toLocaleDateString('sv-SE', { weekday: 'short', month: 'short', day: 'numeric' });

    return (
        <>
            <div className="weather-card">
                <h2>
                    5-dagars prognos
                    <span className="city-badge">{city}</span>
                </h2>

                {!loading && forecastData && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.9rem', letterSpacing: '0.04em' }}>
                        Klicka på en dag för att se timprognos
                    </p>
                )}

                {loading && (
                    <div className="loading-dots">
                        <span /><span /><span />
                    </div>
                )}

                {!loading && forecastData && (
                    <ul className="forecast-list">
                        {forecastData.map((item, i) => (
                            <li
                                key={i}
                                className="forecast-item"
                                onClick={() => setSelectedDay(item)}
                                style={{ animationDelay: `${i * 0.08}s`, cursor: 'pointer' }}
                            >
                                <span className="forecast-date">{formatDateShort(item.dt)}</span>
                                <OWMIcon icon={item.weather[0]?.icon || '01d'} size={36} />
                                <span className="forecast-temp">
                                    {kelvinToCelsius(item.main.temp)}°C
                                </span>
                                <span className="forecast-humid">
                                    {item.main.humidity}%
                                </span>
                                <span className="forecast-desc">
                                    {item.weather[0]?.description}
                                </span>
                                <span style={{ marginLeft: 'auto', color: 'var(--accent-sky)', fontSize: '0.8rem', opacity: 0.7 }}>→</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {selectedDay && allData && (
                <HourlyModal
                    day={selectedDay}
                    allData={allData}
                    onClose={() => setSelectedDay(null)}
                />
            )}
        </>
    );
};

export default ForecastComponent;

const formatDate = ts =>
    new Date(ts * 1000).toLocaleDateString('sv-SE', { weekday: 'long', month: 'long', day: 'numeric' });

const formatHour = ts =>
    new Date(ts * 1000).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });

const HourlyModal = ({ day, allData, onClose }) => {
    const dayStr = new Date(day.dt * 1000).toDateString();
    const hours = allData.filter(item => new Date(item.dt * 1000).toDateString() === dayStr);

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                background: 'rgba(2, 8, 20, 0.75)',
                backdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1rem',
                animation: 'fadeIn 0.2s ease',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'linear-gradient(145deg, #0d1e35, #091525)',
                    border: '1px solid rgba(56,189,248,0.25)',
                    borderRadius: '20px',
                    padding: '1.75rem',
                    width: '100%',
                    maxWidth: '480px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    position: 'relative',
                    animation: 'slideUp 0.25s ease',
                    boxShadow: '0 0 60px rgba(56,189,248,0.12), 0 20px 60px rgba(0,0,0,0.5)',
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#94b8d4',
                        borderRadius: '50%',
                        width: '32px', height: '32px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s, color 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.2)'; e.currentTarget.style.color = '#38bdf8'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94b8d4'; }}
                >
                    ✕
                </button>

                <div style={{ marginBottom: '1.25rem', paddingRight: '2rem' }}>
                    <p style={{ fontSize: '0.7rem', color: '#4a7a9b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                        Timprognos
                    </p>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#f0f8ff', textTransform: 'capitalize' }}>
                        {formatDate(day.dt)}
                    </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {hours.map((item, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '60px 1.5rem 60px 1fr auto',
                                alignItems: 'center',
                                gap: '0.75rem',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '12px',
                                padding: '0.75rem 1rem',
                                animation: `cardIn 0.3s ease ${i * 0.05}s both`,
                            }}
                        >
                            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#38bdf8' }}>
                                {formatHour(item.dt)}
                            </span>
                            <span style={{ fontSize: '1.1rem' }}>
                                {getWeatherIcon(item.weather[0]?.description)}
                            </span>
                            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#f0f8ff' }}>
                                {kelvinToCelsius(item.main.temp)}°C
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#94b8d4', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.weather[0]?.description}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#4a7a9b', textAlign: 'right' }}>
                                {item.main.humidity}% 💧
                            </span>
                        </div>
                    ))}

                    {hours.length === 0 && (
                        <p style={{ color: '#4a7a9b', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
                            Ingen timdata tillgänglig för denna dag.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const ForecastComponent = ({ city }) => {
    const [forecastData, setForecastData] = useState(null);
    const [allData, setAllData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(null);
    const apiKey = 'f1b102a258dcd4a05d17adaa4c4ee0d1';

    useEffect(() => {
        setLoading(true);
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
            .then(r => r.json())
            .then(data => {
                setAllData(data.list);
                setForecastData(data.list.filter((_, i) => i % 8 === 0));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [city]);

    const formatDateShort = ts =>
        new Date(ts * 1000).toLocaleDateString('sv-SE', { weekday: 'short', month: 'short', day: 'numeric' });

    return (
        <>
            <div className="weather-card">
                <h2>
                    5-dagars prognos
                    <span className="city-badge">{city}</span>
                </h2>

                {!loading && forecastData && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.9rem', letterSpacing: '0.04em' }}>
                        Klicka på en dag för att se timprognos
                    </p>
                )}

                {loading && (
                    <div className="loading-dots">
                        <span /><span /><span />
                    </div>
                )}

                {!loading && forecastData && (
                    <ul className="forecast-list">
                        {forecastData.map((item, i) => (
                            <li
                                key={i}
                                className="forecast-item"
                                onClick={() => setSelectedDay(item)}
                                style={{ animationDelay: `${i * 0.08}s`, cursor: 'pointer' }}
                            >
                                <span className="forecast-date">{formatDateShort(item.dt)}</span>
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
                                <span style={{ marginLeft: 'auto', color: 'var(--accent-sky)', fontSize: '0.8rem', opacity: 0.7 }}>→</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {selectedDay && allData && (
                <HourlyModal
                    day={selectedDay}
                    allData={allData}
                    onClose={() => setSelectedDay(null)}
                />
            )}
        </>
    );
};

export default ForecastComponent;
