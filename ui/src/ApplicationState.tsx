import React, { useState } from 'react';
import { ApplicationState, State } from './ourtypes';

export const defaultApplicationState: ApplicationState = {
    state: State.ALABAMA,
    zipcode: undefined,
    sqrft: undefined,
    beds: undefined,
    baths: undefined,
    age: undefined,
    price: undefined,
    dateofproperty: '',
    daysonmarket: undefined,
  };

  const useApplicationState = () => {
    return useState<ApplicationState>(defaultApplicationState);
};

export default useApplicationState;