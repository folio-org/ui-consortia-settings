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

import {
  useCurrentUserTenantsPermissions,
  useUserAffiliations,
} from '../hooks';

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
    tenantsPermissions,
    isFetching: isPermissionsFetching,
  } = useCurrentUserTenantsPermissions({
    tenants: selectedMembers?.map(({ id }) => id),
    expandPermissions: true,
  });

  const isFetching = isPermissionsFetching || isAffiliationsFetching;

  const permissionNamesMap = useMemo(() => Object.entries(tenantsPermissions).reduce((acc, [tenant, perms]) => {
    acc[tenant] = perms.reduce((_acc, { permissionName }) => {
      _acc[permissionName] = true;

      return _acc;
    }, {});

    return acc;
  }, {}), [tenantsPermissions]);

  const hasPerm = useCallback((tenantIds, permissions) => {
    const tenants = (Array.isArray(tenantIds) ? tenantIds : [tenantIds]).filter(Boolean);
    const perms = (Array.isArray(permissions) ? permissions : [permissions]).filter(Boolean);

    return tenants.every((tenant) => perms.every(perm => Boolean(permissionNamesMap[tenant]?.[perm])));
  }, [permissionNamesMap]);

  const contextValue = useMemo(() => ({
    affiliations,
    hasPerm,
    isFetching,
    permissionNamesMap,
    selectedMembers: selectedMembers || DEFAULT_SELECTED_MEMBERS,
    selectMembers,
    selectMembersDisabled,
    setSelectMembersDisabled,
  }), [
    affiliations,
    hasPerm,
    isFetching,
    permissionNamesMap,
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
