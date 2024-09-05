import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import AuthorizationPoliciesSettings from './AuthorizationPoliciesSettings';

jest.mock('@folio/stripes-authorization-components', () => ({
  PolicyFormContainer: () => <div>PolicyFormContainer</div>,
}));

jest.mock('./AuthorizationPoliciesView', () => ({
  AuthorizationPoliciesView: () => <div>AuthorizationPoliciesView</div>,
}));

const pathname = 'consortia-settings/authorization-policies';
const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter initialEntries={[{ pathname }]}>
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

const renderComponent = () => render(<AuthorizationPoliciesSettings />, { wrapper });

describe('AuthorizationPoliciesSettings', () => {
  // beforeEach(() => {
  //   useMemberSelectionContext
  //     .mockClear()
  //     .mockReturnValue({ activeMember: 'central' });
  //   useAuthorizationRoles.mockClear().mockReturnValue({
  //     roles: [],
  //     isLoading: false,
  //     onSubmitSearch: jest.fn(),
  //   });
  // });

  it('should display authorization policy view page', async () => {
    window.location.pathname = pathname;
    renderComponent();

    const pageTitle = await screen.findByText('AuthorizationPoliciesView');

    expect(pageTitle).toBeInTheDocument();
  });

  it('should display create authorization policy create page', async () => {
    window.location.pathname = `${pathname}/create`;
    renderComponent();

    expect(screen.getByText('PolicyFormContainer')).toBeInTheDocument();
  });

  it('should display edit authorization policy edit page', async () => {
    window.location.pathname = `${pathname}/1/edit`;
    renderComponent();

    expect(screen.getByText('PolicyFormContainer')).toBeInTheDocument();
  });
});
