import React, { createContext, useContext, useState } from 'react';
import { ApplicationState} from '../ApplicationState';
import { ApplicationStateType, State } from '../ourtypes';
import ReactSpeedometer from "react-d3-speedometer"
import marketEdgeLogo from '../assets/MarketEdge_logo_header.png';
import { Link } from 'react-router-dom';
import './Header.css';

interface FormProps {
  appState: ApplicationStateType;
  setAppState: React.Dispatch<React.SetStateAction<ApplicationStateType>>;
}

const Header: React.FC<FormProps> = ({ appState, setAppState }) => {
  console.log("applicationState", appState);
  return (
    <header className="stripe-header">
      <div className="logo-container">
        <h2 className="logo">Market Edge </h2>
      </div>
      <nav className="nav-menu">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
      </nav>
    </header>
  );
};

export default Header;
