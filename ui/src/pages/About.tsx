import React, { ChangeEvent, FormEvent } from 'react';
import { ApplicationState, PropertyCondition, State } from '../ourtypes';
import Slider from '@mui/material/Slider';
import ReactSpeedometer from "react-d3-speedometer";
import kevin from '../assets/kevin.jpeg';
import leo from '../assets/leo.png';
import nick from '../assets/nick.png';
import './About.css'

interface FormProps {
  appState: ApplicationState;
  setAppState: React.Dispatch<React.SetStateAction<ApplicationState>>;
}

const About: React.FC<FormProps> = ({ appState, setAppState }) => {

  return (
      <div className='About'>
        <div className="image-container">
            <img src={kevin} alt="kevin" className='team-image'/>
            <img src={leo} alt="kevin" className='team-image'/>
            <img src={nick} alt="kevin" className='team-image'/>
        </div>
        <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3149.578533784525!2d-122.26203552388148!3d37.87015097196145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f7718c522d7c1%3A0xda8034ea3b6b3289!2sUniversity%20of%20California%2C%20Berkeley!5e0!3m2!1sen!2sus!4v1730004421136!5m2!1sen!2sus"
        width="800"
        height="280"
        style={{ border: 0 }}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map"
      />
    </div>
  );
}

export default About;
