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
                  { min: item.min, max: item.max }
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
  console.log("min",min)
  console.log("max",max)
  console.log("range",range)
  console.log("zipData",zipData)

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
          setAppState((prevState) => ({
              ...prevState,
              price: midPrice,
          }));
      }
  }, [appState.zipcode, min, max]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
      setAppState((prevState) => ({
          ...prevState,
          price: newValue as number,
      }));
  };

  useEffect(() => {
      const price = appState.price ?? 0;
      setAppState((prevState) => ({
          ...prevState,
          currentStepIndex: Math.floor((price - min) / step),
      }));
  }, [appState.price, min, step]);
  console.log("final price", appState.price)
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

export default PriceSlider;
