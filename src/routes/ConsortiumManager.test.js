import { render, screen } from '@testing-library/react';

import { tenants } from '../../test/jest/fixtures';
import { ConsortiumManagerContext } from '../contexts';
import { ConsortiumManager } from './ConsortiumManager';

const affiliations = tenants.map(({ id, name }) => ({
  tenantId: id,
  tenantName: name,
}));

const defaultProps = {};
const context = {
  affiliations,
  selectedMembers: tenants.slice(3),
  selectMembers: jest.fn(),
  selectMembersDisabled: false,
};

const wrapper = ({ children }) => (
  <ConsortiumManagerContext.Provider value={context}>
    {children}
  </ConsortiumManagerContext.Provider>
);

const renderConsortiumManager = (props = {}) => render(
  <ConsortiumManager
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('ConsortiumManager', () => {
  it('should render ConsortiumManager', () => {
    renderConsortiumManager();

    expect(screen.getByText('Consortium Manager')).toBeInTheDocument();
  });
});
