import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import useApplicationState from './ApplicationState';
import Home from './pages/Home';
import About from './pages/About';
import './App.css'

const App: React.FC = () => {
    const [appState, setAppState] = useApplicationState();

    return (
        <Router>
            <Header 
                appState={appState}
                setAppState={setAppState}
            />
          <Routes>
            <Route path="/" element={<Home
             appState={appState}
             setAppState={setAppState}
             />} />
             <Route path="/about" element={<About
             appState={appState}
             setAppState={setAppState}
             />} />
          </Routes>
        </Router>
    );
};

export default App;
