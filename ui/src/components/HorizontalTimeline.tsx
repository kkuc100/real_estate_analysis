import React, { useEffect, useRef, useMemo, useState } from 'react';
import { ApplicationState } from '../ourtypes';
import { format, addDays } from 'date-fns';
import { Chrono } from "react-chrono";
import './HorizontalTimeline.css';

interface FormProps {
  appState: ApplicationState;
  setAppState: React.Dispatch<React.SetStateAction<ApplicationState>>;
}

const HorizontalTimeline: React.FC<FormProps> = ({ appState, setAppState }) => {
  
  const [projectedSaleDate, setProjectedSaleDate] = useState<Date | null>(null);
  console.log("projectedSaleDate",projectedSaleDate)
  console.log("Initial dateOfProperty:", appState.dateofproperty);
  console.log("Initial daysOnMarket:", appState.daysonmarket);
  
  useEffect(() => {
    if (appState.dateofproperty && appState.daysonmarket) {
      const newProjectedSaleDate = addDays(new Date(appState.dateofproperty), appState.daysonmarket);
      console.log("newProjectedSaleDate", newProjectedSaleDate);
      setProjectedSaleDate(newProjectedSaleDate);
    } else {
      console.warn("dateofproperty is undefined");
      // Handle the case where dateofproperty is undefined if necessary
    }
  }, [appState.dateofproperty, appState.daysonmarket]);

  
  return (
    <div className="timeline-container">
      <p>The date the property will sell is: {projectedSaleDate ? format(projectedSaleDate, 'MMMM dd, yyyy') : 'N/A'}</p>
    </div>
  );
};

export default HorizontalTimeline;