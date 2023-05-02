import PropTypes from 'prop-types';
import { createContext } from 'react';

import { useStripes } from '@folio/stripes/core';

export const ConsortiumContext = createContext();

const INITIAL_DATA = {};

export const ConsortiumContextProvider = ({ children }) => {
  const stripes = useStripes();

  return (
    <ConsortiumContext.Provider value={stripes.consortium || INITIAL_DATA}>
      {children}
    </ConsortiumContext.Provider>
  );
};

ConsortiumContextProvider.propTypes = {
  children: PropTypes.node,
};
