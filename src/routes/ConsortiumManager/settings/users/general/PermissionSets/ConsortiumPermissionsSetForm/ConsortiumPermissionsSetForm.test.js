import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { MemoryRouter, useLocation, useHistory } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { Paneset } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import { useShowCallout } from '@folio/stripes-acq-components';

import {
  ConsortiumManagerContextProviderMock,
  buildStripesObject,
} from '../../../../../../../../test/jest/helpers';
import { useTenantPermissionSetMutations } from '../hooks';
import { PERMISSION_SET_ROUTES, TENANT_ID_SEARCH_PARAMS } from '../constants';
import { ConsortiumPermissionsSetForm } from './ConsortiumPermissionsSetForm';

const initialValues = {
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

const tenantId = 'mobius';

const defaultProps = {
  onSave: jest.fn(),
  onRemove: jest.fn(),
  initialValues: {},
  tenantId,
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

const renderComponent = (props = {}) => render(
  <ConsortiumPermissionsSetForm {...defaultProps} {...props} />,
  { wrapper },
);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useHistory: jest.fn(),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(),
  IfPermission: jest.fn(({ children }) => <>{children}</>),
  useNamespace: jest.fn(() => ['test']),
}));

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  ConfirmationModal: jest.fn(({ heading, message, onConfirm, onCancel }) => (
    <div>
      <span>ConfirmationModal</span>
      {heading}
      <div>{message}</div>
      <div>
        <button type="button" onClick={onConfirm}>confirm</button>
        <button type="button" onClick={onCancel}>cancel</button>
      </div>
    </div>
  )),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
}));

jest.mock('../hooks', () => ({
  usePermissionSet: jest.fn(),
  useTenantPermissionSetMutations: jest.fn(),
}));

jest.mock('../../../../../../../temp/PermissionsAccordion', () => (jest.fn(() => <div>PermissionsAccordion</div>)));

describe('ConsortiumPermissionsSetForm', () => {
  const showCalloutMock = jest.fn();
  const historyMock = { push: jest.fn() };
  const defaultTenantId = `?${TENANT_ID_SEARCH_PARAMS}=${tenantId}`;

  beforeEach(() => {
    useLocation.mockClear().mockReturnValue({ search: defaultTenantId });
    useStripes.mockClear().mockReturnValue(buildStripesObject());
    useShowCallout.mockClear().mockReturnValue(showCalloutMock);
    useHistory.mockClear().mockReturnValue(historyMock);
    useTenantPermissionSetMutations.mockClear().mockReturnValue({
      createPermissionSet: jest.fn(),
      updatePermissionSet: jest.fn(),
      deletePermissionSet: jest.fn(),
    });
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('ui-users.permissions.newPermissionSet')).toBeInTheDocument();
    expect(screen.getByText('PermissionsAccordion')).toBeInTheDocument();
  });

  it('should render component with onSave and display success callOut message', async () => {
    const onSave = jest.fn(() => Promise.resolve());
    const permissionName = 'test';
    const { container } = renderComponent({ onSave });

    const input = container.querySelector('#input-permission-title');

    userEvent.type(input, permissionName);
    expect(input.value).toBe(permissionName);
    userEvent.click(screen.getByText('ui-users.saveAndClose'));

    expect(onSave).toHaveBeenCalledWith({ 'displayName': permissionName });
    await waitFor(() => expect(showCalloutMock).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' })));
  });

  it('should render component with onSave function', async () => {
    renderComponent();

    const cancelButton = screen.getByText('ui-users.cancel');

    expect(cancelButton).toBeInTheDocument();
    userEvent.click(cancelButton);

    expect(historyMock.push).toHaveBeenCalledWith({
      pathname: PERMISSION_SET_ROUTES.PERMISSION_SETS,
      search: defaultTenantId,
    });
  });

  it('should render component with initialValues', () => {
    renderComponent({ initialValues });

    expect(screen.getByText(/ui-users.edit/)).toBeInTheDocument();
    expect(screen.getByText('ui-users.permissions.generalInformation')).toBeInTheDocument();
  });

  it('should delete permission set', async () => {
    const onRemove = jest.fn(() => Promise.resolve());

    renderComponent({ initialValues, onRemove });

    const deleteButton = screen.getByText('ui-users.delete');

    expect(deleteButton).toBeInTheDocument();

    userEvent.click(deleteButton);
    await waitFor(() => expect(screen.getByRole('button', { name: /confirm/ })).toBeDefined());
    userEvent.click(screen.getByRole('button', { name: /confirm/ }));

    expect(onRemove).toHaveBeenCalled();
    await waitFor(() => expect(showCalloutMock).toHaveBeenCalledWith({
      'message': 'ui-consortia-settings.consortiumManager.members.permissionSets.remove.permissionSet.success',
      'type': 'success',
    }));
  });

  it('should update permission set', async () => {
    const onSave = jest.fn(() => Promise.resolve());
    const permissionName = ' edited';
    const expectedPermissionName = `${initialValues.displayName}${permissionName}`;

    const { container } = renderComponent({
      onSave,
      initialValues: {
        displayName: initialValues.displayName,
        id: initialValues.id,
      },
    });

    const input = container.querySelector('#input-permission-title');

    userEvent.type(input, permissionName);
    expect(input.value).toBe(expectedPermissionName);
    userEvent.click(screen.getByText('ui-users.saveAndClose'));

    expect(onSave).toHaveBeenCalledWith({ 'displayName': expectedPermissionName, 'id': initialValues.id });
    await waitFor(() => expect(showCalloutMock).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' })));
  });
});
