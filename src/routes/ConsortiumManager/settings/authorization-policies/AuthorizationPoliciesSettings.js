import { useState } from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';

import {
  useAuthorizationPolicies,
  useUsers,
  PolicyDetails,
  SearchForm,
} from '@folio/stripes-authorization-components';
import {
  Button,
  MultiColumnList,
  NoValue,
  Pane,
  PaneHeader,
  PaneMenu,
  Paneset,
  Selection,
  TextLink,
} from '@folio/stripes/components';
import { getFullName } from '@folio/stripes/util';

import { useMemberSelection } from '../../hooks';

const AuthorizationPoliciesSettings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  const onRowClick = (_event, row) => setSelectedRow(row);

  const {
    activeMember,
    membersOptions,
    setActiveMember,
  } = useMemberSelection();

  const lastMenu = (
    <PaneMenu>
      <Button buttonStyle="primary" marginBottom0>
        + <FormattedMessage id="ui-consortia-settings.authorizationPolicy.new" />
      </Button>
    </PaneMenu>
  );

  const {
    policies,
    isLoading,
    refetch,
  } = useAuthorizationPolicies({ searchTerm, tenantId: activeMember });
  const { users } = useUsers(policies.map(i => i.metadata.updatedByUserId));

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    refetch();
  };

  const resultsFormatter = {
    name: (item) => <TextLink>{item.name}</TextLink>,
    updatedBy: (item) => (item.metadata.updatedByUserId ? getFullName(users[item.metadata.updatedByUserId]) : (
      <NoValue />
    )),
    updated: (item) => (item.metadata.updatedDate ? (
      <FormattedDate value={item.metadata.updatedDate} />
    ) : (
      <NoValue />
    )),
  };

  return (
    <Paneset>
      <Pane
        defaultWidth="fill"
        renderHeader={() => (
          <PaneHeader
            lastMenu={lastMenu}
            paneTitle={
              <FormattedMessage id="ui-consortia-settings.authorizationPolicy.meta.title" />
            }
          />
        )}
      >
        <Selection
          autoFocus
          dataOptions={membersOptions}
          id="consortium-member-select"
          label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.selection.label" />}
          onChange={setActiveMember}
          value={activeMember}
        />
        <SearchForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSubmit={handleSearchSubmit}
          searchLabelId="ui-consortia-settings.authorizationPolicy.search"
        />
        <MultiColumnList
          columnMapping={{
            name: (
              <FormattedMessage id="ui-consortia-settings.authorizationPolicy.columns.name" />
            ),
            description: (
              <FormattedMessage id="ui-consortia-settings.authorizationPolicy.columns.description" />
            ),
            updated: (
              <FormattedMessage id="ui-consortia-settings.authorizationPolicy.columns.updatedDate" />
            ),
            updatedBy: (
              <FormattedMessage id="ui-consortia-settings.authorizationPolicy.columns.updatedBy" />
            ),
          }}
          contentData={policies}
          formatter={resultsFormatter}
          selectedRow={selectedRow}
          onRowClick={onRowClick}
          loading={isLoading}
          visibleColumns={['name', 'description', 'updated', 'updatedBy']}
        />
      </Pane>
      {selectedRow && <PolicyDetails policy={selectedRow} onClose={() => setSelectedRow(null)} />}
    </Paneset>
  );
};

export default AuthorizationPoliciesSettings;
