import { MemoryRouter, useLocation } from 'react-router-dom';

import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { useShowCallout } from '@folio/stripes-acq-components';

import { tenants } from 'fixtures';
import {
  ConsortiumManagerContextProviderMock,
  buildStripesObject,
} from 'helpers';
import { useTenantPermissions } from '../../../../../../hooks';
import {
  PERMISSION_SET_ROUTES,
  TENANT_ID_SEARCH_PARAMS,
} from './constants';
import { PermissionSets } from './PermissionSets';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
}));

jest.mock('../../../../../../temp', () => ({
  IfConsortiumPermission: jest.fn(({ children }) => <>{children}</>),
  PermissionSetDetails: jest.fn(() => <div>PermissionSetDetails</div>),
}));

jest.mock('../../../../../../hooks', () => ({
  ...jest.requireActual('../../../../../../hooks'),
  useTenantPermissions: jest.fn(),
}));

const defaultProps = {
  history: {
    push: jest.fn(),
  },
  location: {
    pathname: '/perms',
  },
  match: {
    path: '/perms',
  },
  stripes: buildStripesObject(),
  tenantId: 'mobius',
};

const permissions = [
  {
    id: '5317f357-422a-46a4-88de-702b858672b4',
    displayName: 'Test perm set 1',
    subPermissions: [],
  },
  {
    id: 'af5c0528-6197-4c7a-96bc-137e88e88176',
    displayName: 'Test perm set 2',
    subPermissions: [],
  },
];

const wrapper = ({ children }) => (
  <MemoryRouter>
    <ConsortiumManagerContextProviderMock>
      {children}
    </ConsortiumManagerContextProviderMock>
  </MemoryRouter>
);

const renderPermissionsSet = (props = {}) => render(
  <PermissionSets
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('PermissionsSets', () => {
  const showCalloutMock = jest.fn();

  beforeEach(() => {
    showCalloutMock.mockClear();
    useShowCallout.mockClear().mockReturnValue(showCalloutMock);
    useLocation.mockClear().mockReturnValue({ search: 'mobius' });
    useTenantPermissions.mockClear().mockReturnValue({ permissions });
  });

  it('should render permission sets list', () => {
    renderPermissionsSet();

    Object.values(permissions).forEach(({ displayName }) => {
      expect(screen.getByText(displayName)).toBeInTheDocument();
    });
  });

  it('should render a permission set details', async () => {
    renderPermissionsSet();

    await userEvent.click(screen.getByText(permissions[1].displayName));
    expect(screen.getByText('PermissionSetDetails')).toBeInTheDocument();
  });

  it('should handle selected member change', async () => {
    renderPermissionsSet();

    await userEvent.click(screen.getByRole('button', { name: /members.selection.label/ }));
    await userEvent.click(screen.getByText(tenants[4].name));

    expect(defaultProps.history.push).toHaveBeenCalled();
  });

  it('should redirect to compare page on click compare action menu button', async () => {
    const { container } = renderPermissionsSet();

    const actionMenu = screen.getByTestId('permission-sets-actions-dropdown');

    expect(actionMenu).toBeInTheDocument();
    await userEvent.click(actionMenu);
    const compareButton = container.querySelector('#clickable-compare-permissions');

    expect(compareButton).toBeInTheDocument();
    await userEvent.click(compareButton);
    expect(defaultProps.history.push).toHaveBeenCalledWith(`${PERMISSION_SET_ROUTES.COMPARE}?${TENANT_ID_SEARCH_PARAMS}=${tenants[3].id}`);
  });

  describe('Error handling', () => {
    it('should handle 403 error', async () => {
      renderPermissionsSet();

      useTenantPermissions.mock.calls[0][1].onError({
        response: { status: 403 },
      });

      expect(showCalloutMock).toHaveBeenCalledWith(expect.objectContaining({ message: 'ui-consortia-settings.errors.permissionSets.load.common ui-consortia-settings.errors.permissionsRequired' }));
    });

    it('should handle other errors', async () => {
      renderPermissionsSet();

      useTenantPermissions.mock.calls[0][1].onError({ response: {} });

      expect(showCalloutMock).toHaveBeenCalledWith(expect.objectContaining({ message: 'ui-consortia-settings.errors.permissionSets.load.common' }));
    });
  });
});
