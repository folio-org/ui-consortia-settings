import { ConsortiumManagerContext } from '../../../src/contexts';
import { affiliations, tenants } from '../fixtures';

const defaultContext = {
  affiliations,
  hasPerm: jest.fn(() => true),
  selectedMembers: tenants.slice(3),
  selectMembers: jest.fn(),
  selectMembersDisabled: false,
};

export const ConsortiumManagerContextProviderMock = ({ children, context = defaultContext }) => (
  <ConsortiumManagerContext.Provider value={context}>
    {children}
  </ConsortiumManagerContext.Provider>
);
