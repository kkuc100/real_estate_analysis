import React, {ReactNode, ChangeEvent, FormEvent,useState } from 'react';
import { ApplicationStateType, State } from '../ourtypes';
import Slider from '@mui/material/Slider';
import ReactSpeedometer from "react-d3-speedometer";
import kevin from '../assets/kevin.jpeg';
import leo from '../assets/leo.png';
import nick from '../assets/nick.png';
import './About.css'

interface FormProps {
  appState: ApplicationStateType;
  setAppState: React.Dispatch<React.SetStateAction<ApplicationStateType>>;
}

const FlippableCard: React.FC<{ imageSrc: string; altText: string; text: string }> = ({ imageSrc, altText, text }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div onClick={handleFlip}>
      {isFlipped ? (
        <div className='flippable-text'>
          {text}
        </div>
      ) : (
        <img src={imageSrc} alt={altText} className='team-image'/>
      )}
    </div>
  );
};

const About: React.FC<FormProps> = ({ appState, setAppState }) => {
  return (
    <div className="About">
      <div className="image-container">
        <FlippableCard imageSrc={kevin} altText="kevin" text={"Kevin - Data Scientist and Software Engineer currently pursuing his Master's in Data Science at UC Berkeley. He has deployed real-time tracking systems for the Space Development Agency."
        }/>
        <FlippableCard imageSrc={leo} altText="leo" text={"Leo - Senior Data Analyst and Data Scientist at VTS, a commercial real estate technology company, which he leads client facing analytics and reporting."}/>
        <FlippableCard imageSrc={nick} altText="nick" text="Nick - Data Scientist with over 4 years of experience currently living in Buenos Aires, Argentina. His previous experience includes NLP, customer insights, segmentation, and statistics." />
      </div>
      <div className='map-container'>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3149.578533784525!2d-122.26203552388148!3d37.87015097196145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f7718c522d7c1%3A0xda8034ea3b6b3289!2sUniversity%20of%20California%2C%20Berkeley!5e0!3m2!1sen!2sus!4v1730004421136!5m2!1sen!2sus"
        width="950"
        height="210"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map"
      />
      </div>
    </div>
  );
};

export default About;