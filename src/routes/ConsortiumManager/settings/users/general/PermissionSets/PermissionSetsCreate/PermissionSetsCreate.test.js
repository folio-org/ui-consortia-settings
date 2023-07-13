import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { Paneset } from '@folio/stripes/components';

import {
  ConsortiumManagerContextProviderMock,
} from '../../../../../../../../test/jest/helpers';
import { PermissionSetsCreate } from './PermissionSetsCreate';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <MemoryRouter>
    <ConsortiumManagerContextProviderMock>
      <QueryClientProvider client={queryClient}>
        <Paneset>
          {children}
        </Paneset>
      </QueryClientProvider>
    </ConsortiumManagerContextProviderMock>
  </MemoryRouter>
);

const renderComponent = (props = {}) => render(
  <PermissionSetsCreate
    {...props}
  />,
  { wrapper },
);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

jest.mock('../../../../../../../temp/PermissionsAccordion', () => (jest.fn(() => <div>PermissionsAccordion</div>)));

describe('PermissionSetsCreate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useLocation.mockClear().mockReturnValue({ search: 'mobius' });
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('ui-users.permissions.newPermissionSet')).toBeInTheDocument();
    expect(screen.getByText('PermissionsAccordion')).toBeInTheDocument();
  });
});
