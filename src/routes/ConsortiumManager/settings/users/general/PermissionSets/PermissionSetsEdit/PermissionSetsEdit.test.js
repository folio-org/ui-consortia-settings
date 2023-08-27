import { MemoryRouter, useLocation } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { Paneset } from '@folio/stripes/components';

import {
  ConsortiumManagerContextProviderMock,
} from 'helpers';
import { PermissionSetsEdit } from './PermissionSetsEdit';
import { usePermissionSet, useTenantPermissionSetMutations } from '../hooks';

const initialValue = {
  'permissionName': 'ui-consortia-settings.consortium-manager.edit',
  'displayName': 'Consortium manager: Can edit existing settings',
  'id': '5317f357-422a-46a4-88de-702b858672b4',
  'tags': [],
  'subPermissions': [
    {
      'permissionName': 'ui-consortia-settings.consortium-manager.view',
      'displayName': 'Consortium manager: Can view existing settings',
      'id': '31de539c-64db-4f4d-8325-0dd57452ab9d',
      'tags': [],
      'subPermissions': [
        'module.consortia-settings.enabled',
      ],
      'childOf': [
        'ui-consortia-settings.consortium-manager.edit',
        'ui-consortia-settings.consortium-manager.share',
      ],
      'grantedTo': [
        '3eb76711-b1c0-4439-86c8-3251fa61c553',
      ],
      'mutable': true,
      'visible': true,
      'dummy': false,
      'deprecated': false,
      'metadata': {
        'createdDate': '2023-06-09T07:16:09.333+00:00',
        'createdByUserId': 'ff96b580-4206-4957-8b5d-7bdbc3d192f9',
        'updatedDate': '2023-06-09T07:16:09.333+00:00',
        'updatedByUserId': 'ff96b580-4206-4957-8b5d-7bdbc3d192f9',
      },
    },
  ],
  'childOf': [],
  'grantedTo': [
    '3eb76711-b1c0-4439-86c8-3251fa61c553',
  ],
  'mutable': true,
  'visible': true,
  'dummy': false,
  'deprecated': false,
  'metadata': {
    'createdDate': '2023-06-09T07:16:15.196+00:00',
    'createdByUserId': 'ff96b580-4206-4957-8b5d-7bdbc3d192f9',
    'updatedDate': '2023-06-09T07:16:15.196+00:00',
    'updatedByUserId': 'ff96b580-4206-4957-8b5d-7bdbc3d192f9',
  },
};

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

const renderComponent = () => render(
  <PermissionSetsEdit />,
  { wrapper },
);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

jest.mock('../hooks', () => ({
  usePermissionSet: jest.fn(),
  useTenantPermissionSetMutations: jest.fn(),
}));

jest.mock('../../../../../../../temp/PermissionsAccordion', () => (jest.fn(() => <div>PermissionsAccordion</div>)));

describe('PermissionSetsEdit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useLocation.mockClear().mockReturnValue({ search: 'mobius' });
    usePermissionSet.mockClear().mockReturnValue({ isLoading: false, permissionsSet: [initialValue] });
    useTenantPermissionSetMutations.mockClear().mockReturnValue({
      removePermissionSet: jest.fn(),
      updatePermissionSet: jest.fn(),
    });
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('ui-users.permissions.newPermissionSet')).toBeInTheDocument();
    expect(screen.getByText('PermissionsAccordion')).toBeInTheDocument();
  });

  it('should render Loading component', () => {
    usePermissionSet.mockClear().mockReturnValue({ isLoading: true, permissionsSet: {} });
    const { container } = renderComponent();

    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });
});
