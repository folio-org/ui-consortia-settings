import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import { useQueryClient } from 'react-query';

import { HasCommand, Layer } from '@folio/stripes/components';
import { useShowCallout } from '@folio/stripes-acq-components';
import { useNamespace, useStripes } from '@folio/stripes/core';

import { PermissionSetForm } from '../../../../../../../temp';

import { TENANT_ID_SEARCH_PARAMS, PERMISSION_SET_ROUTES } from '../constants';

export const ConsortiumPermissionsSetForm = ({
  onSave,
  onRemove,
  initialValues,
}) => {
  const history = useHistory();
  const location = useLocation();
  const intl = useIntl();
  const stripes = useStripes();
  const [namespace] = useNamespace({ key: 'tenant-permissions' });

  const tenantId = useMemo(() => new URLSearchParams(location.search).get(TENANT_ID_SEARCH_PARAMS), [location.search]);
  const showCallout = useShowCallout();
  const queryClient = useQueryClient();

  const onCancel = () => {
    history.push({
      pathname: PERMISSION_SET_ROUTES.PERMISSION_SETS,
      search: `?${TENANT_ID_SEARCH_PARAMS}=${tenantId}`,
    });
  };

  const handleMutationSuccess = (permissionName, isDeleted) => {
    onCancel();

    const messageId = `ui-consortia-settings.consortiumManager.members.permissionSets.${isDeleted ? 'remove' : 'save'}.permissionSet.success`;

    queryClient.invalidateQueries([namespace, tenantId]);

    return showCallout({
      message: intl.formatMessage({ id: messageId }, { permissionName }),
      type: 'success',
    });
  };

  const handleMutationError = async ({ response }) => {
    const errorMessageId = 'ui-consortia-settings.consortiumManager.members.permissionSets.create.permissionSet.error';

    const error = await response?.text();

    return showCallout({
      message: intl.formatMessage({ id: errorMessageId }, { error }),
      type: 'error',
    });
  };

  const handleSubmit = (values) => {
    return onSave(values)
      .then(() => handleMutationSuccess(values.displayName))
      .catch(handleMutationError);
  };

  const handleRemove = () => {
    return onRemove()
      .then(() => handleMutationSuccess(initialValues.displayName, true))
      .catch(handleMutationError);
  };

  const keyboardCommands = [
    {
      name: 'cancel',
      handler: onCancel,
      shortcut: 'esc',
    },
  ];

  const defaultProps = {
    onCancel,
    intl,
    stripes,
  };

  return (
    <HasCommand
      commands={keyboardCommands}
      scope={document.body}
    >
      <Layer
        isOpen
        inRootSet
        contentLabel="permission-sets-create"
      >
        <PermissionSetForm
          {...defaultProps}
          onSubmit={handleSubmit}
          onRemove={handleRemove}
          initialValues={initialValues}
        />
      </Layer>
    </HasCommand>
  );
};

ConsortiumPermissionsSetForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  onRemove: PropTypes.func,
  initialValues: PropTypes.object,
};

ConsortiumPermissionsSetForm.defaultProps = {
  initialValues: {},
};
