import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { Layer, LoadingView } from '@folio/stripes/components';

import { ConsortiumPermissionsSetForm } from '../ConsortiumPermissionsSetForm';
import { usePermissionSet, useTenantPermissionSetMutations } from '../hooks';
import { TENANT_ID_SEARCH_PARAMS } from '../constants';

export const PermissionSetsEdit = () => {
  const intl = useIntl();
  const location = useLocation();
  const params = useParams();
  const tenantId = useMemo(() => new URLSearchParams(location.search).get(TENANT_ID_SEARCH_PARAMS), [location.search]);
  const permissionSetId = params?.id;

  const { isLoading, permissionsSet } = usePermissionSet({
    tenantId,
    permissionSetId,
  });

  const { removePermissionSet, updatePermissionSet } = useTenantPermissionSetMutations(tenantId);

  const onRemove = () => removePermissionSet(permissionSetId);

  if (isLoading) {
    return (
      <Layer
        isOpen
        inRootSet
        contentLabel={intl.formatMessage({ id: 'ui-consortia-settings.consortiumManager.members.permissionSets.create.permissionSet.contentLabel' })}
      >
        <LoadingView />
      </Layer>
    );
  }

  return (
    <ConsortiumPermissionsSetForm
      onSave={updatePermissionSet}
      onRemove={onRemove}
      initialValues={permissionsSet}
    />
  );
};
