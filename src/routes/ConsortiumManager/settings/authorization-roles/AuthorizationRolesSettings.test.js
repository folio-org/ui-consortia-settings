import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { useAuthorizationRoles } from '@folio/stripes-authorization-components';

import { useMemberSelectionContext } from '../../MemberSelectionContext';
import { AuthorizationRolesSettings } from './AuthorizationRolesSettings';

jest.mock('@folio/stripes-authorization-components', () => ({
  RoleCreate: () => <div>RoleCreate</div>,
  RoleEdit: () => <div>RoleEdit</div>,
  useAuthorizationRoles: jest.fn(),
}));
jest.mock('../../MemberSelectionContext', () => ({
  ...jest.requireActual('../../MemberSelectionContext'),
  useMemberSelectionContext: jest.fn(),
}));
jest.mock('./AuthorizationRolesViewPage', () => ({
  AuthorizationRolesViewPage: () => <div>AuthorizationRolesViewPage</div>,
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter
      initialEntries={[{
        pathname: 'consortia-settings/authorization-roles',
      }]}
    >
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

const renderComponent = () => render(<AuthorizationRolesSettings />, { wrapper });

describe('AuthorizationRolesSettings', () => {
  beforeEach(() => {
    useMemberSelectionContext
      .mockClear()
      .mockReturnValue({ activeMember: 'central' });
    useAuthorizationRoles.mockClear().mockReturnValue({
      roles: [],
      isLoading: false,
      onSubmitSearch: jest.fn(),
    });
  });

  it('should display authorization roles page', async () => {
    window.location.pathname = 'consortia-settings/authorization-roles';
    renderComponent();

    const listConfigurationTitle = await screen.findByText('AuthorizationRolesViewPage');

    expect(listConfigurationTitle).toBeInTheDocument();
  });

  it('should display create authorization roles page', async () => {
    window.location.pathname = '/consortia-settings/authorization-roles/create';
    renderComponent();

    expect(screen.getByText('RoleCreate')).toBeInTheDocument();
  });

  it('should display edit authorization roles page', async () => {
    window.location.pathname = '/consortia-settings/authorization-roles/1/edit';
    renderComponent();

    expect(screen.getByText('RoleEdit')).toBeInTheDocument();
  });
});
