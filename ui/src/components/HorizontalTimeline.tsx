import React, { useEffect, useState } from 'react';
import { ApplicationStateType } from '../ourtypes';
import Slider from '@mui/material/Slider';
import { format, addDays } from 'date-fns';
import Arches from './Arches'
import PriceDomAdjust from '../assets/price_dom_adjustments.json';
import './HorizontalTimeline.css'

interface FormProps {
  appState: ApplicationStateType;
  setAppState: React.Dispatch<React.SetStateAction<ApplicationStateType>>;
}

const HorizontalTimeline: React.FC<FormProps> = ({ appState, setAppState }) => {
  const [DomMap, setDomMap] = useState<Map<string, number[]>>(new Map());
  const [lowerDate, setlowerDate] = useState<Date | null>(null);
  const [projectedSaleDate, setProjectedSaleDate] = useState<Date | null>(null);
  const [upperDate, setupperDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    const fetchDomArray = () => {
      const DomArray = new Map(
        Object.entries(PriceDomAdjust).map(([key, values]) => [
          key.toString(),
          values as number[], // Ensure values are cast correctly
        ])
      );
      setDomMap(DomArray);
    };
    fetchDomArray();
  }, []);

  useEffect(() => {
    if (appState.dateofproperty && appState.daysonmarket && appState.zipcode && appState.currentStepIndex !== undefined) {
      const projectedDate = addDays(new Date(appState.dateofproperty), appState.daysonmarket);
      console.log("AppState",appState)
      const zipValues = DomMap.get(appState.zipcode.toString()); // Ensure the key is a string
      if (zipValues && zipValues[appState.currentStepIndex] !== undefined) {
        const adjustmentFactor = zipValues[appState.currentStepIndex];
        const adjustedSaleDate = addDays(projectedDate, adjustmentFactor);
        console.log("adjustedSaleDate",adjustedSaleDate)
        setlowerDate(addDays(adjustedSaleDate, -10));
        setupperDate(addDays(adjustedSaleDate, 10));
        setProjectedSaleDate(adjustedSaleDate);
      } else {
        console.warn("Invalid adjustment factor or zip code");
      }
    } else {
      console.warn("Missing required data from appState");
    }
  }, [appState.dateofproperty, appState.daysonmarket, appState.zipcode, appState.currentStepIndex]);
  
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSelectedDate(formatDate(newValue as number));
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  const sliderMin = appState.dateofproperty ? appState.dateofproperty.getTime() : 0;
  const sliderMax = upperDate ? upperDate.getTime() : 1000000000000;

  const marks=[
    { value: appState.dateofproperty?.getTime() || 0, label: formatDate(appState.dateofproperty?.getTime() || 0) },
    { value: lowerDate?.getTime() || 0, label: formatDate(lowerDate?.getTime() || 0) },
    { value: projectedSaleDate?.getTime() || 0, label: formatDate(projectedSaleDate?.getTime() || 0) },
    { value: upperDate?.getTime() || 0, label: formatDate(upperDate?.getTime() || 0) },
  ]

  return (
    <div className='horizontal-component'>
      <Arches
      marks = {marks}
      sliderMin = {sliderMin}
      sliderMax = {sliderMax}
      />
      <Slider
        className='horizontal-slider'
        value={projectedSaleDate?.getTime() || 0}
        onChange={handleSliderChange}
        min={sliderMin}
        max={sliderMax}
        step={null}
        marks={marks}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => formatDate(value as number)}
      />
    </div>
  );
};

export default HorizontalTimeline;