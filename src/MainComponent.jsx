import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WeatherComponent from './WeatherComponent';
import ForecastComponent from './ForecastComponent';
import SearchComponent from './SearchComponent';
import './index.css';

const MainComponent = () => {
    const defaultCity = 'Gothenburg';
    const [showForecast, setShowForecast] = useState(false); 

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
                            <Link to="/forecast" onClick={() => setShowForecast(true)}>Prognos</Link> {}
                        </li>
                    </ul>
                </nav>
                <main>
                    <Routes>
                        <Route path="/" element={<WeatherComponent />} />
                        <Route path="/forecast" element={showForecast ? <ForecastComponent city={defaultCity} /> : null} /> {}
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