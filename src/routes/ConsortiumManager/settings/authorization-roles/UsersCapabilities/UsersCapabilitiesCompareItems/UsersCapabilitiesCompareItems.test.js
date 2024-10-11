import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  useAuthorizationRoles,
  useRoleCapabilities,
  useRoleCapabilitySets,
  useUserCapabilities,
  useUserCapabilitiesSets,
  useUserRolesByUserIds,
} from '@folio/stripes-authorization-components';

import {
  groupedRoleCapabilitiesByType,
  groupedRoleCapabilitySetsByType,
  tenants,
} from 'fixtures';
import { ConsortiumManagerContextProviderMock } from 'helpers';

import { COMPARE_ITEM_NAME } from '../../../users/general/PermissionSets/PermissionSetsCompare/constants';
import { useUsers } from '../../../../../../hooks';
import { UsersCapabilitiesCompareItems } from './UsersCapabilitiesCompareItems';

jest.mock('@folio/stripes-authorization-components', () => ({
  ...jest.requireActual('@folio/stripes-authorization-components'),
  useUserCapabilities: jest.fn(),
  useUserCapabilitiesSets: jest.fn(),
  useAuthorizationRoles: jest.fn(),
  useUserRolesByUserIds: jest.fn(),
  useRoleCapabilities: jest.fn(),
  useRoleCapabilitySets: jest.fn(),
}));

jest.mock('../../../../../../hooks/useUsers/useUsers');

const selectedMemberOptions = (
  tenants
    .filter((el, index) => index < 3)
    .map(({ name, id }) => ({ value: id, label: name }))
);

const defaultProps = {
  rolesToCompare: [],
  setRolesToCompare: jest.fn(),
  columnName: COMPARE_ITEM_NAME.LEFT_COLUMN,
  members: selectedMemberOptions,
};

const userRolesResponse = [{
  roleId: '1',
  userId: '1',
},
];

const roles = [
  { id: '1', name: 'role-1' },
  { id: '2', name: 'role-2' },
  { id: '3', name: 'role-3' },
];
const users = [
  {
    id: '1',
    username: 'Admin1',
  },
  {
    id: '2',
    username: 'Admin2',
  },
];

const wrapper = ({ children }) => (
  <MemoryRouter>
    <ConsortiumManagerContextProviderMock>
      {children}
    </ConsortiumManagerContextProviderMock>
  </MemoryRouter>
);

const renderComponent = (props = {}) => render(
  <UsersCapabilitiesCompareItems
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('UsersCapabilitiesCompareItems', () => {
  beforeEach(() => {
    useAuthorizationRoles.mockClear().mockReturnValue({
      roles,
    });
    useUsers.mockClear().mockReturnValue({
      users,
    });
    useUserRolesByUserIds.mockClear().mockReturnValue({
      userRolesResponse,
    });
    useUserCapabilitiesSets.mockClear().mockReturnValue({
      groupedUserCapabilitySetsByType: groupedRoleCapabilitySetsByType,
      initialUserCapabilitySetsSelectedMap: 1,
      capabilitySetsTotalCount: 2,
    });
    useUserCapabilities.mockClear().mockReturnValue({
      groupedUserCapabilitiesByType: groupedRoleCapabilitiesByType,
      initialUserCapabilitiesSelectedMap: 1,
      capabilitiesTotalCount: 2,
    });
    useRoleCapabilitySets.mockClear().mockReturnValue({
      groupedRoleCapabilitySetsByType,
      initialRoleCapabilitySetsSelectedMap: 1,
      capabilitySetsTotalCount: 2,
    });
    useRoleCapabilities.mockClear().mockReturnValue({
      groupedRoleCapabilitiesByType,
      initialRoleCapabilitiesSelectedMap: 1,
      capabilitiesTotalCount: 2,
    });
  });

  it('should render component', () => {
    renderComponent({ initialSelectedMemberId: selectedMemberOptions[0].value });
    expect(screen.getByText('ui-consortia-settings.consortiumManager.members.permissionSets.compare.member')).toBeInTheDocument();
  });

  it('should select member permissions and display capabilities and capabilities sets', async () => {
    const setRolesToCompare = jest.fn();

    renderComponent({ setRolesToCompare });

    await userEvent.click(screen.getByRole('button', { name: /permissionSets.compare.member/ }));
    await userEvent.click(screen.getByText(selectedMemberOptions[0].label));

    await userEvent.click(screen.getByRole('button', { name: /permissionSets.compare.user/ }));
    await userEvent.click(screen.getByText(users[0].username));

    await userEvent.click(screen.getByRole('button', { name: /authorizationsRoles.compare.roles/ }));
    await userEvent.click(screen.getByText(roles[0].name));

    screen.getAllByText('Capability Roles').forEach(role => {
      expect(role).toBeInTheDocument();
    });
  });
});
