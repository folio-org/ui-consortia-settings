import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, withRouter } from 'react-router-dom';

import { useModules } from '@folio/stripes/core';

import { affiliations, tenants } from '../../../test/jest/fixtures';
import { ConsortiumManagerContext } from '../../contexts';
import { ConsortiumManager } from './ConsortiumManager';
import { AVAILABLE_SETTINGS } from './constants';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useModules: jest.fn(),
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
  'data-export': 'ui-data-export.settings.index.paneTitle',
  'data-import': 'ui-data-import.settings.index.paneTitle',
  inventory: 'ui-inventory.inventory.label',
  users: 'ui-users.settings.label',
};

describe('ConsortiumManager', () => {
  beforeEach(() => {
    useModules.mockClear().mockReturnValue(modules);
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
