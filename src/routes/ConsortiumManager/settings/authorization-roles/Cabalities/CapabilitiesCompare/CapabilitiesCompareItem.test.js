import { MemoryRouter } from 'react-router-dom';

import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen, logDOM } from '@folio/jest-config-stripes/testing-library/react';

import {
  useRoleCapabilities,
  useRoleCapabilitySets,
} from '@folio/stripes-authorization-components';

import {
  useAuthorizationRoles,
} from '../../../../../../hooks';
import { tenants } from 'fixtures';
import { COMPARE_ITEM_NAME } from '../../../users/general/PermissionSets/PermissionSetsCompare/constants';

import {ConsortiumManagerContextProviderMock} from '../../../../../../../test/jest/helpers';
import {CapabilitiesCompareItem} from './CapabilitiesCompareItem';
import {groupedRoleCapabilitiesByType, groupedRoleCapabilitySetsByType} from '../../../../../../../test/jest/fixtures';

jest.mock('../../../../../../hooks', () => {
  return {
    useAuthorizationRoles: jest.fn(),
  };
});

jest.mock('@folio/stripes-authorization-components', ()=> ({
  ...jest.requireActual('@folio/stripes-authorization-components'),
  useRoleCapabilities: jest.fn(),
  useRoleCapabilitySets: jest.fn(),
}))

const selectedMemberOptions = tenants.filter((el, index)=> index < 3).map(({ name, id }) => ({ value: id, label: name }));

const defaultProps = {
  rolesToCompare: [],
  setRolesToCompare: jest.fn(),
  columnName: COMPARE_ITEM_NAME.LEFT_COLUMN,
  members: selectedMemberOptions,
};

const roles =  [{ id: '1', name: 'role-1' }, { id: '2', name: 'role-2' }, { id: '3', name: 'role-3' }];

const wrapper = ({ children }) => (
  <MemoryRouter>
    <ConsortiumManagerContextProviderMock>
      {children}
    </ConsortiumManagerContextProviderMock>
  </MemoryRouter>
);

const renderComponent = (props = {}) => render(
  <CapabilitiesCompareItem
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('CapabilitiesCompareItem', () => {
  beforeEach(() => {
    useAuthorizationRoles.mockClear().mockReturnValue({
      roles,
    });
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

    await userEvent.click(screen.getByText(selectedMemberOptions[0].label));
    logDOM();
    await userEvent.click(screen.getByText(roles[0].name));

    screen.getAllByText('Capability Roles').forEach(role => {
      expect(role).toBeInTheDocument()
    })
  });
})
