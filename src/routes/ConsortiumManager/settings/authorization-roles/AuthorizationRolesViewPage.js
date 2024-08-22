import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

import {
  Button,
  Dropdown,
  DropdownMenu,
  Icon,
  MultiColumnList,
  Pane,
  PaneHeader,
  PaneMenu,
  Paneset,
  Selection,
} from '@folio/stripes/components';
import {
  RoleDetails,
  SearchForm,
  useAuthorizationRoles,
} from '@folio/stripes-authorization-components';

import { useMemberSelectionContext } from '../../MemberSelectionContext';
import {
  COLUMN_MAPPING,
  VISIBLE_COLUMNS,
} from './constants';
import { getResultsFormatter } from './utils';

export const AuthorizationRolesViewPage = ({ path }) => {
  const { id: roleId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');

  const {
    activeMember,
    membersOptions,
    setActiveMember,
  } = useMemberSelectionContext();

  const { roles, isLoading, onSubmitSearch } = useAuthorizationRoles(activeMember);

  const lastMenu = (
    <Dropdown
      label={<FormattedMessage id="stripes-components.paneMenuActionsToggleLabel" />}
      buttonProps={{ buttonStyle: 'primary', marginBottom0: true }}
    >
      <DropdownMenu>
        <PaneMenu>
          <Button
            id="clickable-create-role"
            buttonStyle="dropdownItem"
            marginBottom0
            to={`${path}/create`}
          >
            <Icon size="small" icon="plus-sign">
              <FormattedMessage id="stripes-components.button.new" />
            </Icon>
          </Button>
        </PaneMenu>
        <PaneMenu>
          <Button
            id="clickable-compare-permissions"
            to={`${path}/compare`}
            buttonStyle="dropdownItem"
            marginBottom0
          >
            <Icon size="small" icon="transfer">
              <FormattedMessage id="ui-consortia-settings.consortiumManager.members.action.compare" />
            </Icon>
          </Button>
        </PaneMenu>
        <PaneMenu>
          <Button
            id="clickable-compare-permissions"
            to={`${path}/compare-users`}
            buttonStyle="dropdownItem"
            marginBottom0
          >
            <Icon size="small" icon="transfer">
              <FormattedMessage id="ui-consortia-settings.consortiumManager.members.action.compareUsers" />
            </Icon>
          </Button>
        </PaneMenu>
      </DropdownMenu>
    </Dropdown>
  );

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSubmitSearch(searchTerm);
  };

  const resultsFormatter = useMemo(() => getResultsFormatter(path), [path]);

  return (
    <Paneset>
      <Pane
        defaultWidth="100"
        fluidContentWidth
        renderHeader={() => (
          <PaneHeader
            lastMenu={lastMenu}
            paneTitle={<FormattedMessage id="ui-authorization-roles.meta.title" />}
          />
        )}
        actionMenu={lastMenu}
      >
        <Selection
          autoFocus
          dataOptions={membersOptions}
          disabled={isLoading}
          id="consortium-member-select"
          label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.selection.label" />}
          onChange={setActiveMember}
          value={activeMember}
        />
        <SearchForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSubmit={handleSearchSubmit}
        />
        <MultiColumnList
          columnMapping={COLUMN_MAPPING}
          contentData={roles}
          formatter={resultsFormatter}
          loading={isLoading}
          visibleColumns={VISIBLE_COLUMNS}
        />
      </Pane>
      {roleId && (
        <RoleDetails
          tenantId={activeMember}
          roleId={roleId}
          path={path}
        />
      )}
    </Paneset>
  );
};

AuthorizationRolesViewPage.propTypes = {
  path: PropTypes.string.isRequired,
};
