import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { useMemberSelectionContext } from '../../MemberSelectionContext';
import { AuthorizationPoliciesSettings } from './AuthorizationPoliciesSettings';

jest.mock('@folio/stripes-authorization-components', () => ({
  PolicyFormContainer: () => <div>PolicyFormContainer</div>,
}));

jest.mock('../../MemberSelectionContext', () => ({
  ...jest.requireActual('../../MemberSelectionContext'),
  useMemberSelectionContext: jest.fn(),
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
  const membersOptions = [
    { value: 'member1', label: 'Member 1' },
    { value: 'member2', label: 'Member 2' },
  ];

  const setActiveMember = jest.fn();

  beforeEach(() => {
    useMemberSelectionContext
      .mockClear()
      .mockReturnValue({
        activeMember: 'member1',
        membersOptions,
        setActiveMember,
      });
  });

  it('should display authorization policy view page', async () => {
    window.location.pathname = pathname;
    renderComponent();

    const pageTitle = await screen.findByText('AuthorizationPoliciesView');

    expect(pageTitle).toBeInTheDocument();
  });

  xit('should display create authorization policy create page', () => {
    window.location.pathname = `${pathname}/create`;
    renderComponent();

    expect(screen.getByText('PolicyFormContainer')).toBeInTheDocument();
  });

  xit('should display edit authorization policy edit page', () => {
    window.location.pathname = `${pathname}/1/edit`;
    renderComponent();

    expect(screen.getByText('PolicyFormContainer')).toBeInTheDocument();
  });
});
