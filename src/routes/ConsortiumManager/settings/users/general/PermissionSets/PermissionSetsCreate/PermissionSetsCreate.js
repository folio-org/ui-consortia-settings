import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { ConsortiumPermissionsSetForm } from '../ConsortiumPermissionsSetForm';
import { useTenantPermissionSetMutations } from '../hooks';
import { TENANT_ID_SEARCH_PARAMS } from '../constants';

export const PermissionSetsCreate = () => {
  const location = useLocation();
  const tenantId = useMemo(() => new URLSearchParams(location.search).get(TENANT_ID_SEARCH_PARAMS), [location.search]);

  const { createPermissionSet } = useTenantPermissionSetMutations(tenantId);

  const onSave = (values) => createPermissionSet(values);

  return <ConsortiumPermissionsSetForm onSave={onSave} />;
};
