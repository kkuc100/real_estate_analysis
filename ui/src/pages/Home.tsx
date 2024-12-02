import React, { ChangeEvent, useEffect,FormEvent, useState } from 'react';
import { ApplicationStateType, State } from '../ourtypes';
import Slider from '@mui/material/Slider';
import ReactSpeedometer from "react-d3-speedometer";
import marketEdgeLogoOnly from '../assets/MarketEdge_logo_cropped.png';
import { format, addDays } from 'date-fns';
import './Home.css'
import zipData from '../assets/zip_cluster_mapping.json';
import PriceSlider from '../components/PriceSlider';
import HorizontalTimeline from '../components/HorizontalTimeline';
import { ApplicationState } from '../ApplicationState';

interface FormProps {
  appState: ApplicationStateType;
  setAppState: React.Dispatch<React.SetStateAction<ApplicationStateType>>;
}

const Form: React.FC<FormProps> = ({ appState, setAppState }) => {
  const [zipMap, setZipMap] = useState<Map<string, string>>(new Map());
  const [inputZipcode, setInputZipcode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [low, setLow] = useState<number | null>(null);
  const [high, setHigh] = useState<number | null>(null);

  useEffect(() => {
    const fetchZipCodes = () => {

      const zipMapData = new Map(
        zipData.map(item => [
          item.ZIP.toString(),
          item.zip_cluster !== null ? item.zip_cluster.toString() : '', // Handle null by using an empty string
        ])
      );
      setZipMap(zipMapData);
    };
    fetchZipCodes();
  }, []);

  function handleCheckEstimation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElements = event.currentTarget.elements;

    const zip_input = ((formElements.namedItem("zipcode") as HTMLInputElement).value).slice(1);
    setInputZipcode(zip_input);

    if (!zipMap.has(zip_input)) {
      setError('Invalid zip code. Please enter a valid zip code from the list.');
      return;
    } else {
      setError('');
    }
    const DatePlusOneDay = addDays(new Date((formElements.namedItem("dateofproperty") as HTMLInputElement).value), 1);
    const newState: ApplicationStateType = {
      ...appState,  // Use current state instead of prevState
      state: (formElements.namedItem("state") as HTMLSelectElement)?.value,
      zipcode: Number(zipMap.get(zip_input)),
      sqrft: Number((formElements.namedItem("sqrft") as HTMLInputElement).value),
      beds: Number((formElements.namedItem("beds") as HTMLInputElement).value),
      baths: Number((formElements.namedItem("baths") as HTMLInputElement).value),
      age: Number((formElements.namedItem("age") as HTMLInputElement).value),
      inputdate: DatePlusOneDay,
    };

    setAppState(newState);
    console.log("newState", newState);
    callSageMakerEndpoint(newState);
  }

  async function callSageMakerEndpoint(newState: ApplicationStateType) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newState),
    };

    try {
      const response = await fetch('https://ir19td8z0m.execute-api.us-east-1.amazonaws.com/real_estates', requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("response from Lambda", data)
      const predicteddom = JSON.parse(data.body);
      setAppState((prevState) => ({
        ...prevState,
        predicteddom: predicteddom,
      }));
    } catch (error) {
      console.error('Error calling Lambda:', error);
    }
  }

  function handleClear() {
    setAppState(ApplicationState);
    setInputZipcode(''); 
    setError(''); 
  }

  useEffect(() => {
    if (appState.lowerDate && appState.upperDate && appState.inputdate) {
      const lowValue = Math.round((appState.lowerDate.getTime() - appState.inputdate.getTime()) / (1000 * 60 * 60 * 24));
      const highValue = Math.round((appState.upperDate.getTime() - appState.inputdate.getTime()) / (1000 * 60 * 60 * 24));
      setLow(lowValue);
      setHigh(highValue);
    } else {
      console.warn("Dates are missing in appState");
    }
  }, [appState.lowerDate, appState.upperDate, appState.inputdate]);
  

  

  return (
    <div className='Home'>
      <div className='grid-container'>
        <div className='grid-item'>
          <header>
            <h1>
              Are you wondering how long your property will be on the market?
            </h1>
          </header>
          <p>Please fill out the appropriate fields to estimate time on market</p>

          <form onSubmit={handleCheckEstimation}>
            <table className='inputtable'>
              <tbody>
                <tr>
                  <td className='td'>
                    <label htmlFor="state">State:</label>
                    <select id="state" name="state">
                      <option value="" disabled>Select state</option>
                      {Object.values(State).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className='td'>
                  <label htmlFor="zipcode">Zip Code: </label>
                  <input
                    type="text"
                    id="zipcode"
                    name="zipcode"
                    placeholder="Zip Code (ex. 01960)"
                    maxLength={5}
                    pattern="\d{5}"
                  />
                  {error && <span className="error">{error}</span>}
                  </td>
                </tr>
                <tr>
                  <td className='td'>
                    <label htmlFor="sqrft">Square Feet: </label>
                    <input
                      type="number"
                      id="sqrft"
                      name="sqrft"
                      placeholder="Square Feet"
                      style={{ width: '120px' }}
                      max="100000"
                      min="227"
                    />
                  </td>
                </tr>
                <tr>
                  <td className='td'>
                    <label htmlFor="beds">Number of Beds: </label>
                    <input
                      type="number"
                      id="beds"
                      name="beds"
                      placeholder="Beds"
                      style={{ width: '120px' }}
                      max="7"
                      min="1"
                    />
                  </td>
                </tr>
                <tr>
                  <td className='td'>
                    <label htmlFor="baths">Number of Baths: </label>
                    <input
                      type="number"
                      id="baths"
                      name="baths"
                      placeholder="Baths"
                      style={{ width: '120px' }}
                      max="21"
                      min="1"
                    />
                  </td>
                </tr>
                <tr>
                  <td className='td'>
                    <label htmlFor="age">Age of Property: </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      placeholder="age"
                      style={{ width: '120px' }}
                      max="2011"
                      min="0"
                    />
                  </td>
                </tr>
                <tr>
                  <td className='td'>
                    <label htmlFor="dateofproperty">Date property entered the market: </label>
                    <input
                      type="date"
                      id="dateofproperty"
                      name="dateofproperty"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className='button'>
            <button id='submit-button' type='button' onClick={handleClear}>Clear</button>
              <button id='submit-button' type='submit'>Check Estimation</button>
            </div>
          </form>
        </div>
        <div className='grid-item'>
        <h2 style={{ marginBottom: '0px' }}>Timeline Prediction</h2>
        {appState.predicteddom !== undefined ? (
            <>
              <HorizontalTimeline appState={appState} setAppState={setAppState} />
              <p>
              <strong>Expected time on market:</strong> {low} to {high} days
            </p>
            </>
          ) :  (
            <p>Please input property characteristics to get the prediction</p>
          )}
          <h2>Price Slider ($)</h2>
          {appState.predicteddom !== undefined ? (
            <PriceSlider appState={appState} setAppState={setAppState} />
          ) : (
            <p>Please input property characteristics to get the prediction</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Form;
