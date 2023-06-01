import { MemoryRouter, withRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

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
    displayName: module.toLocaleUpperCase(),
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

describe('ConsortiumManager', () => {
  beforeEach(() => {
    useModules.mockClear().mockReturnValue(modules);
  });

  it('should render ConsortiumManager', () => {
    renderConsortiumManager();

    expect(screen.getByText('ui-consortia-settings.consortiumManager.members.header.title')).toBeInTheDocument();
  });
});
