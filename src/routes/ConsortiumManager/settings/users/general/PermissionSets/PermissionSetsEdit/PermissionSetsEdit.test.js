import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import { Paneset } from '@folio/stripes/components';

import {
  ConsortiumManagerContextProviderMock,
  buildStripesObject,
} from '../../../../../../../../test/jest/helpers';
import { PermissionSetsEdit } from './PermissionSetsEdit';
import { useTenantPermissionMutations } from '../hooks';

const STRIPES = buildStripesObject();
const displayName = 'displayName';
const initialValues = {
  'permissionName': 'ui-consortia-settings.consortium-manager.edit',
  'displayName': displayName,
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

const defaultProps = {
  onCancel: jest.fn(),
  onSave: jest.fn(),
  onRemove: jest.fn(),
  isLoading: false,
  initialValues,
  intl: {},
  stripes: STRIPES,
};

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useTenantPermissionMutations: jest.fn(),
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    <ConsortiumManagerContextProviderMock>
      <Paneset>
        {children}
      </Paneset>
    </ConsortiumManagerContextProviderMock>
  </MemoryRouter>
);

const renderComponent = (props = {}) => render(
  <PermissionSetsEdit
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  IfPermission: jest.fn(({ children }) => <>{children}</>),
}));

jest.mock('../../../../../../../temp/PermissionsAccordion', () => (jest.fn(() => <div>PermissionsAccordion</div>)));

describe('PermissionSetsEdit', () => {
  const createPermissionSet = jest.fn();
  const updatePermissionSet = jest.fn();
  const deletePermissionSet = jest.fn();

  beforeEach(() => {
    useTenantPermissionMutations.mockClear().mockReturnValue({
      createPermissionSet,
      updatePermissionSet,
      deletePermissionSet,
    });
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText(`ui-users.edit: ${displayName}`)).toBeInTheDocument();
    expect(screen.getByText('PermissionsAccordion')).toBeInTheDocument();
    expect(screen.getByText('ui-users.delete')).toBeInTheDocument();
  });

  it('should redirect member to permissions page', async () => {
    const onSave = jest.fn();

    const inputValue = ' test';
    const updatedPermissionSetName = displayName + inputValue;

    renderComponent({ onSave });

    const displayNameInput = screen.getByRole('textbox', { name: 'ui-users.permissions.permissionSetName' });
    const saveButton = screen.getByText('ui-users.saveAndClose');

    userEvent.type(displayNameInput, inputValue);
    await waitFor(() => expect(displayNameInput.value).toBe(updatedPermissionSetName));

    userEvent.click(saveButton);

    expect(onSave).toHaveBeenCalled();
  });

  it('should call onCancel function', () => {
    const onCancel = jest.fn();

    renderComponent({ onCancel });

    const cancelButton = screen.getByText('ui-users.cancel');

    userEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });
});
