import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import {ApplicationState} from './ApplicationState';
import Home from './pages/Home';
import About from './pages/About';
import './App.css'
import { ApplicationStateType } from './ourtypes';

const App: React.FC = () => {
    const [appState, setAppState] = useState<ApplicationStateType>(ApplicationState);

    return (
        <Router>
            <div className="App">
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
          </div>
        </Router>
    );
};

export default App;
