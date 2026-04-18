import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WeatherComponent from './WeatherComponent';
import ForecastComponent from './ForecastComponent';
import SearchComponent from './SearchComponent';
import './index.css';

const MainComponent = () => {
    const defaultCity = 'Gothenburg';

    return (
        <Router>
            <div className="MainComponent">
                <header>
                    <h1>Väderapplikation</h1>
                </header>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Väder idag</Link>
                        </li>
                        <li>
                            <Link to="/forecast">Prognos</Link>
                        </li>
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
                    <p>&copy; 2024 Väderapplikation</p>
                </footer>
            </div>
        </Router>
    );
}

export default MainComponent;