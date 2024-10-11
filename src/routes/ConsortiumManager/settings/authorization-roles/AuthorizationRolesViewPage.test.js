import {
  MemoryRouter,
  useParams,
  useHistory,
} from 'react-router-dom';

import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { screen, render } from '@folio/jest-config-stripes/testing-library/react';
import {
  useRoleById,
  useRoleCapabilities,
  useAuthorizationRoles,
  useAuthorizationRolesMutation,
} from '@folio/stripes-authorization-components';
import { Paneset } from '@folio/stripes/components';

import { ConsortiumManagerContextProviderMock } from 'helpers';
import { extendKyWithTenant } from '../../../../utils';
import { MemberSelectionContextProvider } from '../../MemberSelectionContext';
import { AuthorizationRolesViewPage } from './AuthorizationRolesViewPage';

const wrapper = ({ children }) => (
  <MemoryRouter>
    <ConsortiumManagerContextProviderMock>
      <MemberSelectionContextProvider>
        <Paneset>
          {children}
        </Paneset>
      </MemberSelectionContextProvider>
    </ConsortiumManagerContextProviderMock>
  </MemoryRouter>
);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn().mockReturnValue({}),
  useParams: jest.fn().mockReturnValue({}),
}));

jest.mock('@folio/stripes-authorization-components', () => ({
  ...jest.requireActual('@folio/stripes-authorization-components'),
  useRoleCapabilities: jest.fn(),
  useAuthorizationRoles: jest.fn(),
  useAuthorizationRolesMutation: jest.fn().mockReturnValue({ duplicateAuthorizationRole: jest.fn() }),
  useShowCallout: jest.fn(),
  useUsers: jest.fn().mockReturnValue({ users: {} }),
  useRoleById: jest.fn().mockReturnValue({ roleDetails: { name: 'name', id: 'id' } }),
  RoleDetails: ({ onDuplicate }) => {
    return (
      <div data-testid="mock-role-details">
        <button type="button" onClick={onDuplicate}>duplicate</button>
        Role details pane
      </div>
    );
  },
  SearchForm: ({ onSubmit }) => (
    <div>
      <input data-testid="search-field" />
      <button type="submit" onClick={onSubmit}>ui-authorization-roles.search</button>
    </div>
  ),
}));
jest.mock('../../../../utils', () => ({
  ...jest.requireActual('../../../../utils'),
  extendKyWithTenant: jest.fn(),
}));

const mockRoles = [
  {
    id: 'id',
    name: 'Test Role',
    type: 'REGULAR',
    description: 'Test role description',
    metadata: {},
  },
];

const mockKy = {
  get: jest.fn(() => ({
    json: jest.fn(() => Promise.resolve({ roles: [{ id: 'role-id' }] })),
  })),
};

const history = {
  push: jest.fn(),
};

describe('AuthorizationRolesViewPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    extendKyWithTenant.mockReturnValue(mockKy);
    useAuthorizationRoles.mockImplementation(() => ({ roles: mockRoles }));
    useRoleCapabilities.mockReturnValue({
      initialRoleCapabilitiesSelectedMap: {},
      isSuccess: true,
    });
    useHistory.mockReturnValue(history);
  });

  const renderComponent = () => render(<AuthorizationRolesViewPage path="/consortia-settings/authorization-roles" />, { wrapper });

  it('renders the component', () => {
    renderComponent();

    expect(screen.getByText('ui-authorization-roles.meta.title')).toBeInTheDocument();
    expect(screen.getByTestId('search-field')).toBeInTheDocument();
    expect(screen.getByText('Test Role')).toBeInTheDocument();
  });

  it('should renders role details if role id present in the path', async () => {
    useParams.mockReturnValue({ id: 'id' });

    renderComponent();

    expect(screen.getByText('Role details pane')).toBeInTheDocument();
  });

  it('should filter roles on search', async () => {
    const mockFilterRoles = jest.fn();

    useAuthorizationRoles.mockImplementation(() => ({
      roles: mockRoles,
      onSubmitSearch: mockFilterRoles,
    }));

    renderComponent();

    const inputElement = screen.queryByTestId('search-field');

    await userEvent.type(inputElement, 'Test');
    await userEvent.click(screen.getByRole('button', { name: 'ui-authorization-roles.search' }));

    expect(mockFilterRoles).toHaveBeenCalledTimes(1);
  });

  it('should duplicate role on duplicate button click', async () => {
    const mockDuplicateRole = jest.fn(() => Promise.resolve({ id: 'new-id' }));

    useAuthorizationRolesMutation.mockClear().mockReturnValue({
      duplicateAuthorizationRole: mockDuplicateRole,
    });
    useParams.mockReturnValue({ id: 'id' });

    renderComponent();

    await userEvent.click(screen.getByRole('button', { name: 'duplicate' }));

    expect(mockDuplicateRole).toHaveBeenCalled();
  });

  describe('Change selected member', () => {
    it('should close non-shared role\'s details pane on selected member change', async () => {
      renderComponent();

      await userEvent.click(screen.getByRole('button', { name: /consortiumManager.members.selection/ }));
      await userEvent.click(screen.getByText(/Three Rivers College/));

      expect(history.push).toHaveBeenCalledWith('/consortia-settings/authorization-roles');
      expect(mockKy.get).not.toHaveBeenCalled();
    });

    it('should resolve shared role\'s ID in the selected member and open details pane', async () => {
      useRoleById.mockReturnValue({
        roleDetails: {
          name: 'name',
          id: 'id',
          type: 'CONSORTIUM',
        },
      });

      renderComponent();

      await userEvent.click(screen.getByRole('button', { name: /consortiumManager.members.selection/ }));
      await userEvent.click(screen.getByText(/Three Rivers College/));

      expect(history.push).toHaveBeenCalledWith('/consortia-settings/authorization-roles/role-id');
      expect(mockKy.get).toHaveBeenCalled();
    });
  });
});
