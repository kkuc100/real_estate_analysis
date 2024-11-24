import React, { ChangeEvent, useEffect,FormEvent, useState } from 'react';
import { ApplicationStateType, State } from '../ourtypes';
import Slider from '@mui/material/Slider';
import ReactSpeedometer from "react-d3-speedometer";
import marketEdgeLogoOnly from '../assets/MarketEdge_logo_cropped.png';
import MinMaxZipData from '../assets/min_max_price_per_zip_cluster.json';

interface FormProps {
  appState: ApplicationStateType;
  setAppState: React.Dispatch<React.SetStateAction<ApplicationStateType>>;
}

interface ZipCodeData {
  zip_cluster: number; // Assuming zip_cluster is a number; adjust as necessary
  min: number;
  max: number;
}

const PriceSlider: React.FC<FormProps> = ({ appState, setAppState }) => {
    const [MinMaxZipMap, setMinMaxZipMap] = useState<Map<string, { min: number; max: number }>>(new Map());
  
    useEffect(() => {
      const fetchMinMaxZipCodes = () => {
        const zipMap = new Map(
          MinMaxZipData.map(item => [
            item.zip_cluster.toString(),
            { min: item.min, max: item.max },
          ])
        );
        setMinMaxZipMap(zipMap);
      };
  
      fetchMinMaxZipCodes();
    }, []);
  
    if (!appState.zipcode) {
      throw new Error("Zipcode is required.");
    }
  
    const zipcode = appState.zipcode.toString();
    const zipData = MinMaxZipMap.get(zipcode);
    const min = zipData?.min ?? 0;
    const max = zipData?.max ?? 1000000; // Default max value
    const range = max - min;
    const step = range > 0 ? Math.ceil(range / 10) : 1;
  
    console.log("min:", min, "max:", max, "range:", range, "zipData:", zipData);
  
    // Generate marks for the slider
    const marks = Array.from({ length: 11 }, (_, index) => {
      const value = min + step * index;
      const formattedValue = value >= 1000000
        ? `${(value / 1000000).toFixed(1)}M`
        : value >= 1000
          ? `${(value / 1000).toFixed(0)}k`
          : `$${value.toLocaleString()}`;
      return { value, label: formattedValue };
    });
  
    useEffect(() => {
      if (zipData) {
        const midPrice = (max + min) / 2;
        console.log("Calculated midPrice:", midPrice);
        setAppState((prevState) => ({
          ...prevState,
          price: midPrice,
        }));
      }
    }, [appState.zipcode, min, max, setAppState]);
  
    const handleSliderChange = (event: Event, newValue: number | number[]) => {
      setAppState((prevState) => ({
        ...prevState,
        price: newValue as number,
      }));
    };
  
    useEffect(() => {
      const price = appState.price ?? 0;
      const stepIndex = Math.floor((price - min) / step);
      console.log("Calculated step index:", stepIndex);
      setAppState((prevState) => ({
        ...prevState,
        currentStepIndex: stepIndex,
      }));
    }, [appState.price, min, step, setAppState]);
  
    console.log("Final price:", appState.price);
  
    // Prevent rendering slider until the necessary data is available
    if (min === 0 || max === 1000000 || !appState.price) {
      return <div>Loading...</div>; // Display loading message while waiting for data
    }
  
    return (
      <Slider
        className="custom-slider"
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
  
  export default PriceSlider;
  