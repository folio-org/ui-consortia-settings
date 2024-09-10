import { MemoryRouter, useParams } from 'react-router-dom';

import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { screen, render } from '@folio/jest-config-stripes/testing-library/react';
import {
  useRoleCapabilities,
  useAuthorizationRoles,
} from '@folio/stripes-authorization-components';
import { Paneset } from '@folio/stripes/components';

import { ConsortiumManagerContextProviderMock } from 'helpers';
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
  useParams: jest.fn().mockReturnValue({}),
}));

jest.mock('@folio/stripes-authorization-components', () => ({
  ...jest.requireActual('@folio/stripes-authorization-components'),
  useRoleCapabilities: jest.fn(),
  useAuthorizationRoles: jest.fn(),
  useUsers: jest.fn().mockReturnValue({ users: {} }),
  RoleDetails: () => <div data-testid="mock-role-details">Role details pane</div>,
  SearchForm: ({ onSubmit }) => (
    <div>
      <input data-testid="search-field" />
      <button type="submit" onClick={onSubmit}>ui-authorization-roles.search</button>
    </div>
  ),
}));

const mockRoles = [
  {
    id: 'id',
    name: 'Test Role',
    description: 'Test role description',
    metadata: {},
  },
];

describe('AuthorizationRolesViewPage', () => {
  beforeEach(() => {
    useRoleCapabilities.mockReturnValue({
      initialRoleCapabilitiesSelectedMap: {},
      isSuccess: true,
    });
    useAuthorizationRoles.mockImplementation(() => ({ roles: mockRoles }));
  });

  afterAll(() => {
    jest.clearAllMocks();
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
});
