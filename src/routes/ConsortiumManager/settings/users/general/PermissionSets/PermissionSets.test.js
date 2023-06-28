import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { useShowCallout } from '@folio/stripes-acq-components';

import { tenants } from 'fixtures';
import {
  ConsortiumManagerContextProviderMock,
  buildStripesObject,
} from 'helpers';
import { useTenantPermissions } from '../../../../../../hooks';
import { PermissionSets } from './PermissionSets';
import { PERMISSION_SET_ROUTES } from './constants';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
}));
jest.mock('./../../../../../../temp/IfConsortiumPermission', () => ({
  IfConsortiumPermission: jest.fn(({ children }) => <>{children}</>),
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
    useTenantPermissions
      .mockClear()
      .mockReturnValue({
        permissions,
      });
  });

  it('should render permission sets list', () => {
    renderPermissionsSet();

    Object.values(permissions).forEach(({ displayName }) => {
      expect(screen.getByText(displayName)).toBeInTheDocument();
    });
  });

  it('should render a permission set details', () => {
    renderPermissionsSet();

    userEvent.click(screen.getByText(permissions[0].displayName));

    expect(screen.getByText('ui-users.permissions.permissionSetName'));
    expect(screen.getByText('ui-users.description'));
    expect(screen.getByText('ui-users.permissions.assignedPermissions'));
  });

  it('should handle selected member change', () => {
    renderPermissionsSet();

    userEvent.click(screen.getByText(tenants[4].name));

    expect(defaultProps.history.push).toHaveBeenCalled();
  });

  it('should redirect to compare page on click compare action menu button', async () => {
    const { container } = renderPermissionsSet();

    const actionMenu = screen.getByTestId('permission-sets-actions-dropdown');

    expect(actionMenu).toBeInTheDocument();
    userEvent.click(actionMenu);
    const compareButton = container.querySelector('#clickable-compare-permissions');

    expect(compareButton).toBeInTheDocument();
    userEvent.click(compareButton);
    expect(defaultProps.history.push).toHaveBeenCalledWith(PERMISSION_SET_ROUTES.COMPARE);
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
