import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

export const GlobalStateContext = createContext();

const GlobalStateProvider = ({ children }) => {
    const [language, setLanguage] = useState('HU');
    const [theme, setTheme] = useState('orange');

    const globalState = {
        language,
        setLanguage,
        theme,
        setTheme,
    };

    return (
        <GlobalStateContext.Provider value={globalState}>
            {children}
        </GlobalStateContext.Provider>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <GlobalStateProvider>
            <App />
        </GlobalStateProvider>
    </React.StrictMode>
);
