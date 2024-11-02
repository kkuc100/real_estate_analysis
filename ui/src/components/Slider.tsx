import React, { ChangeEvent, useEffect,FormEvent, useState } from 'react';
import { ApplicationState, State } from '../ourtypes';
import Slider from '@mui/material/Slider';
import ReactSpeedometer from "react-d3-speedometer";
import marketEdgeLogoOnly from '../assets/MarketEdge_logo_cropped.png';
import MinMaxZipData from '../assets/min_max_price_per_zip_cluster.json';

interface FormProps {
  appState: ApplicationState;
  setAppState: React.Dispatch<React.SetStateAction<ApplicationState>>;
}

interface ZipCodeData {
  zip_cluster: number; // Assuming zip_cluster is a number; adjust as necessary
  min: number;
  max: number;
}


const Form: React.FC<FormProps> = ({ appState, setAppState }) => {
    const [MinMaxZipMap, setMinMaxZipMap] = useState<Map<string, { min: number; max: number }>>(new Map());

    useEffect(() => {
        const fetchMinMaxZipCodes = () => {
        const zipMap = new Map(
            MinMaxZipData.map(item => [
            item.zip_cluster.toString(),
            { min: item.min, max: item.max }
            ])
        );
        setMinMaxZipMap(zipMap);
        };

        fetchMinMaxZipCodes();
    }, []);

    const zipcode = appState.zipcode?.toString();
    const currentZipData = zipcode ? MinMaxZipMap.get(zipcode) : undefined;
    
    const min = currentZipData ? currentZipData.min : 0;
    const max = currentZipData ? currentZipData.max : 1000000;

    // Calculate step size based on range
    const range = max - min;
    const step = Math.ceil(range / 10);

    // Generate marks for the slider
    const marks = Array.from({ length: 11 }, (_, index) => {
        const value = min + (step * index);
        const formattedValue = value >= 1000000 
            ? `${(value / 1000000).toFixed(1)}M` // For millions, e.g., 1.5M
            : value >= 1000 
                ? `${(value / 1000).toFixed(0)}k` // For thousands, e.g., 500k
                : `$${value.toLocaleString()}`; // For values less than 1000
    
        return { value, label: formattedValue };
    }).filter(mark => mark.value <= max);

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setAppState((prevState) => ({
          ...prevState,
          price: newValue as number,
        }));
      };

  return (
    <Slider
      className='custom-slider'
      aria-label="Price Slider"
      value={appState.price}
      onChange={handleSliderChange}
      valueLabelDisplay="auto"
      step={step}
      marks={marks}
      min={min}
      max={max}
    />
  );
};

export default Form;
