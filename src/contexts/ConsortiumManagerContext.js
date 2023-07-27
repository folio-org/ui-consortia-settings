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

  const {
    affiliations,
    isFetching: isAffiliationsFetching,
  } = useUserAffiliations(
    { userId },
    { onSuccess: initSelectedMembers },
  );

  const {
    permissionNames,
    isFetching: isPermissionsFetching,
  } = useUserTenantsPermissions({ userId, tenants: selectedMembers?.map(({ id }) => id) });

  const isFetching = isPermissionsFetching || isAffiliationsFetching;

  const permissionNamesMap = useMemo(() => Object.entries(permissionNames).reduce((acc, [tenant, perms]) => {
    acc[tenant] = perms.reduce((_acc, perm) => ({ ..._acc, [perm]: true }), {});

    return acc;
  }, {}), [permissionNames]);

  const hasPerm = useCallback((tenantIds, permissions) => {
    const tenants = (Array.isArray(tenantIds) ? tenantIds : [tenantIds]).filter(Boolean);
    const perms = (Array.isArray(permissions) ? permissions : [permissions]).filter(Boolean);

    return tenants.every((tenant) => perms.every(perm => permissionNamesMap[tenant]?.[perm]));
  }, [permissionNamesMap]);

  const contextValue = useMemo(() => ({
    affiliations,
    hasPerm,
    isFetching,
    selectedMembers: selectedMembers || DEFAULT_SELECTED_MEMBERS,
    selectMembers,
    selectMembersDisabled,
    setSelectMembersDisabled,
  }), [
    affiliations,
    hasPerm,
    isFetching,
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
