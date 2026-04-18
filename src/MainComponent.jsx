import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import WeatherComponent from './WeatherComponent';
import ForecastComponent from './ForecastComponent';
import SearchComponent from './SearchComponent';
import './index.css';

const NavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <li>
            <Link to={to} className={isActive ? 'active' : ''}>
                {children}
            </Link>
        </li>
    );
};

const MainComponent = () => {
    const defaultCity = 'Gothenburg';

    return (
        <Router>
            <div className="MainComponent">
                <header>
                    <h1>Väderapplikation</h1>
                    <p className="subtitle">Realtidsväder &amp; prognos</p>
                </header>
                <nav>
                    <ul>
                        <NavLink to="/">Väder idag</NavLink>
                        <NavLink to="/forecast">Prognos</NavLink>
                    </ul>
                </nav>
                <main>
                    <Routes>
                        <Route path="/" element={<WeatherComponent />} />
                        <Route path="/forecast" element={<ForecastComponent city={defaultCity} />} />
                    </Routes>
                    <SearchComponent />
                </main>
                <footer>
                    <p>© 2024 Väderapplikation &nbsp;·&nbsp; Byggd med React + OpenWeatherMap</p>
                </footer>
            </div>
        </Router>
    );
};

export default MainComponent;
