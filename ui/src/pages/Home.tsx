import React, { ChangeEvent, FormEvent } from 'react';
import { ApplicationState, PropertyCondition, State } from '../ourtypes';
import Slider from '@mui/material/Slider';
import ReactSpeedometer from "react-d3-speedometer";
import marketEdgeLogoOnly from '../assets/MarketEdge_logo_only.jpg';
import './Home.css'

interface FormProps {
  appState: ApplicationState;
  setAppState: React.Dispatch<React.SetStateAction<ApplicationState>>;
}

const Form: React.FC<FormProps> = ({ appState, setAppState }) => {

  function handleCheckEstimation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElements = event.currentTarget.elements;

    const newState: ApplicationState = {
      ...appState,  // Use current state instead of prevState
      state: (formElements.namedItem("state") as HTMLSelectElement)?.value,
      zipcode: Number((formElements.namedItem("zipcode") as HTMLInputElement).value),
      price: Number((formElements.namedItem("price") as HTMLInputElement).value),
      propertycondition: (formElements.namedItem("propertycondition") as HTMLInputElement).value,
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
      const body = JSON.parse(data.body);
      setAppState((prevState) => ({
        ...prevState,
        risklevel: Math.round(body) * 10,
      }));
    } catch (error) {
      console.error('Error calling Lambda:', error);
    }
  }

  function handleClear() {
    setAppState({ ...appState, risklevel: 0, price: 0, state: "", zipcode: 0, propertycondition: "", dateofproperty: "" }); // Reset to default values
  }

  function GetRiskLevel(risklevel: number) {
    if (risklevel >= 65) {
      return "High";
    } else if (risklevel >= 35) {
      return "Medium";
    } else {
      return "Low";
    }
  }

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setAppState((prevState) => ({
      ...prevState,
      price: newValue as number, // Use newValue to get the current slider value
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
                  </td>
                </tr>
                <tr>
                  <td className='td'>
                    <label htmlFor="propertycondition">Property Condition: </label>
                    <select id="propertycondition" name="propertycondition">
                      <option value="" disabled>Select condition</option>
                      {Object.values(PropertyCondition).map((condition) => (
                        <option key={condition} value={condition}>
                          {condition}
                        </option>
                      ))}
                    </select>
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
                <tr>
                  <td className='td'>
                    <label htmlFor="price">Price (No commas): </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      placeholder="Price of Property"
                      style={{ width: '120px' }}
                      max="20000000"
                      min="0"
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
          <h3>Your house is at {GetRiskLevel(appState.risklevel)} risk</h3>
          <div className='speedometer'>
            <ReactSpeedometer 
              maxValue={100}
              minValue={0}
              value={appState.risklevel}
              needleColor="black"
              startColor="green"
              segments={10}
              endColor="red"
              height={180}
            />
          </div>
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
