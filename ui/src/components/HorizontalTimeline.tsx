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
  // const daysOffset = 5;
  // const [dateOfProperty, setDateOfProperty] = useState<Date>(
  //   appState.dateofproperty ? new Date(appState.dateofproperty) : new Date()
  // );
  // const [daysOnMarket, setDaysOnMarket] = useState<number>(appState.daysonmarket || 0);
  // const [projectedSaleDate, setProjectedSaleDate] = useState<Date | null>(null);
  // const [lowerBoundProperty, setLowerBoundProperty] = useState<Date | null>(null);
  // const [upperBoundProperty, setUpperBoundProperty] = useState<Date | null>(null);
  
  // useEffect(() => {
  //   const newProjectedSaleDate = addDays(dateOfProperty, daysOnMarket);
  //   setProjectedSaleDate(newProjectedSaleDate);
  //   setLowerBoundProperty(addDays(newProjectedSaleDate, -daysOffset));
  //   setUpperBoundProperty(addDays(newProjectedSaleDate, daysOffset));
  // }, [dateOfProperty, daysOnMarket]);

  // const dates = [
  //   {
  //     title: dateOfProperty.toDateString(),
  //     cardTitle: "Date Property Entered the Market",
  //   },
  //   {
  //     title: lowerBoundProperty ? lowerBoundProperty.toDateString() : "N/A",
  //     cardTitle: "Lower Bound for Property",
  //   },
  //   {
  //     title: upperBoundProperty ? upperBoundProperty.toDateString() : "N/A",
  //     cardTitle: "Upper Bound for Property",
  //   },
  // ];
  const predicted_date = appState.dateofproperty ? new Date(appState.dateofproperty).toDateString() : "N/A";
  
  return (
    <div className="timeline-container">
      <p>The date the property will sell is: {predicted_date}</p>
    </div>
  );
};

export default HorizontalTimeline;