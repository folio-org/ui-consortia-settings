import ReactRouterPropTypes from 'react-router-prop-types';
import { noop } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Selection,
} from '@folio/stripes/components';
import { EntrySelector } from '@folio/stripes/smart-components';
import {
  PermissionSetDetails,
} from '@folio/users';

import { useTenantPermissions } from '../../../../../../hooks';
import { UUID_REGEX } from '../../../../../../constants';
import { PermissionSetsActionsMenu } from './PermissionSetsActionsMenu';
import { useMemberSelection } from '../../../../hooks';

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

  const {
    isFetching,
    permissions: contentData,
  } = useTenantPermissions({
    tenantId: activeMember,
    searchParams: {
      query: 'mutable==true',
      expandSubs: true,
    },
  });

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
    // TODO: UICONSET-59
      onCreate={noop}
    // ^^^^^^^^^^^^^^^^^
    />
  );

  return (
    <EntrySelector
      {...props}
      nameKey={nameKey}
      // TODO: UICONSET-59
      editable={false}
      onAdd={noop}
      onEdit={noop}
      onClone={noop}
      onRemove={noop}
      // ^^^^^^^^^^^^^^^^^
      onClick={onItemClick}
      addMenu={addMenu}
      contentData={contentData}
      detailComponent={PermissionSetDetails}
      detailPaneTitle={selectedItem ? selectedItem[nameKey] : entryLabel}
      paneTitle={paneTitle}
      paneWidth="70%"
      rowFilter={rowFilter}
    />
  );
};

PermissionSets.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};
