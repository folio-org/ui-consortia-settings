import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Loading } from '@folio/stripes/components';

import { ConsortiumPermissionsSetForm } from '../ConsortiumPermissionsSetForm/ConsortiumPermissionsSetForm';
import { usePermissionSet, useTenantPermissionMutations } from '../hooks';
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

  const { removePermission, updatePermission } = useTenantPermissionMutations(tenantId);

  const onSave = (values) => updatePermission((values));
  const onRemove = () => removePermission(permissionSetId);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ConsortiumPermissionsSetForm
      onSave={onSave}
      onRemove={onRemove}
      initialValues={permissionsSet}
    />
  );
};
