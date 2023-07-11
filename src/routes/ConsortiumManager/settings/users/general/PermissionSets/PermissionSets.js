import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { identity, noop, omit } from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';
import { Route, Switch } from 'react-router-dom';
import { useQueryClient } from 'react-query';

import { Selection } from '@folio/stripes/components';
import { EntrySelector } from '@folio/stripes/smart-components';
import { useShowCallout } from '@folio/stripes-acq-components';
import { stripesShape } from '@folio/stripes/core';

import { UUID_REGEX } from '../../../../../../constants';
import { useTenantPermissions } from '../../../../../../hooks';
import { PermissionSetDetails } from '../../../../../../temp';
import { useMemberSelection } from '../../../../hooks';
import { PermissionSetsActionsMenu } from './PermissionSetsActionsMenu';
import { PermissionSetsCompare } from './PermissionSetsCompare';
import { PermissionSetsCreate } from './PermissionSetsCreate';
import { PermissionSetsEdit } from './PermissionSetsEdit';
import { TENANT_ID_SEARCH_PARAMS, PERMISSION_SET_ROUTES } from './constants';
import { usePermissionSet, useTenantPermissionMutations } from './hooks';

const entryLabel = <FormattedMessage id="ui-users.permissionSet" />;
const paneTitle = <FormattedMessage id="ui-users.settings.permissionSet" />;
const nameKey = 'displayName';

