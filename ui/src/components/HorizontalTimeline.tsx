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

  /* Workflow. User inputs info and submits
  - inputdate
  - lowerDate
  - projectedSaleDate
  - UpperDate */

  useEffect(() => {
    if (appState.inputdate && appState.predicteddom && appState.zipcode && appState.currentStepIndex !== undefined) {
      console.log("AppState",appState)
      const zipValues = DomMap.get(appState.zipcode.toString()); // Ensure the key is a string
      if (zipValues && zipValues[appState.currentStepIndex] !== undefined) {
        /* adjustmentFactor pulls a constant ie. 3 */
        const adjustmentFactor = zipValues[appState.currentStepIndex];
        /* projectedSaleDate adds the input date the user added to the prediction */
        const projectedSaleDate = addDays(new Date(appState.inputdate), appState.predicteddom);
        /* adjustedSaleDate accounts for the slider change */
        const adjustedSaleDate = addDays(projectedSaleDate, adjustmentFactor);
        console.log("adjustedSaleDate",adjustedSaleDate)
        setAppState((prevState) => ({
          ...prevState,
          lowerDate: addDays(adjustedSaleDate, -10),
          projectedSaleDate: adjustedSaleDate,
          upperDate: addDays(adjustedSaleDate, 10),
        }));
      } 
    } else {
      console.warn("Missing required data from appState");
    }
  }, [appState.inputdate, appState.predicteddom, appState.zipcode, appState.currentStepIndex]);
  
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSelectedDate(formatDate(newValue as number));
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  const sliderMin = appState.inputdate ? appState.inputdate.getTime() : 0;
  const sliderMax = appState.upperDate ? appState.upperDate.getTime() : 1000000000000;

  const marks=[
    { value: appState.inputdate?.getTime() || 0, label: formatDate(appState.inputdate?.getTime() || 0) },
    { value: appState.lowerDate?.getTime() || 0, label: formatDate(appState.lowerDate?.getTime() || 0) },
    { value: appState.projectedSaleDate?.getTime() || 0, label: formatDate(appState.projectedSaleDate?.getTime() || 0) },
    { value: appState.upperDate?.getTime() || 0, label: formatDate(appState.upperDate?.getTime() || 0) },
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
        value={appState.projectedSaleDate?.getTime() || 0}
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