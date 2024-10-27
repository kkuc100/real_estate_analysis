import React, { useState } from 'react';
import { ApplicationState, PropertyCondition, State } from './ourtypes';

export const defaultApplicationState: ApplicationState = {
    state: State.ALABAMA,
    county: '',
    zipcode: undefined,
    price: undefined,
    propertycondition: PropertyCondition.GOOD,
    dateofproperty: '',
    daysonmarket: undefined,
    risklevel: 0,
  };

  const useApplicationState = () => {
    return useState<ApplicationState>(defaultApplicationState);
};

export default useApplicationState;