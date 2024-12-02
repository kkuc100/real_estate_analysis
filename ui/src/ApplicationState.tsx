import React, { useState } from 'react';
import { ApplicationStateType, State } from './ourtypes';

export const ApplicationState: ApplicationStateType = {
    state: State.ALABAMA,
    zipcode: 2474,
    sqrft: undefined,
    beds: undefined,
    baths: undefined,
    age: undefined,
    price: undefined,
    inputdate: undefined,
    predicteddom: undefined,
    upperDate: undefined,
    projectedSaleDate: undefined, 
    lowerDate: undefined,
    currentStepIndex: 5
  };