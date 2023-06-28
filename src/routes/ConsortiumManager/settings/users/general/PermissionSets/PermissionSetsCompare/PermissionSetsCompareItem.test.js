import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { useShowCallout } from '@folio/stripes-acq-components';

import { tenants } from 'fixtures';
import {
  ConsortiumManagerContextProviderMock,
} from 'helpers';
import { useTenantPermissions } from '../../../../../../../hooks';
import { PermissionSetsCompareItem } from './PermissionSetsCompareItem';
import { COMPARE_ITEM_NAME } from './constants';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
}));

jest.mock('../../../../../../../hooks', () => ({
  ...jest.requireActual('../../../../../../../hooks'),
  useTenantPermissions: jest.fn(),
}));

const selectedMemberOptions = tenants.map(({ name, id }) => ({ value: id, label: name }));

const defaultProps = {
  permissionsToCompare: [],
  setPermissionsToCompare: jest.fn(),
  columnName: COMPARE_ITEM_NAME.LEFT_COLUMN,
  selectedMemberOptions,
};

const permissions = [
  {
    id: '5317f357-422a-46a4-88de-702b858672b4',
    displayName: 'Test perm set 1',
    subPermissions: [{
      id: '5317f357-422a-46a4-88de-702b858672b4',
      displayName: 'Sub test perm',
    }],
  },
  {
    id: 'af5c0528-6197-4c7a-96bc-137e88e88176',
    displayName: 'Test perm set 2',
    subPermissions: [{
      id: 'af5c0528-6197-4c7a-96bc-137e88e88176',
      displayName: 'Sub test perm 2',
    }],
  },
];

const wrapper = ({ children }) => (
  <MemoryRouter>
    <ConsortiumManagerContextProviderMock>
      {children}
    </ConsortiumManagerContextProviderMock>
  </MemoryRouter>
);

const renderComponent = (props = {}) => render(
  <PermissionSetsCompareItem
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('PermissionSetsCompareItem', () => {
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

  it('should render component', () => {
    renderComponent();
    expect(screen.getByText('ui-consortia-settings.consortiumManager.members.permissionSets.compare.member')).toBeInTheDocument();
  });

  it('should select member permissions and display assigned sub permissions', async () => {
    const setPermissionsToCompare = jest.fn();

    renderComponent({ setPermissionsToCompare });

    userEvent.click(screen.getByText(selectedMemberOptions[0].label));
    userEvent.click(screen.getByText(permissions[0].displayName));

    await waitFor(() => expect(setPermissionsToCompare).toHaveBeenCalledWith(
      [permissions[0].subPermissions[0].displayName],
      COMPARE_ITEM_NAME.LEFT_COLUMN,
    ));
  });

  it('should display unique sub permissions as marked', async () => {
    const setPermissionsToCompare = jest.fn();

    const { container } = renderComponent({ setPermissionsToCompare, permissionsToCompare: ['Unique test permission'] });

    userEvent.click(screen.getByText(selectedMemberOptions[0].label));
    userEvent.click(screen.getByText(permissions[0].displayName));

    await waitFor(() => expect(setPermissionsToCompare).toHaveBeenCalledWith(
      [permissions[0].subPermissions[0].displayName],
      COMPARE_ITEM_NAME.LEFT_COLUMN,
    ));

    const markedElement = container.querySelectorAll('li > mark');

    expect(markedElement.length).toBe(1);
  });
});
