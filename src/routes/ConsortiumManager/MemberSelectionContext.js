import PropTypes from 'prop-types';
import {
  createContext,
  useContext,
  useMemo,
} from 'react';

import { useMemberSelection } from './hooks';

export const MemberSelectionContext = createContext();

export const useMemberSelectionContext = () => useContext(MemberSelectionContext);

export const MemberSelectionContextProvider = ({ children }) => {
  const {
    activeMember,
    membersOptions,
    setActiveMember,
  } = useMemberSelection();

  const value = useMemo(() => ({
    activeMember,
    membersOptions,
    setActiveMember,
  }), [
    activeMember,
    membersOptions,
    setActiveMember,
  ]);

  return (
    <MemberSelectionContext.Provider value={value}>
      {children}
    </MemberSelectionContext.Provider>
  );
};

MemberSelectionContextProvider.propTypes = {
  children: PropTypes.node,
};
