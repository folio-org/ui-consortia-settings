import PropTypes from 'prop-types';
import { createContext, useMemo } from 'react';

import { useCurrentConsortium } from './hooks';

export const ConsortiumContext = createContext();

export const ConsortiumContextProvider = ({ children }) => {
  const { consortium, isLoading } = useCurrentConsortium();

  const value = useMemo(() => ({
    ...(consortium || {}),
    isLoading,
  }), [consortium, isLoading]);

  return (
    <ConsortiumContext.Provider value={value}>
      {children}
    </ConsortiumContext.Provider>
  );
};

ConsortiumContextProvider.propTypes = {
  children: PropTypes.node,
};
