import React, { createContext, useContext, useState } from 'react';
import { defaultApplicationState} from '../ApplicationState';
import { ApplicationState, PropertyCondition, State } from '../ourtypes';
import ReactSpeedometer from "react-d3-speedometer"
import marketEdgeLogo from '../assets/MarketEdge_logo_header.jpg';
import { Link } from 'react-router-dom';
import './Header.css';

interface FormProps {
  appState: ApplicationState;
  setAppState: React.Dispatch<React.SetStateAction<ApplicationState>>;
}

const Header: React.FC<FormProps> = ({ appState, setAppState }) => {

  console.log("applicationState",appState)
    return (
      <header>
        <div className='image-logo'>
            <img src={marketEdgeLogo} alt="Market Edge Logo" className='image-logo'/>
        </div>
        <nav className="tab-list">
            <Link to="/" className="button">Home</Link>
            <Link to="/about" className="button">About</Link>
        </nav>
      </header>
    );
  };

export default Header;