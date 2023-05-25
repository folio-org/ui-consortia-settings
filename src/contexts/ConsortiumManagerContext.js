import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import {
  updateUser,
  useStripes,
} from '@folio/stripes/core';

import { useUserAffiliations } from '../hooks';

export const ConsortiumManagerContext = createContext();

export const ConsortiumManagerContextProvider = ({ children }) => {
  const stripes = useStripes();
  const [selectMembersDisabled, setSelectMembersDisabled] = useState();
  const selectedMembers = stripes?.user?.user?.selectedConsortiumMembers;

  const selectMembers = useCallback(async (members) => {
    await updateUser(stripes.store, {
      selectedConsortiumMembers: members,
    });
  }, [stripes.store]);

  const initSelectedMembers = useCallback(async (data) => {
    if (!selectedMembers) {
      await selectMembers(
        data.map(({ tenantId, tenantName }) => ({ id: tenantId, name: tenantName })),
      );
    }
  }, [selectedMembers, selectMembers]);

  const { affiliations } = useUserAffiliations(
    { userId: stripes?.user?.user?.id },
    { onSuccess: initSelectedMembers },
  );

  const value = {
    affiliations,
    selectedMembers,
    selectMembers,
    selectMembersDisabled,
    setSelectMembersDisabled,
  };

  return (
    <ConsortiumManagerContext.Provider value={value}>
      {children}
    </ConsortiumManagerContext.Provider>
  );
};

ConsortiumManagerContextProvider.propTypes = {
  children: PropTypes.node,
};

export const useConsortiumManagerContext = () => useContext(ConsortiumManagerContext);
