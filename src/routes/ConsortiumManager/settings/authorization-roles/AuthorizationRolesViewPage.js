import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { useParams } from 'react-router-dom';

import {
  Button,
  Dropdown,
  DropdownMenu,
  Icon,
  MultiColumnList,
  NoValue,
  Pane,
  PaneHeader,
  PaneMenu,
  Paneset,
  Selection,
  TextLink,
} from '@folio/stripes/components';
import {
  RoleDetails,
  SearchForm,
  useAuthorizationRoles,
} from '@folio/stripes-authorization-components';

import { useMemberSelection } from '../../hooks';

export const AuthorizationRolesViewPage = ({ path }) => {
  const { id: roleId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');

  const {
    activeMember,
    membersOptions,
    setActiveMember,
  } = useMemberSelection();

  const { roles, isLoading, onSubmitSearch } = useAuthorizationRoles(activeMember);

  const lastMenu = (
    <Dropdown
      label={<FormattedMessage id="ui-consortia-settings.button.actions" />}
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
              <FormattedMessage id="ui-consortia-settings.button.new" />
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
      </DropdownMenu>
    </Dropdown>
  );

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSubmitSearch(searchTerm);
  };

  const resultsFormatter = {
    name: (item) => <TextLink to={`${path}/${item.id}`}>{item.name}</TextLink>,
    updatedBy: (item) => (item.metadata?.modifiedBy || <NoValue />),
    updated: (item) => (item.metadata?.modifiedDate ? (
      <FormattedDate value={item.metadata?.modifiedDate} />
    ) : (
      <NoValue />
    )),
  };

  return (
    <Paneset>
      <Pane
        defaultWidth="100"
        fluidContentWidth
        renderHeader={() => (
          <PaneHeader
            lastMenu={lastMenu}
            paneTitle={
              <FormattedMessage id="ui-authorization-roles.meta.title" />
            }
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
          columnMapping={{
            name: <FormattedMessage id="ui-authorization-roles.columns.name" />,
            description: (
              <FormattedMessage id="ui-authorization-roles.columns.description" />
            ),
            updated: (
              <FormattedMessage id="ui-authorization-roles.columns.updatedDate" />
            ),
            updatedBy: (
              <FormattedMessage id="ui-authorization-roles.columns.updatedBy" />
            ),
          }}
          contentData={roles}
          formatter={resultsFormatter}
          loading={isLoading}
          visibleColumns={['name', 'description', 'updated', 'updatedBy']}
        />
      </Pane>
      {roleId && <RoleDetails roleId={roleId} path={path} />}
    </Paneset>
  );
};

AuthorizationRolesViewPage.propTypes = {
  path: PropTypes.string.isRequired,
};
