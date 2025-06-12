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
import { hasInteractionRequiredInterfaces } from './utils';

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
jest.mock('./Capabilities', () => ({
  CapabilitiesCompare: () => <div>CapabilitiesCompare</div>,
}));
jest.mock('./UsersCapabilities', () => ({
  UsersCapabilitiesCompare: () => <div>UsersCapabilitiesCompare</div>,
}));
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  hasInteractionRequiredInterfaces: jest.fn(),
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
    hasInteractionRequiredInterfaces.mockReturnValue(true);
    useMemberSelectionContext.mockReturnValue({ activeMember: 'central' });
    useAuthorizationRoles.mockReturnValue({
      roles: [],
      isLoading: false,
      onSubmitSearch: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
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

  it('should redirect from the create page to the roles page if there are no required interfaces', async () => {
    window.location.pathname = '/consortia-settings/authorization-roles/create';
    hasInteractionRequiredInterfaces.mockReturnValue(false);

    renderComponent();

    expect(screen.getByText('AuthorizationRolesViewPage')).toBeInTheDocument();
  });

  it('should display edit authorization roles page', async () => {
    window.location.pathname = '/consortia-settings/authorization-roles/1/edit';
    renderComponent();

    expect(screen.getByText('RoleEdit')).toBeInTheDocument();
  });

  it('should redirect from the edit page to the roles page if there are no required interfaces', async () => {
    window.location.pathname = '/consortia-settings/authorization-roles/1/edit';
    hasInteractionRequiredInterfaces.mockReturnValue(false);

    renderComponent();

    expect(screen.getByText('AuthorizationRolesViewPage')).toBeInTheDocument();
  });

  it('should display capabilities compare page', async () => {
    window.location.pathname = '/consortia-settings/authorization-roles/compare';
    renderComponent();

    expect(screen.getByText('CapabilitiesCompare')).toBeInTheDocument();
  });

  it('should redirect from the capabilities compare page to the roles page if there are no required interfaces', async () => {
    window.location.pathname = '/consortia-settings/authorization-roles/compare';
    hasInteractionRequiredInterfaces.mockReturnValue(false);

    renderComponent();

    expect(screen.getByText('AuthorizationRolesViewPage')).toBeInTheDocument();
  });

  it('should display users capabilities compare page', async () => {
    window.location.pathname = '/consortia-settings/authorization-roles/compare-users';
    renderComponent();

    expect(screen.getByText('UsersCapabilitiesCompare')).toBeInTheDocument();
  });

  it('should redirect from the users capabilities compare page to the roles page if there are no required interfaces', async () => {
    window.location.pathname = '/consortia-settings/authorization-roles/compare-users';
    hasInteractionRequiredInterfaces.mockReturnValue(false);

    renderComponent();

    expect(screen.getByText('AuthorizationRolesViewPage')).toBeInTheDocument();
  });
});
