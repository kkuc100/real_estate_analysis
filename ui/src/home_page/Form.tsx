import React, { useState, ChangeEvent, FormEvent } from 'react';
import './HomeApp.css';
import { ApplicationState, PropertyCondition, State } from '../ourtypes';
import ReactSpeedometer from "react-d3-speedometer"

interface InputData {
  state: string;
  zipcode: number;
  price: number;
  propertycondition: string;
  dateofproperty: string;
}

function Form() {
  const [applicationState, setApplicationState] = useState<ApplicationState>({
    state: '',
    county: '',
    zipcode: undefined,
    price: undefined,
    propertycondition: '',
    dateofproperty: '',
    daysonmarket: undefined,
    risklevel: 0,
  });

  function handleCheckEstimation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElements = event.currentTarget.elements;
    console.log("formElements", formElements)
    const newState = {
      state: (formElements.namedItem("state") as HTMLSelectElement)?.value,
      zipcode: Number((formElements.namedItem("zipcode") as HTMLInputElement).value),
      price: Number((formElements.namedItem("price") as HTMLInputElement).value),
      propertycondition: (formElements.namedItem("propertycondition") as HTMLInputElement).value,
      dateofproperty: (formElements.namedItem("dateofproperty") as HTMLInputElement).value,
  };
    setApplicationState((prevState) => ({
      ...prevState,
      ...newState,
    }));
    console.log("newState",newState);
    callSageMakerEndpoint(newState)
  }

  async function callSageMakerEndpoint(newState: InputData) {
    const requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(newState),
  };

  try {
      const response = await fetch('https://ir19td8z0m.execute-api.us-east-1.amazonaws.com/real_estates', requestOptions);
      console.log("response",response)
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Response from Lambda:', data);
      setApplicationState((prevState) => ({
        ...prevState,
        risklevel: Math.round(data)*10,
      }));
  } catch (error) {
      console.error('Error calling Lambda:', error);
  }
}

  function handleClear() {
      setApplicationState({
        state: '',
        county: '',
        zipcode: undefined,
        price: undefined,
        propertycondition: '',
        dateofproperty: '',
        daysonmarket: undefined,
        risklevel:0,
      });
    }
  
  function GetRiskLevel(applicationState: { risklevel: number }) {
    if (65 <= applicationState.risklevel){
    return "High"
    } else if (35 <= applicationState.risklevel)
    return "Medium"
    else{
      return "Low"
    }
  }

  console.log("applicationState",applicationState);
  /*  ------------Return-------------*/
  return (
    <div className='HomeApp'>
      <div className='grid-container'>
      <div className='grid-item'>
      <header>
        <h1>
          Are you wondering how long your property will be on the market?
        </h1>
      </header>
      <p>Please fill out the appropriate fields to estimate time on market</p>

      <form onSubmit = {handleCheckEstimation}>
        <table className='inputtable'>
        <tbody>
        <tr>
        <td className='td'>
            <label htmlFor="state">State:</label>
            <select
              id="state"
              name="state"
            >
              <option value="" disabled>Select state</option>
              {Object.values(State).map((state) => (
                <option key={state} value={state}>{state}</option>
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
            <select
              id="propertycondition"
              name="propertycondition"
            >
              <option value="" disabled>Select condition</option>
              {Object.values(PropertyCondition).map((propertycondition) => (
                <option key={propertycondition} value={propertycondition}>{propertycondition}</option>
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
              type="text"
              id="price"
              name="price"
              placeholder="Price of Property"
            />
           </td>
        </tr>
      </tbody>
    </table>
      <button type='submit'>Check Estimation </button>
      <button type="button" onClick={handleClear}>Clear</button>
      </form>

      </div>
      <div className='grid-item'>
        <div className='speedometer'>
        <h3>Your house is at {GetRiskLevel(applicationState)} risk</h3>
        <ReactSpeedometer 
        maxValue={100}
        minValue={0}
        value={applicationState.risklevel}
        needleColor="black"
        startColor="green"
        segments={10}
        endColor="red"
        />
        </div>
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
    </div>
  );
}

export default Form;