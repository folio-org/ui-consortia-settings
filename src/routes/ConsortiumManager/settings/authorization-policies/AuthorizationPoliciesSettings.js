import {
  useMemo,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  useAuthorizationPolicies,
  useUsers,
  PolicyDetails,
  SearchForm,
} from '@folio/stripes-authorization-components';
import {
  Button,
  MultiColumnList,
  Pane,
  PaneHeader,
  PaneMenu,
  Paneset,
  Selection,
} from '@folio/stripes/components';

import { useMemberSelection } from '../../hooks';
import {
  COLUMN_MAPPING,
  getResultsFormatter,
  VISIBLE_COLUMNS,
} from './constanta';

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

  const formatter = useMemo(() => getResultsFormatter({ users }), [users]);

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
          columnMapping={COLUMN_MAPPING}
          contentData={policies}
          formatter={formatter}
          selectedRow={selectedRow}
          onRowClick={onRowClick}
          loading={isLoading}
          visibleColumns={VISIBLE_COLUMNS}
        />
      </Pane>
      {selectedRow && (
        <PolicyDetails
          policy={selectedRow}
          onClose={() => setSelectedRow(null)}
        />
      )}
    </Paneset>
  );
};

export default AuthorizationPoliciesSettings;
