import React, { ChangeEvent, useEffect,FormEvent, useState } from 'react';
import { ApplicationState, State } from '../ourtypes';
import Slider from '@mui/material/Slider';
import ReactSpeedometer from "react-d3-speedometer";
import marketEdgeLogoOnly from '../assets/MarketEdge_logo_only.jpg';
import './Home.css'
import zipData from '../assets/zip_cluster_mapping.json';

interface FormProps {
  appState: ApplicationState;
  setAppState: React.Dispatch<React.SetStateAction<ApplicationState>>;
}

interface ZipCodeData {
  ZIP: string;       // Assuming ZIP is a string
  zip_cluster: number; // Assuming zip_cluster is a number; adjust as necessary
}


const Form: React.FC<FormProps> = ({ appState, setAppState }) => {
  const [zipMap, setZipMap] = useState<Map<string, string>>(new Map());
  const [inputZipcode, setInputZipcode] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchZipCodes = () => {
      // Map through the zipData and ensure zip_cluster is treated as a string
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

    const newState: ApplicationState = {
      ...appState,  // Use current state instead of prevState
      state: (formElements.namedItem("state") as HTMLSelectElement)?.value,
      zipcode: Number(zipMap.get(zip_input)),
      sqrft: Number((formElements.namedItem("sqrft") as HTMLInputElement).value),
      beds: Number((formElements.namedItem("beds") as HTMLInputElement).value),
      baths: Number((formElements.namedItem("baths") as HTMLInputElement).value),
      age: Number((formElements.namedItem("age") as HTMLInputElement).value),
      dateofproperty: (formElements.namedItem("dateofproperty") as HTMLInputElement).value,
    };

    setAppState(newState);
    console.log("newState", newState);
    callSageMakerEndpoint(newState);
  }

  async function callSageMakerEndpoint(newState: ApplicationState) {
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
      const daysonmarket = JSON.parse(data.body);
      setAppState((prevState) => ({
        ...prevState,
        daysonmarket: daysonmarket,
      }));
    } catch (error) {
      console.error('Error calling Lambda:', error);
    }
  }

  function handleClear() {
    setAppState({ ...appState,
      state: State.ALABAMA,
      zipcode: undefined,
      sqrft: undefined,
      beds: undefined,
      baths: undefined,
      age: undefined,
      price: undefined,
      dateofproperty: '',
      daysonmarket: undefined,});
      setInputZipcode(''); // Clear input zipcode
      setError('');
    };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setAppState((prevState) => ({
      ...prevState,
      price: newValue as number,
    }));
  };



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
                    placeholder="Zip Code"
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
                      max="1000000"
                      min="0"
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
                      max="100"
                      min="0"
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
                      max="60"
                      min="0"
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
                      max="1000"
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
              <button id='submit-button' type='submit'>Check Estimation</button>
              <button id='submit-button' type='button' onClick={handleClear}>Clear</button>
            </div>
          </form>
        </div>
        <div className='grid-item'>
          <Slider
            className='custom-slider'
            aria-label="Price Slider"
            value={appState.price}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            step={100000}
            marks={[
              { value: 0, label: '0' },
              { value: 100000, label: '$100k' },
              { value: 200000, label: '$200k' },
              { value: 300000, label: '$300k' },
              { value: 400000, label: '$400k' },
              { value: 500000, label: '$500k' },
              { value: 600000, label: '$600k' },
              { value: 700000, label: '$700k' },
              { value: 800000, label: '$800k' },
              { value: 900000, label: '$900k' },
            ]}
            min={0}
            max={900000}
          />
          <h3>Steps can be taken to lower risk</h3>
          <table className='risktable'>
            <tbody>
              <tr>
                <td className='td'>Reevaluate house pricing strategy</td>
              </tr>
              <tr>
                <td className='td'>Reach out to real estate agents</td>
              </tr>
              <tr>
                <td className='td'>Evaluate the current market volatility</td>
              </tr>
            </tbody>
          </table>
          <p>Check out the Tips page for more information</p>
        </div>
      </div>
      <div>
        <img src={marketEdgeLogoOnly} alt="Market Edge Logo Only" id='image-logo' />
      </div>
    </div>
  );
}

export default Form;
