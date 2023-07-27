import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  updateUser,
  useStripes,
} from '@folio/stripes/core';

import { useUserAffiliations, useUserTenantsPermissions } from '../hooks';

const DEFAULT_SELECTED_MEMBERS = [];

export const ConsortiumManagerContext = createContext();

export const ConsortiumManagerContextProvider = ({ children }) => {
  const stripes = useStripes();
  const [selectMembersDisabled, setSelectMembersDisabled] = useState();
  const selectedMembers = stripes?.user?.user?.selectedConsortiumMembers;
  const userId = stripes?.user?.user?.id;

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
    { userId },
    { onSuccess: initSelectedMembers },
  );

  const { perms } = useUserTenantsPermissions({ userId, tenants: selectMembers.map(({ id }) => id) });

  console.log('perms', perms);

  const contextValue = useMemo(() => ({
    affiliations,
    selectedMembers: selectedMembers || DEFAULT_SELECTED_MEMBERS,
    selectMembers,
    selectMembersDisabled,
    setSelectMembersDisabled,
  }), [
    affiliations,
    selectMembers,
    selectMembersDisabled,
    selectedMembers,
  ]);

  return (
    <ConsortiumManagerContext.Provider value={contextValue}>
      {children}
    </ConsortiumManagerContext.Provider>
  );
};

ConsortiumManagerContextProvider.propTypes = {
  children: PropTypes.node,
};

export const useConsortiumManagerContext = () => useContext(ConsortiumManagerContext);
