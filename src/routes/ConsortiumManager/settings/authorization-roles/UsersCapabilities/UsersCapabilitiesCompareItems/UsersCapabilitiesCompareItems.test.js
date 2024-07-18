import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  useAuthorizationRoles,
  useRoleCapabilities,
  useRoleCapabilitySets, useUsers,
} from '@folio/stripes-authorization-components';

import {
  tenants,
  groupedRoleCapabilitiesByType,
  groupedRoleCapabilitySetsByType,
} from 'fixtures';
import {ConsortiumManagerContextProviderMock} from 'helpers';
import { COMPARE_ITEM_NAME } from '../../../users/general/PermissionSets/PermissionSetsCompare/constants';
import {UsersCapabilitiesCompareItems} from "./UsersCapabilitiesCompareItems";

jest.mock('@folio/stripes-authorization-components', ()=> ({
  ...jest.requireActual('@folio/stripes-authorization-components'),
  useRoleCapabilities: jest.fn(),
  useRoleCapabilitySets: jest.fn(),
  useAuthorizationRoles: jest.fn(),
  useUsers: jest.fn(),
}))

const selectedMemberOptions = tenants.filter((el, index)=> index < 3).map(({ name, id }) => ({ value: id, label: name }));

const defaultProps = {
  rolesToCompare: [],
  setRolesToCompare: jest.fn(),
  columnName: COMPARE_ITEM_NAME.LEFT_COLUMN,
  members: selectedMemberOptions,
};

const roles =  [{ id: '1', name: 'role-1', metadata: {updatedByUserId: '11'} }, { id: '2', name: 'role-2', metadata: {updatedByUserId: '22'} }, { id: '3', name: 'role-3', metadata: {updatedByUserId: '33'} }];
const users = {
  11: {
    id: '11',
    username: 'Admin1'
  },
  22: {
    id: '22',
    username: 'Admin2'
  }
}

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
      users
    })
    useRoleCapabilitySets.mockClear().mockReturnValue({
        groupedRoleCapabilitySetsByType,
        initialRoleCapabilitySetsSelectedMap: 1,
        capabilitySetsTotalCount: 2
      }
    );
    useRoleCapabilities.mockClear().mockReturnValue({
      groupedRoleCapabilitiesByType,
      initialRoleCapabilitiesSelectedMap: 1,
      capabilitiesTotalCount: 2
    });
  });

  it('should render component', () => {
    renderComponent({ initialSelectedMemberId: selectedMemberOptions[0].value });
    expect(screen.getByText('ui-consortia-settings.consortiumManager.members.permissionSets.compare.member')).toBeInTheDocument();
  });

  it('should select member permissions and display capabilities and capabilities sets', async () => {
    const setRolesToCompare = jest.fn();

    renderComponent({ setRolesToCompare });

    await userEvent.click(screen.getByText(users["11"].username))

    await userEvent.click(screen.getByText(selectedMemberOptions[0].label));
    await userEvent.click(screen.getByText(roles[0].name));

    screen.getAllByText('Capability Roles').forEach(role => {
      expect(role).toBeInTheDocument()
    })
  });
});
