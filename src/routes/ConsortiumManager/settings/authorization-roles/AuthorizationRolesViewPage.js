import PropTypes from 'prop-types';
import {
  useMemo,
  useState,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  useParams,
  useHistory,
} from 'react-router-dom';

import { useShowCallout } from '@folio/stripes-acq-components';
import {
  Button,
  Dropdown,
  DropdownMenu,
  Icon,
  MultiColumnList,
  Pane,
  PaneBackLink,
  PaneHeader,
  PaneMenu,
  Paneset,
  Selection,
} from '@folio/stripes/components';
import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import {
  isShared,
  RoleDetails,
  ROLES_API,
  SearchForm,
  useAuthorizationRoles,
  useAuthorizationRolesMutation,
  useRoleById,
  useUsers,
} from '@folio/stripes-authorization-components';

import { MODULE_ROOT_ROUTE } from '../../../../constants';
import { useIsRowSelected } from '../../../../hooks';
import {
  extendKyWithTenant,
  handleErrorMessages,
} from '../../../../utils';
import { useMemberSelectionContext } from '../../MemberSelectionContext';
import {
  COLUMN_MAPPING,
  VISIBLE_COLUMNS,
} from './constants';
import {
  getResultsFormatter,
  hasInteractionRequiredInterfaces,
} from './utils';

const resolveSharedRoleLocation = (ky, tenantId) => async (role, path) => {
  const httpClient = extendKyWithTenant(ky, tenantId);

  const searchParams = { query: `name=${role?.name}` };
  const { roles } = await httpClient.get(`${ROLES_API}`, { searchParams })
    .json()
    .catch(() => ({ roles: [] }));

  const id = roles[0]?.id;

  return id ? `${path}/${id}` : path;
};

export const AuthorizationRolesViewPage = ({ path }) => {
  const stripes = useStripes();
  const intl = useIntl();
  const showCallout = useShowCallout();
  const { id: roleId } = useParams();
  const history = useHistory();
  const ky = useOkapiKy();

  const isRowSelected = useIsRowSelected(`${path}/:id`);

  const [searchTerm, setSearchTerm] = useState('');

  const {
    activeMember,
    membersOptions,
    setActiveMember,
  } = useMemberSelectionContext();
  const {
    duplicateAuthorizationRole,
    isLoading: isDuplicating,
  } = useAuthorizationRolesMutation({ tenantId: activeMember });

  const {
    roles,
    isLoading,
    onSubmitSearch,
  } = useAuthorizationRoles(
    activeMember,
    {
      onError: ({ response }) => handleErrorMessages({
        intl,
        showCallout,
        response,
        messageId: 'ui-consortia-settings.authorizationRoles.errors.loading.roles',
      }),
      enabled: Boolean(activeMember),
    },
  );

  const { roleDetails } = useRoleById(roleId, { tenantId: activeMember });

  const userIds = useMemo(() => roles.map(i => i.metadata?.updatedByUserId), [roles]);
  const { users } = useUsers(userIds, { tenantId: activeMember });

  const isRoleShared = isShared(roleDetails);

  const onMemberChange = async (member) => {
    setActiveMember(member);

    const targetLocation = isRoleShared
      ? await resolveSharedRoleLocation(ky, member)(roleDetails, path)
      : path;

    history.push(targetLocation);
  };

  const onDuplicate = () => {
    const roleName = roleDetails?.name;
    const messageIdPrefix = 'ui-consortia-settings.consortiumManager.members.authorizationsRoles.duplicate';

    duplicateAuthorizationRole(roleId)
      .then(({ id }) => {
        history.push(`${path}/${id}`);

        showCallout({
          messageId: `${messageIdPrefix}.success`,
          type: 'success',
          values: { name: roleName },
        });
      }).catch(() => {
        showCallout({
          messageId: `${messageIdPrefix}.error`,
          type: 'error',
          values: { name: roleName },
        });
      });
  };

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
              <FormattedMessage id="ui-consortia-settings.consortiumManager.members.authorizationsRoles.compare" />
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

  const resultsFormatter = useMemo(() => getResultsFormatter(path, users, stripes), [path, stripes, users]);

  return (
    <Paneset>
      <Pane
        defaultWidth="100"
        fluidContentWidth
        renderHeader={() => (
          <PaneHeader
            firstMenu={<PaneBackLink to={MODULE_ROOT_ROUTE} />}
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
          onChange={onMemberChange}
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
          isSelected={isRowSelected}
          loading={isLoading}
          visibleColumns={VISIBLE_COLUMNS}
        />
      </Pane>
      {roleId && hasInteractionRequiredInterfaces(stripes) && (
        <RoleDetails
          displayShareAction
          hideUserLink
          isLoading={isDuplicating}
          onDuplicate={onDuplicate}
          path={path}
          tenantId={activeMember}
          roleId={roleId}
        />
      )}
    </Paneset>
  );
};

AuthorizationRolesViewPage.propTypes = {
  path: PropTypes.string.isRequired,
};
