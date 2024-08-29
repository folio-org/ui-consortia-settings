import identity from 'lodash/identity';
import noop from 'lodash/noop';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { Route, Switch } from 'react-router-dom';

import { Selection } from '@folio/stripes/components';
import { stripesShape } from '@folio/stripes/core';
import { EntrySelector } from '@folio/stripes/smart-components';

import { UUID_REGEX } from '../../../../../../constants';
import {
  useCommonErrorMessages,
  useTenantPermissions,
} from '../../../../../../hooks';
import { PermissionSetDetails } from '../../../../../../temp';
import { useMemberSelection } from '../../../../hooks';
import { PermissionSetsActionsMenu } from './PermissionSetsActionsMenu';
import { PermissionSetsCompare } from './PermissionSetsCompare';
import { PermissionSetsCreate } from './PermissionSetsCreate';
import { PermissionSetsEdit } from './PermissionSetsEdit';
import { TENANT_ID_SEARCH_PARAMS, PERMISSION_SET_ROUTES } from './constants';

const entryLabel = <FormattedMessage id="ui-users.permissionSet" />;
const paneTitle = <FormattedMessage id="ui-users.settings.permissionSet" />;
const nameKey = 'displayName';

export const PermissionSets = (props) => {
  const { history, location, match } = props;

  const {
    activeMember,
    membersOptions,
    setActiveMember,
  } = useMemberSelection();
  const [selectedItemId, setSelectedItemId] = useState(() => (
    new RegExp(UUID_REGEX).exec(location.pathname)?.[0]
  ));

  const defaultActiveMember = useMemo(() => {
    return new URLSearchParams(location.search).get(TENANT_ID_SEARCH_PARAMS);
  }, [location.search]);

  useEffect(() => {
    if (defaultActiveMember && defaultActiveMember !== activeMember) {
      setActiveMember(defaultActiveMember);
    }
    // Excluded activeMember from dependencies to prevent infinite loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultActiveMember, setActiveMember]);

  const { handleErrorMessages } = useCommonErrorMessages();

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
    {
      onError: ({ response }) => {
        return handleErrorMessages({
          response,
          messageId: 'ui-consortia-settings.errors.permissionSets.load.common',
        });
      },
    },
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

  const redirectWithParams = useCallback((path) => {
    const searchParams = activeMember ? `?${TENANT_ID_SEARCH_PARAMS}=${activeMember}` : '';

    history.push(`${path}${searchParams}`);
  }, [activeMember, history]);

  const onCreate = () => redirectWithParams(PERMISSION_SET_ROUTES.CREATE);
  const onCompare = () => redirectWithParams(PERMISSION_SET_ROUTES.COMPARE);
  const onEdit = () => redirectWithParams(`${PERMISSION_SET_ROUTES.EDIT}/${selectedItemId}`);

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
      permissions={{
        put: 'perms.permissions.item.put',
        post: 'perms.permissions.item.post',
        delete: 'perms.permissions.item.delete',
      }}
      tenantId={activeMember}
    >
      <Switch>
        <Route exact path={PERMISSION_SET_ROUTES.COMPARE} component={PermissionSetsCompare} />
        <Route exact path={PERMISSION_SET_ROUTES.CREATE} component={PermissionSetsCreate} />
        <Route exact path={`${PERMISSION_SET_ROUTES.EDIT}/:id`} component={PermissionSetsEdit} />
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
