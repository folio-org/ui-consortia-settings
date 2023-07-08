import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Paneset } from '@folio/stripes/components';
import { useShowCallout } from '@folio/stripes-acq-components';

import { ConsortiumManagerContextProviderMock } from '../../../../../../../../test/jest/helpers';
import PermissionSetsCreate from './PermissionSetsCreate';
import { useTenantKy } from '../../../../../../../hooks';
import { useManageTenantPermissions, useSelectPermissionSetById } from '../hooks';

const STRIPES = {
  connect: (Component) => Component,
  config: {},
  currency: 'USD',
  hasInterface: () => true,
  hasPerm: jest.fn().mockReturnValue(true),
  locale: 'en-US',
  logger: {
    log: () => {},
  },
  okapi: {
    tenant: 'diku',
    url: 'https://folio-testing-okapi.dev.folio.org',
    translations: {
      'stripes-components.Datepicker.calendar': 'calendar',
      'stripes-components.Datepicker.calendarDaysList': 'calendar days list.',
      'stripes-core.button.cancel': [{ type: 0, value: 'Cancel' }],
      'ui-users.permission.modal.list.pane.header': 'Permissions',
      'ui-users.permission.modal.list.pane.header.array': [{ type: 0, value: 'Permissions' }],
      default: false,
    },
  },
  store: {
    getState: () => ({
      okapi: {
        token: 'abc',
      },
    }),
    dispatch: () => {},
    subscribe: () => {},
    replaceReducer: () => {},
  },
  timezone: 'UTC',
  user: {
    perms: {},
    user: {
      id: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
      username: 'diku_admin',
    },
  },
  withOkapi: true,
};

const defaultProps = {
  history: {
    push: jest.fn(),
  },
  location: {
    search: '',
  },
  match: {
    params: {},
  },
  intl: jest.fn(),
  mutator: {
    permissionSets: {
      POST: jest.fn(),
    },
  },
  stripes: STRIPES,
  initialValues: {
    stripes: STRIPES,
  },
};

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
  <PermissionSetsCreate
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
  IfPermission: jest.fn(({ children }) => <>{children}</>),
  stripesConnect: jest.fn(c => c),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(() => {}),
}));

jest.mock('../../../../../../../hooks', () => ({
  ...jest.requireActual('../../../../../../../hooks'),
  useTenantKy: jest.fn(),
}));

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useManageTenantPermissions: jest.fn(),
  useSelectPermissionSetById: jest.fn(),
}));

jest.mock('../../../../../../../temp/PermissionsAccordion', () => (jest.fn(() => <div>PermissionsAccordion</div>)));

const kyMock = {
  get: jest.fn(),
  delete: jest.fn(() => 'ok'),
  put: jest.fn(),
};

describe('PermissionSetsCreate', () => {
  const showCalloutMock = jest.fn();

  beforeEach(() => {
    showCalloutMock.mockClear();
    useShowCallout.mockClear().mockReturnValue(showCalloutMock);
    useTenantKy
      .mockClear()
      .mockReturnValue(kyMock);
    useManageTenantPermissions.mockClear().mockReturnValue({
      createPermission: jest.fn(),
      updatePermission: jest.fn(),
      deletePermission: jest.fn(),
    });
    useSelectPermissionSetById.mockClear().mockReturnValue({
      selectedPermissionSet: {}, isLoading: true,
    });
  });

  it('should render loading component', () => {
    const { container } = renderComponent();

    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  it('should render component', () => {
    useSelectPermissionSetById.mockClear().mockReturnValue({
      selectedPermissionSet: {}, isLoading: false,
    });

    renderComponent();

    expect(screen.getByText('ui-users.permissions.newPermissionSet')).toBeInTheDocument();
    expect(screen.getByText('PermissionsAccordion')).toBeInTheDocument();
  });
});
