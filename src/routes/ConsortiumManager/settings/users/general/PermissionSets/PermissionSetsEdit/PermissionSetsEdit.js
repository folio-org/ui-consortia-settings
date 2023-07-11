import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Loading } from '@folio/stripes/components';

import { ConsortiumPermissionsSetForm } from '../ConsortiumPermissionsSetForm';
import { usePermissionSet, useTenantPermissionSetMutations } from '../hooks';
import { TENANT_ID_SEARCH_PARAMS } from '../constants';

export const PermissionSetsEdit = () => {
  const location = useLocation();
  const params = useParams();
  const tenantId = useMemo(() => new URLSearchParams(location.search).get(TENANT_ID_SEARCH_PARAMS), [location.search]);
  const permissionSetId = params?.id;

  const { isLoading, permissionsSet } = usePermissionSet({
    tenantId,
    permissionSetId,
  });

  const { removePermissionSet, updatePermissionSet } = useTenantPermissionSetMutations(tenantId);

  const updatePermission = (values) => updatePermissionSet(values);
  const onRemove = () => removePermissionSet(permissionSetId);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ConsortiumPermissionsSetForm
      onSave={updatePermission}
      onRemove={onRemove}
      initialValues={permissionsSet}
    />
  );
};