export const PermissionSets = (props) => {
  const { history, location, match, stripes } = props;
  const intl = useIntl();
  const search = window.location.search;
  const showCallout = useShowCallout();
  const queryClient = useQueryClient();

  const {
    activeMember,
    membersOptions,
    setActiveMember,
  } = useMemberSelection();
  const [selectedItemId, setSelectedItemId] = useState(() => (
    new RegExp(UUID_REGEX).exec(location.pathname)?.[0]
  ));

  const tenantId = useMemo(() => new URLSearchParams(search).get(TENANT_ID_SEARCH_PARAMS), [search]);
  const defaultActiveMember = useMemo(() => {
    return new URLSearchParams(location.search).get(TENANT_ID_SEARCH_PARAMS);
  }, [location.search]);

  useEffect(() => {
    if (defaultActiveMember && defaultActiveMember !== activeMember) {
      setActiveMember(defaultActiveMember);
    }
  }, [activeMember, defaultActiveMember, setActiveMember]);

  const { isLoading, selectedPermissionSet: initialValues } = usePermissionSet({
    permissionSetId: selectedItemId,
    tenantId,
  });

  const handlePermissionsMutationError = async ({ response }) => {
    const errorMessageId = 'ui-consortia-settings.consortiumManager.members.permissionSets.create.permissionSet.error';

    const error = await response?.text();

    return showCallout({
      message: intl.formatMessage({ id: errorMessageId }, { error }),
      type: 'error',
    });
  };

  const handleLogsLoadingError = useCallback(({ response }) => {
    const defaultMessage = intl.formatMessage({ id: 'ui-consortia-settings.errors.permissionSets.load.common' });

    if (response?.status === 403) {
      return showCallout({
        message: `${defaultMessage} ${intl.formatMessage({ id: 'ui-consortia-settings.errors.permissionsRequired' })}`,
        type: 'error',
      });
    }

    return showCallout({
      message: defaultMessage,
      type: 'error',
    });
  }, [intl, showCallout]);

  const {
    isFetching,
    permissions: contentData,
  } = useTenantPermissions(
    {
      tenantId: activeMember,
      searchParams: {
        query: 'mutable==true',
        expandSubs: true,
      },
    },
    { onError: handleLogsLoadingError },
  );

  const onMemberChange = useCallback((member) => {
    setActiveMember(member);
    history.push(match.path);
  }, [history, match.path, setActiveMember]);

  const onItemClick = useCallback(({ id }) => {
    setSelectedItemId(id);
  }, []);

  const selectedItem = useMemo(() => (
    contentData.find(({ id }) => id === selectedItemId)
  ), [contentData, selectedItemId]);

  const searchParams = activeMember ? `?${TENANT_ID_SEARCH_PARAMS}=${activeMember}` : '';

  const onCreate = () => {
    history.push(`${PERMISSION_SET_ROUTES.CREATE}${searchParams}`);
  };

  const onCompare = () => {
    history.push(`${PERMISSION_SET_ROUTES.COMPARE}${searchParams}`);
  };

  const onEdit = () => {
    history.push(`${PERMISSION_SET_ROUTES.EDIT}/${selectedItemId}${searchParams}`);
  };

  const onCancel = () => {
    history.push({
      pathname: PERMISSION_SET_ROUTES.PERMISSION_SETS,
      search: `?${TENANT_ID_SEARCH_PARAMS}=${tenantId}`,
    });
  };

  const handleSuccess = (permissionName) => {
    onCancel();

    const messageId = 'ui-consortia-settings.consortiumManager.members.permissionSets.save.permissionSet.success';

    queryClient.invalidateQueries({ tenantId });

    return showCallout({
      message: intl.formatMessage({ id: messageId }, { permissionName }),
      type: 'success',
    });
  };

  const { createPermission, removePermission, updatePermission } = useTenantPermissionMutations(tenantId, {
    onError: handlePermissionsMutationError,
  });

  const onRemove = () => {
    removePermission(selectedItemId, {
      onSuccess: () => handleSuccess('remove'),
    });
  };

  const getNormalizedPermissionSet = (values) => {
    const filtered = omit(values, ['childOf', 'grantedTo', 'dummy', 'deprecated']);
    const permSet = {
      ...filtered,
      mutable: true,
      subPermissions: (values.subPermissions || []).map(p => p.permissionName),
    };

    return permSet;
  };

  const onSave = (values) => {
    return createPermission(getNormalizedPermissionSet(values), {
      onSuccess: () => handleSuccess(values.displayName),
    });
  };

  const onSaveEdit = (values) => {
    return updatePermission(getNormalizedPermissionSet(values), {
      onSuccess: () => handleSuccess('update'),
    });
  };

  const defaultProps = {
    onCancel,
    intl,
    stripes,
  };

  const rowFilter = (
    <Selection
      autoFocus
      dataOptions={membersOptions}
      disabled={isFetching}
      id="consortium-member-select"
      label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.selection.label" />}
      onChange={onMemberChange}
      value={activeMember}
    />
  );

  const addMenu = (
    <PermissionSetsActionsMenu
      onCreate={onCreate}
      onCompare={onCompare}
      disabled={!activeMember}
    />
  );

  return (
    <EntrySelector
      {...props}
      nameKey={nameKey}
      editable
      onAdd={noop}
      onEdit={onEdit}
      onClone={noop}
      onRemove={noop}
      onClick={onItemClick}
      addMenu={addMenu}
      contentData={contentData}
      detailComponent={PermissionSetDetails}
      detailPaneTitle={selectedItem ? selectedItem[nameKey] : entryLabel}
      parseInitialValues={identity}
      paneTitle={paneTitle}
      paneWidth="70%"
      rowFilter={rowFilter}
    >
      <Switch>
        <Route exact path={PERMISSION_SET_ROUTES.COMPARE} component={PermissionSetsCompare} />
        <Route exact path={PERMISSION_SET_ROUTES.CREATE}>
          <PermissionSetsCreate {...defaultProps} onSave={onSave} />
        </Route>
        <Route exact path={`${PERMISSION_SET_ROUTES.EDIT}/:id`}>
          <PermissionSetsEdit
            {...defaultProps}
            onSave={onSaveEdit}
            onRemove={onRemove}
            initialValues={initialValues}
            isLoading={isLoading}
          />
        </Route>
      </Switch>
    </EntrySelector>
  );
};

PermissionSets.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  stripes: stripesShape.isRequired,
};
