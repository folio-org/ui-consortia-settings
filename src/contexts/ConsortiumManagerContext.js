import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';

import { useStripes } from '@folio/stripes/core';
import { useToggle } from '@folio/stripes-acq-components';

import {
  useCurrentUserTenantsPermissions,
  useMembersSelection,
  useUserAffiliations,
} from '../hooks';

const DEFAULT_SELECTED_MEMBERS = [];

export const ConsortiumManagerContext = createContext();

export const ConsortiumManagerContextProvider = ({ children }) => {
  const stripes = useStripes();
  const userId = stripes?.user?.user?.id;

  const [isNavigationPaneVisible, toggleNavigationPane] = useToggle(true);

  const {
    members,
    initMembersSelection,
    updateMembersSelection,
  } = useMembersSelection();

  const {
    affiliations,
    isFetching: isAffiliationsFetching,
  } = useUserAffiliations(
    { userId },
    { onSuccess: initMembersSelection },
  );

  const {
    tenantsPermissions,
    isFetching: isPermissionsFetching,
  } = useCurrentUserTenantsPermissions({
    tenants: members?.map(({ id }) => id),
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
    isNavigationPaneVisible,
    permissionNamesMap,
    selectedMembers: members || DEFAULT_SELECTED_MEMBERS,
    selectMembers: updateMembersSelection,
    toggleNavigationPane,
  }), [
    members,
    affiliations,
    hasPerm,
    isFetching,
    isNavigationPaneVisible,
    permissionNamesMap,
    updateMembersSelection,
    toggleNavigationPane,
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
