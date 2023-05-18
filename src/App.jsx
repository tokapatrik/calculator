import React, { useContext } from 'react';
import { Calculator } from './Calculator';
import { GlobalStateContext } from './index';
import './App.css';

function App() {
    const { theme, setLanguage, setTheme } = useContext(GlobalStateContext);

    return (
        <div className={theme}>
            <header>
                <select onChange={(e) => setLanguage(e.target.value)}>
                    <option value="HU">HU</option>
                    <option value="EN">EN</option>
                </select>
                <h1>calculator</h1>
                <select onChange={(e) => setTheme(e.target.value)}>
                    <option value="orange">Orange</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                </select>
            </header>
            <div className="container">
                <Calculator />
            </div>
        </div>
    );
}

export default App;
