import React, { useState } from 'react';
import { ApplicationState, State } from './ourtypes';

export const defaultApplicationState: ApplicationState = {
    state: State.ALABAMA,
    zipcode: 2474,
    sqrft: undefined,
    beds: undefined,
    baths: undefined,
    age: undefined,
    price: undefined,
    dateofproperty: new Date("2024-02-10"),
    daysonmarket: 5,
  };

  const useApplicationState = () => {
    return useState<ApplicationState>(defaultApplicationState);
};

export default useApplicationState;