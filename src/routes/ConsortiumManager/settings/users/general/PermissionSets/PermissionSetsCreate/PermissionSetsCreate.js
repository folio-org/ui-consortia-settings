import { useCallback, useMemo } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

import { HasCommand, Layer, Loading } from '@folio/stripes/components';
import { useShowCallout } from '@folio/stripes-acq-components';
import { stripesConnect } from '@folio/stripes/core';

import { TENANT_ID_SEARCH_PARAMS, PERMISSION_SET_ROUTES } from '../constants';
import { PermissionSetForm } from '../../../../../../../temp';
import { useManageTenantPermissions, useSelectPermissionSetById } from '../hooks';

const PermissionSetsCreate = (props) => {
  const { intl, stripes, history, location, match } = props;
  const { search } = location;
  const showCallout = useShowCallout();

  const permissionSetId = match.params?.id;
  const tenantId = useMemo(() => new URLSearchParams(search).get(TENANT_ID_SEARCH_PARAMS), [search]);

  const { isLoading, selectedPermissionSet: initialValues } = useSelectPermissionSetById({
    permissionSetId,
    tenantId,
  });

  const handlePermissionsLoadingError = useCallback(async ({ response }) => {
    const errorMessageId = 'ui-consortia-settings.consortiumManager.members.permissionSets.create.permissionSet.error';
    const defaultMessage = intl.formatMessage({ id: errorMessageId });

    if (response?.status === 403) {
      return showCallout({
        message: `${defaultMessage} ${intl.formatMessage({ id: 'ui-consortia-settings.errors.permissionsRequired' })}`,
        type: 'error',
      });
    }

    const error = await response?.text();

    return showCallout({
      message: intl.formatMessage({ id: errorMessageId }, { error }),
      type: 'error',
    });
  }, [intl, showCallout]);

  const handleCancel = () => {
    history.push({
      pathname: PERMISSION_SET_ROUTES.PERMISSION_SETS,
      state: { isUpdated: true },
    });
  };

  const handleSuccess = (action) => {
    handleCancel();

    const permissionName = initialValues?.displayName;

    const actionType = {
      create: intl.formatMessage({ id: 'ui-consortia-settings.consortiumManager.members.permissionSets.create.permissionSet.success' }),
      update: intl.formatMessage({ id: 'ui-consortia-settings.consortiumManager.members.permissionSets.update.permissionSet.success' }, {
        permissionName,
      }),
      remove: intl.formatMessage({ id: 'ui-consortia-settings.consortiumManager.members.permissionSets.remove.permissionSet.success' }, {
        permissionName,
      }),
    };

    return showCallout({
      message: actionType[action],
      type: 'success',
    });
  };

  const { createPermission, removePermission, updatePermission } = useManageTenantPermissions(tenantId, {
    onError: handlePermissionsLoadingError,
  });

  const handleRemove = () => {
    removePermission(permissionSetId, {
      onSuccess: () => handleSuccess('remove'),
    });
  };

  const handleSubmit = (values) => {
    const filtered = omit(values, ['childOf', 'grantedTo', 'dummy', 'deprecated']);
    const permSet = {
      ...filtered,
      mutable: true,
      subPermissions: (values.subPermissions || []).map(p => p.permissionName),
    };

    if (permissionSetId) {
      return updatePermission(permSet, {
        onSuccess: () => handleSuccess('update'),
      });
    }

    return createPermission(permSet, {
      onSuccess: () => handleSuccess('create'),
    });
  };

  const keyboardCommands = [
    {
      name: 'cancel',
      handler: handleCancel,
      shortcut: 'esc',
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <HasCommand
      commands={keyboardCommands}
      scope={document.body}
    >
      <Layer isOpen inRootSet>
        <PermissionSetForm
          intl={intl}
          stripes={stripes}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onRemove={handleRemove}
          initialValues={initialValues}
        />
      </Layer>
    </HasCommand>
  );
};

PermissionSetsCreate.propTypes = {
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    connect: PropTypes.func.isRequired,
  }).isRequired,
  intl: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
};

export default stripesConnect(injectIntl(PermissionSetsCreate));
