import noop from 'lodash/noop';
import {
  useMemo,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';

import {
  SEARCH_PARAMETER,
  useLocationFilters,
} from '@folio/stripes-acq-components';
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
  PaneBackLink,
  PaneHeader,
  PaneMenu,
  Paneset,
  Selection,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

import {
  AUTHORIZATION_POLICIES_ROUTE,
  MODULE_ROOT_ROUTE,
} from '../../../../constants';
import { useMemberSelection } from '../../hooks';
import {
  COLUMN_MAPPING,
  VISIBLE_COLUMNS,
} from './constants';
import { getResultsFormatter } from './utils';

export const AuthorizationPoliciesView = () => {
  const history = useHistory();
  const location = useLocation();
  const [selectedRow, setSelectedRow] = useState(null);

  const [
    filters,
    searchTerm,,
    applySearchTerm,
    changeSearchTerm,
  ] = useLocationFilters(location, history, noop);

  const onRowClick = (_event, row) => setSelectedRow(row);

  const onEdit = (id) => {
    history.push(`${AUTHORIZATION_POLICIES_ROUTE}/${id}/edit`);
  };

  const {
    activeMember,
    membersOptions,
    setActiveMember,
  } = useMemberSelection();

  const {
    policies,
    isLoading,
  } = useAuthorizationPolicies({
    searchTerm: filters[SEARCH_PARAMETER],
    tenantId: activeMember,
    options: {
      enabled: Boolean(activeMember),
    },
  });

  const userIds = useMemo(() => policies.map(i => i.metadata.updatedByUserId), [policies]);
  const { users } = useUsers(userIds, { tenantId: activeMember });

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    applySearchTerm();
  };

  const formatter = useMemo(() => getResultsFormatter({ users }), [users]);

  const lastMenu = (
    <PaneMenu>
      <IfPermission perm="policies.item.post">
        <Button
          buttonStyle="primary"
          marginBottom0
          to={`${AUTHORIZATION_POLICIES_ROUTE}/create`}
        >
          + <FormattedMessage id="ui-consortia-settings.authorizationPolicy.new" />
        </Button>
      </IfPermission>
    </PaneMenu>
  );

  return (
    <Paneset>
      <Pane
        defaultWidth="fill"
        renderHeader={() => (
          <PaneHeader
            firstMenu={<PaneBackLink to={MODULE_ROOT_ROUTE} />}
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
          setSearchTerm={(value) => changeSearchTerm({ target: { value } })}
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
          onEdit={() => onEdit(selectedRow.id)}
          tenantId={activeMember}
          displayShareAction
        />
      )}
    </Paneset>
  );
};
