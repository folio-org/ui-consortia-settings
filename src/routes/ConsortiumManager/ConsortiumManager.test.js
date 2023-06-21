import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, withRouter } from 'react-router-dom';

import {
  useModules,
  useStripes,
} from '@folio/stripes/core';

import {
  affiliations,
  tenants,
} from 'fixtures';
import { buildStripesObject } from 'helpers';
import { ConsortiumManagerContext } from '../../contexts';
import { ConsortiumManager } from './ConsortiumManager';
import { AVAILABLE_SETTINGS } from './constants';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useModules: jest.fn(),
  useStripes: jest.fn(),
}));
jest.mock('../../hooks', () => ({
  useTenantPermissions: jest.fn(() => ({ permissions: [], isLoading: false, isFetching: false })),
}));
jest.mock('./settings/data-export/hooks', () => ({
  useDataExportLogs: jest.fn(() => ({ jobExecutions: [], isLoading: false, isFetching: false })),
}));
jest.mock('./settings/data-import/hooks', () => ({
  useDataImportLogs: jest.fn(() => ({ jobExecutions: [], isLoading: false, isFetching: false })),
}));
jest.mock('./settings/users/general', () => ({
  PermissionSets: jest.fn(() => 'PermissionSets'),
}));

const defaultProps = {};
const context = {
  affiliations,
  selectedMembers: tenants.slice(3),
  selectMembers: jest.fn(),
  selectMembersDisabled: false,
};

const modules = {
  settings: AVAILABLE_SETTINGS.map((module) => ({
    displayName: module,
    module,
    route: `/${module}`,
  })),
};

const wrapper = ({ children }) => (
  <MemoryRouter>
    <ConsortiumManagerContext.Provider value={context}>
      {children}
    </ConsortiumManagerContext.Provider>
  </MemoryRouter>
);

const TestComponent = withRouter(ConsortiumManager);
const renderConsortiumManager = (props = {}) => render(
  <TestComponent
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

const settingsLabelsMap = {
  circulation: 'ui-circulation.settings.index.paneTitle',
  'data-export': 'ui-data-export.meta.title',
  'data-import': 'ui-data-import.meta.title',
  inventory: 'ui-inventory.inventory.label',
  users: 'ui-users.settings.label',
};

describe('ConsortiumManager', () => {
  beforeEach(() => {
    useModules.mockClear().mockReturnValue(modules);
    useStripes.mockClear().mockReturnValue(buildStripesObject());
  });

  it('should render ConsortiumManager', () => {
    renderConsortiumManager();

    expect(screen.getByText('ui-consortia-settings.consortiumManager.members.header.title')).toBeInTheDocument();
  });

  it('should render consortium manager settings nav links', () => {
    renderConsortiumManager();

    AVAILABLE_SETTINGS.forEach(module => {
      expect(screen.getByText(module)).toBeInTheDocument();
    });
  });

  it.each(AVAILABLE_SETTINGS.map(module => [module]))('should render \'%s\' settings pane', async (name) => {
    renderConsortiumManager();

    userEvent.click(screen.getByText(name));

    expect(await screen.findByText(settingsLabelsMap[name])).toBeInTheDocument();
  });
});
